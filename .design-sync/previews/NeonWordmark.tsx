import { NeonWordmark } from '@cyberoffroading/night-trail';

/** The neon sign at nav scale: cyan Audiowide "Cyber" + red Yellowtail "Offroading", both tubes flickering independently. */
export const NeonSign = () => (
  <div style={{ padding: '28px 12px' }}>
    <NeonWordmark />
  </div>
);

/** Footer variant: small, desaturated — reads as a dim sign-off mark. */
export const FooterSign = () => (
  <div style={{ padding: '20px 12px' }}>
    <NeonWordmark variant="footer" />
  </div>
);

/** Static (flicker disabled) — for reduced-motion or print contexts. */
export const StaticSign = () => (
  <div style={{ padding: '28px 12px' }}>
    <NeonWordmark flicker={false} />
  </div>
);

/** As the home link it usually is. */
export const HomeLink = () => (
  <div style={{ padding: '28px 12px' }}>
    <NeonWordmark href="#top" />
  </div>
);
