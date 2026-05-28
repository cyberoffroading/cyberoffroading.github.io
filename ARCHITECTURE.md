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
├── images/                    # ~112 MB raw (being actively optimized)
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
- Twitter widgets and Lucide icons (when present) are re-initialized inside the modal.

This system is elegant and has proven very effective.

### 2. Voting + Click Tracking (Worker + js/main.js)

Every product card with `data-product-id` gets two interactive elements injected by JS:

- Star vote button (toggle up/down)
- Public click counter (affiliate link clicks)

**Client behavior**:
- Optimistic UI updates + localStorage for "I have voted" state.
- On click: `fetch` to the worker (POST for votes, `sendBeacon` for clicks).
- Counts are fetched once on page load from `/votes`.

**Backend** (`worker/index.js`):
- Deployed separately as a Cloudflare Worker (`cyberoffroading-votes.chaukevin.workers.dev`).
- Uses Workers KV (`VOTES` binding).
- Endpoints:
  - `GET /votes` → `{ votes, clicks }`
  - `POST /vote/:id` and `/unvote/:id` (IP-based rate limiting, 1 vote per IP per product, 365 day TTL)
  - `POST /click/:id` (fire-and-forget)
- CORS restricted to the main domain + localhost.
- Full documentation lives in `worker/README.md`.

**Privacy note**: Only composite keys (`voted:${ip}:${productId}`) are stored. No raw IPs or other PII.

### 3. Image Optimization Workflow

**Problem**: Original phone exports and Amazon downloads were 5–7 MB each. Total `images/` was ~112 MB.

**Solution** (Phase 1):
- `scripts/optimize-images.sh` — a simple, well-documented Bash helper using ImageMagick (`magick`) + `cwebp`.
- For any input image it produces:
  - `name-1600.webp` (primary, high quality)
  - `name-1600.jpg` (fallback)
- Script is **optional**. You can still commit raw images if needed.
- HTML is updated with `srcset` + `sizes` + explicit `width`/`height`.

**Current status**: Hero, winch build cluster, major gallery images, flat-tire lifestyle, and several product shots have been optimized. The script + pattern is established for future work.

**Recommendation**: Always keep originals. Run the optimizer on new/replacement photos.

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
- **404.html**: Functional but uses inline styles (minor inconsistency).

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

## Known Gaps / Future Work (as of 2026)

From the original 2026 analysis plan:

- **Phase 2** (current): Finish updating `CLAUDE.md`, consider a small `CONTRIBUTING.md`.
- **Phase 3**: `aria-live` regions for vote/click counters, improve 404.html, deeper accessibility audit of modals/lightbox.
- **Phase 4**: JSON-LD structured data for products + articles. Add Cloudflare Web Analytics.
- **Phase 5**: Consider self-hosting the 3 Lucide icons or locking the Twitter widget version.
- Continue image optimization until `images/` is under ~30–40 MB total.

## Related Documents

- `tasks/todo.md` — Living prioritized backlog with review notes.
- `tasks/lessons.md` — Institutional memory and process rules.
- `worker/README.md` — Worker API contract, privacy model, deployment.
- `PLAN.md` — Original 2024 vision (historical reference only).
- `css/style.css` and `js/main.js` — Heavily commented.

---

*This document was created during the 2026 analysis follow-up work to reduce documentation debt.*