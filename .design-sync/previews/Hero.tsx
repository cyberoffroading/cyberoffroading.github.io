import { CtaButton, Hero } from '@cyberoffroading/night-trail';

const nightShot = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#1a1c1f"/><text x="50%" y="50%" fill="#3f444b" font-family="monospace" font-size="26" text-anchor="middle">salt flats at night</text></svg>`,
)}`;

/** Canonical page hero: night photo relit by the cyan/red duotone, tag rule, title, sub, and the paired internal CTAs. */
export const PhotoHero = () => (
  <Hero
    tag="// Curated Gear for the Trail"
    title="Night Runs"
    sub="Spec-focused reviews of off-road accessories for the Cybertruck. No fluff. No affiliate spam walls. Just the gear that works."
    imageSrc={nightShot}
    imageAlt="Cybertruck on the salt flats at night"
    actions={
      <>
        <CtaButton internal className="hero__cta" href="#offroad">
          Explore Gear &rarr;
        </CtaButton>
        <CtaButton internal variant="secondary" className="hero__cta" href="#winch">
          Winch Build &rarr;
        </CtaButton>
      </>
    }
  />
);

/** Photo-less hero: the pure void + breathing glow-pool stage, tag + title + sub only. */
export const VoidGlowHero = () => (
  <Hero
    tag="// Curated Gear for the Trail"
    title="CyberOffroading"
    sub="Trail-tested accessories for the Cybertruck, reviewed spec-first from a Cyberbeast that actually runs the trails."
  />
);
