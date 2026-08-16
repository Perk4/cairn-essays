import { getStaticFiles } from "remotion";
import type { Mood, Pose } from "../types";

/**
 * Talking kit filenames. Design is still drawing these.
 * Drop them in public/cairn/ on this same branch; do not invent mouths
 * from still/listen/point. Visemes stay unwired until the PNGs exist.
 */
export const MOUTH_CLOSED = "cairn/mouth-closed.png";
export const MOUTH_MID = "cairn/mouth-mid.png";
export const MOUTH_OPEN = "cairn/mouth-open.png";
export const TUE_OPEN = "cairn/tue-open.png";
export const THU_SLITS = "cairn/thu-slits.png";

const MOUTH_FILES = [MOUTH_CLOSED, MOUTH_MID, MOUTH_OPEN] as const;

function hasPublicFile(name: string): boolean {
  return getStaticFiles().some((file) => file.name === name);
}

export function talkingKitReady(): {
  mouth: boolean;
  tueThu: boolean;
} {
  return {
    mouth: MOUTH_FILES.every((name) => hasPublicFile(name)),
    tueThu: hasPublicFile(TUE_OPEN) && hasPublicFile(THU_SLITS),
  };
}

/**
 * Follow-up: open on vowels, shut on holds, from the spoken track.
 * Returns null this pass so the current stamps do not blink.
 */
export function mouthViseme(): "closed" | "mid" | "open" | null {
  return null;
}

export function resolveCairnFile(pose: Pose, mood?: Mood): string {
  const kit = talkingKitReady();
  if (kit.tueThu && mood === "warm" && hasPublicFile(TUE_OPEN)) {
    return TUE_OPEN;
  }
  if (kit.tueThu && mood === "cold" && hasPublicFile(THU_SLITS)) {
    return THU_SLITS;
  }

  const viseme = mouthViseme();
  if (kit.mouth && viseme) {
    switch (viseme) {
      case "closed":
        return MOUTH_CLOSED;
      case "mid":
        return MOUTH_MID;
      case "open":
        return MOUTH_OPEN;
      default: {
        const exhaustive: never = viseme;
        return exhaustive;
      }
    }
  }

  return `cairn/${pose}.png`;
}
