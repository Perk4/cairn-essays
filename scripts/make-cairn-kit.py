#!/usr/bin/env python3

from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "cairn"
TMP = Path("/tmp/cairn-frames")
CHROME_CANDIDATES = (
    Path("/usr/bin/google-chrome-stable"),
    Path("/usr/bin/google-chrome"),
    Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
)
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

SLIT_EYES = """
  <rect x="-58" y="-32" width="40" height="8" rx="3" fill="#281D0E" stroke="none"/>
  <rect x="22" y="-28" width="32" height="7" rx="3" fill="#281D0E" stroke="none"/>
"""

MOUTH_CLOSED = """
  <rect x="-22" y="16" width="44" height="8" rx="3" fill="#281D0E" stroke="none"/>
"""

MOUTH_MID = """
  <ellipse cx="0" cy="28" rx="22" ry="16" fill="#281D0E" stroke="none"/>
"""

MOUTH_OPEN = """
  <circle cx="0" cy="30" r="24" fill="#281D0E" stroke="none"/>
"""

ARMS_STILL = """
  <path d="M -210 -10 L -250 95"/>
  <path d="M -250 95 L -300 95"/>
  <path d="M 210 -10 L 250 95"/>
  <path d="M 250 95 L 300 95"/>
"""

ARMS_LISTEN = """
  <path d="M -210 -20 L -250 70"/>
  <path d="M -250 70 L -295 85"/>
  <path d="M -250 70 L -275 115"/>
  <path d="M 210 -10 L 340 40"/>
  <path d="M 340 40 L 385 28"/>
  <path d="M 340 40 L 380 70"/>
"""

ARMS_POINT = """
  <path d="M -210 -20 L -250 80"/>
  <path d="M -250 80 L -300 80"/>
  <path d="M 210 -40 L 390 -30"/>
  <path d="M 390 -30 L 430 -18"/>
  <path d="M 390 -30 L 428 -55"/>
"""

ARMS_REACT = """
  <path d="M -210 -40 L -300 -180"/>
  <path d="M -300 -180 L -345 -165"/>
  <path d="M -300 -180 L -330 -225"/>
  <path d="M 210 -40 L 300 -180"/>
  <path d="M 300 -180 L 345 -165"/>
  <path d="M 300 -180 L 330 -225"/>
"""

ARMS_PRESENT = """
  <path d="M -210 -40 L -280 30"/>
  <path d="M -280 30 L -325 40"/>
  <path d="M -280 30 L -305 75"/>
  <path d="M 210 -20 L 370 -40"/>
  <path d="M 370 -40 L 410 -20"/>
  <path d="M 370 -40 L 415 -70"/>
"""

ARMS_SLUMP = """
  <path d="M -200 10 L -230 130"/>
  <path d="M -230 130 L -270 150"/>
  <path d="M -230 130 L -245 175"/>
  <path d="M 200 10 L 230 130"/>
  <path d="M 230 130 L 270 150"/>
  <path d="M 230 130 L 245 175"/>
"""


def svg_markup(arms: str, extras: str, rotate: float) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{SIZE}" height="{SIZE}" viewBox="-430 -360 860 780">
  <rect width="100%" height="100%" x="-430" y="-360" fill="#FCF2C6"/>
  <g transform="rotate({rotate})" stroke="#281D0E" stroke-width="14" stroke-linejoin="round" stroke-linecap="round" fill="none">
    <g fill="none" stroke="#281D0E" stroke-width="12">
      {arms}
    </g>
    {STONES}
    {extras}
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


def chrome_bin() -> str:
    for path in CHROME_CANDIDATES:
        if path.exists():
            return str(path)
    raise FileNotFoundError("Chrome not found")


def screenshot(html_path: Path, png_path: Path) -> None:
    cmd = [
        chrome_bin(),
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        f"--window-size={SIZE},{SIZE}",
        f"--screenshot={png_path}",
        html_path.as_uri(),
    ]
    subprocess.run(cmd, check=True, capture_output=True)


def write_pose(name: str, arms: str, rotate: float, extras: str) -> Path:
    TMP.mkdir(parents=True, exist_ok=True)
    html_path = TMP / f"{name}.html"
    png_path = OUT / f"{name}.png"
    html_path.write_text(html_wrap(svg_markup(arms, extras, rotate)), encoding="utf-8")
    screenshot(html_path, png_path)
    return png_path


def key_cream(name: str) -> None:
    png = OUT / f"{name}.png"
    keyed = TMP / f"{name}-rgba.png"
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(png),
            "-vf",
            "colorkey=0xFCF2C6:0.08:0.25,format=rgba",
            str(keyed),
        ],
        check=True,
        capture_output=True,
    )
    keyed.replace(png)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)

    frames = {
        "still": (ARMS_STILL, 0, OPEN_EYES + MOUTH_CLOSED),
        "listen": (ARMS_LISTEN, -16, OPEN_EYES + MOUTH_CLOSED),
        "point": (ARMS_POINT, 0, OPEN_EYES + MOUTH_CLOSED),
        "mouth-closed": (ARMS_STILL, 0, OPEN_EYES + MOUTH_CLOSED),
        "mouth-mid": (ARMS_STILL, 0, OPEN_EYES + MOUTH_MID),
        "mouth-open": (ARMS_STILL, 0, OPEN_EYES + MOUTH_OPEN),
        "tue-open": (ARMS_LISTEN, -16, OPEN_EYES + MOUTH_CLOSED),
        "thu-slits": (ARMS_STILL, 0, SLIT_EYES + MOUTH_CLOSED),
        "react": (ARMS_REACT, -4, OPEN_EYES + MOUTH_CLOSED),
        "present": (ARMS_PRESENT, 3, OPEN_EYES + MOUTH_CLOSED),
        "slump": (ARMS_SLUMP, 12, OPEN_EYES + MOUTH_CLOSED),
    }
    for name, (arms, rotate, extras) in frames.items():
        write_pose(name, arms, rotate, extras)
        key_cream(name)
    print("wrote talking kit pngs to", OUT)


if __name__ == "__main__":
    main()
