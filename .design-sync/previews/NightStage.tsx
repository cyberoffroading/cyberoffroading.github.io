import { NightStage, SectionHeader, CtaButton } from '@cyberoffroading/night-trail';

/** The text ramp on the void: high-contrast heading, body copy, cyan link. */
export const TextRamp = () => (
  <NightStage>
    <h2>Tires &amp; Pressure</h2>
    <p style={{ marginTop: 12, maxWidth: 560 }}>
      Tire management is everything off-road. Deflate for traction, re-inflate when you hit pavement.
      Spec-focused reviews of off-road accessories for the Cybertruck. No fluff. No affiliate spam walls.
    </p>
    <p style={{ marginTop: 12 }}>
      <a href="#recovery">Recovery Gear &rarr;</a>
    </p>
  </NightStage>
);

/** A small composition on the stage: trail-domain section header + internal CTA. */
export const NestedComposition = () => (
  <NightStage>
    <SectionHeader
      eyebrow="// When You're Stuck"
      iconName="recovery"
      tone="trail"
      title="Recovery Gear"
      intro="When you're stuck, you need gear you can trust. Don't cheap out here."
    />
    <CtaButton internal href="#recovery">
      Explore Gear &rarr;
    </CtaButton>
  </NightStage>
);
