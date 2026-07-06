import { Section, SectionHeader } from '@cyberoffroading/night-trail';

/** Default band: transparent over the void, with a compact cyan section header. */
export const DefaultBand = () => (
  <Section id="offroad">
    <SectionHeader eyebrow="// Air Down · Air Up" iconName="offroad" title="Offroad Essentials" />
  </Section>
);

/** Alt band: elevated panel-2 background — the down-page contrast rhythm — with a trail-red header. */
export const AltBand = () => (
  <Section id="recovery" alt>
    <SectionHeader tone="trail" eyebrow="// When You're Stuck" iconName="recovery" title="Recovery Gear" />
  </Section>
);
