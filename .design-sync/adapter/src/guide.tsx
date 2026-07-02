import type { ReactNode } from 'react';

export interface StepListProps {
  /** One entry per step; each renders as a paragraph beside a glowing numbered box */
  steps: ReactNode[];
}

/**
 * Numbered install/how-to steps: cyan outlined counter boxes with a soft
 * glow, step copy beside each. Semantic ordered list.
 */
export function StepList({ steps }: StepListProps) {
  return (
    <ol className="step-list">
      {steps.map((s, i) => (
        <li key={i} className="step">
          <p>{s}</p>
        </li>
      ))}
    </ol>
  );
}

export interface GuideTableProps {
  /** Column headers (cyan uppercase mono) */
  headers: ReactNode[];
  /** Table body rows. Use <span className="yes">Yes</span> / <span className="no">No</span> for verdict cells. */
  rows: ReactNode[][];
}

/**
 * Comparison/spec table in a horizontally-scrollable wrap: cyan mono headers
 * on a panel, hairline row borders. `.yes` renders cyan, `.no` renders red.
 */
export function GuideTable({ headers, rows }: GuideTableProps) {
  return (
    <div className="guide-table-wrap">
      <table className="guide-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface MetaChipItem {
  /** Cyan bold figure, e.g. "14" */
  value?: string;
  /** Muted label, e.g. "inflators tested" */
  label: string;
}

export interface MetaChipsProps {
  items: MetaChipItem[];
}

/** Tested-meta chips under a roundup header ("14 inflators tested · 9 months on trail"). */
export function MetaChips({ items }: MetaChipsProps) {
  return (
    <div className="meta-chips">
      {items.map((c, i) => (
        <span key={i} className="meta-chip">
          {c.value ? <strong>{c.value} </strong> : null}
          {c.label}
        </span>
      ))}
    </div>
  );
}

export interface HudFrameProps {
  /** The image (or any media) to frame */
  children: ReactNode;
  /** Optional corner label, e.g. "// REC" */
  label?: string;
}

/**
 * HUD targeting reticle: cyan L-brackets at the top-left and bottom-right of
 * an image, with an optional mono corner label. Makes field photos read like
 * recon footage. Wrap an <img> directly.
 */
export function HudFrame({ children, label }: HudFrameProps) {
  return (
    <span className="hud-frame">
      {label ? <span className="hud-frame__label">{label}</span> : null}
      {children}
    </span>
  );
}

export interface AuthorBoxProps {
  /** Author display name */
  name: ReactNode;
  /** Cyan uppercase role line, e.g. "Cyberbeast owner · every product field-tested" */
  role?: ReactNode;
  /** Avatar slot (img or SVG) in a 46px steel-bordered box */
  avatar?: ReactNode;
}

/** Article sign-off box: avatar, name, and glowing cyan role line above a hairline rule. */
export function AuthorBox({ name, role, avatar }: AuthorBoxProps) {
  return (
    <div className="author-box">
      {avatar ? <div className="author-box__avatar">{avatar}</div> : null}
      <div>
        <p className="author-box__name">{name}</p>
        {role ? <p className="author-box__role">{role}</p> : null}
      </div>
    </div>
  );
}
