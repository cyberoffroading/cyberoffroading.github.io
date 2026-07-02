import { GalleryItem } from '@cyberoffroading/night-trail';

const ph = (label: string, w: number, h: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#15161a"/><text x="50%" y="50%" fill="#3f444b" font-family="monospace" font-size="64" text-anchor="middle">${label}</text></svg>`,
  )}`;

/** Canonical landscape trail photo cell. */
export const LandscapePhoto = () => (
  <div style={{ maxWidth: 380 }}>
    <GalleryItem
      src={ph('forest trail run', 1200, 900)}
      alt="Cybertruck off-road trail run through forest"
      width={1200}
      height={900}
    />
  </div>
);

/** Portrait aspect — taller cell in the masonry column. */
export const PortraitPhoto = () => (
  <div style={{ maxWidth: 320 }}>
    <GalleryItem
      src={ph('mountain terrain', 1200, 1600)}
      alt="Cybertruck on rugged mountain terrain"
      width={1200}
      height={1600}
    />
  </div>
);
