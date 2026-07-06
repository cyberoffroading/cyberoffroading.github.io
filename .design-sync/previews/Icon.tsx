import { Icon } from '@cyberoffroading/night-trail';
import type { IconName } from '@cyberoffroading/night-trail';

const NAMES: IconName[] = [
  'articles',
  'grid',
  'offroad',
  'recovery',
  'flat-tire',
  'winter',
  'winch',
  'starlink',
  'comms',
  'essentials',
  'events',
  'gallery',
];

const tile = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
  padding: '16px 8px 12px',
  border: '1px solid var(--border-steel, #2a2a30)',
  background: 'var(--panel, #0e0f12)',
  color: 'var(--cyan, #00d4ff)',
} as const;

const caption = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: 10,
  letterSpacing: '0.06em',
  color: 'var(--text-mute, #7a7c80)',
} as const;

/** All 12 site line icons at section-eyebrow size, cyan with the earned neon glow. */
export const AllTwelve = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(96px, 1fr))', gap: 12, maxWidth: 560 }}>
    {NAMES.map((name) => (
      <div key={name} style={tile}>
        <Icon name={name} className="section__icon" />
        <span style={caption}>{name}</span>
      </div>
    ))}
  </div>
);

/** Real placement: an icon inside a glowing section eyebrow. */
export const EyebrowPlacement = () => (
  <div className="section__eyebrow">
    <Icon name="offroad" className="section__icon" />
    <span>// Trail-Ready Upgrades</span>
  </div>
);
