import { SiteFooter } from '@cyberoffroading/night-trail';

/** The full production footer: terrain watermark, link row, FTC disclaimer, sign-off bar. */
export const FullFooter = () => (
  <SiteFooter
    links={[
      { label: 'EV Off-roading Discord', href: 'https://discord.gg/8QUfBsZeCC', external: true },
      { label: 'Back to Top', href: '#top' },
    ]}
    disclaimer="CyberOffroading.com is a participant in the Amazon Services LLC Associates Program and other affiliate programs. Links on this site may earn us a commission at no extra cost to you. We only recommend products we personally use or have thoroughly researched. Always verify product compatibility with your specific Cybertruck configuration before purchasing."
    metaline="// affiliate-supported · est. 2026 · © 2026 cyberoffroading.com"
  />
);

/** Quiet minimal state: links + sign-off only, watermark off. */
export const MinimalFooter = () => (
  <SiteFooter
    watermark={false}
    links={[
      { label: 'EV Off-roading Discord', href: 'https://discord.gg/8QUfBsZeCC', external: true },
      { label: 'Back to Top', href: '#top' },
    ]}
    metaline="// affiliate-supported · est. 2026 · © 2026 cyberoffroading.com"
  />
);
