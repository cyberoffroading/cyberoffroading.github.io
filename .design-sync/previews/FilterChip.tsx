import { FilterChip } from '@cyberoffroading/night-trail';

/** Selected chip: cyan fill with glow. */
export const ActiveChip = () => (
  <div style={{ display: 'inline-flex' }}>
    <FilterChip active>All</FilterChip>
  </div>
);

/** Resting chip: muted mono outline. */
export const DefaultChip = () => (
  <div style={{ display: 'inline-flex' }}>
    <FilterChip>Field Guide</FilterChip>
  </div>
);

/** The two states side by side as they read in a chip row. */
export const ChipPair = () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <FilterChip active>Recovery</FilterChip>
    <FilterChip>Winter</FilterChip>
  </div>
);
