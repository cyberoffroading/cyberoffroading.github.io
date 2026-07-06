---
category: Layout
---
Full-bleed night hero: bottom-anchored content over a grayscale photo relit by the diagonal cyan/red duotone, scanlines, vignette, and two breathing glow pools. Works with no photo (pure void + glows). One per page.

```jsx
<Hero
  tag="// Curated Gear for the Trail"
  title="Night Runs"
  sub="Spec-focused reviews of off-road accessories for the Cybertruck."
  imageSrc="/photos/salt-flats.jpg"
  actions={<>
    <CtaButton internal className="hero__cta" href="#offroad">Explore Gear &rarr;</CtaButton>
    <CtaButton internal variant="secondary" className="hero__cta" href="#winch">Winch Build &rarr;</CtaButton>
  </>}
/>
```
