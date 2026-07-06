import { ProductGrid, ProductCard, CtaButton } from '@cyberoffroading/night-trail';

const productShot = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#f2f3f4"/><rect x="250" y="150" width="300" height="300" fill="#b9bdc2"/><rect x="280" y="180" width="240" height="240" fill="#8f959b"/><text x="400" y="530" fill="#6a7076" font-family="monospace" font-size="26" text-anchor="middle">${label}</text></svg>`,
  )}`;

/** Responsive gear grid (1 → 2 → 3 columns) with compact recovery cards. */
export const GearGrid = () => (
  <ProductGrid>
    <ProductCard title="Soft Shackles" review="HMPE fiber, rated for recovery loads. Safer than metal D-rings — no shrapnel if they fail under load.">
      <CtaButton href="https://amzn.to/498461v">Check Price on Amazon</CtaButton>
    </ProductCard>
    <ProductCard title="Shackle Block" review="Replaces the tow ball in your hitch receiver. Proper recovery point — use this, not a ball.">
      <CtaButton href="https://amzn.to/3YH7uvs">Check Price on Amazon</CtaButton>
    </ProductCard>
    <ProductCard title="Tree Saver" review="Wide nylon strap to wrap around trees without cutting into bark. Essential for winch anchoring.">
      <CtaButton href="https://amzn.to/49rQ5Ny">Check Price on Amazon</CtaButton>
    </ProductCard>
  </ProductGrid>
);

/** `cardList`: horizontal listing rows — image left, details right. */
export const ListingRows = () => (
  <ProductGrid cardList>
    <ProductCard
      title="Tire Deflators"
      qty="Set of 4"
      price="~$30"
      review="Brass construction, adjustable target PSI. Set them and walk away — all 4 tires deflate simultaneously to your preset."
      imageSrc={productShot('deflators')}
      imageAlt="Tire deflators"
    >
      <CtaButton href="https://amzn.to/4e2mxsB">Check Price on Amazon</CtaButton>
    </ProductCard>
    <ProductCard
      title="Plug Kit"
      review="ARB Speedy Seal. Handles tread punctures without removing the tire. Quick, reliable, reusable tools."
      imageSrc={productShot('plug kit')}
      imageAlt="ARB Speedy Seal plug kit"
    >
      <CtaButton href="https://amzn.to/3MK3FmP">Check Price on Amazon</CtaButton>
    </ProductCard>
  </ProductGrid>
);
