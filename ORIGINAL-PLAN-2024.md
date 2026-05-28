# CyberOffroading.com — Site Plan

## Vision
A sharp, opinionated Cybertruck offroading accessories site with affiliate revenue. Not a store — a curated recommendation list from someone who actually uses this stuff. Think "Wirecutter meets trail journal" with the angular, industrial aesthetic of the Cybertruck itself.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Static Site** | Plain HTML/CSS/JS | Zero build step, instant GitHub Pages deploy, anyone can edit |
| **Hosting** | GitHub Pages | Free, reliable, auto-deploys on push |
| **CDN/DNS** | Cloudflare (free tier) | Caching, SSL, DNS for cyberoffroading.com |
| **Fonts** | Google Fonts — Orbitron (display) + Space Mono (body) | Angular, techy, matches Cybertruck geometry |
| **Icons** | Inline SVGs | No dependencies |
| **Images** | WebP format, lazy loaded | Performance on mobile |
| **Analytics** | Cloudflare Web Analytics | Free, privacy-friendly, no JS bloat |

## Design Direction

**Aesthetic**: COLD STEEL BRUTALISM — The Cybertruck isn't a car, it's an unfinished weapons prototype that escaped the factory. The site should feel the same: raw stainless steel, exposed geometry, like you're reading a classified spec sheet for off-road hardware. Not "tech startup dark mode" — think armored vehicle HUD meets industrial parts catalog.

**What makes this UNFORGETTABLE**: The entire site feels like it was laser-etched onto brushed steel. Angled clip-paths slice through sections at the same angles as the CT's body lines. No curves anywhere — the border-radius is a war crime on this site.

### Color Palette
```css
:root {
  /* Steel foundation */
  --steel-dark:     #0a0a0b;       /* Near-black base — cold, not warm */
  --steel-mid:      #1a1a1e;       /* Card backgrounds */
  --steel-light:    #2a2a30;       /* Elevated surfaces */
  --steel-edge:     #3a3a42;       /* Borders, dividers */

  /* Stainless texture */
  --stainless:      #c8c8c0;       /* Primary text — warm silver, not white */
  --stainless-dim:  #78787a;       /* Secondary text */

  /* Accent — electric blue */
  --cyber-blue:     #00d4ff;       /* Primary accent — electric cyan */
  --cyber-glow:     rgba(0, 212, 255, 0.15);  /* Subtle glow behind CTAs */

  /* Danger/warning */
  --warn-red:       #ff2a2a;       /* "DO NOT use a tow ball" */
}
```

Electric cyan/blue against dark steel — clean, high-contrast, unmistakably cyber.

### Typography
- **Display**: `Chakra Petch` (Google Fonts) — Angular, geometric, Thai-inspired letterforms that feel engineered. Bold weight for headings.
- **Body**: `IBM Plex Mono` — Industrial monospace with real readability. Not decorative mono — functional, like spec sheets and terminal output.
- **Accent**: `Chakra Petch` light weight for category nav pills and callouts.

### Layout & Spatial Composition
- **Mobile-first single column** — Cards stack full-width on mobile. No grid fighting small screens.
- **Desktop**: 2-column product grid within each section. Max-width 1200px.
- **Section dividers**: Angled `clip-path: polygon()` slices at ~3° — matching the CT's hood/bed angles. Not decorative — structural.
- **Generous vertical spacing** between sections (120px+). Each category breathes.
- **Sticky nav**: Horizontal scrollable bar, pills with angular cut corners (`clip-path`), active state = blue fill.

### Product Cards
- Background: `--steel-mid` with subtle CSS noise texture overlay (SVG filter)
- **Corner cuts**: Top-right and bottom-left corners clipped at 45° via `clip-path` — echoing the CT's angular panels
- Image fills top half, info fills bottom half
- CTA button: `--cyber-blue` outline on hover fills solid with a fast 150ms wipe transition
- No box shadows — this is steel, not paper. Use 1px `--steel-edge` borders instead.

### Texture & Atmosphere
- **Noise overlay**: Subtle SVG noise filter at 2-3% opacity over the entire page — gives the flat dark surface a brushed-metal grain
- **Section backgrounds**: Alternate between `--steel-dark` and `--steel-mid` for visual rhythm
- **Scan lines** (very subtle): Repeating 1px transparent/semi-transparent lines at ~4px intervals over the hero — CRT/HUD feel without being gimmicky. CSS only, `repeating-linear-gradient`.
- **Hero**: Full-bleed CT photo with a hard diagonal clip overlay (not a gradient fade — a sharp geometric mask). Site title large, monospace, letter-spaced.

### Motion & Micro-interactions
- **Page load**: Staggered reveal — hero slides in, then nav, then first section cards fade up with 50ms delays between each
- **Scroll-triggered**: Cards fade up + translate 20px as they enter viewport (IntersectionObserver, CSS transitions — no library)
- **Hover on product cards**: Subtle 1px blue border glow (`box-shadow: 0 0 0 1px var(--cyber-blue)`) — fast, 150ms
- **CTA buttons**: Orange outline → solid fill wipe on hover
- **Nav pills**: Active pill gets a bottom-edge blue line that slides between pills on scroll (CSS transition on `::after` pseudo-element)
- **No bounce, no elastic, no spring physics** — everything is linear or ease-out. Sharp and mechanical, like servo motors.

### Warning Callouts
For safety warnings ("DO NOT use a tow ball"):
- `--warn-red` left border, 3px solid
- `--steel-light` background
- Monospace text, all caps label: `⚠ WARNING`
- Stands out without being obnoxious

### Responsive Breakpoints
- **Mobile** (< 768px): Single column, full-width cards, horizontal scroll nav
- **Tablet** (768-1024px): 2-column card grid
- **Desktop** (1024+): 2-column grid, max-width 1200px centered, sticky nav becomes fixed top bar

## Site Structure — Single Page + Guides

**Core approach**: One long scrolling page (`index.html`) with all product categories as anchor sections. No nested navigation, no multi-page category browsing. Mobile-first, thumb-friendly. Only separate pages for in-depth guides that warrant their own URL.

```
cyberoffroading.com/
├── index.html                    # THE site — hero + all categories as sections
├── css/
│   └── style.css                 # Single stylesheet, CSS custom properties
├── js/
│   └── main.js                   # Sticky nav highlighting, smooth scroll, mobile menu
├── images/
│   ├── hero/                     # bed-setup-overview.jpg
│   └── products/                 # Organized by category/product-name/
├── guides/
│   ├── roof-glass.html           # Standalone: 1st gen vs 2nd gen silver vs black glass
│   └── winch-wiring.html         # Standalone: DC wiring guide for winch build
├── CNAME                         # cyberoffroading.com
└── 404.html                      # Custom 404
```

## Content Architecture

### Single-Page Layout (index.html)
Top-to-bottom scroll order:
1. **Hero** — Full-width CT photo, site tagline, scroll-down indicator
2. **Sticky category nav** — Horizontal scrollable pill bar (mobile: swipeable, desktop: fixed). Highlights active section on scroll.
3. **Sections** (each with `id` anchor, this order):
   - `#offroad` — Tire deflators, inflators, tankless inflator
   - `#recovery` — Boards, shackles, straps, rope, tree saver + "NO TOW BALL" warning
   - `#flat-tire` — Patch kit, plug kit, jack + "get a spare" note
   - `#winter` — AutoSocks, chains, shovel
   - `#winch` — Full parts list + wiring basics + link to detailed wiring guide
   - `#starlink` — Mounts (interior/exterior) + glass compatibility summary + link to roof glass guide
   - `#comms` — Rocky Talkies
   - `#cyberbeast` — Backer rod
   - `#essentials` — Fire extinguisher, MOLLE mount/nuts, tonneau lube, fairing delete, mud wash, cleaning
4. **Footer** — Affiliate disclaimer, links to guides

### Review Tone
Concise, spec-focused. Minimal opinion, maximum info. Example:
> "5W GMRS radio. 5-mile range in open terrain. USB-C charging. Pairs well with CT's built-in outlet."

No fluff, no storytelling. Specs, compatibility, and one-line verdict.

### Card Layout
All products are equal-sized cards within each section. No featured/hero callouts — clean, uniform grid. Let the content speak for itself.

### Product Card Structure
Each product gets a consistent card with:
- Product name
- Short review / recommendation note (1-3 sentences, opinionated)
- Product photo (own photos where available, styled placeholder otherwise)
- Affiliate link button ("Check Price on Amazon" / "Check Price at Harbor Freight")
- Optional: warning/tip callout (e.g., "DO NOT use a tow ball")

### Guide Pages (Separate)
Only long-form informational content gets its own page:
- **Roof Glass Guide** (`guides/roof-glass.html`): 1st gen silver, 2nd gen silver, black glass comparison. Starlink Mini compatibility matrix.
- **Winch Wiring Guide** (`guides/winch-wiring.html`): Detailed DC wiring walkthrough, pin references (34, 33, 36).

These link back to the main page's relevant section.

## Affiliate Link Inventory

### Winter
| Product | Link |
|---------|------|
| AutoSocks ("Not Chains") | https://amzn.to/4b2lA1V |
| Snow Chains (Tesla official) | https://shop.tesla.com/product/cybertruck-18_20_-snow-chains |
| Ice-breaking Shovel | https://amzn.to/498eIO5 |

### Offroading
| Product | Link |
|---------|------|
| Tire Deflators | https://amzn.to/3LBzMEw |
| Multi Tire Inflator Kit | https://amzn.to/49b3yrU |
| Inflator Adapter | https://amzn.to/48TKxvd |
| Tire Inflator | https://amzn.to/3NhPdCs |
| Tankless Inflator Setup | https://amzn.to/4phHAcE |

> Review note: "Tankless. Inflates all 4 tires 35-50psi simultaneously in 3.5 min. Runs off 120v AC from the CT bed outlet."

### Flat Tire
| Product | Link |
|---------|------|
| Sidewall Patch Kit | https://amzn.to/48QXq9i |
| Plug Kit | https://amzn.to/3MK3FmP |
| 3-Ton Off-Road Jack | https://harborfreight.com/3-ton-off-road-jack-59136.html |

### Recovery
| Product | Link |
|---------|------|
| Recovery Boards (Option A) | https://amzn.to/44F72l8 |
| Recovery Boards (Option B) | https://amzn.to/3LeeRaK |
| Recovery Board MOLLE Mounts | https://amzn.to/44DomHa |
| Soft Shackles | https://amzn.to/498461v |
| Shackle Block | https://amzn.to/3YH7uvs |
| Tow Strap | https://amzn.to/4qoZg76 |
| Dynamic Rope | https://amzn.to/4q1gdFa |
| Tree Saver | https://amzn.to/49rQ5Ny |

### Comms
| Product | Link |
|---------|------|
| Rocky Talkies 5W | https://amzn.to/3KXD9FX |
| Rocky Talkies 2W | https://amzn.to/49qwn4K |

### Cleaning
| Product | Link |
|---------|------|
| Mud Wash | https://amzn.to/3N2KEMl |

### Starlink Mini Mounts
| Product | Link |
|---------|------|
| Interior Mount (Option A) | https://amzn.to/3Li88wr |
| Interior Mount (Option B) | https://amzn.to/4jasyUC |
| Exterior Mount | https://amzn.to/4m50XFN |

### Misc / MOLLE / Safety
| Product | Link |
|---------|------|
| Fairing Delete | https://amzn.to/44H80x7 |
| Tonneau Track Lube | https://amzn.to/4bK7FO6 |
| Fire Extinguisher | https://amzn.to/4m1jXoC |
| MOLLE Mount | https://amzn.to/45k4qcn |
| MOLLE Panel Nuts | https://builtrightind.com/products/molle-nuts-threaded-molle-pals-fastener |

### Winch Build
| Product | Link |
|---------|------|
| 12k Winch | https://harborfreight.com/12000-lb-winch-with-synthetic-rope-and-wireless-remote-56385.html |
| Hitch Mount | https://harborfreight.com/12000-lb-winch-hitch-mount-57607.html |
| Power Supplies (x4) | https://amzn.to/4pYPpVS |
| AC Side Cable — 4x | https://amzn.to/492Xnrb |
| AC Side Cable — 2x | https://amzn.to/3Leg6qq |
| AC Side Cable — 1x | https://amzn.to/4awixPx |
| Soldering Kit | https://amzn.to/4pMZepK |
| Signal Wire | https://amzn.to/45rh7SO |
| Resistors | https://amzn.to/3MWUOxZ |

### Cyberbeast Specific
| Product | Link |
|---------|------|
| Backer Rod (light bar wind noise fix) | https://amzn.to/3Lj2QRp |

## SEO Strategy

Built into every phase, not bolted on at the end:

- **Semantic HTML**: Proper `<article>`, `<section>`, `<nav>`, `<h1>`-`<h3>` hierarchy
- **Meta tags**: Unique `<title>` and `<meta description>` per page, keyword-rich but natural
- **Open Graph / Twitter Cards**: Hero image, site description — drives social sharing
- **JSON-LD structured data**: `Product` schema on each product card (name, url, image), `Article` schema on guides
- **Canonical URLs**: `<link rel="canonical">` on every page
- **Sitemap**: `sitemap.xml` for Google Search Console
- **Image SEO**: Descriptive `alt` tags on every image, WebP format, lazy loading
- **Performance**: Single page = fast load. Minimal JS. Cloudflare caching. Google rewards speed.
- **Internal linking**: Guide pages link back to main page sections; main page links to guides. Anchor sections get keyword-rich `id` values.
- **Mobile-first**: Google indexes mobile version — our single-scroll layout is inherently mobile-optimized

**Target keywords**: "cybertruck offroad accessories", "cybertruck recovery gear", "cybertruck winch build", "cybertruck starlink mini mount", "cybertruck roof glass starlink"

## Implementation Phases

### Phase 1 — Foundation
- [x] Create PLAN.md
- [ ] Set up project structure (directories, CNAME)
- [ ] Build `css/style.css` — full design system (colors, typography, cards, layout, responsive, mobile-first)
- [ ] Build `index.html` — hero, sticky category nav, all product sections with cards, footer
- [ ] Build `js/main.js` — sticky nav active-section highlighting, smooth scroll, mobile menu
- [ ] SEO: meta tags, Open Graph, JSON-LD product schema, semantic HTML throughout

### Phase 2 — Guide Pages
- [ ] `guides/roof-glass.html` — 1st gen silver vs 2nd gen silver vs black glass, Starlink Mini compatibility
- [ ] `guides/winch-wiring.html` — detailed wiring guide (pin 34, 33, 36 explanation)
- [ ] SEO: Article schema, canonical URLs, cross-linking to main page

### Phase 3 — Deploy & DNS
- [ ] Initialize git repo, push to GitHub
- [ ] Enable GitHub Pages (main branch)
- [ ] Configure Cloudflare DNS (CNAME → github.io)
- [ ] Set Cloudflare caching rules (Cache Everything, edge TTL)
- [ ] Verify SSL and CNAME resolution

### Phase 4 — Polish
- [ ] Optimize images (WebP conversion, compression)
- [ ] Add 404.html
- [ ] Generate sitemap.xml
- [ ] Submit to Google Search Console
- [ ] Cloudflare Web Analytics snippet

## Adding New Products (How-To)

Find the relevant `<section id="category">` in `index.html` and add this card:

```html
<article class="product-card">
  <div class="product-image">
    <img src="images/products/CATEGORY/PRODUCT/photo.webp" alt="PRODUCT NAME for Cybertruck" loading="lazy">
  </div>
  <div class="product-info">
    <h3>PRODUCT NAME</h3>
    <p class="product-review">YOUR SHORT REVIEW HERE</p>
    <a href="AFFILIATE_LINK" target="_blank" rel="noopener noreferrer" class="cta-button">
      Check Price on Amazon
    </a>
  </div>
</article>
```

To add a new **category section**, copy an existing `<section>` block, update the `id`, add it to the sticky nav, and drop in product cards.

## Photo Inventory (Current)

**Have: 41 photos across 30 products. Missing: 2.**

### Hero / Lifestyle
| Photo | Path |
|-------|------|
| Bed setup overview | `images/hero/bed-setup-overview.jpg` |
| Hero CT photo | `images/hero/IMG_2984.jpeg` |
| Flat tire lifestyle (2) | `images/products/flat-tire/IMG_8569.jpeg`, `IMG_8570.jpeg` |

### Product Photos (Have)
| Product | Path | Source |
|---------|------|--------|
| AutoSocks | `winter/autosocks/product.jpg` | Amazon |
| Ice-breaking Shovel | `winter/ice-shovel/product.jpg` | Amazon |
| Tire Deflators | `offroad/tire-deflators/product.jpg` + `tire-deflators.jpg` | Amazon + Own |
| Multi Tire Inflator Kit | `offroad/multi-tire-inflator-kit/product.jpg` | Amazon |
| Inflator Adapter | `offroad/inflator-adapter/product.jpg` | Amazon |
| Tire Inflator | `offroad/tire-inflator/product.jpg` | Amazon |
| Tankless Inflator | `offroad/tankless-inflator/product.jpg` + `tankless-compressor.jpg` | Amazon + Own |
| Sidewall Patch Kit | `flat-tire/sidewall-patch-kit/product.jpg` | Amazon |
| Plug Kit | `flat-tire/plug-kit/71Zh8bC1WtL._AC_SL1500_.jpg` | Amazon |
| Off-Road Jack | `flat-tire/off-road-jack/product.jpg` | Harbor Freight |
| Recovery Boards | `recovery/recovery-boards/bed-view-recovery-boards.jpg` | Own |
| Recovery Board MOLLE Mounts | `recovery/molle-mounts/61iOaQnZiYL._AC_SL1500_.jpg` | Amazon |
| Soft Shackles | `recovery/soft-shackles/81YxsCbBXGL._AC_SL1500_.jpg` | Amazon |
| Shackle Block | `recovery/shackle-block/61eH+qvQ6NL._AC_SL1500_.jpg` | Amazon |
| Tow Strap | `recovery/tow-strap/81CAEuwHnsL._AC_SL1500_.jpg` | Amazon |
| Dynamic Rope | `recovery/dynamic-rope/71GE2sVmIpL._AC_SL1500_.jpg` | Amazon |
| Tree Saver | `recovery/tree-saver/81xS7J0+QkL._AC_SL1500_.jpg` | Amazon |
| Rocky Talkies | `comms/rocky-talkies/71fLurHsxFL._AC_SL1500_.jpg` + `IMG_2974.jpeg` | Amazon + Own |
| Mud Wash | `cleaning/mud-wash/61DFNI7VfXL._AC_SL1000_.jpg` | Amazon |
| Starlink Interior Mount | `starlink/interior-mount/G89FeJsb0AE8yS0.jpg` | Own |
| Fairing Delete | `misc/fairing-delete/81uJWrvpDpL._AC_SL1500_.jpg` | Amazon |
| Tonneau Track Lube | `misc/tonneau-track-lube/G89FeJrbwAAu48G.jpg` | Own |
| MOLLE Mount | `misc/molle-mount/61sGaw71zWL._AC_SL1500_.jpg` | Amazon |
| MOLLE Panel Nuts | `misc/molle-panel-nuts/product.png` | BuiltRight |
| Backer Rod | `cyberbeast/backer-rod/G89ecfFaQAAaDf3.jpg` | Own |
| 12k Winch | `winch/12k-winch/product.jpg` | Harbor Freight |
| Hitch Mount | `winch/hitch-mount/product.jpg` | Harbor Freight |
| Winch (installed) | `winch/G89KqXbawAAAu7o.jpg` + `G89KqXbawAAAu7o2.jpg` | Own |
| Power Supplies | `winch/power-supplies/61culAi5vDL._AC_SL1500_.jpg` | Amazon |
| AC Side Cable 4x | `winch/ac-cable-4x/61LJkTLBkQL._AC_SL1500_.jpg` | Amazon |
| AC Side Cable 2x | `winch/ac-cable-2x/613T6dpQ7BL._AC_SL1500_.jpg` | Amazon |
| AC Side Cable 1x | `winch/ac-cable-1x/51CsSpn0eFL._AC_SL1500_.jpg` | Amazon |
| Soldering Kit | `winch/soldering-kit/71HjH1vv6GL._AC_SL1500_.jpg` | Amazon |
| Signal Wire | `winch/signal-wire/61qmozO24ZL._SL1500_.jpg` | Amazon |
| Resistors | `winch/resistors/71+ZLtlZftL._SL1500_.jpg` | Amazon |

### All product photos complete.

## Key Content Notes

- **Recovery section** must include prominent warning: "DO NOT use a tow ball for recovery"
- **Starlink section** must link to the roof glass guide page
- **Winch section** includes parts list + wiring basics (pin 34 signal wire, pins 33 & 36 resistor jump), links to full wiring guide. Note "How you wire up the DC side is up to you"
- **Tire deflators** link is listed twice in source — use same link, present as single product
- All affiliate links use `rel="noopener noreferrer"` and `target="_blank"`
- All images need descriptive `alt` tags with "Cybertruck" keyword where natural
