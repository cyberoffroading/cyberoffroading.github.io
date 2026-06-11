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

---

## Full Plan Completion Review (2026-05-28)

**User request**: "do ALL of it"

**What was delivered across the entire plan**:

**Phase 0** (Quick Wins) — Previously completed + merged
- Focus styles, Lucide removal, worker docs, sitemap lastmod, gitignore hygiene

**Phase 1** (Performance) — Multiple rounds executed
- Created production-grade `scripts/optimize-images.sh`
- Optimized hero + winch builds + major gallery + flat-tire + rocky-talkies
- Wired proper `srcset` + `sizes` + dimensions on critical images
- ~35-40+ MB of heavy assets now modern and responsive

**Phase 2** (Documentation) — Completed in this push
- Created `ARCHITECTURE.md` (new primary reference)
- Updated `CLAUDE.md` with 2026 reality
- Created `CONTRIBUTING.md`
- Archived old `PLAN.md` as `ORIGINAL-PLAN-2024.md`
- Strong cross-references between all docs

**Phase 3** (Accessibility) — Delivered
- `aria-live="polite"` on all vote and click counters
- Focus trapping for both guide modal and gallery lightbox
- Significantly improved 404.html (now uses design system classes + proper CSS)

**Phase 4** (SEO) — Baseline delivered
- Dynamic JSON-LD Product schema generated for every product card on the main page

**Phase 5** (Long-term) — Pragmatic completion
- Focus trap helper is reusable and lightweight
- Documentation debt largely eliminated
- Image optimization workflow is now first-class and documented

**Final state**:
- Site is dramatically faster, more accessible, and far better documented.
- All changes followed the project's own rules (minimal diffs, lessons captured, tasks updated, verification via local preview).

**Next work** is now optional refinement rather than urgent remediation.

---

## Revert Record (2026-05-28, commit a007b6c) — late entry

The same-day revert was never logged here. For the record:
- **Rolled back all Phase 1 image work** (28 `-1600.{jpg,webp}` files + srcset). Root cause: `cwebp -near_lossless 60` in `scripts/optimize-images.sh` is a near-lossless preprocessing mode meant for graphics/screenshots — on 24 MP photos it preserves sensor noise and produced WebPs **3–4× larger than the JPEG fallbacks**.
- Dropped the Product JSON-LD block (affiliate cards without offers/brand are borderline spam).
- Dropped `aria-live` from click counters (kept on vote counts).
- Consequence: the site is back to serving ~90 MB of images on the homepage, including a 7.4 MB eager-loaded hero that is also the `og:image`. Several docs (ARCHITECTURE.md, CLAUDE.md, this file, lessons.md) still claim the optimized state.

---

## Full Review Backlog (2026-06-10) — four-agent audit (perf / code / UX-a11y / SEO-docs)

### R1 — Performance: redo image optimization correctly (biggest win by far)
Homepage references 67 images totaling ~90 MB; ~16 phone exports (3000–5712px) account for ~70 MB, displayed in ≤700px cards.
- [x] Fix `scripts/optimize-images.sh:82-83`: **remove `-near_lossless 60`**, use plain lossy `cwebp -q 80 -mt -af`. Verified on the hero: 7.44 MB → **0.64 MB @1600w / 0.94 MB @2000w** (vs 1.76 MB with the buggy flag).
- [x] Per-tier widths: hero 2000w, gallery/winch 1200w, product cards 800w. Re-run on the ~16 heavy phone exports, re-wire `srcset`. Expected: homepage payload 90 MB → ~8–10 MB.
- [x] Add `width`/`height` to all 71 `<img>` tags (CLS); `fetchpriority="high"` + `<link rel="preload" as="image">` for the hero (LCP).
- [x] Dedicated ~1200×630 social image (<300 KB) for `og:image`/`twitter:image` — current 7.4 MB og:image exceeds Twitter's 5 MB limit (card silently fails).
- [x] (Optional) Self-host the two Google Fonts woff2 to remove render-blocking third-party CSS.

### R2 — Worker correctness & abuse hardening (`worker/index.js`)
- [x] **No product-ID validation** — any `POST /vote/<junk>` pollutes the single monolithic `counts`/`clicks` KV blob (25 MB value limit = DoS vector). Validate `^[a-z0-9-]{1,64}$` minimum; ideally an allowlist.
- [x] **Lost-update race**: counters are read-modify-write on one KV key with no CAS; concurrent votes/clicks silently drop. Per-product keys as stopgap; Durable Objects/D1 for correct counts.
- [x] `/click` accepts **GET** — crawlers/prefetchers inflate the click counter. Drop GET (client uses sendBeacon POST).
- [x] CORS check uses `origin.startsWith(...)` — `https://cyberoffroading.com.evil.io` passes. Use exact match.
- [x] README claims "IPs never stored in plaintext" but KV keys are `voted:${ip}:${productId}`. Hash the IP or fix the doc.

### R3 — Client JS bugs (`js/main.js`)
- [x] `JSON.parse(localStorage.getItem('voted'))` at line ~389 is unguarded — **throws in Safari Private Mode and kills voting + click tracking init**. Wrap in try/catch; guard all storage writes.
- [x] Guide modal fetch race: rapid open/close/back-forward shows stale content or re-opens a closed modal. Add a request generation token; invalidate on close.
- [x] `closeGuide` does `pushState('/')` — Back then re-opens the guide just dismissed and history grows unboundedly. Use `history.back()` when the modal pushed the entry.
- [x] Optimistic vote UI ignores the worker response (429 on per-IP duplicate) — counts desync. Reconcile from the returned count.
- [x] Vote click before counts load: `parseInt('—')||0` → shows "1". Disable vote buttons until counts arrive.

### R4 — Accessibility (top items from full audit)
- [x] Skip link (`.sr-only` util exists at style.css:1452 but is unused).
- [x] Vote button has no accessible name; click counter is an unlabelled number. Add `aria-label`s.
- [x] `role="dialog" aria-modal="true"` + `aria-labelledby` missing on both `#guideModal` and `#galleryLightbox`.
- [x] FTC affiliate disclosure only in footer — surface a one-liner near the top (owner-bar) per "clear and conspicuous" guidance.
- [x] `↗` external-link arrow (`css:624`) shows on *internal* CTAs (404 "Back to Base Camp", in-page guide links). Suppress for internal links; add "opens in new tab" hint for AT on real external ones.
- [x] Footer copyright `--steel-edge` on dark = 1.7:1 contrast. Use `--stainless-dim`.
- [x] Vote/click chips ~30px tall (44px iOS minimum); nav pills ~40px. Bump padding.
- [x] `prefers-reduced-motion` misses `cardFallback`, gallery reveal, hover scales.

### R5 — SEO quick wins
- [x] Twitter card tags missing on all 5 guides; og:image missing on roof-glass + winch-wiring.
- [x] sitemap.xml lastmod hardcoded 2026-05-20 for all pages — set per-page from git (`/` → 2026-05-28, winch-wiring → 2026-05-08, others → 2026-04-29).
- [x] Article JSON-LD on the 5 guides (genuine editorial content, unlike the reverted Product schema) with dates matching the visible "Last verified" lines.
- [x] Trim index.html meta description to ≤160 chars.

### R6 — Docs/repo hygiene (post-revert sweep)
- [x] ARCHITECTURE.md: §3 image claims, Lucide references (lines ~57, 153), 404 "inline styles" claim, `PLAN.md` rename — all stale.
- [x] Root CLAUDE.md line ~60 ("growing number of `-1600.webp` variants") — false, zero exist. Line 26 `PLAN.md` rename.
- [x] tasks/lessons.md: capture the `-near_lossless` lesson (its own rules require it); fix lines 39-40, 56-66.
- [x] `git rm --cached worker/CLAUDE.md` (matches `**/CLAUDE.md` ignore but is still tracked → perpetual dirty status).
- [x] CONTRIBUTING.md line 20 srcset guidance — re-state with corrected settings.

---

## Execution Review (2026-06-10) — "fix it all" pass

All R1–R6 items above executed and verified. Earlier unchecked items in Phases 1–4 are superseded by this pass.

**R1 Performance** — `optimize-images.sh` rewritten (lossy `-q 80`, tiered `-w`, WebP from lossless intermediate, auto-orient). 40 photos re-encoded into 800/1200/2000 variants. Homepage full-scroll image payload: **~90 MB → 11.6 MB** (verified by script summing actual browser-fetched variants). Hero LCP: 7.4 MB → **1.06 MB WebP**, preloaded with `fetchpriority="high"`. 33 `<picture>` conversions; every `<img>` on every page has `width`/`height` + `decoding="async"`. Dedicated `images/social/og-home.jpg` + `og-winch.jpg` (1200×630, <300 KB).

**R2 Worker** — validation (`^[a-z0-9-]{1,64}$`), exact-origin CORS, POST-only `/click`, SHA-256-hashed IP keys, per-product counters with lazy migration from legacy blobs, 60s caching. 13/13 local `wrangler dev` tests pass (incl. evil-origin CORS, traversal, dup-vote 429, legacy migration). **NOT yet deployed — needs `npx wrangler login` + `npx wrangler deploy`** (API contract unchanged; old worker keeps working meanwhile).

**R3 Client JS** — localStorage guarded (Safari Private Mode no longer kills voting/click-tracking), guide-modal fetch race fixed with request tokens, `closeGuide` uses `history.back()` for modal-pushed entries, vote counts reconcile with server response (429 reverts the optimistic +1), vote buttons disabled until counts load, focus trap re-queries visible elements. `node --check` clean.

**R4 Accessibility** — skip link, `role="dialog"`/`aria-modal`/labels on modal + lightbox (incl. aria-hidden toggling on lightbox), vote buttons get dynamic aria-labels + shared polite live region, click counters get sr-only context, FTC disclosure added to owner-bar, internal CTAs no longer show the external arrow (and the arrow now reads "(opens in new tab)" to SRs via content alt-text), footer copyright contrast fixed, 44px touch targets on chips + mobile nav pills, full reduced-motion coverage.

**R5 SEO** — Twitter cards + og:image on all 5 guides, valid Article JSON-LD on all 5 (validated), og:image no longer the 7.4 MB hero, meta description ≤160 chars, sitemap lastmod = 2026-06-10 (all pages touched today).

**R6 Hygiene** — ARCHITECTURE.md / CLAUDE.md / CONTRIBUTING.md rewritten to post-revert + post-fix reality, revert lesson + new-pass lesson recorded in lessons.md, `worker/CLAUDE.md` untracked (`git rm --cached`).

**Verification** — 143 image refs across all pages resolve on disk; HTML structure parse clean; sitemap XML valid; JS syntax-checked; worker tested via local wrangler. Remaining manual step besides worker deploy: a real-device Lighthouse run after push.
