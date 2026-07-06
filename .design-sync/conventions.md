# Night Trail — build conventions

**The system is dark-first.** `styles.css` styles the page body itself: void-black background (`--void: #08090a`), IBM Plex Mono everywhere, light text. A full-page design gets this for free. Any composition NOT sitting on the page body (an embed, a white artboard, a framed region) must be wrapped in `<NightStage>` or the neon reads wrong on white.

**Styling idiom: the site's CSS classes + `var(--*)` tokens — never invent either.** Components emit the real site classes and style themselves. For your own layout glue, use inline styles or minimal CSS built from the tokens defined in `:root` of `_ds_bundle.css`:

- Surfaces: `--void` (page) · `--panel` (cards) · `--panel-2` (alt bands, footer) · `--tile`
- Borders: `--border` · `--border-steel` · `--border-cyan`
- Cyan (action/spec/link domain): `--cyan` #00d4ff · `--cyan-core` · `--cyan-soft` · `--cyan-hot` · `--cyan-glow`
- Red (trail/recovery/hazard domain — co-primary, not "danger only"): `--red` #ff2a2a · `--red-text` (legible on dark) · `--red-core` · `--red-hot`
- Text ramp: `--text-hi` (headings) → `--text` → `--text-body` → `--text-2` → `--text-mute` → `--text-dim` (decorative only)
- Fonts: `--font-mono` (ALL UI/headings/body) · `--font-cyber` (Audiowide — wordmark "CYBER" only) · `--font-script` (Yellowtail — wordmark "Offroading" only)

**Hard aesthetic rules:** zero `border-radius` anywhere — angular `clip-path` corner cuts are the system's shape language (the components carry them; don't round your glue either). **Glow is earned**: neon `box-shadow`/`text-shadow` belongs to brand and interactive elements only — one glowing primary `CtaButton` per card. **Only the brand flickers** (`NeonWordmark`); UI never animates opacity. Eyebrow labels are slash-prefixed uppercase mono: `// Like This`.

**Domain tones:** most components take `tone` (`'cyan'` default, `'trail'`/`'red'`): cyan = gear/specs/articles; red = recovery, flat-tire, winter, hazard, events. Match a section's tone across its `SectionHeader`, `NavPill`, and `CategoryTile`.

**Where the truth lives:** read `styles.css` → `_ds_bundle.css` (the complete site stylesheet — tokens in `:root`, every class) before styling anything custom; per-component API + examples in `components/<group>/<Name>/<Name>.prompt.md`.

**Idiomatic page section:**

```jsx
import { Section, SectionHeader, MoreLink, ProductGrid, ProductCard, CtaButton } from '@cyberoffroading/night-trail';

<Section id="recovery" alt>
  <SectionHeader tone="trail" eyebrow="// When You're Stuck" iconName="recovery"
    title="Recovery Gear" intro="When you're stuck, you need gear you can trust.">
    <MoreLink href="#all">View all recovery gear &rarr;</MoreLink>
  </SectionHeader>
  <ProductGrid>
    <ProductCard title="Recovery Boards" price="~$300" review="MAXTRAX. Nylon-reinforced, built to handle the CT's weight."
      specs={[{ label: 'Material', value: 'Nylon-reinforced' }, { label: 'Rating', value: '10,000 lb' }]}
      stats={{ votes: 128, clicks: 3410 }}>
      <CtaButton href="https://example.com">Check Price</CtaButton>
      <CtaButton variant="secondary" href="https://example.com">Budget Option</CtaButton>
    </ProductCard>
  </ProductGrid>
</Section>
```

Page chrome order on the site: `Hero` → `TopBar` → `OwnerBar` → `CategoryNav` (sticky) → sections (alternate `alt`) → `EventsCta` (at most one) → `SiteFooter`.
