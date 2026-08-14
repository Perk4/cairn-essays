#!/usr/bin/env python3
"""Rasterize Cairn still/listen/point PNGs and an 8-frame idle.gif."""

from __future__ import annotations

import subprocess
from pathlib import Path

OUT = Path("/workspace/public/cairn")
TMP = Path("/tmp/cairn-frames")
CHROME = "/usr/bin/google-chrome-stable"
SIZE = 800

STONES = """
  <ellipse cx="0" cy="175" rx="310" ry="155" fill="#A5532D"/>
  <ellipse cx="-90" cy="210" rx="18" ry="14" fill="#57351C" stroke="none"/>
  <ellipse cx="70" cy="230" rx="14" ry="11" fill="#57351C" stroke="none"/>
  <ellipse cx="140" cy="175" rx="11" ry="9" fill="#57351C" stroke="none"/>
  <ellipse cx="0" cy="-20" rx="230" ry="125" fill="#A5532D"/>
  <ellipse cx="0" cy="-195" rx="155" ry="95" fill="#796635"/>
  <ellipse cx="-40" cy="-175" rx="12" ry="10" fill="#57351C" stroke="none"/>
  <ellipse cx="35" cy="-210" rx="9" ry="8" fill="#57351C" stroke="none"/>
  <ellipse cx="55" cy="-165" rx="8" ry="7" fill="#57351C" stroke="none"/>
"""

OPEN_EYES = """
  <circle cx="-38" cy="-28" r="16" fill="#281D0E" stroke="none"/>
  <circle cx="42" cy="-22" r="11" fill="#281D0E" stroke="none"/>
"""

BLINK_EYES = """
  <ellipse cx="-38" cy="-28" rx="16" ry="3" fill="#281D0E" stroke="none"/>
  <ellipse cx="42" cy="-22" rx="11" ry="2.5" fill="#281D0E" stroke="none"/>
"""

ARMS_STILL = """
  <path d="M -210 -40 L -310 -90"/>
  <path d="M -310 -90 L -355 -70"/>
  <path d="M -310 -90 L -345 -135"/>
  <path d="M 210 -40 L 310 -90"/>
  <path d="M 310 -90 L 355 -70"/>
  <path d="M 310 -90 L 345 -135"/>
"""

ARMS_LISTEN = """
  <path d="M -210 -20 L -250 70"/>
  <path d="M -250 70 L -295 85"/>
  <path d="M -250 70 L -275 115"/>
  <path d="M 210 -20 L 250 70"/>
  <path d="M 250 70 L 295 85"/>
  <path d="M 250 70 L 275 115"/>
"""

ARMS_POINT = """
  <path d="M -210 -40 L -280 40"/>
  <path d="M -280 40 L -325 50"/>
  <path d="M -280 40 L -300 85"/>
  <path d="M 210 -40 L 360 -200"/>
  <path d="M 360 -200 L 395 -175"/>
  <path d="M 360 -200 L 400 -230"/>
"""


def svg_markup(arms: str, eyes: str, rotate: float) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{SIZE}" height="{SIZE}" viewBox="-430 -360 860 780">
  <rect width="100%" height="100%" x="-430" y="-360" fill="#FCF2C6"/>
  <g transform="rotate({rotate})" stroke="#281D0E" stroke-width="14" stroke-linejoin="round" stroke-linecap="round" fill="none">
    <g fill="none" stroke="#281D0E" stroke-width="12">
      {arms}
    </g>
    {STONES}
    {eyes}
  </g>
</svg>
"""


def html_wrap(svg: str) -> str:
    return f"""<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {{ margin: 0; width: {SIZE}px; height: {SIZE}px; background: #FCF2C6; overflow: hidden; }}
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


def write_pose(name: str, arms: str, rotate: float, eyes: str = OPEN_EYES) -> Path:
    TMP.mkdir(parents=True, exist_ok=True)
    html_path = TMP / f"{name}.html"
    png_path = OUT / f"{name}.png" if name in {"still", "listen", "point"} else TMP / f"{name}.png"
    html_path.write_text(html_wrap(svg_markup(arms, eyes, rotate)), encoding="utf-8")
    screenshot(html_path, png_path)
    return png_path


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)

    write_pose("still", ARMS_STILL, 0)
    write_pose("listen", ARMS_LISTEN, -7)
    write_pose("point", ARMS_POINT, 5)

    idle = [
        ("idle0", ARMS_STILL, -4, OPEN_EYES),
        ("idle1", ARMS_STILL, -2, OPEN_EYES),
        ("idle2", ARMS_STILL, 0, OPEN_EYES),
        ("idle3", ARMS_STILL, 2, BLINK_EYES),
        ("idle4", ARMS_STILL, 3, BLINK_EYES),
        ("idle5", ARMS_STILL, 1, OPEN_EYES),
        ("idle6", ARMS_STILL, -1, OPEN_EYES),
        ("idle7", ARMS_STILL, -3, OPEN_EYES),
    ]
    frames: list[Path] = []
    for name, arms, rotate, eyes in idle:
        html_path = TMP / f"{name}.html"
        png_path = TMP / f"{name}.png"
        html_path.write_text(html_wrap(svg_markup(arms, eyes, rotate)), encoding="utf-8")
        screenshot(html_path, png_path)
        frames.append(png_path)

    palette = TMP / "palette.png"
    gif_path = OUT / "idle.gif"
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-framerate",
            "8",
            "-i",
            str(TMP / "idle%d.png"),
            "-vf",
            "palettegen=reserve_transparent=0",
            str(palette),
        ],
        check=True,
        capture_output=True,
    )
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-framerate",
            "8",
            "-i",
            str(TMP / "idle%d.png"),
            "-i",
            str(palette),
            "-lavfi",
            "paletteuse=dither=none",
            "-loop",
            "0",
            str(gif_path),
        ],
        check=True,
        capture_output=True,
    )
    print("wrote", OUT)


if __name__ == "__main__":
    main()
