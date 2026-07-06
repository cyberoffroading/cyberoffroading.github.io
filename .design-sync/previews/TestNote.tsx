import { TestNote } from '@cyberoffroading/night-trail';

/** Canonical methodology band — default "// How We Test" label. */
export const HowWeTest = () => (
  <div style={{ maxWidth: 640 }}>
    <TestNote>
      Every product is run on a Cyberbeast for at least a month of trail duty before it earns a
      slot.
    </TestNote>
  </div>
);

/** Custom label — the cabin-air-filter comparison's real-world test conditions. */
export const TestConditions = () => (
  <div style={{ maxWidth: 640 }}>
    <TestNote label="// Test Conditions">
      This comparison is based on real-world driving in the Pacific Northwest. The Lectron went
      through a West Coast road trip before failing at 6 months. The Basenor and EVAnnex were used
      for around-town driving only.
    </TestNote>
  </div>
);
