# cairn-essays

Remotion factory for Cairn essays. Episode 1 is a **story with a spoken track**. Captions support the line. They are not the show. Cairn is the body on camera.

## Voice

The hook line is **Qwen3-TTS CustomVoice / Ryan** through mlx-audio, near 165 wpm. Other lines still use the espeak-ng placeholder.

It is **not Perk**. It is **not a clone**. It is **not macOS say**.

See `public/vo/VOICE.md`. Regenerate the hook with `npm run vo` (needs the local venv and `ffmpeg`).

## Install

```
npm i
```

## Render

```
npm run render
```

Writes:

- `out/ep01.mp4` — 1920×1080 flagship, every scene in `episodes/ep01.json`, Ryan on the hook, espeak on the rest, plus the CC0 music bed
- `out/ep01-hook.mp4` — 1080×1920 Short, two beats (calling / homework), VO + bed
- `out/ep01-rule.mp4` — 1080×1920 Short, two beats (finish / stone on the pile), VO + bed. Rule uses the **point** pose.

Studio: `npm run dev`

## Timing

Each scene has `vo` plus `durationSec` in `episodes/ep01.json` (source of truth). `durationSec` is the spoken line plus a hold so the picture can keep moving. Flagship length is the sum of those holds. ep01 is inside the 8–12 minute week-1 bar.

If `durationSec` is missing, runtime uses spoken/visible words:

```
durationSec = clamp(round(12 + wordCount / 2.2), 16, 72)
```

Shorts are two or more beats. Each beat has its own `durationSec`. Total is clamped to 12–30s. Kickers are on screen from frame 0 so a For You page has a second beat to cut to.

## Pictures

Scenes are rooms, not cream cards that fade and freeze. Cairn uses `public/cairn/still.png`, `listen.png`, and `point.png`. Caption scenes do not substitute `idle.gif` for the named pose. The rule scene uses **point**.

Study 3 (`2.04 vs 2.64`) and Study 5 (`2.75 vs 3.59`) are the 120px type. Sample size and Mage are footnotes.

## Music

`public/music/bee-hive-pad.mp3` — John Bartmann, _bee-hive-pad-master_, [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Source and license: `public/music/SOURCE.md`.

Looped under the flagship and the Shorts, quiet, under the VO, faded in/out. No commercial track.
