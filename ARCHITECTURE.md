# CyberOffroading.com — Architecture (2026)

This document describes the **current** state of the project as of mid-2026. It is the primary reference for anyone working on the site.

## Overview

CyberOffroading.com is a single-page, static affiliate content site focused on Cybertruck off-road accessories. It combines high-quality, opinionated written content with interactive social proof features (voting + click tracking) while maintaining a strict "zero build step" philosophy.

**Core principles**:
- Pure HTML + CSS + JS. Anyone can edit and deploy with `git push`.
- Strong, consistent brutalist industrial aesthetic (zero border-radius, heavy use of `clip-path`).
- Standalone guide pages remain the source of truth for SEO and shareability.
- Optional tooling is allowed (image optimizer) as long as the default edit path stays simple.

## Site Structure

```
/
├── index.html                 # The main single-page experience
├── css/style.css              # Design system + all component styles
├── js/main.js                 # All interactivity (one IIFE)
├── guides/                    # 5 standalone long-form guides
│   ├── vault-seal.html
│   ├── cabin-air-filter.html
│   ├── roof-glass.html
│   ├── winch-wiring.html
│   └── trail-lift.html
├── images/                    # Originals + optimized -800/-1200/-2000 variants (originals kept as source of truth)
├── scripts/optimize-images.sh # Optional image optimization helper
├── worker/                    # Cloudflare Worker (separate deployment)
├── CNAME
├── sitemap.xml
├── robots.txt
└── 404.html
```

Current nav order (as of 2026):
`Articles` → `Offroad` → `Recovery` → `Flat Tire` → `Winter` → `Winch Build` → `Starlink` → `Comms` → `Essentials` → `Events` → `Gallery`

## Key Systems

### 1. Guide Modal System (js/main.js)

**Design goal**: Best of both worlds — real URLs for SEO/sharing + delightful in-page reading experience.

- Standalone `.html` files in `/guides/` are the canonical source of truth.
- Each guide must contain a `<article class="guide-content">` wrapper.
- Clicking any `a[data-guide-modal]` triggers:
  1. `fetch()` of the real page
  2. Parse with `DOMParser`
  3. Extract `.guide-content` innerHTML
  4. Inject into `#guideModal`
  5. `history.pushState()` updates the URL to the real path (deep linking + shareable)
- Hover prefetch for perceived speed.
- Back/forward navigation works via `popstate`.
- Legacy hash deep links (`#guide-vault` etc.) are redirected.
- Twitter widgets are re-initialized inside the modal (Lucide was removed in Phase 0; the two icons are inline SVGs in `js/main.js`).
- Race-safe: each open carries a token so a slow fetch can't repopulate a modal the user already closed; closing a modal-pushed guide uses `history.back()` so the back button never re-opens a dismissed guide.

This system is elegant and has proven very effective.

### 2. Voting + Click Tracking (Worker + js/main.js)

Every product card with `data-product-id` gets two interactive elements injected by JS:

- Star vote button (toggle up/down)
- Public click counter (affiliate link clicks)

**Client behavior**:
- Optimistic UI updates + localStorage for "I have voted" state (guarded with try/catch — Safari Private Mode degrades to session-only state instead of crashing the script).
- On click: `fetch` to the worker (POST for votes, `sendBeacon` for clicks), then the count is reconciled with the server's authoritative response (the per-IP limit can reject the optimistic +1).
- Counts are fetched once per page load from `/votes`, deferred via `requestIdleCallback`; vote buttons stay disabled until real counts arrive.

**Backend** (`worker/index.js`):
- Deployed separately as a Cloudflare Worker (`cyberoffroading-votes.chaukevin.workers.dev`).
- Uses Workers KV (`VOTES` binding) with **per-product keys** (`count:${id}`, `clicks:${id}`) so concurrent writes to different products never collide. Same-product increments can still race (KV has no compare-and-swap); exact counters would need Durable Objects — accepted limitation at this traffic level.
- Endpoints:
  - `GET /votes` → `{ votes, clicks }` (60s in-isolate cache + `Cache-Control: max-age=60`)
  - `POST /vote/:id` and `/unvote/:id` (1 vote per IP per product, 365 day TTL)
  - `POST /click/:id` (fire-and-forget; GET is rejected so crawlers can't inflate the counter)
- Product IDs validated against `^[a-z0-9-]{1,64}$` — junk IDs get a 400.
- CORS exact-matches the production origins (+ localhost/127.0.0.1 on any port for dev).
- Full documentation lives in `worker/README.md`.

**Privacy note**: Voter identity is stored as `voted:${sha256(ip + ':' + productId)}` — no plaintext IPs anywhere in KV.

### 3. Image Optimization Workflow

**Problem**: Original phone exports and Amazon downloads were 5–7 MB each. Total `images/` was ~112 MB.

**Solution** (redone correctly 2026-06-10; the first attempt was reverted — see `tasks/lessons.md`):
- `scripts/optimize-images.sh -w WIDTH input.jpg` — Bash helper using ImageMagick (`magick`) + `cwebp` with **plain lossy WebP** (`-q 80`). The original attempt used `-near_lossless 60`, which is for screenshots/graphics and produced WebPs 3–4× larger than the JPEG fallback on photos.
- Width tiers: hero/full-bleed **2000**, gallery/build photos **1200**, product cards **800**.
- For each input it produces `name-WIDTH.webp` (primary) + `name-WIDTH.jpg` (fallback).
- HTML uses `<picture><source type="image/webp" srcset="...webp"><img src="...jpg" width=... height=... loading="lazy" decoding="async"></picture>`.
- Script is **optional**. You can still commit raw images if needed.

**Current status**: Every heavy photo referenced by `index.html` and the guides is optimized. Homepage full-scroll image payload dropped from ~90 MB to ~12 MB; the LCP hero is a 1.06 MB WebP, preloaded with `fetchpriority="high"`. Every `<img>` site-wide has explicit `width`/`height` (zero CLS). Dedicated 1200×630 social images live in `images/social/`.

**Recommendation**: Always keep originals. Run the optimizer (with the right `-w` tier) on new/replacement photos.

### 4. Design System (css/style.css)

Extremely consistent brutalist execution:
- Custom properties for the entire steel + cyber-blue palette.
- Heavy use of `clip-path: polygon(...)` for angular cuts on cards, buttons, nav pills, modals, lightbox, etc.
- Inline SVG noise texture (no extra request).
- Reduced motion respect.
- Strong focus-visible styles (added in Phase 0) using `outline` + `box-shadow` rings for clipped elements.

Typography: Chakra Petch (display) + IBM Plex Mono (body).

No border-radius anywhere.

### 5. Other Notable Features

- **Gallery + Lightbox**: 11 images with keyboard navigation, counter, and nice transitions.
- **Back-to-top button**: Appears after scrolling past hero (IntersectionObserver).
- **Two promo bars**: Tesla-Essentials cross-promo + "Built by Kevin" attribution.
- **Events section**: Currently just an outbound link to cybertrexevents.com.
- **404.html**: Uses the shared design system (`error-page` classes in `style.css`).
- **Accessibility**: skip link, `role="dialog"`/`aria-modal` on modal + lightbox, labelled vote buttons/click counters, shared polite live region for vote feedback, full `prefers-reduced-motion` coverage, ≥44px touch targets on interactive chips and mobile nav pills.
- **SEO**: Article JSON-LD + Twitter cards + og:image on all 5 guides; dedicated social-share images; per-page `lastmod` in sitemap.xml.

## Development & Contribution

**Default workflow** (respected):
1. Edit files directly.
2. Test locally (`python3 -m http.server` or similar).
3. `git add` + `git commit` + `git push`.
4. GitHub Pages deploys automatically.

**Helpful optional tools**:
- `./scripts/optimize-images.sh` for photos.
- `worker/` development uses `wrangler dev`.

**When adding a product** (updated 2026):
1. Add `<article class="product-card" data-product-id="...">`.
2. Include price/review/affiliate link(s).
3. Add photo to `images/products/...` (run optimizer if possible).
4. Update `tasks/todo.md` if it's part of a larger effort.

## Deployment

- **Frontend**: GitHub Pages (main branch) + Cloudflare CDN.
- **Worker**: Separate Cloudflare Workers deployment (see `worker/wrangler.toml` and `worker/README.md`).
- DNS / SSL / caching rules managed in Cloudflare dashboard.

## Known Gaps / Future Work (as of 2026-06)

- **Deploy the hardened worker**: `worker/index.js` (validation, hashed IPs, per-product keys, exact CORS) is tested locally but needs `npx wrangler login` + `npx wrangler deploy` from the worker directory.
- **Cloudflare Web Analytics**: one privacy-friendly `<script>` in `<head>` — still not added.
- **Exact counters**: KV increments can still race per product; migrate to Durable Objects/D1 only if vote volume ever makes it matter.
- **AVIF tier**: `<picture>` makes adding an AVIF `<source>` trivial if further savings are wanted.
- **Self-host fonts**: Google Fonts CSS is still a render-blocking third-party request.
- **Lock/lazy-load the Twitter widget** (only needed inside guide modals).

## Related Documents

- `tasks/todo.md` — Living prioritized backlog with review notes.
- `tasks/lessons.md` — Institutional memory and process rules.
- `worker/README.md` — Worker API contract, privacy model, deployment.
- `ORIGINAL-PLAN-2024.md` — Original 2024 vision (historical reference only).
- `css/style.css` and `js/main.js` — Heavily commented.

---

*This document was created during the 2026 analysis follow-up work to reduce documentation debt.*