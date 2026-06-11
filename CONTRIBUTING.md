# Contributing to CyberOffroading.com

Thanks for your interest! This is a personal, opinionated site, but contributions that improve quality, accessibility, or performance are welcome.

## Core Principles

- **Zero build step** — Keep the default workflow as simple as `edit file → test locally → git push`.
- **Brutalist consistency** — Zero border-radius. Heavy use of angular `clip-path`. Match the existing design system.
- **Content first** — Real-world testing and honest specs beat marketing copy.
- **Minimal dependencies** — We removed the only external icon library. Be very reluctant to add new ones.

## How to Contribute

### 1. Small fixes / typos
Just open a PR. Mention it in the commit message.

### 2. Adding or updating a product
See the "Adding Products (2026)" section in [CLAUDE.md](CLAUDE.md).

**Strong recommendation**: Run `./scripts/optimize-images.sh -w 800` on any new photo (800 for product cards, 1200 for gallery/build shots) and wire it up with the `<picture>` pattern used by existing cards, including explicit `width`/`height`.

### 3. Documentation / Architecture
- Update `ARCHITECTURE.md` when changing major systems (modal behavior, worker, image workflow, etc.).
- Keep `tasks/todo.md` and `tasks/lessons.md` up to date.

### 4. Larger changes
Open an issue first describing the problem and your proposed approach. We value minimal, elegant diffs.

## Local Development

```bash
python3 -m http.server 8000
# or
npx serve .
```

The voting system will show placeholder counts locally (it calls an external worker).

## Image Workflow

See `ARCHITECTURE.md` → "Image Optimization Workflow".

## Worker (Voting / Clicks)

See `worker/README.md` for the API contract and deployment instructions.

## Code Style

- Keep `js/main.js` as one well-commented IIFE for now (it's still under 500 lines).
- CSS lives in one file with clear section comments.
- Prefer `clip-path` and existing CSS variables over new techniques that break the angular aesthetic.

## Questions?

Open an issue or reach out on X (@kchau).

---

*Last updated during the 2026 full-site improvement pass.*