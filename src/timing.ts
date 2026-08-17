import type { Scene, SceneBeat, SceneBody, ShortBeat } from "./types";

export const FPS = 30;

export const FLAGSHIP_WIDTH = 1920;
export const FLAGSHIP_HEIGHT = 1080;
export const SHORT_WIDTH = 1080;
export const SHORT_HEIGHT = 1920;

export const ESSAY_BASE_HOLD_SEC = 12;
export const MIN_SCENE_SEC = 16;
export const MAX_SCENE_SEC = 72;
export const SPEECH_SETTLE_SEC = 0.8;
export const FLAGSHIP_MIN_SEC = 400;
export const FLAGSHIP_MAX_SEC = 540;
export const FLAGSHIP_FEEL_SEC = 450;
export const SHORT_MIN_SEC = 12;
export const SHORT_MAX_SEC = 30;
export const CLIP_MIN_SEC = 20;
export const CLIP_MAX_SEC = 45;

export function sceneVisibleText(scene: SceneBody): string {
  switch (scene.type) {
    case "cairnCaption":
      return scene.caption;
    case "citeCard":
      return scene.lines.join(" ");
    case "namedFrame":
      return `${scene.left} ${scene.right} ${scene.caption}`;
    case "quoteCard":
      return `${scene.caption ?? scene.quote} ${scene.attr}`;
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

/** Fallback if durationSec is missing: spoken words plus a short hold. */
export function durationSecFromText(text: string): number {
  return clamp(
    Math.round(ESSAY_BASE_HOLD_SEC + wordCount(text) / 2.2),
    MIN_SCENE_SEC,
    MAX_SCENE_SEC,
  );
}

export function speechLedDurationSec(voSec: number): number {
  if (!Number.isFinite(voSec) || voSec <= 0) {
    throw new Error("speech-led VO duration must be a positive number");
  }
  return voSec + SPEECH_SETTLE_SEC;
}

export function durationSecForScene(scene: Scene): number {
  if (Number.isFinite(scene.durationSec) && scene.durationSec > 0) {
    return scene.durationSec;
  }
  return durationSecFromText(scene.vo || sceneVisibleText(scene));
}

export function secondsToFrames(sec: number): number {
  return Math.round(sec * FPS);
}

export function shortBeatsDurationSec(beats: readonly ShortBeat[]): number {
  const total = beats.reduce((sum, beat) => sum + beat.durationSec, 0);
  return clamp(total, SHORT_MIN_SEC, SHORT_MAX_SEC);
}

export function shortDurationInFrames(beats: readonly ShortBeat[]): number {
  return secondsToFrames(shortBeatsDurationSec(beats));
}

export function clipSpokenSec(clip: { startSec: number; endSec: number }): number {
  return clip.endSec - clip.startSec;
}

export function clipDurationSec(clip: { startSec: number; endSec: number }): number {
  return clipSpokenSec(clip) + SPEECH_SETTLE_SEC;
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

export function activeBeat(
  beats: readonly SceneBeat[] | undefined,
  frame: number,
  fps: number,
): SceneBeat | undefined {
  if (!beats || beats.length === 0) {
    return undefined;
  }
  const t = frame / fps;
  let current = beats[0];
  for (const beat of beats) {
    if (t >= beat.atSec) {
      current = beat;
    }
  }
  return current;
}
