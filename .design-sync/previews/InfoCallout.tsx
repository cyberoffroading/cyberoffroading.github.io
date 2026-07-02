import { InfoCallout } from '@cyberoffroading/night-trail';

/** Canonical tip — default "ⓘ Tip" label, the spare-tire advice from the tires section. */
export const SpareTireTip = () => (
  <div style={{ maxWidth: 640 }}>
    <InfoCallout>
      Strongly consider carrying a full-size spare. No patch kit replaces the confidence of a spare
      tire on remote trails.
    </InfoCallout>
  </div>
);

/** Custom label with an inline link — the winch-build "How This Works" explainer. */
export const HowThisWorks = () => (
  <div style={{ maxWidth: 640 }}>
    <InfoCallout label="ⓘ How This Works">
      The CT's 240v 50A plug splits to four HP Common Slot power supplies that convert AC to 12v DC
      for the winch motor. Wire all pin 34s together with signal wire. Jump pins 33 &amp; 36 with a
      low-ohm resistor. DC side is up to you. <a href="#winch">Full wiring guide &rarr;</a>
    </InfoCallout>
  </div>
);
