import type {
  BeatId,
  Episode,
  KenBurns,
  Scene,
  SceneBody,
  ShortBeat,
} from "./types";
import { BEATS, KEN_BURNS } from "./types";
import raw from "../episodes/ep01.json";
import voDurations from "../public/vo/durations.json";
import {
  FLAGSHIP_MAX_SEC,
  FLAGSHIP_MIN_SEC,
  MAX_HOLD_SEC,
  flagshipDurationSec,
  pictureStills,
  speechLedDurationSec,
} from "./timing";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function requireString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string") {
    throw new Error(`${key} must be a string`);
  }
  return value;
}

function optionalString(
  record: Record<string, unknown>,
  key: string,
): string | undefined {
  if (!(key in record) || record[key] === undefined) {
    return undefined;
  }
  return requireString(record, key);
}

function isBeat(value: unknown): value is BeatId {
  return typeof value === "string" && (BEATS as readonly string[]).includes(value);
}

function isKenBurns(value: unknown): value is KenBurns {
  return (
    typeof value === "string" && (KEN_BURNS as readonly string[]).includes(value)
  );
}

function voDurationSec(id: string): number {
  if (!(id in voDurations)) {
    throw new Error(`Missing VO duration for ${id}`);
  }
  const sec = voDurations[id as keyof typeof voDurations];
  if (typeof sec !== "number" || !Number.isFinite(sec) || sec <= 0) {
    throw new Error(`VO duration for ${id} must be a positive number`);
  }
  return sec;
}

function withDuration(scene: SceneBody): Scene {
  return {
    ...scene,
    durationSec: speechLedDurationSec(voDurationSec(scene.id)),
  };
}

function optionalStringArray(
  record: Record<string, unknown>,
  key: string,
): string[] | undefined {
  if (!(key in record) || record[key] === undefined) {
    return undefined;
  }
  const value = record[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${key} must be an array of strings`);
  }
  return value;
}

function parseScene(value: unknown): Scene {
  if (!isRecord(value)) {
    throw new Error("Scene must be an object");
  }
  const type = requireString(value, "type");
  if (type !== "stillShot") {
    throw new Error(`Unknown scene type: ${type}`);
  }
  const id = requireString(value, "id");
  const beat = value.beat;
  if (!isBeat(beat)) {
    throw new Error(`Scene ${id} needs beat ${BEATS.join("|")}`);
  }
  const kenBurns = value.kenBurns;
  if (!isKenBurns(kenBurns)) {
    throw new Error(`Scene ${id} needs kenBurns ${KEN_BURNS.join("|")}`);
  }
  if ("durationSec" in value && value.durationSec !== undefined) {
    throw new Error(`Scene ${id} is speech-led; drop durationSec`);
  }
  return withDuration({
    id,
    type: "stillShot",
    still: requireString(value, "still"),
    altStill: optionalString(value, "altStill"),
    holdStills: optionalStringArray(value, "holdStills"),
    vo: requireString(value, "vo"),
    caption: requireString(value, "caption"),
    beat,
    kenBurns,
  });
}

function parseShortBeat(value: unknown, index: string): ShortBeat {
  if (!isRecord(value)) {
    throw new Error(`Short beat ${index} must be an object`);
  }
  const id = requireString(value, "id");
  const voId = `short-hook-${id}`;
  return {
    id,
    still: requireString(value, "still"),
    altStill: optionalString(value, "altStill"),
    holdStills: optionalStringArray(value, "holdStills"),
    vo: requireString(value, "vo"),
    caption: requireString(value, "caption"),
    durationSec: speechLedDurationSec(voDurationSec(voId)),
  };
}

function parseEpisode(value: unknown): Episode {
  if (!isRecord(value)) {
    throw new Error("Episode JSON must be an object");
  }
  if (!isRecord(value.palette)) {
    throw new Error("palette must be an object");
  }
  if (!Array.isArray(value.scenes)) {
    throw new Error("scenes must be an array");
  }
  if (!isRecord(value.shorts) || !Array.isArray(value.shorts.hook)) {
    throw new Error("shorts.hook must be an array");
  }
  if (value.shorts.hook.length < 2) {
    throw new Error("shorts.hook needs at least two beats");
  }
  const durationTargetSec = value.durationTargetSec;
  if (typeof durationTargetSec !== "number") {
    throw new Error("durationTargetSec must be a number");
  }
  const scenes = value.scenes.map(parseScene);
  return {
    id: requireString(value, "id"),
    slug: requireString(value, "slug"),
    title: requireString(value, "title"),
    durationTargetSec,
    thesis: requireString(value, "thesis"),
    voice: requireString(value, "voice"),
    voiceLabel: requireString(value, "voiceLabel"),
    description: requireString(value, "description"),
    thumbLine: requireString(value, "thumbLine"),
    thumbStill: requireString(value, "thumbStill"),
    palette: {
      cream: requireString(value.palette, "cream"),
      terracotta: requireString(value.palette, "terracotta"),
      olive: requireString(value.palette, "olive"),
      stone: requireString(value.palette, "stone"),
      outline: requireString(value.palette, "outline"),
    },
    shorts: {
      hook: value.shorts.hook.map((beat, i) => parseShortBeat(beat, `hook[${i}]`)),
    },
    scenes,
  };
}

export const episode = parseEpisode(raw);

const flagshipSec = flagshipDurationSec(episode.scenes);
if (flagshipSec < FLAGSHIP_MIN_SEC || flagshipSec > FLAGSHIP_MAX_SEC) {
  throw new Error(
    `Flagship duration ${flagshipSec}s is outside the feel window (${FLAGSHIP_MIN_SEC}–${FLAGSHIP_MAX_SEC})`,
  );
}

for (const scene of episode.scenes) {
  const stills = pictureStills(scene);
  if (scene.durationSec > stills.length * MAX_HOLD_SEC + 1e-6) {
    throw new Error(
      `Scene ${scene.id} holds ${scene.durationSec.toFixed(2)}s with ${stills.length} pictures`,
    );
  }
}

for (const beat of episode.shorts.hook) {
  const stills = pictureStills(beat);
  if (beat.durationSec > stills.length * MAX_HOLD_SEC + 1e-6) {
    throw new Error(
      `Short beat ${beat.id} holds ${beat.durationSec.toFixed(2)}s with ${stills.length} pictures`,
    );
  }
}

const lockedCta =
  "If this week's takeaway stuck, subscribe. Next one lands same time.";
const cta = episode.scenes.find((scene) => scene.id === "cta");
if (!cta || cta.vo !== lockedCta) {
  throw new Error("CTA VO must be the locked line");
}

export function sceneById(id: string): Scene {
  const scene = episode.scenes.find((item) => item.id === id);
  if (!scene) {
    throw new Error(`No scene ${id}`);
  }
  return scene;
}
