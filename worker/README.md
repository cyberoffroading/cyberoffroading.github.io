# Worker — Votes & Click Tracking

This Cloudflare Worker powers the public product voting (stars) and affiliate click counters displayed on every product card.

It is **completely optional** for the core site experience. If the worker is down or unreachable, the UI gracefully degrades (counts show "—", clicks are not recorded).

## Architecture

- **Platform**: Cloudflare Workers + Workers KV
- **Binding**: `VOTES` (KV namespace)
- **Production URL**: `https://cyberoffroading-votes.chaukevin.workers.dev`
- **CORS**: Exact-match allowlist — `https://cyberoffroading.com` and `https://www.cyberoffroading.com`. For local dev, `http://localhost` / `http://127.0.0.1` on **any port** is allowed (the Origin header is parsed as a URL; no prefix matching, so lookalike domains like `cyberoffroading.com.evil.io` are rejected). All responses include `Vary: Origin`.

## Endpoints

| Method | Path                  | Purpose                              | Notes |
|--------|-----------------------|--------------------------------------|-------|
| GET    | `/votes`              | Returns `{ votes: {...}, clicks: {...} }` | Served from the `snapshot` key (1 KV read); cached 60s (in-worker + `Cache-Control: public, max-age=60`) |
| POST   | `/vote/:productId`    | Increment vote count for a product   | Rate-limited (1 per IP per product, 365 days) |
| POST   | `/unvote/:productId`  | Decrement vote (only if this IP previously voted) | Clamped at 0; requires prior vote from same IP |
| POST   | `/click/:productId`   | Record an affiliate link click       | **POST only** (client uses `sendBeacon`, which POSTs). GET returns 404. |

All responses include appropriate CORS headers.

### Product ID Validation

Every `:productId` must match `/^[a-z0-9-]{1,64}$/` (lowercase kebab-case, e.g. `12k-winch`, `tire-deflators`). Anything else returns **400**. This blocks path traversal, uppercase/underscore IDs, and KV key abuse.

## KV Schema

Keys stored in the `VOTES` namespace:

- `count:${productId}` — plain integer as a string (vote total for one product)
- `clicks:${productId}` — plain integer as a string (click total for one product)
- `voted:${sha256hex(ip + ':' + productId)}` — string value `"1"`, TTL 365 days (one-vote-per-IP-per-product rate limit)
- `snapshot` — JSON `{ votes: {...}, clicks: {...}, builtAt: <ms epoch> }`; the pre-merged `/votes` payload (see **KV Budget** below)
- `counts` / `clicks` — **legacy** monolithic JSON blobs `{ "product-id": number }`, kept read-only for migration (see below)

IP is taken from `CF-Connecting-IP` (Cloudflare edge). The IP is **only ever stored as a SHA-256 hash** combined with the product ID — never in plaintext.

### Migration from Legacy Blobs

Counters used to live in two monolithic JSON blobs (`counts`, `clicks`), which made concurrent writes to *different* products clobber each other. They are now per-product keys, migrated lazily:

- **On write** (`/vote`, `/unvote`, `/click`): if `count:${id}` / `clicks:${id}` doesn't exist yet, the value is seeded from the legacy blob, then incremented and written as a per-product key.
- **On read** (`/votes`): the `snapshot` key is served as-is. When the snapshot is (re)built, per-product keys are listed (`count:` / `clicks:` prefixes) and merged **over** the legacy blobs — for any id present in both, the per-product value wins.
- The legacy blobs are never written again; once every product has been touched they're dead weight and can be deleted manually.
- Old plaintext `voted:${ip}:${productId}` keys from before IP hashing are orphans — they simply expire via their 365-day TTL. Worst case, a previous voter can vote once more under the new hashed key. Acceptable.

### Known Limitation: Same-Product Write Races

Workers KV has no compare-and-swap. Two **concurrent** increments of the *same* product can still lose one update (read-modify-write race). This is an accepted limitation for low-stakes social-proof counters; exact counters would require Durable Objects. Per-product keys do guarantee that writes to **different** products never collide.

## KV Budget (why the `snapshot` key exists)

The Workers KV **free tier** allows, per day: 100,000 reads, 1,000 writes, 1,000 deletes, **1,000 list operations**.

`GET /votes` used to rebuild the whole payload on every cache miss: 2 list ops + one read per product key (~110 ops with 53 products). Cloudflare's 60s in-isolate cache barely helps on a low-traffic site because isolates are recycled constantly, so **~450 cache-missing page loads a day hit 90% of the list cap** (Sept 2026 alert). That's a worker-efficiency problem, not a traffic milestone.

Now the merged payload is persisted as a single `snapshot` key:

| Operation | KV ops | Notes |
|---|---|---|
| `GET /votes` (isolate cache warm) | 0 | |
| `GET /votes` (cache miss, snapshot fresh) | 1 read | ~100k homepage loads/day of free-tier headroom |
| `GET /votes` (snapshot missing) | 2 lists + ~1 read/product + 1 write | First request after deploy; blocks on the rebuild |
| `GET /votes` (snapshot older than 1 hour) | same as above | Stale snapshot served immediately; rebuild runs via `ctx.waitUntil` |
| `POST /click/:id` | 2 reads, 2 writes | per-product key + snapshot mirror |
| `POST /vote/:id` | 3 reads, 3 writes | + the `voted:` rate-limit key |
| `POST /unvote/:id` | 3 reads, 2 writes, 1 delete | |

Writes are now the tightest budget: roughly **400–500 clicks+votes a day** fits the free tier. If the site ever sustains that, upgrade to Workers Paid ($5/mo) rather than chasing further savings.

**Consistency**: the per-product keys remain the source of truth. Mirroring into the snapshot is a read-modify-write on one blob, so two concurrent writes can drop one product's update *in the snapshot only*; the hourly rebuild (triggered lazily by the next `GET /votes`) repairs any drift from the per-product keys. A snapshot that's missing or unparseable is simply rebuilt.

## Caching

`GET /votes` is cached two ways on top of the snapshot:

1. **In-worker**: a module-scope cache of the merged payload, 60s TTL per isolate (invalidated within an isolate when that isolate handles a write or finishes a background rebuild).
2. **HTTP**: `Cache-Control: public, max-age=60` so browsers/CDN reuse the response.

Counters may therefore lag up to ~60s (and up to an hour for the rare lost snapshot update described above). Fine for this use case.

## Privacy Note

- IP addresses are **never stored in plaintext** — only SHA-256 hashes of `ip:productId`, used solely for rate limiting.
- This data expires after 365 days.
- No other personal data is collected by this worker.
- The main site itself uses no third-party analytics cookies (Cloudflare Web Analytics is planned but not yet implemented).

If you are privacy-sensitive, you can safely block the worker domain; the site remains fully functional.

## Local Development

```bash
cd worker
npx wrangler dev --local
```

This will start the worker on `http://localhost:8787`. Update `VOTE_API` in `js/main.js` temporarily during development if needed.

Local KV state lives under `.wrangler/`. To seed legacy-migration test data:

```bash
npx wrangler kv key put --binding=VOTES --local 'counts' '{"legacy-item":5}'
npx wrangler kv key put --binding=VOTES --local 'clicks' '{"legacy-item":2}'
npx wrangler kv key list --binding=VOTES --local
```

## Deployment

```bash
cd worker
wrangler deploy
```

The worker name and KV namespace ID are defined in `wrangler.toml`.

After deploy, the new version is live immediately at the `.workers.dev` subdomain (or custom route if configured in the dashboard).

## Adding a New Product

1. Add a `data-product-id="your-new-id"` to the product card in `index.html` (must match `/^[a-z0-9-]{1,64}$/`).
2. The worker needs **no changes** — it is generic and will create counts on first use.
3. (Optional) Seed an initial count via the KV dashboard or a one-off curl if desired.

## Failure Modes (Client Perspective)

- Worker unreachable → counts stay at "—" forever (no breakage).
- Vote/unvote fails → optimistic UI change is **not** rolled back (acceptable for this low-stakes social proof feature).
- Click tracking fails → silent (beacon is best-effort).

## Related Code

- Client injection + handlers: `js/main.js` (search for `VOTE_API` and `product-card__stats`)
- Styling: `css/style.css` (`.vote-btn`, `.click-counter`, `.product-card__stats`)

---

**Last updated**: 2026-09 — `snapshot` key so `/votes` costs 1 KV read instead of ~110 ops (free-tier list cap alert). Previous: 2026-06 hardening pass (CORS exact-match, ID validation, hashed IP keys, per-product counters, POST-only /click, /votes caching).
