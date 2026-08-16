#!/usr/bin/env python3
"""Rasterize Design talking-kit poses: planted base, no 4-and-8 hang."""

from __future__ import annotations

import subprocess
from pathlib import Path

OUT = Path("/workspace/public/cairn")
TMP = Path("/tmp/cairn-frames")
CHROME = "/usr/bin/google-chrome-stable"
SIZE = 800
KEY = "#00FFFF"

STONES = """
  <ellipse cx="0" cy="175" rx="310" ry="155" fill="#A5532D"/>
  <ellipse cx="-90" cy="210" rx="18" ry="14" fill="#57351C" stroke="none"/>
  <ellipse cx="70" cy="230" rx="14" ry="11" fill="#57351C" stroke="none"/>
  <ellipse cx="140" cy="175" rx="11" ry="9" fill="#57351C" stroke="none"/>
  <ellipse cx="-40" cy="250" rx="10" ry="8" fill="#57351C" stroke="none"/>
  <ellipse cx="0" cy="-20" rx="230" ry="125" fill="#A5532D"/>
  <ellipse cx="0" cy="-195" rx="155" ry="95" fill="#796635"/>
  <ellipse cx="-40" cy="-175" rx="12" ry="10" fill="#57351C" stroke="none"/>
  <ellipse cx="35" cy="-210" rx="9" ry="8" fill="#57351C" stroke="none"/>
  <ellipse cx="55" cy="-165" rx="8" ry="7" fill="#57351C" stroke="none"/>
  <ellipse cx="-70" cy="-220" rx="7" ry="6" fill="#57351C" stroke="none"/>
"""

OPEN_EYES = """
  <circle cx="-38" cy="-28" r="16" fill="#281D0E" stroke="none"/>
  <circle cx="42" cy="-22" r="11" fill="#281D0E" stroke="none"/>
"""

TUE_EYES = """
  <circle cx="-40" cy="-30" r="18" fill="#281D0E" stroke="none"/>
  <circle cx="44" cy="-24" r="13" fill="#281D0E" stroke="none"/>
"""

SLIT_FACE = """
  <path d="M -54 -32 L -22 -28" stroke-width="10"/>
  <path d="M 22 -26 L 52 -30" stroke-width="10"/>
  <path d="M -18 18 L 18 18" stroke-width="10"/>
"""

# Twigs rest on the top of the bottom stone (planted still).
ARMS_STILL = """
  <path d="M -205 -8 L -268 48"/>
  <path d="M -268 48 L -312 42"/>
  <path d="M -268 48 L -292 82"/>
  <path d="M 205 -8 L 268 48"/>
  <path d="M 268 48 L 312 42"/>
  <path d="M 268 48 L 292 82"/>
"""

# Lean-in: same planted twigs, plus a forward reach on the right.
ARMS_LISTEN = """
  <path d="M -205 -8 L -250 52"/>
  <path d="M -250 52 L -292 48"/>
  <path d="M -250 52 L -268 88"/>
  <path d="M 205 -12 L 300 8"/>
  <path d="M 300 8 L 338 0"/>
  <path d="M 300 8 L 328 38"/>
"""

# Left twig on the base; right twig points on the floor, stage-right.
ARMS_POINT = """
  <path d="M -205 -8 L -260 50"/>
  <path d="M -260 50 L -304 44"/>
  <path d="M -260 50 L -282 86"/>
  <path d="M 210 -18 L 390 -22"/>
  <path d="M 390 -22 L 428 -8"/>
  <path d="M 390 -22 L 430 -48"/>
"""


def mouth_closed() -> str:
    return '<path d="M -16 20 L 16 20" stroke-width="12"/>'


def mouth_mid() -> str:
    return '<circle cx="0" cy="24" r="14" fill="#281D0E" stroke="none"/>'


def mouth_open() -> str:
    return '<circle cx="0" cy="26" r="24" fill="#281D0E" stroke="none"/>'


def svg_markup(
    arms: str,
    face: str,
    rotate: float,
    pivot_y: float = 175,
) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{SIZE}" height="{SIZE}" viewBox="-500 -400 1040 860">
  <rect width="100%" height="100%" x="-500" y="-400" fill="{KEY}"/>
  <g transform="translate(0, {pivot_y}) rotate({rotate}) translate(0, {-pivot_y})"
     stroke="#281D0E" stroke-width="14" stroke-linejoin="round" stroke-linecap="round" fill="none">
    <g fill="none" stroke="#281D0E" stroke-width="12">
      {arms}
    </g>
    {STONES}
    {face}
  </g>
</svg>
"""


def html_wrap(svg: str) -> str:
    return f"""<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {{ margin: 0; width: {SIZE}px; height: {SIZE}px; background: {KEY}; overflow: hidden; }}
      svg {{ display: block; }}
    </style>
  </head>
  <body>{svg}</body>
</html>
"""


def screenshot(html_path: Path, png_path: Path) -> None:
    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        f"--window-size={SIZE},{SIZE}",
        f"--screenshot={png_path}",
        html_path.as_uri(),
    ]
    subprocess.run(cmd, check=True, capture_output=True)


def key_out(src: Path, dest: Path) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(src),
            "-vf",
            "colorkey=0x00FFFF:0.12:0.22,format=rgba",
            str(dest),
        ],
        check=True,
        capture_output=True,
    )


def write_pose(name: str, arms: str, face: str, rotate: float) -> Path:
    TMP.mkdir(parents=True, exist_ok=True)
    html_path = TMP / f"{name}.html"
    raw_path = TMP / f"{name}-raw.png"
    png_path = OUT / f"{name}.png"
    html_path.write_text(html_wrap(svg_markup(arms, face, rotate)), encoding="utf-8")
    screenshot(html_path, raw_path)
    key_out(raw_path, png_path)
    return png_path


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)

    still_face = OPEN_EYES + mouth_closed()
    write_pose("still", ARMS_STILL, still_face, 0)
    write_pose("listen", ARMS_LISTEN, still_face, 16)
    write_pose("point", ARMS_POINT, still_face, 0)
    write_pose("mouth-closed", ARMS_STILL, OPEN_EYES + mouth_closed(), 0)
    write_pose("mouth-mid", ARMS_STILL, OPEN_EYES + mouth_mid(), 0)
    write_pose("mouth-open", ARMS_STILL, OPEN_EYES + mouth_open(), 0)
    write_pose("tue-open", ARMS_STILL, TUE_EYES + mouth_open(), 0)
    write_pose("thu-slits", ARMS_STILL, SLIT_FACE, 0)
    print("wrote talking kit to", OUT)


if __name__ == "__main__":
    main()
