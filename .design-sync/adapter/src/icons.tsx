import type { ReactNode } from 'react';

/** The 12 line icons used across the site (section eyebrows + category tiles).
 *  1.6-stroke, miter joins, currentColor — they inherit the neon color and
 *  drop-shadow glow from their context class (.section__icon / .category-tile__icon). */
export type IconName =
  | 'articles'
  | 'grid'
  | 'offroad'
  | 'recovery'
  | 'flat-tire'
  | 'winter'
  | 'winch'
  | 'starlink'
  | 'comms'
  | 'essentials'
  | 'events'
  | 'gallery';

const PATHS: Record<IconName, string[]> = {
  articles: ['M5,3 L15,3 L19,7 L19,21 L5,21 Z', 'M15,3 L15,7 L19,7', 'M8,11 H16 M8,14 H16 M8,17 H13'],
  grid: ['M4,4 H10 V10 H4 Z M14,4 H20 V10 H14 Z M4,14 H10 V20 H4 Z M14,14 H20 V20 H14 Z'],
  offroad: ['M2,19 L8,9 L12,14 L17,5 L22,19', 'M2,19 H22'],
  recovery: ['M7,20 V10 L12,5 L17,10 V20', 'M4,20 H20', 'M10,20 V14 H14 V20'],
  'flat-tire': ['M9,4 L15,4 L20,9 L20,14 L18,17 L6,17 L4,14 L4,9 Z', 'M12,9 L15,12 L12,15 L9,12 Z', 'M5,21 H19'],
  winter: ['M12,2 V22 M3.5,7 L20.5,17 M20.5,7 L3.5,17', 'M12,6 L9.5,4.5 M12,6 L14.5,4.5 M12,18 L9.5,19.5 M12,18 L14.5,19.5'],
  winch: ['M4,8 L16,8 L16,16 L4,16 Z', 'M7,8 V16 M13,8 V16', 'M16,11 H21 L21,14'],
  starlink: ['M3,12 L14,6 L17,11 L6,16 Z', 'M11,14 V19 M8,20 H15', 'M9,9 L12,4'],
  comms: ['M12,9 V21 M9,21 L12,18 L15,21', 'M12,5 L13.5,7 L12,9 L10.5,7 Z', 'M8,5 L5,8 M16,5 L19,8'],
  essentials: ['M4,9 L20,9 L20,19 L4,19 Z', 'M9,9 V6 L15,6 V9', 'M4,13 H20 M11,9 V13'],
  events: ['M4,5 L20,5 L20,20 L4,20 Z', 'M8,3 V7 M16,3 V7 M4,9 H20', 'M9,12 L13,12 L13,16 L9,16 Z'],
  gallery: ['M8,4 L20,4 L20,15', 'M4,8 L16,8 L16,20 L4,20 Z', 'M6,17 L9,13 L11,15 L13,12 L14,17'],
};

export interface IconProps {
  /** Which site icon to render */
  name: IconName;
  /** Context class that sizes and glows it, e.g. "section__icon" or "category-tile__icon" */
  className?: string;
}

/**
 * Site line-icon set. Angular 1.6-stroke SVGs drawn on a 24px grid.
 * Give it the context class of where it sits: `className="section__icon"`
 * inside a section eyebrow, `className="category-tile__icon"` inside a
 * category tile. Color and neon drop-shadow come from that class.
 */
export function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {PATHS[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Star glyph used by VoteButton (filled when voted via currentColor). */
export function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/** Cursor-click glyph used by ClickCounter. */
export function ClickIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      <path d="M13 13l6 6" />
    </svg>
  );
}

export type { ReactNode };
