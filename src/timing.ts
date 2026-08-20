import type { KenBurns, Scene, SceneBeat, SceneBody, ShortBeat } from "./types";
import { KEN_BURNS } from "./types";

export const FPS = 30;

export const FLAGSHIP_WIDTH = 1920;
export const FLAGSHIP_HEIGHT = 1080;
export const SHORT_WIDTH = 1080;
export const SHORT_HEIGHT = 1920;

export const SPEECH_SETTLE_SEC = 0;
export const MAX_HOLD_SEC = 4;
export const FLAGSHIP_MIN_SEC = 180;
export const FLAGSHIP_MAX_SEC = 540;
export const FLAGSHIP_FEEL_SEC = 420;
export const SHORT_MAX_SEC = 30;

export function sceneVisibleText(scene: SceneBody): string {
  return scene.caption || scene.vo;
}

export function wordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((token) => /[0-9A-Za-z\u00C0-\u024F]/.test(token)).length;
}

export function pictureStills(scene: {
  still: string;
  altStill?: string;
  holdStills?: readonly string[];
}): string[] {
  const stills = [scene.still];
  if (scene.altStill && !stills.includes(scene.altStill)) {
    stills.push(scene.altStill);
  }
  for (const extra of scene.holdStills ?? []) {
    if (!stills.includes(extra)) {
      stills.push(extra);
    }
  }
  return stills;
}

export function stillSliceIndex(tSec: number, stillCount: number): number {
  if (stillCount < 1) {
    throw new Error("need at least one still");
  }
  return Math.min(stillCount - 1, Math.floor(Math.max(0, tSec) / MAX_HOLD_SEC));
}

export function kenBurnsForSlice(base: KenBurns, slice: number): KenBurns {
  const offset = KEN_BURNS.indexOf(base);
  const index = ((offset < 0 ? 0 : offset) + slice) % KEN_BURNS.length;
  const next = KEN_BURNS[index];
  if (!next) {
    throw new Error("kenBurns slice is empty");
  }
  return next;
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
  throw new Error(`Scene ${scene.id} is missing durationSec`);
}

export function secondsToFrames(sec: number): number {
  return Math.round(sec * FPS);
}

export function shortBeatsDurationSec(beats: readonly ShortBeat[]): number {
  const total = beats.reduce((sum, beat) => sum + beat.durationSec, 0);
  if (total <= 0) {
    throw new Error("Short beats need a positive duration");
  }
  if (total > SHORT_MAX_SEC) {
    throw new Error(`Short picture ${total}s is over ${SHORT_MAX_SEC}s`);
  }
  return total;
}

export function shortDurationInFrames(beats: readonly ShortBeat[]): number {
  return secondsToFrames(shortBeatsDurationSec(beats));
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
