import type { ReactNode } from 'react';
import { Icon, IconName } from './icons';

export interface HeroProps {
  /** Eyebrow tag with a glowing rule, e.g. "// Curated Gear for the Trail" */
  tag?: string;
  /** Big title. The production site mounts its baked neon wordmark here; pass text or a custom lockup. */
  title?: ReactNode;
  /** Supporting sentence under the title */
  sub?: ReactNode;
  /** CTA row — compose CtaButton elements (add className="hero__cta" for hero sizing) */
  actions?: ReactNode;
  /** Background photo. It renders grayscale with the cyan/red neon duotone, scanlines, and glow pools cast over it. */
  imageSrc?: string;
  imageAlt?: string;
  /** Extra content rendered after the title */
  children?: ReactNode;
}

/**
 * Full-bleed night hero: bottom-anchored content over a grayscale photo relit
 * by a diagonal cyan/red duotone, scanlines, vignette, and two breathing neon
 * glow pools. Works without a photo too (pure void + glow). This is the
 * site's signature stage — one per page.
 */
export function Hero({ tag, title, sub, actions, imageSrc, imageAlt = '', children }: HeroProps) {
  return (
    <header className="hero">
      <div className="hero__bg">
        {imageSrc ? <img src={imageSrc} alt={imageAlt} loading="eager" /> : null}
        <div className="hero__duotone" aria-hidden="true" />
      </div>
      <div className="hero__vignette" aria-hidden="true" />
      <div className="hero__glow hero__glow--cyan" aria-hidden="true" />
      <div className="hero__glow hero__glow--red" aria-hidden="true" />
      <div className="hero__content">
        {tag ? (
          <p className="hero__tag">
            <span className="hero__tag-rule" aria-hidden="true" />
            {tag}
          </p>
        ) : null}
        {title ? <h1>{title}</h1> : null}
        {children}
        {sub ? <p className="hero__sub">{sub}</p> : null}
        {actions ? <div className="hero__actions">{actions}</div> : null}
      </div>
    </header>
  );
}

export interface SectionProps {
  children: ReactNode;
  /** Elevated contrast band (--panel-2 background) — alternate sections for rhythm */
  alt?: boolean;
  /** Anchor id for nav pills */
  id?: string;
}

/** Page section band. Alternate `alt` on/off down the page for the dark-band rhythm. */
export function Section({ children, alt = false, id }: SectionProps) {
  return (
    <section id={id} className={alt ? 'section section--alt' : 'section'}>
      {children}
    </section>
  );
}

export interface SectionHeaderProps {
  /** Uppercase glowing eyebrow, by convention slash-prefixed: "// When You're Stuck" */
  eyebrow?: string;
  /** Site line icon rendered beside the eyebrow */
  iconName?: IconName;
  /** Custom icon node — must carry className="section__icon" */
  icon?: ReactNode;
  /** The h2 title (auto-uppercased, neon underline bar) */
  title: ReactNode;
  /** Short intro paragraph */
  intro?: ReactNode;
  /** 'cyan' (default) or 'trail' — red domain for recovery/hazard/events sections */
  tone?: 'cyan' | 'trail';
  /** Optional trailing content, e.g. a MoreLink */
  children?: ReactNode;
}

/**
 * Section header: glowing "// eyebrow" with icon, uppercase h2 with a neon
 * underline bar, optional intro and "View all →" link. tone="trail" switches
 * the eyebrow, glow, and bar to warn-red for the trail/recovery domain.
 */
export function SectionHeader({ eyebrow, iconName, icon, title, intro, tone = 'cyan', children }: SectionHeaderProps) {
  const cls = tone === 'trail' ? 'section__header section__header--trail' : 'section__header';
  return (
    <div className={cls}>
      {eyebrow ? (
        <div className="section__eyebrow">
          {icon ?? (iconName ? <Icon name={iconName} className="section__icon" /> : null)}
          <span>{eyebrow}</span>
        </div>
      ) : null}
      <h2>{title}</h2>
      {intro ? <p className="section__intro">{intro}</p> : null}
      {children}
    </div>
  );
}

export interface PageHeadProps {
  /** Glowing eyebrow above the title, e.g. "// Field Notes & Guides" */
  eyebrow?: string;
  /** Big uppercase page h1 with neon underline bar */
  title: ReactNode;
  /** Lede paragraph */
  sub?: ReactNode;
  /** 'cyan' (default) or 'trail' (red domain) */
  tone?: 'cyan' | 'trail';
  children?: ReactNode;
}

/** Listing-page header (article index, gear roundups): eyebrow + display h1 + lede. */
export function PageHead({ eyebrow, title, sub, tone = 'cyan', children }: PageHeadProps) {
  const cls = tone === 'trail' ? 'page-head page-head--red' : 'page-head';
  const eyebrowCls = tone === 'trail' ? 'page-head__eyebrow page-head__eyebrow--red' : 'page-head__eyebrow';
  return (
    <div className={cls}>
      {eyebrow ? <p className={eyebrowCls}>{eyebrow}</p> : null}
      <h1>{title}</h1>
      {sub ? <p className="page-head__sub">{sub}</p> : null}
      {children}
    </div>
  );
}

export interface TopBarProps {
  /** Inline content; links get an underline + cyan hover glow, `<span>` inside a link reads cyan */
  children: ReactNode;
}

/** Slim cross-promo bar above the nav (bottom hairline border). */
export function TopBar({ children }: TopBarProps) {
  return <div className="top-bar">{children}</div>;
}

export interface OwnerBarProps {
  /** Inline content; links read cyan */
  children: ReactNode;
}

/** Slim provenance bar ("Built by …") below the top bar (top hairline border). */
export function OwnerBar({ children }: OwnerBarProps) {
  return <div className="owner-bar">{children}</div>;
}

export interface NightStageProps {
  children: ReactNode;
  /** Stage inset in px */
  padding?: number;
}

/**
 * The void page stage. Night Trail is dark-first — the page body is always
 * void-black (#08090a) with mono body text. Wrap any composition that isn't
 * already sitting on a dark page (embeds, white artboards, preview frames)
 * so surfaces, glow, and text ramp read as designed.
 */
export function NightStage({ children, padding = 20 }: NightStageProps) {
  return (
    <div
      style={{
        background: 'var(--void, #08090a)',
        color: 'var(--text, #c8c8c0)',
        fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
        padding,
        minHeight: '100%',
      }}
    >
      {children}
    </div>
  );
}

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Max-width (1200px) centered content column with the site's page padding. */
export function Container({ children, className }: ContainerProps) {
  return <div className={className ? `container ${className}` : 'container'}>{children}</div>;
}
