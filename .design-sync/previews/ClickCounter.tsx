import { ClickCounter, VoteButton } from '@cyberoffroading/night-trail';

/** Click-through badge with a resolved count. */
export const WithCount = () => <ClickCounter count={3410} />;

/** Placeholder dash shown before the worker returns counts. */
export const Placeholder = () => <ClickCounter />;

/** The real pairing: VoteButton + ClickCounter in a ProductCard stats row. */
export const PairedStatsRow = () => (
  <div className="product-card__stats">
    <VoteButton count={128} />
    <ClickCounter count={3410} />
  </div>
);
