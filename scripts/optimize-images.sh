#!/bin/bash
#
# CyberOffroading.com — Optional Image Optimization Helper
#
# Purpose:
#   Reduce multi-MB phone exports to web-appropriate sizes without a build step.
#   Run this manually when adding or replacing photos.
#
# Tools used (all available on this machine):
#   - ImageMagick (magick) for resizing + high-quality JPEG fallback
#   - cwebp for WebP encoding
#
# IMPORTANT — lesson from the 2026-05-28 revert:
#   Do NOT use `-near_lossless` on photos. It is a near-lossless preprocessing
#   mode meant for screenshots/flat graphics; on noisy 24 MP camera photos it
#   preserves sensor noise and produced WebPs 3-4x LARGER than the JPEG
#   fallback. Plain lossy `-q 80` compresses the hero from 7.4 MB to ~0.6 MB
#   at 1600w. See tasks/lessons.md.
#
# Usage:
#   ./scripts/optimize-images.sh [-w WIDTH] <image1.jpg> [image2.jpg ...]
#
#   -w WIDTH   Target width in px (default 1200). Recommended tiers:
#                hero / full-bleed feature ... 2000
#                gallery / build photos ...... 1200
#                product card photos ......... 800
#
# Output (for -w 1200 on input.jpeg):
#   input-1200.webp   (primary, lossy q80)
#   input-1200.jpg    (fallback, q82 progressive)
#
# After running, wire the variants into HTML with <picture>:
#   <picture>
#     <source type="image/webp" srcset="path/input-1200.webp">
#     <img src="path/input-1200.jpg" width="1200" height="900" alt="..." loading="lazy" decoding="async">
#   </picture>
#
# Keep the original full-res file around as the re-encode source of truth.
#
set -euo pipefail

WIDTH=1200
JPEG_QUALITY=82          # Very good visual quality, big size saving
WEBP_QUALITY=80          # Plain lossy WebP — correct mode for photos

while getopts "w:" opt; do
  case "$opt" in
    w) WIDTH="$OPTARG" ;;
    *) echo "Usage: $0 [-w WIDTH] <image1.jpg> [image2.jpg ...]"; exit 1 ;;
  esac
done
shift $((OPTIND - 1))

if [ $# -eq 0 ]; then
  echo "Usage: $0 [-w WIDTH] <image1.jpg> [image2.jpg ...]"
  echo "Example: $0 -w 2000 images/hero/IMG_2984.jpeg"
  exit 1
fi

echo "=== CyberOffroading Image Optimizer (width=${WIDTH}) ==="
echo "Using: $(magick --version | head -1)"
echo "cwebp: $(cwebp -version 2>/dev/null | head -1)"
echo

for input in "$@"; do
  if [ ! -f "$input" ]; then
    echo "Skipping (not found): $input"
    continue
  fi

  dir=$(dirname "$input")
  base=$(basename "$input")
  name="${base%.*}"

  echo "→ Processing: $input ($(du -h "$input" | cut -f1))"

  out_jpeg="$dir/${name}-${WIDTH}.jpg"
  out_webp="$dir/${name}-${WIDTH}.webp"

  # JPEG fallback — progressive, chroma-subsampled, stripped metadata.
  # `-auto-orient` bakes in EXIF rotation BEFORE -strip removes the tag,
  # otherwise portrait phone photos come out sideways.
  magick "$input" \
    -auto-orient \
    -resize "${WIDTH}x>" \
    -strip \
    -interlace Plane \
    -sampling-factor 4:2:0 \
    -quality "$JPEG_QUALITY" \
    "$out_jpeg"

  # WebP primary — plain lossy (NO -near_lossless, see header).
  # Encode from a lossless auto-oriented intermediate: encoding from the
  # compressed JPEG inflates the WebP (it spends bits preserving JPEG
  # artifacts), and cwebp ignores EXIF orientation on raw originals.
  tmp_png=$(mktemp /tmp/optimg-XXXXXX).png
  magick "$input" -auto-orient -resize "${WIDTH}x>" -strip "$tmp_png"
  cwebp -q "$WEBP_QUALITY" -mt -af "$tmp_png" -o "$out_webp" 2>/dev/null
  rm -f "$tmp_png"

  echo "   Created:"
  echo "     $(du -h "$out_webp" | cut -f1)  $out_webp"
  echo "     $(du -h "$out_jpeg" | cut -f1)  $out_jpeg"
  echo
done

echo "Done. Wire the variants into HTML with <picture> (see header comment)."
