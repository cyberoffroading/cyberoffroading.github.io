import { AffiliateCard } from '@cyberoffroading/night-trail';

const trailThumb = (
  <svg viewBox="0 0 64 34" fill="none" aria-hidden="true">
    <path
      d="M2 30 L28 4 L62 24 Z"
      stroke="#00d4ff"
      strokeWidth="3"
      strokeLinejoin="miter"
      style={{ filter: 'drop-shadow(0 0 3px rgba(0,212,255,.6))' }}
    />
    <path d="M9 27 L19 14 L28 22 L38 9 L52 20" stroke="#ff2a2a" strokeWidth="2.5" strokeLinejoin="miter" strokeLinecap="square" />
  </svg>
);

/** Full inline affiliate card: thumb stage, name + blurb, red neon CTA, FTC disclosure. */
export const FullWithDisclosure = () => (
  <div style={{ maxWidth: 720 }}>
    <AffiliateCard
      thumb={trailThumb}
      name="ARB Speedy Seal Plug Kit"
      blurb="Handles tread punctures without removing the tire. Quick, reliable, reusable tools."
      ctaLabel="Check Price"
      href="https://amzn.to/3MK3FmP"
      disclosure="Affiliate link — supports the site at no cost to you."
    />
  </div>
);

/** Minimal: no thumb, no disclosure — name, blurb, and the red CTA. */
export const Minimal = () => (
  <div style={{ maxWidth: 720 }}>
    <AffiliateCard
      name="Tailgate Gap Seal"
      blurb="Foam seal strip that closes the biggest dust entry point — the gap between the tailgate and the bed floor."
      href="https://amzn.to/43H3HkE"
    />
  </div>
);
