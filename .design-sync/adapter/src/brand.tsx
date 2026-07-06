export interface NeonWordmarkProps {
  /** 'default' = full-brightness neon sign (nav scale); 'footer' = small desaturated sign-off mark */
  variant?: 'default' | 'footer';
  /** Independent cyan/red tube flicker (7s + 6.4s timelines, out of phase). On by default; auto-disabled under prefers-reduced-motion. */
  flicker?: boolean;
  /** Render as a link (e.g. "#top" for a home link) */
  href?: string;
  className?: string;
}

/**
 * The CyberOffroading neon wordmark as live text: cyan Audiowide "Cyber" +
 * red Yellowtail "Offroading", each glowing like a fabricated neon tube and
 * flickering on its own timeline. This is the brand — the ONLY element that
 * flickers; UI never does. On the production site the hero/nav lockups are
 * pre-rendered images for cross-engine pixel fidelity; this live-text form
 * is the design-system source of that artwork and scales to any context.
 */
export function NeonWordmark({ variant = 'default', flicker = true, href, className }: NeonWordmarkProps) {
  const cls = ['wordmark', variant === 'footer' ? 'wordmark--footer' : '', flicker ? 'flick' : '', className || '']
    .filter(Boolean)
    .join(' ');
  const inner = (
    <>
      <span className="wordmark__cyber">Cyber</span>
      <span className="wordmark__off">Offroading</span>
    </>
  );
  return href ? (
    <a className={cls} href={href} aria-label="CyberOffroading — home">
      {inner}
    </a>
  ) : (
    <span className={cls}>{inner}</span>
  );
}
