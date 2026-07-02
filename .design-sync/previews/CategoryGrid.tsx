import { CategoryGrid, CategoryTile } from '@cyberoffroading/night-trail';

/** The homepage wayfinding grid — all 11 sections in site order, red for hazard domains. */
export const FullWayfinding = () => (
  <CategoryGrid>
    <CategoryTile iconName="articles" label="Articles" href="#articles" />
    <CategoryTile iconName="offroad" label="Offroad" href="#offroad" />
    <CategoryTile iconName="recovery" label="Recovery" href="#recovery" tone="red" />
    <CategoryTile iconName="flat-tire" label="Flat Tire" href="#flat-tire" tone="red" />
    <CategoryTile iconName="winter" label="Winter" href="#winter" tone="red" />
    <CategoryTile iconName="winch" label="Winch Build" href="#winch" />
    <CategoryTile iconName="starlink" label="Starlink" href="#starlink" />
    <CategoryTile iconName="comms" label="Comms" href="#comms" />
    <CategoryTile iconName="essentials" label="Essentials" href="#essentials" />
    <CategoryTile iconName="events" label="Events" href="#events" tone="red" />
    <CategoryTile iconName="gallery" label="Gallery" href="#gallery" />
  </CategoryGrid>
);

/** A short four-tile quick-links row (gear + hazard mix). */
export const QuickLinks = () => (
  <div style={{ maxWidth: 700 }}>
    <CategoryGrid ariaLabel="Quick links">
      <CategoryTile iconName="offroad" label="Offroad" href="#offroad" />
      <CategoryTile iconName="recovery" label="Recovery" href="#recovery" tone="red" />
      <CategoryTile iconName="winch" label="Winch Build" href="#winch" />
      <CategoryTile iconName="winter" label="Winter" href="#winter" tone="red" />
    </CategoryGrid>
  </div>
);
