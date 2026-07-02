import { MoreLink, SectionHeader } from '@cyberoffroading/night-trail';

/** Cyan domain header: glowing eyebrow + line icon, neon-underlined h2, intro, and a roundup MoreLink. */
export const CyanWithMoreLink = () => (
  <SectionHeader
    eyebrow="// Air Down · Air Up"
    iconName="offroad"
    title="Offroad Essentials"
    intro="Tire management is everything off-road. Deflate for traction, re-inflate when you hit pavement."
  >
    <MoreLink href="#tire-inflators">Roundup: best tire inflators &rarr;</MoreLink>
  </SectionHeader>
);

/** Trail-red domain: eyebrow, icon glow, and the h2 underline bar all switch to warn-red. */
export const TrailRed = () => (
  <SectionHeader
    tone="trail"
    eyebrow="// When You're Stuck"
    iconName="recovery"
    title="Recovery Gear"
    intro="When you're stuck, you need gear you can trust. Don't cheap out here."
  />
);
