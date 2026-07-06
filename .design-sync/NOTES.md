# design-sync notes — cyberoffroading

## Repo shape (important context)
- This repo is a **zero-build static site** (pure HTML/CSS/JS), NOT a component library. The synced package is a hand-authored **adapter layer** at `.design-sync/adapter/` — thin React wrappers that emit the site's exact markup/classes. The styling ships verbatim: `adapter/styles/site.css` is a **build-time copy of `css/style.css`** (the `build` script re-copies it), so the site stylesheet stays the single source of truth. Never edit `site.css` in the adapter; edit `css/style.css` and rebuild.
- When site markup/classes change, the adapter components in `.design-sync/adapter/src/*.tsx` must be updated by hand to match — a re-sync rebuild alone only refreshes the CSS.
- Adapter build: `cd .design-sync/adapter && npm run build` (npm install first on a fresh clone; sandbox may require `--cache <scratchpad>/npm-cache` because `~/.npm` writes get denied).

## Converter specifics
- `cssEntry` is copied **verbatim** (no `@import` resolution) → it points straight at `styles/site.css`. Fonts ride `extraFonts: ["styles/fonts.css"]` (self-hosted woff2, latin + latin-ext subsets harvested from Google Fonts; IBM Plex Mono 400/500/600, Audiowide, Yellowtail — OFL/Apache licensed).
- `guidelinesGlob` must stay `[]` — the default glob swallows `docs/*.md` (the per-component docs) as guidelines.
- The preview harness paints the page white; `cfg.provider = NightStage` (a real DS export packaging the site's dark body styles) puts every preview cell on the void. Without it the dark-first system grades wrong on white.
- Playwright: repo has no pin; the machine cache had chromium-1200 → playwright **1.57.0** installed into `.ds-sync/`. On a different machine, re-match the cache build to the playwright release first.
- Site markup gotcha baked into the adapters: `.product-card`, `.gallery-item`, and `.category-nav__brand` are invisible until site JS adds `revealed` — the adapters hard-code `revealed` so static renders show the settled state.

## Known render warns (triaged)
- **"⚠" error-sentinel false-positive**: the capture/validate harness flags any cell whose root `textContent` starts with "⚠" as its own error-fallback card. WarningCallout's real label is "⚠ Warning" → the floor-card warn (`"WarningWarningCallout"`) and any authored ⚠-leading cell false-positive. Workaround baked into `previews/WarningCallout.tsx`: a `display:none` span with U+200B prepended in each cell. Keep that span on any future ⚠-leading preview cell.

## Preview-authoring gotchas (from the 2026-07 wave)
- Bare `className="product-card"` stage divs in previews need `revealed` too (base CSS is `opacity:0` until revealed; capture beats the 1.5s fallback animation).
- `section__icon` carries glow but NOT color — the `.section__eyebrow` parent supplies `currentColor`; standalone icon tiles need `color: var(--cyan)` on the wrapper. `category-tile__icon` colors itself.
- `.gallery-grid` is CSS multicol — equal-height items balance by column height (4 identical photos → 2/2/0 with an empty column). Mix aspect ratios in previews.
- Fixed-position pieces (BackToTop) escape the NightStage provider strip and render on the harness's white cell corner — accepted, don't fake it.
- Global `*{margin:0}` reset → bare sibling `<p>`s stack with no gap outside scoped prose contexts; CSS truth, not a bug. Alt-band contrast (`--panel-2` vs `--void`) is real but intentionally faint.
- Accent var is `--cyan` — the project CLAUDE.md's `--cyber-blue` name is historical/wrong for styling work.
- Article-body pieces read best at `maxWidth` 640–760 in previews; cards at ~380; standalone CategoryTile at ~180.

## Deliberately not synced
- GuideModal / gallery Lightbox / loading-skeleton states — interaction-driven, no static render.
- The baked brand lockup images (hero/nav/footer PNGs in `images/brand/`) — binary assets outside the bundle model. `NeonWordmark` (live text) is the DS-source form; its docs note the baked-image practice.
- Hover/flicker motion can't show in static sheets; flicker was verified present in CSS (`.flick`, `nflick`/`nflick2`).

## Re-sync risks
- `adapter/styles/fonts.css` + `styles/fonts/*.woff2` are a frozen harvest (2026-07) — if the site changes font weights/families in the Google Fonts link, re-harvest by hand.
- The adapter duplicates site markup by construction: any `index.html`/`style.css` refactor (class renames, new variants) silently stales the adapters until someone updates `src/*.tsx`. Diff `css/style.css` class names against adapter usage when re-syncing after big site changes.
- Preview realism copied from mid-2026 site content; harmless to age.
