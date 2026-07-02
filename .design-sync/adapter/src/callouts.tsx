import type { ReactNode } from 'react';

export interface WarningCalloutProps {
  /** Uppercase red label; the site prefixes "⚠ " */
  label?: string;
  /** Warning body copy */
  children: ReactNode;
}

/**
 * Red neon warning box (safety-critical guidance — recovery loads, electrical
 * work). Red-tinted panel, red border, inner glow, corner-cut clip.
 */
export function WarningCallout({ label = '⚠ Warning', children }: WarningCalloutProps) {
  return (
    <div className="warning-callout">
      <p className="warning-callout__label">{label}</p>
      <p>{children}</p>
    </div>
  );
}

export interface InfoCalloutProps {
  /** Uppercase cyan label; the site prefixes "ⓘ " */
  label?: string;
  /** Tip/spec body copy */
  children: ReactNode;
}

/** Cyan spec-box callout for tips and how-it-works notes. Counterpart to WarningCallout. */
export function InfoCallout({ label = 'ⓘ Tip', children }: InfoCalloutProps) {
  return (
    <div className="info-callout">
      <p className="info-callout__label">{label}</p>
      <p>{children}</p>
    </div>
  );
}

export interface PartsListRow {
  /** Part name */
  name: ReactNode;
  /** Cyan value column — qty, spec, or price */
  value: ReactNode;
}

export interface PartsListProps {
  /** Cyan uppercase panel label */
  label?: string;
  rows: PartsListRow[];
}

/**
 * Cyan-tinted parts/spec panel with dashed leader rows — name left, cyan
 * value right. The article parts-list and roundup spec-sheet pattern.
 */
export function PartsList({ label = '// Parts List', rows }: PartsListProps) {
  return (
    <div className="parts-list">
      <p className="parts-list__label">{label}</p>
      {rows.map((r, i) => (
        <div key={i} className="parts-list__row">
          <span className="pl-name">{r.name}</span>
          <span className="pl-val">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export interface TestNoteProps {
  /** Red uppercase band label */
  label?: string;
  children: ReactNode;
}

/** "How we test" methodology band: bordered panel, red eyebrow, muted copy. */
export function TestNote({ label = '// How We Test', children }: TestNoteProps) {
  return (
    <div className="test-note">
      <p className="test-note__label">{label}</p>
      <p>{children}</p>
    </div>
  );
}

export interface EventsCtaProps {
  /** Cyan uppercase label, e.g. "// Cybertrex Events" */
  label?: string;
  /** Supporting sentence */
  text?: ReactNode;
  /** CtaButton (or other action) — add className="events-cta__button" for band sizing */
  children?: ReactNode;
}

/**
 * Full-width promo band: gradient panel with a cyan neon border and glow,
 * centered label + text + one CTA. The strongest container on the page —
 * use once per page at most.
 */
export function EventsCta({ label = '// Events', text, children }: EventsCtaProps) {
  return (
    <div className="events-cta">
      <div className="events-cta__body">
        <p className="events-cta__label">{label}</p>
        {text ? <p className="events-cta__text">{text}</p> : null}
        {children}
      </div>
    </div>
  );
}
