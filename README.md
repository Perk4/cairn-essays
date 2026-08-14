# cairn-essays

Remotion factory for Cairn essays. Captions are the prose. No spoken VO.

## Install

```
npm i
```

## Render

```
npm run render
```

Writes:

- `out/ep01.mp4` — 1920×1080 flagship, every scene in `episodes/ep01.json`, music bed
- `out/ep01-hook.mp4` — 1080×1920 Short, hook caption (no bed)
- `out/ep01-rule.mp4` — 1080×1920 Short, rule caption (no bed)

Studio: `npm run dev`

## Timing

Each scene has `durationSec` in `episodes/ep01.json` (source of truth). Flagship length is the sum of those holds. ep01 is **590 seconds (9:50)** — inside the 8–12 minute week-1 bar.

If `durationSec` is missing, runtime uses the same function:

```
durationSec = clamp(round(24 + wordCount), 28, 72)
```

`wordCount` is whitespace tokens of the visible text (caption / quote / lines / note+stat / items / title+cta). Longer quotes and limits get more time; short cairn captions less. Not a flat 8s, not a 2-minute stretch-read.

Shorts use that scene’s `durationSec`, clamped to 12–25s.

## Music

`public/music/bee-hive-pad.mp3` — John Bartmann, _bee-hive-pad-master_, [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Source and license: `public/music/SOURCE.md`.

Looped under the flagship, quiet, ducked further under cards, faded in/out. Omitted on Shorts. No VO.

Cairn art lives in `public/cairn/`. Caption scenes loop `idle.gif` when that file is present, and fall back to `still.png` / `listen.png` / `point.png` from the scene `pose` field.
