import { getStaticFiles } from "remotion";
import type { Mood, Pose } from "../types";

export const MOUTH_CLOSED = "cairn/mouth-closed.png";
export const MOUTH_MID = "cairn/mouth-mid.png";
export const MOUTH_OPEN = "cairn/mouth-open.png";
export const TUE_OPEN = "cairn/tue-open.png";
export const THU_SLITS = "cairn/thu-slits.png";

const MOUTH_FILES = [MOUTH_CLOSED, MOUTH_MID, MOUTH_OPEN] as const;

/** Same rate as the placeholder espeak track. */
export const VO_WPM = 120;

export type Viseme = "closed" | "mid" | "open";

const VOWELS = new Set("aeiouy");

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

function letterViseme(ch: string): Viseme {
  const lower = ch.toLowerCase();
  if (!/[a-z]/.test(lower)) {
    return "closed";
  }
  if (VOWELS.has(lower)) {
    return "open";
  }
  return "mid";
}

/**
 * Open on vowels, mid on consonants, closed on holds / silence.
 * Driven from the spoken line at 120 wpm — not a blink sine.
 */
export function mouthViseme(
  vo: string | undefined,
  frame: number,
  fps: number,
): Viseme | null {
  if (!vo || vo.trim().length === 0 || fps <= 0) {
    return null;
  }
  const words = vo.trim().split(/\s+/);
  const spokenSec = (words.length / VO_WPM) * 60;
  const t = frame / fps;
  if (t < 0 || t >= spokenSec) {
    return "closed";
  }

  const beats: { viseme: Viseme; weight: number }[] = [];
  for (const word of words) {
    for (const ch of word) {
      beats.push({ viseme: letterViseme(ch), weight: 1 });
    }
    beats.push({ viseme: "closed", weight: 0.45 });
  }
  const total = beats.reduce((sum, beat) => sum + beat.weight, 0);
  if (total <= 0) {
    return "closed";
  }
  let cursor = (t / spokenSec) * total;
  for (const beat of beats) {
    cursor -= beat.weight;
    if (cursor <= 0) {
      return beat.viseme;
    }
  }
  return "closed";
}

function mouthFile(viseme: Viseme): string {
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

/**
 * Tuesday/Thursday are whole-body files. Mouth sheets are the still body.
 * Point keeps its own PNG. Listen talks with the mouth sheets plus a lean
 * so lean-in and the VO can both exist without a 4-and-8 hang.
 */
export function resolveCairnFile(
  pose: Pose,
  mood: Mood | undefined,
  viseme: Viseme | null,
): string {
  const kit = talkingKitReady();
  if (kit.tueThu && mood === "warm" && hasPublicFile(TUE_OPEN)) {
    return TUE_OPEN;
  }
  if (kit.tueThu && mood === "cold" && hasPublicFile(THU_SLITS)) {
    return THU_SLITS;
  }

  if (pose === "point") {
    return `cairn/${pose}.png`;
  }

  if (kit.mouth && viseme && (pose === "still" || pose === "listen")) {
    return mouthFile(viseme);
  }

  return `cairn/${pose}.png`;
}
