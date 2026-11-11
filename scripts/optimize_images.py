"""Shrink photos uploaded through the CMS so the website stays fast.

Run by .github/workflows/optimize-images.yml whenever images are added under
assets/uploads/. Photos wider or taller than MAX_SIDE are resized and JPEGs are
re-saved at good quality. EXIF data (including GPS location) is removed.
Files that are already small are left untouched.
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

MAX_SIDE = 1600
MAX_BYTES = 450_000
ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else "assets/uploads")

changed = 0
for path in sorted(ROOT.rglob("*")):
    if path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        continue
    size = path.stat().st_size
    with Image.open(path) as im:
        has_exif = bool(im.getexif())
        if max(im.size) <= MAX_SIDE and size <= MAX_BYTES and not has_exif:
            continue
        im = ImageOps.exif_transpose(im)  # keep the photo the right way up
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        if path.suffix.lower() in {".jpg", ".jpeg"}:
            im.convert("RGB").save(path, "JPEG", quality=82, optimize=True, progressive=True)
        elif path.suffix.lower() == ".png":
            im.save(path, "PNG", optimize=True)
        else:
            im.save(path, "WEBP", quality=82)
    print(f"optimized {path}: {size} -> {path.stat().st_size} bytes")
    changed += 1

print(f"{changed} image(s) optimized")
