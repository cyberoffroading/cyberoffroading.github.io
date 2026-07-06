import { HudFrame } from '@cyberoffroading/night-trail';

const trailPhoto = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#15161a"/><text x="50%" y="50%" fill="#3f444b" font-family="monospace" font-size="26" text-anchor="middle">trail photo</text></svg>`,
)}`;

/** Recon-footage framing: cyan L-brackets + the "// REC" corner label. */
export const RecLabel = () => (
  <HudFrame label="// REC">
    <img src={trailPhoto} alt="Cybertruck on the trail at night" width={600} height={400} />
  </HudFrame>
);

/** Brackets only — no corner label. */
export const Unlabeled = () => (
  <HudFrame>
    <img src={trailPhoto} alt="Cybertruck crawling a rock ledge" width={600} height={400} />
  </HudFrame>
);
