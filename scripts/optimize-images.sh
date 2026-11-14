#!/usr/bin/env bash
# Builds AVIF, WebP and JPEG variants at 800w and 1600w from each master in images/.
# Requires ffmpeg, cwebp and avifenc (brew install ffmpeg webp libavif).
set -euo pipefail
cd "$(dirname "$0")/.."
out=public/images
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
for master in images/*.jpg; do
 name=$(basename "$master" .jpg)
 for w in 800 1600; do
  ffmpeg -loglevel error -y -i "$master" -vf "scale=$w:-1:flags=lanczos" -q:v 5 "$out/$name-$w.jpg"
  ffmpeg -loglevel error -y -i "$master" -vf "scale=$w:-1:flags=lanczos" "$tmp/$name-$w.png"
  cwebp -quiet -q 75 "$tmp/$name-$w.png" -o "$out/$name-$w.webp"
  avifenc -q 55 -s 6 "$tmp/$name-$w.png" "$out/$name-$w.avif" >/dev/null
 done
done
ls -la "$out"
