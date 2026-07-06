import { ArticleCard } from '@cyberoffroading/night-trail';

const cover = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#15161a"/><text x="50%" y="50%" fill="#3f444b" font-family="monospace" font-size="26" text-anchor="middle">${label}</text></svg>`,
  )}`;

/** Canonical editorial card: dark cover, cyan tag, title, teaser, quiet cyan text link. */
export const DiyBuildCard = () => (
  <div style={{ maxWidth: 380 }}>
    <ArticleCard
      tag="// DIY BUILD"
      title="Winch Wiring Guide — 240v AC"
      excerpt="Power a 12,000 lb winch from the Cybertruck's 240v 50A plug using four HP Common Slot power supplies wired in parallel."
      imageSrc={cover('winch build')}
      imageAlt="Cybertruck winch wiring guide"
      href="/guides/winch-wiring"
    />
  </div>
);

/** No tag — cover, title, and teaser carry the card. */
export const NoTagCard = () => (
  <div style={{ maxWidth: 380 }}>
    <ArticleCard
      title="Sealing the Cybertruck Vault"
      excerpt="3-level approach to dust-proofing the bed: tailgate seal, smuggler's bay door seal, and bed mat technique."
      imageSrc={cover('vault seal')}
      imageAlt="Cybertruck vault sealing guide"
      href="/guides/vault-seal"
    />
  </div>
);

/** Custom CTA label on a tested-gear write-up. */
export const FieldTestCard = () => (
  <div style={{ maxWidth: 380 }}>
    <ArticleCard
      tag="// TESTED"
      title="Cabin Air Filters — OEM vs Aftermarket"
      excerpt="I tested three aftermarket HEPA filters against the Tesla OEM. None of them held up. Here's why the activated carbon layer matters."
      imageSrc={cover('filter test')}
      imageAlt="Cybertruck cabin air filter comparison"
      href="/guides/cabin-air-filter"
      ctaLabel="Read the Test Results"
    />
  </div>
);
