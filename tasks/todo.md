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

### Session 1 Progress (2026-05-28) — "Next Round" after Phase 0 merge

**Created**: `scripts/optimize-images.sh` — optional, well-documented helper using `magick` + `cwebp` (tools already on the machine). Respects the zero-build philosophy.

**Hero optimization** (biggest single win — LCP):
- Original: `images/hero/IMG_2984.jpeg` → **7.1 MB**
- Optimized:
  - `IMG_2984-1600.webp` → **2.7 MB** (−62%)
  - `IMG_2984-1600.jpg`  → **696 KB** (−90%)
- Updated primary hero `<img>` + one secondary use with proper `srcset` + `sizes="100vw"`.
- Added explicit `width`/`height` for better CLS.

**Winch build-setup cluster** (very heavy section with 4 large photos):
- Originals combined: **~22.4 MB**
- After optimization:
  - WebP versions: ~11.1 MB total
  - JPEG fallbacks: ~2.2 MB total
- Updated the `.build-gallery` + two product card references with proper `srcset`.

**Cumulative savings this session (continued)**:
- Hero + Winch build (previous round): ~25–27 MB saved
- **Gallery + Flat-tire + Rocky Talkies** (this round):
  - 9 images processed (5 gallery, 2 flat-tire lifestyle, 1 comms)
  - Combined original: ~38 MB+
  - Optimized WebPs + JPEGs: roughly 14-15 MB total for the set
  - Typical savings: 55-85% per file

**Total visible progress so far**: 35-40+ MB of heavy images now have modern optimized variants with srcset in production HTML.

Still many more to go (remaining gallery images, vault-seal guides, etc.), but the critical path (hero, winch builds, gallery, flat-tire) is now substantially lighter.

**Current total images/** size: still ~112 MB (we've only touched the hero so far). Real progress will compound quickly once we hit the winch + gallery clusters.

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

**Status**: In progress (started right after Phase 1 image work).

### Completed
- [x] Created `ARCHITECTURE.md` — the new primary reference documenting the 2026 reality:
  - Guide modal system (fetch + `.guide-content`, pushState deep linking, prefetch, legacy hash handling)
  - Voting + click tracking (full Worker + KV architecture, privacy model, endpoints)
  - Image optimization workflow (`scripts/optimize-images.sh` + srcset pattern)
  - Current nav structure, key systems, development workflow, and known gaps
- [x] Updated root `CLAUDE.md` with accurate current architecture, adding products process, images guidance, and references to new docs.

### Remaining
- [ ] Consider creating a lightweight `CONTRIBUTING.md` (or expand the "Adding Products" section).
- [ ] Decide fate of old `PLAN.md` (archive as historical vision document?).
- [ ] Continue seeding `tasks/lessons.md` as new patterns emerge.

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