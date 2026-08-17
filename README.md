# cairn-essays

Remotion factory for Cairn essays. Episode 1 is a **story with a spoken track**. Captions support the line. They are not the show. Cairn is the body on camera.

## Voice

The hook and Part 1 are **Qwen3-TTS CustomVoice / Ryan** through mlx-audio, near 165 wpm. Later lines still use the espeak-ng placeholder.

It is **not Perk**. It is **not a clone**. It is **not macOS say**.

See `public/vo/VOICE.md`. Regenerate speech-led lines with `npm run vo` (needs the local venv and `ffmpeg`).

## Install

```
npm i
```

## Render

```
npm run render
```

Writes:

- `out/ep01.mp4` — 1920×1080 flagship, every scene in `episodes/ep01.json`, Ryan on the hook and Part 1, espeak on the rest, plus the CC0 music bed
- `out/ep01-hook.mp4` — 1080×1920 Short, two beats (calling / homework), VO + bed
- `out/ep01-rule.mp4` — 1080×1920 Short, two beats (finish / stone on the pile), VO + bed. Rule uses the **point** pose.

Studio: `npm run dev`. `ep01-clip-part1` is a 1080×1920 remount of flagship Part 1. Same Ryan take. First-frame kicker. Picture is clamped to 20–45s.

## Timing

Episode timing lives in `episodes/ep01.json`. Most scenes set `durationSec` as the spoken line plus a hold. Speech-led scenes (the hook and Part 1) omit `durationSec`. Their picture lasts the VO file plus 0.8s settle and skips the 16–72s clamp. A Clip remounts one of those takes at 9:16 and clamps picture to 20–45s. Flagship length is the sum of those scene lengths. ep01 is inside the 8–12 minute week-1 bar.

If `durationSec` is missing and the scene is not speech-led, runtime uses spoken/visible words:

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
