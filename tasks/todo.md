# CyberOffroading.com — Improvement Tasks

**Source**: Full repo analysis (May 2026) — see session plan for details.  
**Status Legend**: `TODO` | `IN PROGRESS` | `DONE` | `BLOCKED`

---

## Phase 0 — Quick Wins (1–2 hours total, high confidence, minimal risk)

- [x] **Add `:focus-visible` styles** — Done on `improvements/2026-analysis`. Uses `outline` for standard elements + `box-shadow` rings on clipped buttons (`.cta-button`, `.vote-btn`, nav, modals, gallery) to respect the angular aesthetic.
- [x] **Replace Lucide with inline SVGs** — Removed `unpkg.com/lucide@latest` entirely. Two minimal inline SVGs (star + pointer) now live in `js/main.js`. Zero external icon requests.
- [x] **Document the Worker** — Created `worker/README.md` with full API reference, KV schema, privacy model, local dev, and deployment notes.
- [x] **Update sitemap.xml** — Added `<lastmod>2026-05-20</lastmod>` to all 6 entries.
- [x] **Font display** — Already had `&display=swap` on the Google Fonts link (no change needed).

**Owner**: Kevin  
**Branch**: `improvements/2026-analysis`  
**Status**: Phase 0 complete. Ready for local review.

---

## Branch Review Notes (2026-05)

**Changes in this branch**:
- All Phase 0 items above
- No image work yet (Phase 1 is large — candidate for follow-up PR)
- No new structured data or analytics yet (Phase 4)
- Kept diff surface small and focused

**How to review locally**:
```bash
git checkout improvements/2026-analysis
git log --oneline main..HEAD
git diff main...improvements/2026-analysis --stat
```

Open `index.html` in a browser (or `python -m http.server`) and:
- Tab through the entire page (focus rings should appear cleanly on all CTAs, vote stars, nav, gallery, modals)
- Click a few vote stars (they should toggle and persist in localStorage)
- Confirm no console errors and no lucide network request

**Next suggested work** (after review):
- Hero + winch build image compression (biggest perf win)
- Or Phase 2 architecture docs

---

## Merge Review (2026-05-28)

**Merged**: `improvements/2026-analysis` → `main` (commit `fa0e6c3`)

**What was delivered**:
- All Phase 0 items (focus styles, Lucide removal, worker docs, sitemap lastmod, gitignore hygiene, task tracking files)
- Reviewed locally via `python -m http.server` + keyboard navigation
- Clean `--no-ff` merge commit with full context in message

**Post-merge actions**:
- Updated this file with merge record
- (Next) Push to origin/main

**Verification**:
- `git log --oneline -1` shows proper merge commit
- No conflicts
- Working tree clean after merge (noise files ignored)

---

## Phase 1 — Performance (Highest business + UX impact)

---

## Phase 1 — Performance (Highest business + UX impact)

**Goal**: Reduce `/images` from 112 MB → < 25 MB while preserving visual quality on 2x displays. Target Lighthouse Performance ≥ 90 on mobile.

### 1.1 Image Audit & Baseline
- [ ] Inventory every production image (hero, 11 gallery, 4 winch build-setup, vault-seal guides ×6, flat-tire lifestyle ×2, all product cards).
- [ ] Record current file sizes + dimensions (use `identify` or similar).
- [ ] Identify quick-kill candidates (e.g. the 4×5–7 MB winch build photos can be heavily downsampled or replaced with tighter crops).

### 1.2 Optimization Pipeline (respect no-build constraint)
- [ ] Decide on approach: manual (Squoosh / ImageMagick one-time) vs lightweight script (`scripts/optimize-images.sh`) vs GitHub Action on PRs touching images/.
- [ ] Produce AVIF (primary) + WebP (fallback) + JPEG (legacy) variants for every asset.
- [ ] Define responsive widths (e.g. 800w / 1200w / 1600w for cards; hero at 2× needed size only).
- [ ] Update all `<img>` tags with `srcset` + `sizes` (start with hero + gallery + winch build as highest impact).

### 1.3 Validation
- [ ] Before/after Lighthouse (mobile sim, throttled).
- [ ] Visual regression spot-check on key pages (especially winch and gallery sections).
- [ ] Confirm total images/ size drop and no broken references.

**Risk**: Over-compression on critical hero. Mitigate with A/B visual review.

---

## Phase 2 — Documentation & Maintainability

- [ ] Create `ARCHITECTURE.md` (or major rewrite of `PLAN.md`) capturing 2026 reality:
  - Voting/click system (`data-product-id`, optimistic UI, localStorage, Worker contract)
  - Guide modal system (fetch + `.guide-content` extraction, pushState, hover prefetch, legacy hash map)
  - Gallery + lightbox behavior
  - Worker privacy model + KV details
  - CSS/JS cache-busting convention (`?v=N`)
  - "How to add a product" updated checklist (image optimization step, `data-product-id`, testing votes)
- [ ] Update root `CLAUDE.md`:
  - Add "Current Feature Set (2026)" section
  - Update "Adding Products" with new requirements
  - Reference `ARCHITECTURE.md` and `worker/README.md`
- [ ] Seed `tasks/lessons.md` with patterns from this analysis (image bloat, missing focus styles, doc velocity lag).
- [ ] (Optional) Add minimal `CONTRIBUTING.md` or section pointing new contributors to image workflow + worker docs.

---

## Phase 3 — Accessibility (Trust & Compliance)

- [ ] Expand focus work from Phase 0 into full audit:
  - Focus trap for modals and lightbox (currently close-on-outside-click + Escape, but tab order can escape)
  - `aria-live="polite"` regions for vote count and click counter updates
  - Verify all custom buttons have proper `role` / `aria-*` if needed
- [ ] Improve `404.html` to consume the real design system (or extract minimal shared header/footer styles) instead of inline styles.
- [ ] Review + tighten all `alt` attributes (most are already good).
- [ ] Manual testing: VoiceOver (macOS) + keyboard-only on iOS Safari for modals/gallery/voting.
- [ ] Document the contrast bump on `--stainless-dim` (5.2:1) and re-verify with real tools.

---

## Phase 4 — SEO & Analytics (Business Value)

- [ ] Add JSON-LD structured data:
  - `Product` + `Offer` on every product card (use `data-product-id` as identifier)
  - `Article` on guide pages (and ensure modal-injected content doesn't duplicate)
  - `WebSite` + `Organization` + optional `Person` (Kevin) on homepage
- [ ] Implement Cloudflare Web Analytics (one `<script>` in `<head>`, privacy-friendly, matches original PLAN).
- [ ] (Future) Consider surfacing "Top Voted" or "Most Clicked" derived views using the existing public counters.

---

## Phase 5 — Architecture / Tech Debt (Only if pain materializes)

- [ ] Evaluate extracting JS concerns into small modules or keeping as single well-commented IIFE (current size is acceptable).
- [ ] Eliminate unpkg Lucide (inline the 3 icons or self-host minimal set).
- [ ] Add minimal GitHub Actions only for high-value automation (image optimization on PR, Lighthouse CI on deploy previews).
- [ ] Decide whether to co-locate worker config/secrets docs in-repo or keep separate.

---

## Verification Rules (Apply to Every Task)

Before marking any item `DONE`:
- [ ] Lighthouse mobile + desktop scores recorded before/after (or relevant manual test)
- [ ] Keyboard-only navigation test on changed components
- [ ] `git diff --stat` shows intentionally small surface area
- [ ] Relevant docs (CLAUDE.md, ARCHITECTURE.md, worker/README, todo.md) updated in same change
- [ ] For images: at least one modern format variant confirmed + `srcset` in use

---

## Review Section (After Each Phase)

**Phase 0 Review** (date):  
Findings:  
Lessons captured in `tasks/lessons.md`:  
Next phase decision:  

---

**Status as of analysis**: All items above are `TODO`. No work started yet.

**Decision needed**: Which item or phase should we execute first? (Recommended: Phase 0 focus styles + worker docs as zero-risk quick wins, or Phase 1 hero image compression for maximum visible impact.)