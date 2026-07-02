import { RelatedGuides } from '@cyberoffroading/night-trail';

/** Article-footer band: red "// Related Guides" label + three compact guide links. */
export const ArticleFooter = () => (
  <div style={{ maxWidth: 720 }}>
    <RelatedGuides
      items={[
        { tag: '// BUILD', title: 'Sealing the Cybertruck Vault', href: '/guides/vault-seal' },
        { tag: '// BUILD', title: 'Winch Wiring Guide — 240v AC', href: '/guides/winch-wiring' },
        { tag: '// RECOVERY', title: 'Lifting on the Trail Without a Jack', href: '/guides/trail-lift' },
      ]}
    />
  </div>
);

/** Custom band label, tag-less cards — titles carry the links. */
export const KeepReading = () => (
  <div style={{ maxWidth: 720 }}>
    <RelatedGuides
      label="// Keep Reading"
      items={[
        { title: 'Cabin Air Filters — OEM vs Aftermarket', href: '/guides/cabin-air-filter' },
        { title: 'Roof Glass & Starlink Mini', href: '/guides/roof-glass' },
      ]}
    />
  </div>
);
