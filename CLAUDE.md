# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CyberOffroading.com — A single-page Cybertruck off-road accessories site with affiliate links. Pure HTML/CSS/JS, no build step. Hosted on GitHub Pages with Cloudflare CDN.

## Architecture

- **Single-page site**: `index.html` contains all product sections as anchor-linked sections (`#offroad`, `#recovery`, etc.)
- **Two guide pages**: `guides/roof-glass.html` and `guides/winch-wiring.html` — standalone long-form content
- **No framework**: Plain HTML/CSS/JS. Edit files directly. Changes deploy on push via GitHub Pages.

## Key Files

- `index.html` — The entire site. Product cards organized in `<section>` elements by category.
- `css/style.css` — Design system. CSS custom properties for colors, fonts. Chakra Petch (display) + IBM Plex Mono (body).
- `js/main.js` — IntersectionObserver for nav highlighting and card reveal animations. No dependencies.
- `PLAN.md` — Full site plan with affiliate link inventory, photo inventory, design specs.
- `CNAME` — Points to cyberoffroading.com for GitHub Pages.

## Design System

- **Zero border-radius** — Everything is angular. No rounded corners.
- **Colors**: `--steel-dark` (#0a0a0b) base, `--cyber-blue` (#00d4ff) accent, `--warn-red` (#ff2a2a) for warnings.
- **Cards use `clip-path`** for corner cuts. Don't add `border-radius`.
- **Nav pills** also use `clip-path` for angular shape.

## Adding Products

Copy an existing `<article class="product-card">` block, update the content, image path, and affiliate link. Place it inside the relevant `<section>`. Photo goes in `images/products/CATEGORY/PRODUCT-NAME/`.

## Adding Categories

Copy an existing `<section>` block, give it a new `id`, and add a corresponding `<a class="nav-pill">` to the sticky nav.

## Affiliate Links

All affiliate links use `target="_blank" rel="noopener noreferrer"`. Amazon links use amzn.to shortlinks. FTC disclosure is in the footer.

## Images

Photos are in `images/products/` organized by category. Mix of own photos and Amazon product images. Use `loading="lazy"` on all product images. Hero image uses `loading="eager"`.