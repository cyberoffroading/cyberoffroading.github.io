# Worker — Votes & Click Tracking

This Cloudflare Worker powers the public product voting (stars) and affiliate click counters displayed on every product card.

It is **completely optional** for the core site experience. If the worker is down or unreachable, the UI gracefully degrades (counts show "—", clicks are not recorded).

## Architecture

- **Platform**: Cloudflare Workers + Workers KV
- **Binding**: `VOTES` (KV namespace)
- **Production URL**: `https://cyberoffroading-votes.chaukevin.workers.dev`
- **CORS**: Restricted to `cyberoffroading.com` + localhost for development

## Endpoints

| Method | Path                  | Purpose                              | Notes |
|--------|-----------------------|--------------------------------------|-------|
| GET    | `/votes`              | Returns `{ votes: {...}, clicks: {...} }` | All public counters |
| POST   | `/vote/:productId`    | Increment vote count for a product   | Rate-limited (1 per IP per product, 365 days) |
| POST   | `/unvote/:productId`  | Decrement vote (only if this IP previously voted) | Requires prior vote from same IP |
| POST/GET | `/click/:productId` | Record an affiliate link click       | Fire-and-forget (uses `sendBeacon` from client) |

All responses include appropriate CORS headers.

## KV Schema

Keys stored in the `VOTES` namespace:

- `counts` — JSON object: `{ "product-id": number }` (vote totals)
- `clicks` — JSON object: `{ "product-id": number }` (affiliate click totals)
- `voted:${ip}:${productId}` — String value `"1"`, TTL 365 days (anti-brigading / one-vote-per-IP-per-product)

IP is taken from `CF-Connecting-IP` header (Cloudflare edge).

## Privacy Note

- IP addresses are **never stored in plaintext**.
- The only IP-derived data is the composite key `voted:${ip}:${productId}` used solely for rate limiting.
- This data expires after 365 days.
- No other personal data is collected by this worker.
- The main site itself uses no third-party analytics cookies (Cloudflare Web Analytics is planned but not yet implemented).

If you are privacy-sensitive, you can safely block the worker domain; the site remains fully functional.

## Local Development

```bash
cd worker
wrangler dev
```

This will start the worker on `http://localhost:8787`. Update `VOTE_API` in `js/main.js` temporarily during development if needed.

You will need a KV namespace bound locally (see `wrangler.toml` for the production binding name).

## Deployment

```bash
cd worker
wrangler deploy
```

The worker name and KV namespace ID are defined in `wrangler.toml`.

After deploy, the new version is live immediately at the `.workers.dev` subdomain (or custom route if configured in the dashboard).

## Adding a New Product

1. Add a `data-product-id="your-new-id"` to the product card in `index.html`.
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

**Last updated**: 2026-05 during 2026 analysis improvement pass.