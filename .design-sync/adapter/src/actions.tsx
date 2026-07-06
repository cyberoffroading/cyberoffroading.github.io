import type { ReactNode } from 'react';
import { StarIcon, ClickIcon } from './icons';

export interface CtaButtonProps {
  /** Button label (add the arrow yourself for internal nav, e.g. "Explore Gear →") */
  children: ReactNode;
  /** 'primary' = filled cyan neon (the affiliate CTA); 'secondary' = red outline neon */
  variant?: 'primary' | 'secondary';
  /** Internal navigation: drops the auto external-link ↗ and the new-tab attrs */
  internal?: boolean;
  href?: string;
  className?: string;
}

/**
 * The site's CTA button: angular sheared clip-path, uppercase mono, glowing
 * cyan gradient fill. Primary cyan = the one glowing action per card;
 * secondary red outline = the co-primary alternative (budget pick, second
 * option). External links get an automatic ↗ and open in a new tab; set
 * `internal` for in-page/article navigation (auto-hides the arrow).
 */
export function CtaButton({ children, variant = 'primary', internal = false, href = '#', className }: CtaButtonProps) {
  const cls = [
    'cta-button',
    variant === 'secondary' ? 'cta-button--secondary' : '',
    internal ? 'cta-button--internal' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');
  const external = !internal;
  return (
    <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  );
}

export interface VoteButtonProps {
  /** Vote count (dash placeholder when undefined) */
  count?: number | string;
  /** Voted state: cyan outline + soft glow, filled star */
  voted?: boolean;
  disabled?: boolean;
}

/**
 * Community star-vote button from product cards. Neutral steel outline at
 * rest; cyan neon with a filled star once voted. Pair with ClickCounter
 * inside a ProductCard stats row.
 */
export function VoteButton({ count, voted = false, disabled = false }: VoteButtonProps) {
  return (
    <button
      type="button"
      className={voted ? 'vote-btn voted' : 'vote-btn'}
      disabled={disabled}
      aria-label={voted ? 'Voted — tap to remove your vote' : 'Vote for this product'}
    >
      <StarIcon />
      <span className="vote-btn__count">{count ?? '—'}</span>
    </button>
  );
}

export interface ClickCounterProps {
  /** Click-through count (dash placeholder when undefined) */
  count?: number | string;
}

/** Public click-through counter badge shown next to VoteButton on product cards. */
export function ClickCounter({ count }: ClickCounterProps) {
  return (
    <span className="click-counter">
      <ClickIcon /> <span className="click-counter__count">{count ?? '—'}</span>
      <span className="sr-only"> people clicked through to this product</span>
    </span>
  );
}

export interface BackToTopProps {
  /** The site fades it in after scrolling; defaults visible here */
  visible?: boolean;
}

/** Fixed bottom-right back-to-top button (angular, steel outline, cyan hover glow). */
export function BackToTop({ visible = true }: BackToTopProps) {
  return (
    <button type="button" className={visible ? 'back-to-top visible' : 'back-to-top'} aria-label="Back to top">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 14V3M3 7l5-5 5 5" stroke="currentColor" strokeWidth={1.5} />
      </svg>
    </button>
  );
}
