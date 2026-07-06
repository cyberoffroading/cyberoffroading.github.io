import type { ReactNode } from 'react';
import { NeonWordmark } from './brand';

export interface SiteFooterLink {
  label: string;
  href: string;
  /** Opens in a new tab with rel noopener */
  external?: boolean;
}

export interface SiteFooterProps {
  /** Uppercase link row */
  links?: SiteFooterLink[];
  /** Affiliate/FTC disclosure paragraph */
  disclaimer?: ReactNode;
  /** Sign-off meta line beside the dim footer wordmark, e.g. "// affiliate-supported · est. 2026" */
  metaline?: string;
  /** Brand slot above the links (the production site mounts its baked neon mark here) */
  brand?: ReactNode;
  /** Faint terrain-profile watermark bleeding off the bottom-right */
  watermark?: boolean;
  /** Extra rows rendered before the disclaimer */
  children?: ReactNode;
}

/**
 * Site footer on the elevated panel band: faint terrain watermark, link row,
 * FTC disclaimer, and a sign-off bar with the small desaturated flickering
 * wordmark. The quiet end of the page — no bright neon here.
 */
export function SiteFooter({ links, disclaimer, metaline, brand, watermark = true, children }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      {watermark ? (
        <div className="site-footer__watermark" aria-hidden="true">
          <svg viewBox="-14 -16 1228 201" width="100%">
            <defs>
              <clipPath id="footMark">
                <path d="M0,159 L480,10 L1200,105 Z" />
              </clipPath>
            </defs>
            <g fill="none" stroke="#143842" strokeWidth={6} strokeLinejoin="miter">
              <path d="M0,159 L480,10 L1200,105 Z" />
            </g>
            <g clipPath="url(#footMark)">
              <path
                fill="none"
                stroke="#3a1416"
                strokeWidth={5}
                strokeLinejoin="miter"
                d="M130,150 L235,106 L345,140 L470,42 L590,132 L705,74 L825,128 L945,100 L1065,126 L1165,114"
              />
            </g>
            <circle cx="470" cy="42" r="7" fill="#143842" />
          </svg>
        </div>
      ) : null}
      <div className="site-footer__inner">
        {brand}
        {links && links.length ? (
          <div className="site-footer__links">
            {links.map((l, i) =>
              l.external ? (
                <a key={i} href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              ) : (
                <a key={i} href={l.href}>
                  {l.label}
                </a>
              ),
            )}
          </div>
        ) : null}
        {children}
        {disclaimer ? <p className="site-footer__disclaimer">{disclaimer}</p> : null}
        {metaline ? (
          <div className="site-footer__meta">
            <NeonWordmark variant="footer" />
            <span className="site-footer__metaline">{metaline}</span>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
