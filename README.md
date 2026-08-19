# cairn-essays

Remotion factory for Cairn essays. Episode 1 is a **story with a spoken track**. Captions support the line. They are not the show. Cairn is the body on camera.

## Voice

Flagship lines use local Apache Kokoro-82M with `am_echo` at speed 1.25. `public/vo/voice.json` owns the model, voice, speed, and 0.45 second sentence gap.

It is **not Perk**. It is **not a clone**. It is **not espeak**. It is **not ElevenLabs**.

See `public/vo/VOICE.md`. Regenerate speech-led lines with `npm run vo`.

## Install

```
npm i
```

## Render

```
npm run render
```

Writes:

- `out/ep01.mp4`. A dry 1920×1080 flagship with Kokoro on every line.
- `out/ep01-hook.mp4`. A dry 1080×1920 Short where Tuesday calling becomes Thursday homework.

The rule Short composition can still render. It is not in this package.

Studio: `npm run dev`. `ep01-thumb` is the authored 16:9 cream thumbnail. Clips are 1080×1920 remounts of the hook and named scenes. Each has a first-frame kicker and runs 20 to 45 seconds.

Description lives on the episode as `description`. It starts with "Cairn explains" and credits the warrant. The end card uses the authored subscribe line.

## Timing

The board at `episodes/ep01.board.md` owns the spoken track. `episodes/ep01.json` owns the render shape and copies each Spoken section without rewrites. Flagship scenes omit `durationSec`. Picture lasts for the VO file plus a 0.8 second settle. The feel window is 8 to 12 minutes.

Shorts are two or more beats. Each beat has its own `durationSec`. Total duration stays between 12 and 30 seconds. Kickers appear on frame 0.

## Pictures

Scenes are rooms. Cairn uses the talking kit in `public/cairn/`: `still`, `listen`, `point`, mouth sheets, `tue-open`, `thu-slits`. No academic Part N title cards. Cairn points at 2.75 vs 3.59. Eggs drop with him in the scene. The stone leaves the hand and lands on a real pile.

## Music

None on the flagship or the Short. Dry.

`public/music/bee-hive-pad.mp3` stays in the tree as a CC0 file. It is not mixed in this cut.
