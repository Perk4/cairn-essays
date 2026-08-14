export const FPS = 30;

/** Seconds each flagship scene holds. JSON `durationTargetSec` stays 540. */
export const SCENE_DURATION_SEC = 8;

export const SHORT_DURATION_SEC = 12;

export const FLAGSHIP_WIDTH = 1920;
export const FLAGSHIP_HEIGHT = 1080;
export const SHORT_WIDTH = 1080;
export const SHORT_HEIGHT = 1920;

export const sceneDurationInFrames = SCENE_DURATION_SEC * FPS;
export const shortDurationInFrames = SHORT_DURATION_SEC * FPS;

export function flagshipDurationInFrames(sceneCount: number): number {
  return sceneCount * sceneDurationInFrames;
}
