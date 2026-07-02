import { NavPill } from '@cyberoffroading/night-trail';

/** Default cyan pill — quiet mono uppercase, sheared clip. */
export const CyanDefault = () => (
  <div style={{ display: 'inline-flex' }}>
    <NavPill href="#articles">Articles</NavPill>
  </div>
);

/** Current-section pill: solid cyan fill with neon box-shadow. */
export const CyanActive = () => (
  <div style={{ display: 'inline-flex' }}>
    <NavPill href="#offroad" active>
      Offroad
    </NavPill>
  </div>
);

/** Red-domain pill (trail / recovery / hazard sections), resting state. */
export const RedTone = () => (
  <div style={{ display: 'inline-flex' }}>
    <NavPill href="#recovery" tone="red">
      Recovery
    </NavPill>
  </div>
);

/** Red-domain pill as the current section: solid red fill + red glow. */
export const RedActive = () => (
  <div style={{ display: 'inline-flex' }}>
    <NavPill href="#winter" tone="red" active>
      Winter
    </NavPill>
  </div>
);

/** A short run of pills as they sit together in the header row. */
export const PillRow = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <NavPill href="#articles">Articles</NavPill>
    <NavPill href="#offroad" active>
      Offroad
    </NavPill>
    <NavPill href="#recovery" tone="red">
      Recovery
    </NavPill>
    <NavPill href="#winch">Winch Build</NavPill>
  </div>
);
