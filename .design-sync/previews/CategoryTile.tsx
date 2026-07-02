import { CategoryTile } from '@cyberoffroading/night-trail';

/** Canonical cyan tile: line icon + mono label on a corner-cut panel. */
export const OffroadTile = () => (
  <div style={{ maxWidth: 180 }}>
    <CategoryTile iconName="offroad" label="Offroad" href="#offroad" />
  </div>
);

/** Red-domain tile for the recovery section. */
export const RecoveryTile = () => (
  <div style={{ maxWidth: 180 }}>
    <CategoryTile iconName="recovery" label="Recovery" href="#recovery" tone="red" />
  </div>
);

/** Cyan tile with a two-word label. */
export const WinchTile = () => (
  <div style={{ maxWidth: 180 }}>
    <CategoryTile iconName="winch" label="Winch Build" href="#winch" />
  </div>
);

/** Red winter-hazard tile. */
export const WinterTile = () => (
  <div style={{ maxWidth: 180 }}>
    <CategoryTile iconName="winter" label="Winter" href="#winter" tone="red" />
  </div>
);
