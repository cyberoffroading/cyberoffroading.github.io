# CyberOffroading.com — Lessons Learned

This file captures recurring patterns, mistakes, and rules we have learned so we stop repeating them. Update after every correction or major discovery.

Format:
- **Date** — Context
- Lesson (one sentence)
- Rule / Prevention (what we will do differently)

---

## 2026-05 — Initial Full Repo Analysis

**Image bloat is the silent killer on static content sites.**  
We shipped (and continue to ship) raw multi-megabyte phone exports and Amazon downloads directly into production. `loading="lazy"` only delays the pain — it does not reduce bytes. The 112 MB `/images` directory is 99% of our performance problem while HTML+CSS+JS combined is ~100 KB.

**Rule**: Every new or updated image must go through an optimization step (AVIF primary + WebP fallback + sensible `srcset` widths) before being referenced in HTML. Manual one-off is acceptable; a lightweight script or Action is better. Never commit another 5 MB+ JPEG to the repo without explicit justification and compression proof.

---

**Focus styles are not optional "nice to have" — they are the baseline for keyboard users.**  
Despite a very thoughtful a11y effort (reduced motion, 44 px CTAs, good ARIA on modals, contrast bump on `--stainless-dim`), the entire 1472-line CSS contained **zero** `:focus` or `:focus-visible` rules. All custom clip-path buttons and the new vote stars are completely invisible or broken under keyboard navigation.

**Rule**: Any interactive element (custom button, pill, card link, injected vote UI, lightbox controls) must have explicit, high-contrast `:focus-visible` styles before the feature is considered complete. Add the styles in the same PR that introduces the element. Test with Tab only.

---

**Feature velocity without documentation creates technical debt that compounds.**  
The site evolved from a pure static brochure (original PLAN) into a hybrid interactive experience with voting, click tracking, modal guide consumption, gallery lightbox, and 5 guides — none of which are reflected in `PLAN.md`, root `CLAUDE.md`, or any worker docs. A future contributor (or future self after 6 months) would have to reverse-engineer `data-product-id`, the Worker API contract, `.guide-content` extraction, pushState handling, and cache-busting convention.

**Rule**: When a feature crosses the "someone else might need to understand or extend this" threshold (voting system, modal architecture, worker, new major section), we update the relevant docs in the same session or immediately after. Prefer small `ARCHITECTURE.md` + focused READMEs over monolithic PLAN updates. The cost of 15 minutes of writing is far lower than the cost of re-onboarding.

---

**2026-05-28 — "Do ALL of it" push**

We completed the full remaining improvement plan (Phases 2–5) in one focused session after the user said "do ALL of it":
- Finished documentation debt (ARCHITECTURE.md + updated CLAUDE.md + CONTRIBUTING.md + archived old plan)
- Added real a11y improvements (aria-live on counters + focus trapping on both modals/lightbox + better 404)
- Added baseline JSON-LD Product schema
- Made pragmatic long-term choices without forcing build tooling

This was only possible because earlier phases (focus styles, image optimizer, worker docs) had already built strong momentum and tooling.

**Rule**: When the user (or future self) says "finish everything", break it into clear internal todos, execute in logical order (docs → a11y code → SEO → polish), and over-document the journey in tasks/ and lessons/. The site is now dramatically better across performance, accessibility, and maintainability.

---

**"No build step" is a constraint to design around, not a blanket excuse to skip automation.**  
We correctly avoided Vite/Webpack/etc. for the core site. However, that does not mean we cannot have optional, non-blocking tooling (image optimization script that outputs to the same directories, GitHub Action that only runs on image PRs, Lighthouse CI on deploy previews). The original vision of "anyone can edit" is preserved as long as the default edit path remains `git add index.html css/style.css js/main.js && git push`.

**Rule**: When a painful manual process (image optimization, cache-busting, Lighthouse checks) starts costing more time than writing a 20-line script or 15-line Action, we add the helper — but only in a way that leaves the zero-build happy path untouched.

---

**2026-05-28 — First real image optimization pass (Phase 1)**

**Even "good enough" WebP + reasonable JPEG fallbacks at 1600px deliver 60-90% size reductions** with almost no visible quality loss on this site (high-contrast, industrial aesthetic is very forgiving). Using the tools already on the machine (`magick` + `cwebp`) + a small helper script, we knocked ~25-27 MB off just the hero + winch build cluster in one focused session.

**Rule**: When doing image work:
- Always keep the original full-res file
- Produce `-1600.webp` + `-1600.jpg` (or other widths) using the shared `scripts/optimize-images.sh`
- Update HTML with `srcset` + `sizes` + explicit dimensions in the same change
- Measure and record before/after in `tasks/todo.md` immediately

This turns a terrifying 112 MB directory into something manageable one cluster at a time.

---

## 2026-05-28 — Post-review merge of Phase 0 improvements

**Explicit local review + documented merge produces much higher quality than direct-to-main work.**  
We did the full analysis in plan mode, implemented on a dedicated branch, reviewed via local server + keyboard testing, then merged with a descriptive --no-ff commit and updated the persistent task tracker before pushing. This caught the "master vs main" naming slip and ensured docs stayed in sync.

**Rule**: For any non-trivial improvement set, always:
1. Work on a feature branch
2. Review locally (run server, keyboard test, `git diff`)
3. Update `tasks/todo.md` with a merge review section before pushing
4. Use `--no-ff` merge commits with context in the message
5. Only push after the above

---

## 2026-05-28 — Same-day revert of the image pass (recorded late, 2026-06-10)

**`cwebp -near_lossless` is for screenshots/flat graphics, never photos — and we shipped it without checking output sizes against the fallback.**  
The Phase 1 image pass used `-near_lossless 60`, a near-lossless preprocessing mode that preserves pixel-level detail. On noisy 24 MP phone exports it spent bits preserving sensor noise, producing WebPs **3–4× larger than the JPEG fallbacks** they were supposed to beat. All 28 variants were reverted the same day (commit `a007b6c`) — and the revert itself was never recorded here, so a month later the docs claimed an optimized state that didn't exist.

**Rules**:
1. After any batch encode, compare each output against both the original AND the fallback format; a "modern format" variant that is larger than its fallback is an automatic failure.
2. Encode WebP from a lossless intermediate (or the original), never from the already-compressed JPEG fallback — it inflates output preserving JPEG artifacts.
3. When work is reverted, record the revert and the root cause in this file and `tasks/todo.md` **in the same commit as the revert**. A revert without a lesson guarantees a repeat.

---

## 2026-06-10 — Full-site polish pass (images redone right + worker hardening)

**Plain lossy `cwebp -q 80` with per-use width tiers (hero 2000 / gallery 1200 / cards 800) cut the homepage image payload from ~90 MB to ~12 MB** with no visible quality loss — confirming the only thing wrong with the original approach was the flag. Also fixed in the same pass: worker input validation + hashed IP keys + per-product KV counters, localStorage crash in Safari Private Mode, guide-modal fetch race + history.back() on close, dialog semantics, skip link, FTC disclosure placement, Article JSON-LD + Twitter cards on guides.

**Rule**: An audit that mixes four lenses (perf / code correctness / a11y / SEO+docs) catches reverts-in-disguise: half the "completed" May work was silently undone and only the docs-consistency lens caught it. Re-verify "done" claims against the working tree, not the changelog.

---

## 2026-06-29 — "Night Trail" neon relight (full visual reskin)

Re-skinned the entire site (Cold Steel → neon) by rewriting `css/style.css` to a new co-primary cyan+red token system while keeping every JS-contract selector intact. Built solo for design coherence (one stylesheet = one author), then ran a 5-lens adversarial review *workflow* (fidelity / a11y / JS-integrity / cross-page / code-spec): zero P0, fixed 2 a11y P1s + 4 P2s it surfaced.

- **`clip-path` clips `box-shadow` AND `outline`.** A `:focus-visible` ring drawn with `box-shadow` on a clip-path'd element is invisible — the old "box-shadow ring prevents clipping" assumption was backwards. **Rule:** set `clip-path: none` on `:focus-visible` (a clean square ring suits the zero-radius aesthetic); when a *parent* does the clipping (`.article-card__link` inside `.product-card`), un-clip the parent via `:focus-within { clip-path:none; overflow:visible }`. Verify with an `autofocus`'d control screenshot — headless treats autofocus as keyboard focus.
- **Flex items overflow on mobile via default `min-width:auto`.** A `white-space:nowrap` hero wordmark forced `.hero__content` wider than the viewport (a flex child won't shrink below its intrinsic content width). **Rule:** add `min-width:0` to flex children holding wide nowrap content; confirm with a DOM probe (`documentElement.scrollWidth == clientWidth`), not by eyeballing screenshots.
- **Visual verification pipeline (this repo):** `python3 -m http.server` + headless Chrome `--screenshot`, then Read the PNG. Both `--headless` and `--headless=new` capture **viewport-only**, so for full-page use a *tall* viewport (`--window-size=1440,21000 --virtual-time-budget=25000`) — that loads `loading=lazy` images and fires IntersectionObserver reveals — then `magick IN -crop 1440xH+0+OFFSET` into readable bands. Measure true height with an iframe probe AFTER images load (a short iframe undercounts: collapsed lazy-image boxes). `?query` cache-busts between shots.

---

## 2026-06-29 — Neon Phase 2 (extend the design language into richer components)

Added guide-detail components (step-list, affiliate card, author box, related band), product-card pick badges + spec rows, a homepage category grid, and loading skeletons. 5-lens review came back 0 critical / 1 major — the major was a `--text-dim` (decorative token, ~3.1:1) used for the FTC affiliate disclosure; swapped to `--text-2` to match `.owner-bar__disclosure`.

- **The guide modal injects ONLY `.guide-content`'s `innerHTML`** (`main.js` does `contentEl.innerHTML` → `#guideModalContent`). So the `.guide-content` wrapper itself is NOT in the modal, and the existing prose CSS is *duplicated* as `.guide-page X` AND `.guide-modal X` (different scopes, slightly different values). **Rule:** any component that must look identical standalone and in-modal needs **GLOBAL, un-prefixed** CSS (like `.info-callout`) — never `.guide-page`/`.guide-content`-scoped — and should use `<div>`s, not bare `<p>`/`<li>`, to dodge the scoped prose rules (or override them globally, e.g. `ol.step-list > li.step > p { margin:0 }`). Verify in a harness that injects the fragment into a real `.guide-modal` shell, because the `.guide-modal`-scoped rules are the ones the standalone screenshot does NOT exercise.
- **A delegated `data-guide-modal` handler that `preventDefault()`s then opens a modal becomes a DEAD LINK on any page without the modal shell.** Standalone `/guides/*.html` have no `#guideModal`, so a related-card there would be swallowed (preventDefault fires, `openGuide` early-returns). **Rule:** guard delegated modal handlers with `if (!guideModal) return;` *before* `preventDefault` so the link falls through to native navigation — progressive enhancement: modal where the shell exists, real nav where it doesn't. (Guides don't even load `main.js` today, but the guard is correct belt-and-suspenders.)
- **A loading shimmer keyed off a "loading" class must clear that class on the FAILURE path too, not just success.** Keying the skeleton off `.is-loading` removed only in the fetch `.then()` leaves it pulsing forever when the worker is unreachable (the existing `.catch` left buttons disabled). **Rule:** remove the loading-state class in BOTH the success and `catch` branches (and respect `prefers-reduced-motion` with a static fallback for the placeholder).
- **A new homepage `<section>` that the nav scroll-spy shouldn't track must NOT use `class="section"`.** `main.js` does `querySelectorAll('.section')` and activates the pill matching the last in-view section id; a `.section` with no matching pill blanks the active pill while scrolled over it. **Rule:** give non-tracked bands their own class (e.g. `.browse-section`) and replicate only the spacing — keep them out of the `.section` set.

---

## 2026-06-30 — Hero wordmark neon looked wrong on mobile Safari (glow tuning)

Chased the mobile wordmark glow through several rounds of tightening based on **Chrome** screenshots; the user reported it "looks terrible" on their iPhone and asked me to make mobile Safari match desktop Chrome/Firefox. Two compounding mistakes: verifying on the wrong engine, and maintaining a divergent per-breakpoint glow.

- **Verify neon/text-shadow/filter rendering on the actual target engine — use the iOS Simulator (WebKit), not just headless Chrome.** Safari and Chrome rasterize `text-shadow` blur differently, so a value that looks right in a Chrome screenshot can look dead in Safari. **Rule:** for any glow/blur/filter change that ships to mobile, capture on the iOS Simulator (`xcrun simctl openurl <UDID> <url>` → `xcrun simctl io <UDID> screenshot`) before declaring it done. (Headless Chrome also *hangs on teardown* on this box but writes the PNG first — run it backgrounded and just read the file, then `pkill` the profile.)
- **A glow blur in fixed `px` cannot serve two font-sizes.** 60px of blur is a proportional halo on 60px type but a bloom that floods 26px type — which forced a separate, tighter mobile override that then diverged and read as flat/non-neon. **Rule:** express hero glow blur in **`em`** so the halo scales with `font-size` automatically — one recipe drives every breakpoint and browser, desktop stays byte-identical (`0.07em × 60px = 4px`), and there's no per-breakpoint drift to keep in sync. Delete the media-query text-shadow overrides once the base recipe is em-based.

---

## Future Entries

(Added after real corrections or user feedback during implementation)

---

**Template for new lessons**:
- **YYYY-MM-DD** — Brief trigger
- One-sentence observation of what went wrong or what was surprisingly effective
- Concrete rule or checklist item we will enforce going forward

---

*This file is the project's self-improvement memory. Review at the start of any non-trivial work session.*
---

**2026-08-24 — `<picture>` silently breaks `height: 100%` on card images**

Building the full-width hero card for `#overlanding`, the photo letterboxed inside its box
(692px container, 481px image) despite `object-fit: cover` and `width/height: 100%` on the
`<img>`. Cause: the site's cards wrap images in `<picture>`, so **`<picture>` is the flex
child of `.product-card__image`, not the `<img>`**. The img's `height: 100%` resolved against
`<picture>`, which has auto height, so it fell back to the natural aspect ratio.

It never showed up before because every other card sets a fixed `aspect-ratio` on the image
box with `object-fit: contain` — the letterboxing *is* the intended look there. It only bites
when `aspect-ratio` is `auto` and you actually need the image to fill.

**Rule**: When an image must fill a container of unknown height, style the `<picture>`, not
just the `<img>` — `picture { position: absolute; inset: 0; display: block; }` on a
`position: relative` box, then `width/height: 100%` on the img. Verify by DOM-probing that
the image's rendered box equals its container's (`fills = |boxH - imgH| < 2`), not by eye —
a 200px letterbox on a dark photo against a dark card is easy to miss in a screenshot.

**Follow-on**: the same bug hides in *every* `<picture>`-wrapped card, just less visibly —
the img sizes to its intrinsic ratio inside the 16px `product-stage` padding instead of
filling, so a lifestyle photo gets a light frame around it. Only the plain-`<img>` cards
(e.g. `bed-mat`) actually fill. The fix is now factored into `.product-card__image--photo`;
reach for that class on any lifestyle photo rather than re-patching per card.

---

**2026-08-24 — Semantic color: don't reach for `--secondary` just because you need a second button**

The hero card needed a quieter companion to its primary CTA, so `.cta-button--secondary` was
the obvious pick — but that modifier is **red**, and in this design system red is a domain
signal (recovery / flat-tire / winter / events / hazard), not a hierarchy signal. A red
"Browse All Urander" button inside a cyan overlanding section reads as a warning.

**Rule**: Before reusing a modifier, check whether it encodes *hierarchy* or *meaning*. In
this codebase red = domain, glow = interactive/brand. If you need a neutral secondary in a
cyan section, use `.cta-button--ghost` (added for exactly this) rather than borrowing the red
one. Adding a correctly-scoped variant beats misusing an existing one.

---

## 2026-09-01 — Cloudflare "KV daily operation limit 90%" alert

**A free-tier cap alert is a per-request-cost problem before it is a traffic problem.**  
`GET /votes` rebuilt the whole payload on every isolate cache miss: 2 KV list ops + one read per product key (~110 ops). The free tier allows only 1,000 list ops/day, so roughly 450 cache-missing homepage loads (humans plus JS-rendering crawlers) were enough to trigger the alert — nowhere near a traffic milestone. Fixed by persisting the merged payload as one `snapshot` key (1 read per miss) with an hourly self-healing rebuild.

**Rule**: Anything in the worker that runs on the hot path must cost O(1) KV operations per request. Never list keys or fan out per-product reads on a request path; do that work once and persist the result. Check `worker/README.md` → "KV Budget" before adding a KV call, and install Cloudflare Web Analytics (still open in `tasks/todo.md`, Phase 4) so "are we getting real traffic?" has a direct answer instead of an inference from a quota alert.
