import { MoreLink } from '@cyberoffroading/night-trail';

/** Canonical section-header link out to the articles index. */
export const ViewAllArticles = () => <MoreLink href="articles/">View all articles &rarr;</MoreLink>;

/** Pointing at a roundup page from a product section. */
export const RoundupLink = () => (
  <MoreLink href="roundups/tire-inflators.html">Roundup: best tire inflators &rarr;</MoreLink>
);
