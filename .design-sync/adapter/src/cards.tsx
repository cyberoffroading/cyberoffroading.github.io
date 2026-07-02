import type { ReactNode } from 'react';
import { VoteButton, ClickCounter } from './actions';

export interface SpecRowProps {
  /** Spec key, e.g. "Pressure" */
  label: string;
  /** Spec value, e.g. "35–50 psi" */
  value: ReactNode;
}

/** One label/value spec line (muted key left, value right). Used inside ProductCard specs. */
export function SpecRow({ label, value }: SpecRowProps) {
  return (
    <div className="spec-row">
      <span className="spec-row__k">{label}</span>
      <span className="spec-row__v">{value}</span>
    </div>
  );
}

export interface ProductCardStats {
  votes?: number | string;
  clicks?: number | string;
  voted?: boolean;
}

export interface ProductCardProps {
  /** Product name (h3) */
  title: ReactNode;
  /** Cyan uppercase price line, e.g. "~$130" — also used for promo codes */
  price?: string;
  /** Cyan uppercase quantity line, e.g. "Set of 4" */
  qty?: string;
  /** The review paragraph — spec-first, no fluff */
  review?: ReactNode;
  /** Spec rows rendered in a bordered block under the review */
  specs?: SpecRowProps[];
  /** Product photo — object-fit contain on the brushed-steel "product stage" */
  imageSrc?: string;
  imageAlt?: string;
  /** Custom image-area content instead of imageSrc */
  image?: ReactNode;
  /** Community stats row (star votes + click-throughs) */
  stats?: ProductCardStats;
  /** CTA area — one primary CtaButton, optionally a secondary; rendered after specs */
  children?: ReactNode;
  /** data-product-id hook (voting/click tracking on the live site) */
  productId?: string;
}

/**
 * The core gear card: brushed-steel product stage with a cyan top-edge
 * accent, then title, price, review, spec rows, CTA buttons, and community
 * stats on a corner-cut dark panel. Hover lifts it with a cyan ring.
 * Compose CtaButton children — one glowing primary per card ("glow is
 * earned"); use a secondary red outline for the alternative pick.
 */
export function ProductCard({
  title,
  price,
  qty,
  review,
  specs,
  imageSrc,
  imageAlt = '',
  image,
  stats,
  children,
  productId,
}: ProductCardProps) {
  return (
    <article className="product-card revealed" {...(productId ? { 'data-product-id': productId } : {})}>
      {image || imageSrc ? (
        <div className="product-card__image">{image ?? <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />}</div>
      ) : null}
      <div className="product-card__info">
        <h3>{title}</h3>
        {qty ? <p className="product-card__qty">{qty}</p> : null}
        {price ? <p className="product-card__price">{price}</p> : null}
        {review ? <p className="product-card__review">{review}</p> : null}
        {specs && specs.length ? (
          <div className="product-card__specs">
            {specs.map((s, i) => (
              <SpecRow key={i} label={s.label} value={s.value} />
            ))}
          </div>
        ) : null}
        {children}
        {stats ? (
          <div className="product-card__stats">
            <VoteButton count={stats.votes} voted={stats.voted} />
            <ClickCounter count={stats.clicks} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

export interface ArticleCardProps {
  /** Article title (h3) */
  title: ReactNode;
  /** Teaser paragraph */
  excerpt?: ReactNode;
  /** Cover photo — dark editorial stage, cover-fit (unlike the product stage) */
  imageSrc?: string;
  imageAlt?: string;
  /** Small cyan category tag above the title, e.g. "// DIY Build" */
  tag?: string;
  href?: string;
  /** Quiet cyan text-link CTA (gets an auto → arrow) */
  ctaLabel?: string;
}

/**
 * Editorial article card: full-bleed dark cover photo + title, teaser, and a
 * quiet cyan "Read Article →" text link (not a filled button — glow is
 * earned). The whole card is one link.
 */
export function ArticleCard({ title, excerpt, imageSrc, imageAlt = '', tag, href = '#', ctaLabel = 'Read Article' }: ArticleCardProps) {
  return (
    <article className="product-card article-card">
      <a className="article-card__link" href={href}>
        {imageSrc ? (
          <div className="product-card__image">
            <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />
          </div>
        ) : null}
        <div className="product-card__info">
          {tag ? <span className="article-card__tag">{tag}</span> : null}
          <h3>{title}</h3>
          {excerpt ? <p className="product-card__review">{excerpt}</p> : null}
          <span className="cta-button cta-button--internal">{ctaLabel}</span>
        </div>
      </a>
    </article>
  );
}

export interface ProductGridProps {
  /** ProductCard / ArticleCard elements */
  children: ReactNode;
  /** Horizontal row layout (image left, details right) used on listing pages */
  cardList?: boolean;
}

/** Responsive card grid: 1 → 2 → 3 columns. `cardList` switches to single-column horizontal rows. */
export function ProductGrid({ children, cardList = false }: ProductGridProps) {
  return <div className={cardList ? 'product-grid card-list' : 'product-grid'}>{children}</div>;
}

export interface RelatedGuideItem {
  /** Tiny cyan tag, e.g. "// RECOVERY" */
  tag?: string;
  title: string;
  href?: string;
}

export interface RelatedGuidesProps {
  /** Red-glow band label */
  label?: string;
  items: RelatedGuideItem[];
}

/** "Related guides" band for article footers: red label + a grid of compact link cards. */
export function RelatedGuides({ label = '// Related Guides', items }: RelatedGuidesProps) {
  return (
    <div className="related">
      <p className="related__label">{label}</p>
      <div className="related__grid">
        {items.map((item, i) => (
          <a key={i} className="related__card" href={item.href ?? '#'}>
            {item.tag ? <p className="related__card-tag">{item.tag}</p> : null}
            <p className="related__card-title">{item.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export interface AffiliateCardProps {
  /** Product name */
  name: ReactNode;
  /** One-line pitch */
  blurb?: ReactNode;
  /** Red CTA label, e.g. "Check Price" (auto ↗, opens in new tab) */
  ctaLabel?: string;
  href?: string;
  /** Thumbnail slot (an img or inline SVG) shown in the 84px stage */
  thumb?: ReactNode;
  /** FTC disclosure line rendered under the card */
  disclosure?: string;
}

/**
 * Inline affiliate card for article bodies: thumb + name + blurb + a red
 * neon CTA. Include the FTC `disclosure` when it's the first affiliate link
 * in the content.
 */
export function AffiliateCard({ name, blurb, ctaLabel = 'Check Price', href = '#', thumb, disclosure }: AffiliateCardProps) {
  return (
    <>
      <div className="affiliate-card">
        {thumb ? <div className="affiliate-card__thumb">{thumb}</div> : null}
        <div className="affiliate-card__body">
          <p className="affiliate-card__name">{name}</p>
          {blurb ? <p className="affiliate-card__blurb">{blurb}</p> : null}
        </div>
        <a className="affiliate-card__cta" href={href} target="_blank" rel="noopener noreferrer">
          {ctaLabel}
        </a>
      </div>
      {disclosure ? <p className="affiliate-card__disclosure">{disclosure}</p> : null}
    </>
  );
}
