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

## Future Entries

(Added after real corrections or user feedback during implementation)

---

**Template for new lessons**:
- **YYYY-MM-DD** — Brief trigger
- One-sentence observation of what went wrong or what was surprisingly effective
- Concrete rule or checklist item we will enforce going forward

---

*This file is the project's self-improvement memory. Review at the start of any non-trivial work session.*