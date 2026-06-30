# CyberOffroading — Neon brand assets

Everything for the neon "Night Trail" identity: the **CO monogram** favicons, the **mark**, the **wordmark**, and a **live Logo Kit** with drop-in CSS for the glow + independent flicker.

```
neon/
├─ logo-kit.html        ← open this first. Live logo + copy-paste CSS/HTML
├─ favicons/            ← CO monogram (Audiowide "C" cyan + Yellowtail "O" red)
│  ├─ favicon.ico        (16/32/48)
│  ├─ favicon.svg
│  ├─ favicon-16x16.png · favicon-32x32.png
│  ├─ apple-touch-icon.png        (180)
│  ├─ icon-192.png · icon-512.png (PWA)
│  ├─ maskable-icon-512.png       (safe-zone padded)
│  ├─ site.webmanifest
│  └─ head-snippet.html           (the <link> tags below)
├─ mark/
│  ├─ mark.svg          ← flat two-tone wedge (cyan body + red ridge), scalable
│  └─ hero-mark.png     ← lit two-tone mark, transparent, 2000px
└─ wordmark/
   ├─ wordmark-stacked.png   (top/bottom, lit, transparent)
   └─ wordmark-inline.png    (left/right, lit, transparent)
```

## Favicons
Drop `favicons/` at your web root and add to `<head>` (also in `favicons/head-snippet.html`):

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#08090a">
```

## Logo & wordmark — preferred (live, scalable)
Open **`logo-kit.html`** — it shows the logo flat and lit, and contains the full copy-paste CSS + HTML. In short: the wordmark is live text (Audiowide + Yellowtail), the mark is inline SVG; wrap either in `.neon` for the glow and add `.flick-c` / `.flick-o` for the independent cyan/red flicker. This is the best form for the site (crisp at any size, recolours for mono/print, glow & flicker stay live).

## Raster fallbacks
`hero-mark.png` and the two `wordmark-*.png` are transparent PNGs for places that can't run the CSS (email, social, OG images). They're tuned for **dark backgrounds**.

## Tokens
Cyan `#00d4ff` (core `#eafdff`/`#f2feff`) · Warn-red `#ff2a2a` (core `#ffecec`/`#fff2f2`) · Void `#08090a`. Fonts: **Audiowide** (CYBER / C), **Yellowtail** (Offroading / O), **IBM Plex Mono** (UI/labels).
