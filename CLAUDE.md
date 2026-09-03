# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CyberOffroading.com — A single-page Cybertruck off-road accessories site with affiliate links. Pure HTML/CSS/JS, no build step. Hosted on GitHub Pages with Cloudflare CDN.

## Architecture (Current as of 2026)

- **Single-page site** with interactive enhancements: `index.html` is the main experience. All product categories live as anchor sections.
- **5 guide pages** in `/guides/` (vault-seal, cabin-air-filter, roof-glass, winch-wiring, trail-lift). These are the canonical sources for SEO.
- **Guide Modal System**: Article cards open guides in an in-page modal while updating the URL via `pushState` (best of both worlds).
- **Voting + Click Tracking**: Every product card (`data-product-id`) gets a star vote button and public click counter powered by a separate Cloudflare Worker + KV.
- **No framework**: Pure HTML/CSS/JS. Zero build step. Edit directly and push.
- **Optional tooling**: `scripts/optimize-images.sh` for photos (uses ImageMagick + cwebp). Fully optional.

See `ARCHITECTURE.md` for the full current system description.

## Key Files

- `index.html` — The entire site + all interactive UI.
- `css/style.css` — Complete design system (brutalist angular aesthetic with clip-paths).
- `js/main.js` — Nav highlighting, card reveals, guide modals, gallery lightbox, voting, click tracking (single IIFE).
- `js/analytics.js` — Google Analytics 4 loader; the only place the Measurement ID lives. Every public page loads it from `<head>` as `/js/analytics.js?v=N` (bump N on change). Skips localhost.
- `ARCHITECTURE.md` — **Primary reference** for current 2026 architecture.
- `ORIGINAL-PLAN-2024.md` — Original 2024 vision document (historical).
- `tasks/todo.md` — Living prioritized improvement backlog with review notes.
- `tasks/lessons.md` — Project process rules and lessons learned.
- `worker/README.md` — Voting/click tracking worker contract and deployment.
- `CNAME` — Points to cyberoffroading.com.

## Design System

- **Zero border-radius** — Everything is angular. No rounded corners.
- **Colors**: `--steel-dark` (#0a0a0b) base, `--cyber-blue` (#00d4ff) accent, `--warn-red` (#ff2a2a) for warnings.
- **Cards use `clip-path`** for corner cuts. Don't add `border-radius`.
- **Nav pills** also use `clip-path` for angular shape.

## Adding Products (2026)

1. Add `<article class="product-card" data-product-id="your-id">` inside the correct `<section>`.
2. Include review text, price (if relevant), and one or more affiliate CTAs.
3. Add the photo to `images/products/CATEGORY/PRODUCT-NAME/`.
4. **Strongly recommended**: Run `./scripts/optimize-images.sh -w 800` on the photo (800 for cards, 1200 for build/gallery shots) and wire it up with `<picture>` + explicit `width`/`height` — copy an existing card's markup.
5. Test voting and click tracking locally.

See `ARCHITECTURE.md` → "Development & Contribution" for the full current process.

## Adding Categories / Sections

Copy an existing `<section>` + corresponding nav pill. Update the Articles section if the new content is long-form.

## Affiliate Links

All use `target="_blank" rel="noopener noreferrer"`. Amazon = amzn.to shortlinks. Full FTC disclosure lives in the footer.

## Images & Optimization

- Organized by category under `images/products/`.
- Heavy photos ship as `-800`/`-1200`/`-2000` `.webp` + `.jpg` variants inside `<picture>` elements; originals are kept as the re-encode source of truth.
- Use `./scripts/optimize-images.sh -w WIDTH` when adding/replacing photos (800 = product cards, 1200 = gallery/build, 2000 = hero). **Never use cwebp `-near_lossless` on photos** — it backfired badly once (see `tasks/lessons.md`).
- Every `<img>` must carry explicit `width`/`height` (CLS) and `decoding="async"`.
- See `ARCHITECTURE.md` for the current image workflow.