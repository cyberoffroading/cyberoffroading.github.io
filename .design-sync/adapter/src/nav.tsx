import type { ReactNode } from 'react';
import { Icon, IconName } from './icons';
import { NeonWordmark } from './brand';

export interface NavPillProps {
  /** Pill label */
  children: ReactNode;
  /** Anchor target, e.g. "#recovery" */
  href?: string;
  /** Current section — cyan (or red) fill with glow */
  active?: boolean;
  /** Red-domain pill (trail / recovery / hazard / events sections) */
  tone?: 'cyan' | 'red';
  className?: string;
}

/**
 * Angular nav pill (7deg-sheared clip-path, uppercase mono). Cyan is the
 * default domain; red marks trail/recovery/hazard/events sections. The
 * active pill fills solid with a neon box-shadow.
 */
export function NavPill({ children, href = '#', active = false, tone = 'cyan', className }: NavPillProps) {
  const cls = ['nav-pill', tone === 'red' ? 'nav-pill--red' : '', active ? 'active' : '', className || '']
    .filter(Boolean)
    .join(' ');
  return (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}

export interface CategoryNavProps {
  /** NavPill elements */
  children: ReactNode;
  /** Brand slot on the left (defaults to the live NeonWordmark; the production site swaps in its baked lockup) */
  brand?: ReactNode;
  /** Hide the brand entirely (the site conceals it until the hero wordmark scrolls away) */
  showBrand?: boolean;
}

/**
 * Sticky site header: translucent blurred void bar with the neon wordmark on
 * the left and a horizontally-scrolling row of NavPills. Compose NavPill
 * children in section order; mark the current one active.
 */
export function CategoryNav({ children, brand, showBrand = true }: CategoryNavProps) {
  return (
    <nav className="category-nav" aria-label="Site">
      <div className="category-nav__bar">
        {showBrand && (
          <span className="category-nav__brand revealed">
            {brand ?? <NeonWordmark href="#top" />}
          </span>
        )}
        <div className="category-nav__inner">{children}</div>
      </div>
    </nav>
  );
}

export interface FilterChipProps {
  children: ReactNode;
  /** Selected chip — cyan fill */
  active?: boolean;
  className?: string;
}

/** Angular filter chip (listing pages). Active = cyan fill + glow. */
export function FilterChip({ children, active = false, className }: FilterChipProps) {
  const cls = ['filter-chip', active ? 'active' : '', className || ''].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls}>
      {children}
    </button>
  );
}

export interface FilterChipsProps {
  /** FilterChip elements */
  children: ReactNode;
}

/** Wrapping row of FilterChips under a page header. */
export function FilterChips({ children }: FilterChipsProps) {
  return <div className="filter-chips">{children}</div>;
}

export interface CategoryTileProps {
  /** Tile label */
  label: string;
  /** Site line icon (or pass a custom node via `icon`) */
  iconName?: IconName;
  /** Custom icon node — must carry className="category-tile__icon" */
  icon?: ReactNode;
  href?: string;
  /** Red-domain tile (recovery / flat-tire / winter / events) */
  tone?: 'cyan' | 'red';
}

/**
 * Homepage wayfinding tile: icon + label on a dark panel with a corner-cut
 * clip. Alternate cyan/red tone to match the target section's domain.
 */
export function CategoryTile({ label, iconName, icon, href = '#', tone = 'cyan' }: CategoryTileProps) {
  const cls = ['category-tile', tone === 'red' ? 'category-tile--red' : ''].filter(Boolean).join(' ');
  return (
    <a className={cls} href={href}>
      {icon ?? (iconName ? <Icon name={iconName} className="category-tile__icon" /> : null)}
      <span className="category-tile__label">{label}</span>
    </a>
  );
}

export interface CategoryGridProps {
  /** CategoryTile elements */
  children: ReactNode;
  /** Accessible label for the nav landmark */
  ariaLabel?: string;
}

/** Auto-filling grid of CategoryTiles (min 150px columns). */
export function CategoryGrid({ children, ariaLabel = 'Browse sections' }: CategoryGridProps) {
  return (
    <nav className="category-grid" aria-label={ariaLabel}>
      {children}
    </nav>
  );
}

export interface MoreLinkProps {
  children: ReactNode;
  href?: string;
}

/** Quiet cyan "View all →" link for a section header. The arrow is part of the label you pass. */
export function MoreLink({ children, href = '#' }: MoreLinkProps) {
  return (
    <a href={href} className="section__more">
      {children}
    </a>
  );
}
