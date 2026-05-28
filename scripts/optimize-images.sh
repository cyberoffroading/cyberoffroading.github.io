#!/bin/bash
#
# CyberOffroading.com — Optional Image Optimization Helper
#
# Purpose:
#   Reduce the 112MB images/ directory without forcing a build step.
#   Run this manually when adding or replacing photos.
#
# Tools used (all available on this machine):
#   - ImageMagick (magick) for resizing + high-quality JPEG/WebP
#   - cwebp for excellent WebP encoding
#
# Philosophy:
#   - Keep the zero-build happy path intact (you can still just `git add image.jpg`)
#   - Produce modern formats (WebP primary) + reasonable JPEG fallback
#   - Target sensible responsive widths instead of shipping 5-7MB phone exports
#
# Usage examples:
#   ./scripts/optimize-images.sh images/hero/IMG_2984.jpeg
#   ./scripts/optimize-images.sh images/products/winch/build-setup/*.jpeg
#
# Output:
#   For each input.jpg you get:
#     input-1600.webp   (primary, high quality)
#     input-1600.jpg    (fallback, good quality)
#     (optionally smaller widths if you extend the script)
#
# After running, update the corresponding <img> tags to use srcset + sizes.
#
# Recommended widths for this site (tweak per use case):
#   - Hero / large feature: 1600w or 2000w
#   - Product cards & gallery: 800w or 1200w
#   - Thumbnails: 400w-600w
#
set -euo pipefail

if [ $# -eq 0 ]; then
  echo "Usage: $0 <image1.jpg> [image2.jpg ...]"
  echo "Example: $0 images/hero/IMG_2984.jpeg images/products/winch/build-setup/*.jpeg"
  exit 1
fi

# Quality settings tuned for this brutalist, high-contrast site
JPEG_QUALITY=82          # Very good visual quality, big size saving
WEBP_QUALITY=80          # WebP is more efficient → slightly lower number is fine

# Max width for "large" images (hero, winch builds, full gallery)
LARGE_WIDTH=1600

echo "=== CyberOffroading Image Optimizer ==="
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
  ext="${base##*.}"

  echo "→ Processing: $input ($(du -h "$input" | cut -f1))"

  # Large version (hero / feature images)
  large_jpeg="$dir/${name}-${LARGE_WIDTH}.jpg"
  large_webp="$dir/${name}-${LARGE_WIDTH}.webp"

  # Create optimized JPEG fallback
  magick "$input" \
    -resize "${LARGE_WIDTH}x>" \
    -strip \
    -interlace Plane \
    -sampling-factor 4:2:0 \
    -quality "$JPEG_QUALITY" \
    "$large_jpeg"

  # Create excellent WebP (primary format)
  # -near_lossless 60 gives great detail retention on text/edges while still compressing well
  cwebp -q "$WEBP_QUALITY" -near_lossless 60 -mt -af "$input" -resize "$LARGE_WIDTH" 0 -o "$large_webp" 2>/dev/null || {
    # Fallback if cwebp resize fails for some reason
    magick "$input" -resize "${LARGE_WIDTH}x>" -quality "$WEBP_QUALITY" "$large_webp"
  }

  echo "   Created:"
  echo "     $(du -h "$large_webp" | cut -f1)  $large_webp"
  echo "     $(du -h "$large_jpeg" | cut -f1)  $large_jpeg"
  echo
done

echo "Done. Now update the <img> tags in index.html to use srcset."
echo "Example pattern:"
echo '<img src="images/hero/IMG_2984-1600.jpg"'
echo '     srcset="images/hero/IMG_2984-1600.webp 1600w, images/hero/IMG_2984-1600.jpg 1600w"'
echo '     sizes="100vw" alt="..." loading="eager">'
echo
echo "Tip: Keep the original full-res file around in case you need to re-encode later."