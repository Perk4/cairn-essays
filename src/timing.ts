import type { Scene, SceneBody } from "./types";

export const FPS = 30;

export const FLAGSHIP_WIDTH = 1920;
export const FLAGSHIP_HEIGHT = 1080;
export const SHORT_WIDTH = 1080;
export const SHORT_HEIGHT = 1920;

/** Essay hold, not a caption speed-read. One extra second per visible word. */
export const ESSAY_BASE_HOLD_SEC = 24;
export const MIN_SCENE_SEC = 28;
export const MAX_SCENE_SEC = 72;
export const FLAGSHIP_MIN_SEC = 480;
export const FLAGSHIP_MAX_SEC = 720;
export const SHORT_MIN_SEC = 12;
export const SHORT_MAX_SEC = 25;

export function sceneVisibleText(scene: SceneBody): string {
  switch (scene.type) {
    case "cairnCaption":
      return scene.caption;
    case "citeCard":
      return scene.lines.join(" ");
    case "namedFrame":
      return `${scene.left} ${scene.right} ${scene.caption}`;
    case "quoteCard":
      return `${scene.quote} ${scene.attr}`;
    case "numberCard":
      return `${scene.kicker} ${scene.stat} ${scene.note}`;
    case "limitsCard":
      return scene.items.join(" ");
    case "endCard":
      return `${scene.title} ${scene.cite} ${scene.cta}`;
    default: {
      const exhaustive: never = scene;
      return exhaustive;
    }
  }
}

export function wordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((token) => /[0-9A-Za-z\u00C0-\u024F]/.test(token)).length;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Per-scene essay duration from on-screen text. Override in JSON wins. */
export function durationSecFromText(text: string): number {
  return clamp(
    Math.round(ESSAY_BASE_HOLD_SEC + wordCount(text)),
    MIN_SCENE_SEC,
    MAX_SCENE_SEC,
  );
}

export function durationSecForScene(scene: Scene): number {
  if (Number.isFinite(scene.durationSec) && scene.durationSec > 0) {
    return scene.durationSec;
  }
  return durationSecFromText(sceneVisibleText(scene));
}

export function secondsToFrames(sec: number): number {
  return Math.round(sec * FPS);
}

export function shortDurationSec(scene: Scene): number {
  return clamp(durationSecForScene(scene), SHORT_MIN_SEC, SHORT_MAX_SEC);
}

export function shortDurationInFrames(scene: Scene): number {
  return secondsToFrames(shortDurationSec(scene));
}

export type SceneFrameRange = {
  id: string;
  from: number;
  durationInFrames: number;
};

export function sceneFrameRanges(scenes: readonly Scene[]): SceneFrameRange[] {
  const ranges: SceneFrameRange[] = [];
  let from = 0;
  for (const scene of scenes) {
    const durationInFrames = secondsToFrames(durationSecForScene(scene));
    ranges.push({ id: scene.id, from, durationInFrames });
    from += durationInFrames;
  }
  return ranges;
}

export function flagshipDurationInFrames(scenes: readonly Scene[]): number {
  return sceneFrameRanges(scenes).reduce(
    (sum, range) => sum + range.durationInFrames,
    0,
  );
}

export function flagshipDurationSec(scenes: readonly Scene[]): number {
  return scenes.reduce((sum, scene) => sum + durationSecForScene(scene), 0);
}
