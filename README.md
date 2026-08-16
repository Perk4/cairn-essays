# cairn-essays

Remotion factory for Cairn essays. Episode 1 is a **story with a spoken track**. Captions support the line. They are not the show. Cairn is the body on camera.

## Voice (placeholder)

Spoken audio in `public/vo/` is **espeak-ng** (`en-us`, 120 wpm). It is a system TTS placeholder.

It is **not Perk**. It is **not a clone**. It is **not a human host**.

See `public/vo/VOICE.md`. Regenerate with `npm run vo` (needs `espeak-ng` and `ffmpeg`).

## Install

```
npm i
```

## Render

```
npm run render
```

Writes:

- `out/ep01.mp4` — 1920×1080 flagship, every scene in `episodes/ep01.json`, placeholder VO + CC0 music bed
- `out/ep01-hook.mp4` — 1080×1920 Short, two beats (Tuesday / Thursday), VO + bed
- `out/ep01-rule.mp4` — 1080×1920 Short, two beats (finish / stone on the pile), VO + bed. Rule uses the **point** pose. Stack is a stone hitting the pile.

Studio: `npm run dev`

## Timing

Each scene has `vo` plus `durationSec` in `episodes/ep01.json` (source of truth). `durationSec` is the spoken line plus a hold so the picture can keep moving. Flagship length is the sum of those holds. ep01 is inside the 8–12 minute week-1 bar.

If `durationSec` is missing, runtime uses spoken/visible words:

```
durationSec = clamp(round(12 + wordCount / 2.2), 16, 72)
```

Shorts are two or more beats. Each beat has its own `durationSec`. Total is clamped to 12–30s. Kickers are on screen from frame 0 so a For You page has a second beat to cut to.

## Pictures

Scenes are rooms. Cairn stands on the floor. Captions support the line.

Cairn uses `public/cairn/still.png`, `listen.png`, and `point.png` until the talking kit lands. See `public/cairn/KIT.md`. Caption scenes do not substitute `idle.gif`. The rule scene uses **point**. A stone leaves the hand and lands on the pile.

The repeatable line is **Hard does not mean you picked the wrong thing. Finish the session anyway.** Study 5 (`2.75 vs 3.59`) and the news-desk **470** are the 120px type. He points at the number that just appeared. Sources sit on screen (APS, CNBC, O’Keefe, Dweck & Walton, 2018), not as a bibliography scene.

## Music

`public/music/bee-hive-pad.mp3` — John Bartmann, _bee-hive-pad-master_, [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Source and license: `public/music/SOURCE.md`.

Looped under the flagship and the Shorts, quiet, under the VO, faded in/out. No commercial track.
