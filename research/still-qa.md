# Still QA against `origin/main` `07ce744`

Rendered 2026-08-14 from `/tmp/cairn-main` with `@remotion/cli` 4.0.512.

```
npx remotion still src/index.ts ep01 research/stills/flagship-hook.png --frame=90 --gl=angle
npx remotion still src/index.ts ep01 research/stills/flagship-namedFrame.png --frame=780 --gl=angle
npx remotion still src/index.ts ep01 research/stills/flagship-numberCard.png --frame=1260 --gl=angle
npx remotion still src/index.ts ep01-hook research/stills/short-hook.png --frame=180 --gl=angle
npx remotion still src/index.ts ep01-rule research/stills/short-rule.png --frame=180 --gl=angle
```

Compositions: `ep01` 1920×1080 3600 frames (120s). `ep01-hook` and `ep01-rule` 1080×1920 360 frames (12s).

## What the frames show

- Flagship hook is a `cairnCaption`. Cairn left, caption right, `CAIRN` kicker. Palette matches the lock.
- Named frame is FIND / DEVELOP cards plus the caption. Generated CSS cards, not drawn stills.
- Number card is `N = 126 · 141` with the Studies 1 & 2 kicker.
- Shorts reflow to a column. Hook and rule captions both render.

## What they also show

JSON `pose: "point"` on the rule scene does not appear. `CairnSlot` prefers `idle.gif` whenever `live` is set, so still / listen / point PNGs are unused on caption scenes. The rule Short looks like the hook pose.

`durationTargetSec` 540 in `episodes/ep01.json` is unused. Each flagship scene is 8 seconds in `src/timing.ts`.

Kit PNGs are Chrome-rasterized SVG from `scripts/make-cairn-kit.py`, not a drawn puppet.

No audio. `scripts/render.mjs` passes `--muted`.
