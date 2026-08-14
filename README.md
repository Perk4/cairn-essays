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

- `out/ep01.mp4` — 1920×1080, every scene in `episodes/ep01.json`
- `out/ep01-hook.mp4` — 1080×1920 Short, hook caption
- `out/ep01-rule.mp4` — 1080×1920 Short, rule caption

Studio: `npm run dev`

Each flagship scene is 8 seconds (`SCENE_DURATION_SEC` in `src/timing.ts`). `durationTargetSec` in the JSON stays 540. A full 9-minute encode is too heavy for this pass.

Cairn art lives in `public/cairn/`. Caption scenes loop `idle.gif` when that file is present, and fall back to `still.png` / `listen.png` / `point.png` from the scene `pose` field.
