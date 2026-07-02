import type { ReactNode } from 'react';

export interface GalleryItemProps {
  /** Photo URL */
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * One masonry gallery photo: desaturated at rest, cyan ring + top-edge accent
 * and re-saturation on hover, corner-cut clip. The live site opens these in a
 * lightbox.
 */
export function GalleryItem({ src, alt, width, height }: GalleryItemProps) {
  return (
    <figure className="gallery-item revealed" tabIndex={0} role="button" aria-label="Open photo in fullscreen viewer">
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
    </figure>
  );
}

export interface GalleryGridProps {
  /** GalleryItem elements */
  children: ReactNode;
}

/** Masonry photo columns: 2 → 3 → 4 across breakpoints. */
export function GalleryGrid({ children }: GalleryGridProps) {
  return <div className="gallery-grid">{children}</div>;
}
