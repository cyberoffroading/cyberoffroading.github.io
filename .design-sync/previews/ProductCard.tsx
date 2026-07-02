import { ProductCard, CtaButton } from '@cyberoffroading/night-trail';

const productShot = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#f2f3f4"/><rect x="250" y="150" width="300" height="300" fill="#b9bdc2"/><rect x="280" y="180" width="240" height="240" fill="#8f959b"/><text x="400" y="530" fill="#6a7076" font-family="monospace" font-size="26" text-anchor="middle">${label}</text></svg>`,
  )}`;

/** The full gear card: photo on the brushed-steel stage, price, spec-first review, spec rows, one glowing CTA, community stats. */
export const FullSpecCard = () => (
  <div style={{ maxWidth: 380 }}>
    <ProductCard
      title="Tankless Inflator Setup"
      price="~$130"
      review="Tankless. Inflates all 4 tires 35–50psi simultaneously in 3.5 min. Runs off 120v AC from the CT bed outlet."
      imageSrc={productShot('inflator')}
      imageAlt="Tankless inflator"
      specs={[
        { label: 'Tires', value: 'All 4 at once' },
        { label: 'Pressure', value: '35–50 psi' },
        { label: 'Time', value: '3.5 min' },
        { label: 'Power', value: '120V AC' },
      ]}
      stats={{ votes: 128, clicks: 3410 }}
    >
      <CtaButton href="https://amzn.to/4phHAcE">Check Price on Amazon</CtaButton>
    </ProductCard>
  </div>
);

/** Two CTAs: primary pick + secondary budget option (red outline). */
export const TwoCtaCard = () => (
  <div style={{ maxWidth: 380 }}>
    <ProductCard
      title="Recovery Boards"
      price="~$300 / ~$160"
      review="MAXTRAX. Nylon-reinforced, built to handle the CT's weight. Xtreme is the premium pick; MKII is solid on a budget."
      imageSrc={productShot('recovery boards')}
      imageAlt="Recovery boards"
    >
      <CtaButton href="https://amzn.to/44F72l8">Xtreme — Top Pick</CtaButton>
      <CtaButton variant="secondary" href="https://amzn.to/3LeeRaK">
        MKII — Budget Option
      </CtaButton>
    </ProductCard>
  </div>
);

/** Minimal card: title, review, one CTA — no photo, no specs. */
export const MinimalCard = () => (
  <div style={{ maxWidth: 380 }}>
    <ProductCard title="Soft Shackles" review="HMPE fiber, rated for recovery loads. Safer than metal D-rings — no shrapnel if they fail under load.">
      <CtaButton href="https://amzn.to/498461v">Check Price on Amazon</CtaButton>
    </ProductCard>
  </div>
);

/** Voted state: cyan star button + click counter with the qty line. */
export const VotedWithQty = () => (
  <div style={{ maxWidth: 380 }}>
    <ProductCard
      title="Tire Deflators"
      qty="Set of 4"
      price="~$30"
      review="Brass construction, adjustable target PSI. Set them and walk away — all 4 tires deflate simultaneously."
      imageSrc={productShot('deflators')}
      imageAlt="Tire deflators"
      stats={{ votes: 214, clicks: 5120, voted: true }}
    >
      <CtaButton href="https://amzn.to/4e2mxsB">Deflators</CtaButton>
    </ProductCard>
  </div>
);
