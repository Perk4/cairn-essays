import { getStaticFiles } from "remotion";
import type { Mood, Pose } from "../types";
import envelopes from "../voEnvelopes.json";

export const MOUTH_CLOSED = "cairn/mouth-closed.png";
export const MOUTH_MID = "cairn/mouth-mid.png";
export const MOUTH_OPEN = "cairn/mouth-open.png";
export const TUE_OPEN = "cairn/tue-open.png";
export const THU_SLITS = "cairn/thu-slits.png";

const MOUTH_FILES = [MOUTH_CLOSED, MOUTH_MID, MOUTH_OPEN] as const;

export type Viseme = "closed" | "mid" | "open";

const VOWELS = new Set("aeiouy");

const envelopeMap = envelopes as Record<string, number[]>;

function hasPublicFile(name: string): boolean {
  return getStaticFiles().some((file) => file.name === name);
}

export function talkingKitReady(): { mouth: boolean; tueThu: boolean } {
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

function visemeFromLetters(vo: string, t: number, spokenSec: number): Viseme {
  const words = vo.trim().split(/\s+/);
  if (t < 0 || t >= spokenSec || words.length === 0) {
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
  let cursor = (t / spokenSec) * total;
  for (const beat of beats) {
    cursor -= beat.weight;
    if (cursor <= 0) {
      return beat.viseme;
    }
  }
  return "closed";
}

function envelopeClosed(voName: string | undefined, frame: number): boolean {
  if (!voName) {
    return false;
  }
  const envelope = envelopeMap[voName];
  if (!envelope || envelope.length === 0) {
    return false;
  }
  const peak = Math.max(...envelope, 0.0001);
  const sample =
    envelope[Math.min(Math.max(frame, 0), envelope.length - 1)] ?? 0;
  return sample / peak < 0.16;
}

export function mouthViseme(args: {
  vo?: string;
  voName?: string;
  frame: number;
  fps: number;
  spokenSec?: number;
}): Viseme | null {
  const vo = args.vo?.trim();
  if (!vo || args.fps <= 0) {
    return null;
  }
  if (envelopeClosed(args.voName, args.frame)) {
    return "closed";
  }
  const spokenSec =
    args.spokenSec && args.spokenSec > 0
      ? args.spokenSec
      : (vo.split(/\s+/).length / 165) * 60;
  return visemeFromLetters(vo, args.frame / args.fps, spokenSec);
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

export function resolveCairnFile(
  pose: Pose,
  mood: Mood | undefined,
  viseme: Viseme | null,
): string {
  const kit = talkingKitReady();
  if (pose === "point") {
    return "cairn/point.png";
  }
  if (kit.mouth && viseme && (pose === "still" || pose === "listen")) {
    return mouthFile(viseme);
  }
  if (kit.tueThu && mood === "warm" && hasPublicFile(TUE_OPEN)) {
    return TUE_OPEN;
  }
  if (kit.tueThu && mood === "cold" && hasPublicFile(THU_SLITS)) {
    return THU_SLITS;
  }
  return `cairn/${pose}.png`;
}
