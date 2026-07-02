import { GalleryGrid, GalleryItem } from '@cyberoffroading/night-trail';

const ph = (label: string, w: number, h: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#15161a"/><text x="50%" y="50%" fill="#3f444b" font-family="monospace" font-size="64" text-anchor="middle">${label}</text></svg>`,
  )}`;

/** The trail-photo masonry: five photos, portrait + landscape mix. */
export const TrailGallery = () => (
  <GalleryGrid>
    <GalleryItem
      src={ph('forest trail run', 1200, 900)}
      alt="Cybertruck off-road trail run through forest"
      width={1200}
      height={900}
    />
    <GalleryItem
      src={ph('mountain terrain', 1200, 1600)}
      alt="Cybertruck on rugged mountain terrain"
      width={1200}
      height={1600}
    />
    <GalleryItem
      src={ph('trail adventure', 1200, 900)}
      alt="Cybertruck trail adventure through trees"
      width={1200}
      height={900}
    />
    <GalleryItem
      src={ph('outdoor adventure', 1200, 675)}
      alt="Cybertruck outdoor adventure"
      width={1200}
      height={675}
    />
    <GalleryItem
      src={ph('scenery overlook', 1200, 1600)}
      alt="Cybertruck trail scenery overlook"
      width={1200}
      height={1600}
    />
  </GalleryGrid>
);

/** Landscape-only row — one shot per masonry column. */
export const WideShots = () => (
  <GalleryGrid>
    <GalleryItem src={ph('action shot', 1200, 900)} alt="Cybertruck off-road action shot" width={1200} height={900} />
    <GalleryItem src={ph('dirt trail run', 1200, 900)} alt="Cybertruck dirt trail run" width={1200} height={900} />
    <GalleryItem src={ph('in the wild', 1200, 900)} alt="Cybertruck in the wild off-road" width={1200} height={900} />
  </GalleryGrid>
);
