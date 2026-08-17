import type {
  Episode,
  EpisodeClip,
  Mood,
  Pose,
  Scene,
  SceneBeat,
  SceneBody,
  ShortBeat,
  Visual,
} from "./types";
import { MOODS, POSES, VISUALS } from "./types";
import raw from "../episodes/ep01.json";
import voDurations from "../public/vo/durations.json";
import {
  CLIP_MAX_SEC,
  CLIP_MIN_SEC,
  durationSecFromText,
  FLAGSHIP_MAX_SEC,
  FLAGSHIP_MIN_SEC,
  flagshipDurationSec,
  MIN_SCENE_SEC,
  sceneVisibleText,
  SPEECH_SETTLE_SEC,
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

function requireStringArray(
  record: Record<string, unknown>,
  key: string,
): string[] {
  const value = record[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${key} must be a string array`);
  }
  return value;
}

function isPose(value: unknown): value is Pose {
  return (
    typeof value === "string" && (POSES as readonly string[]).includes(value)
  );
}

function isMood(value: unknown): value is Mood {
  return (
    typeof value === "string" && (MOODS as readonly string[]).includes(value)
  );
}

function isVisual(value: unknown): value is Visual {
  return (
    typeof value === "string" && (VISUALS as readonly string[]).includes(value)
  );
}

function optionalPositiveNumber(
  record: Record<string, unknown>,
  key: string,
): number | undefined {
  if (!(key in record) || record[key] === undefined) {
    return undefined;
  }
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${key} must be a positive number`);
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

function optionalPose(record: Record<string, unknown>): Pose | undefined {
  if (!("pose" in record) || record.pose === undefined) {
    return undefined;
  }
  if (!isPose(record.pose)) {
    throw new Error("pose must be still|listen|point");
  }
  return record.pose;
}

function optionalMood(record: Record<string, unknown>): Mood | undefined {
  if (!("mood" in record) || record.mood === undefined) {
    return undefined;
  }
  if (!isMood(record.mood)) {
    throw new Error("mood must be default|warm|cold");
  }
  return record.mood;
}

function optionalVisual(record: Record<string, unknown>): Visual | undefined {
  if (!("visual" in record) || record.visual === undefined) {
    return undefined;
  }
  if (!isVisual(record.visual)) {
    throw new Error(`Unknown visual: ${String(record.visual)}`);
  }
  return record.visual;
}

function parseBeats(value: unknown): SceneBeat[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new Error("beats must be an array");
  }
  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`beats[${index}] must be an object`);
    }
    const atSec = item.atSec;
    if (typeof atSec !== "number" || !Number.isFinite(atSec) || atSec < 0) {
      throw new Error(`beats[${index}].atSec must be a non-negative number`);
    }
    const beat: SceneBeat = { atSec };
    const pose = optionalPose(item);
    if (pose) {
      beat.pose = pose;
    }
    const caption = optionalString(item, "caption");
    if (caption) {
      beat.caption = caption;
    }
    const mood = optionalMood(item);
    if (mood) {
      beat.mood = mood;
    }
    return beat;
  });
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

function isSpeechLed(record: Record<string, unknown>, id: string): boolean {
  if (!("speechLed" in record) || record.speechLed === undefined) {
    return false;
  }
  if (typeof record.speechLed !== "boolean") {
    throw new Error(`Scene ${id} speechLed must be a boolean`);
  }
  return record.speechLed;
}

function withDuration(
  record: Record<string, unknown>,
  scene: SceneBody,
): Scene {
  if (isSpeechLed(record, scene.id)) {
    if ("durationSec" in record && record.durationSec !== undefined) {
      throw new Error(`Scene ${scene.id} is speech-led; drop durationSec`);
    }
    return {
      ...scene,
      durationSec: speechLedDurationSec(voDurationSec(scene.id)),
    };
  }
  const override = optionalPositiveNumber(record, "durationSec");
  const durationSec =
    override ?? durationSecFromText(scene.vo || sceneVisibleText(scene));
  return { ...scene, durationSec };
}

function parseScene(value: unknown): Scene {
  if (!isRecord(value)) {
    throw new Error("Scene must be an object");
  }

  const type = requireString(value, "type");
  const id = requireString(value, "id");
  const vo = requireString(value, "vo");

  switch (type) {
    case "cairnCaption": {
      const pose = value.pose;
      if (!isPose(pose)) {
        throw new Error(`Scene ${id} needs pose still|listen|point`);
      }
      return withDuration(value, {
        id,
        type,
        pose,
        caption: requireString(value, "caption"),
        vo,
        visual: optionalVisual(value),
        mood: optionalMood(value),
        label: optionalString(value, "label"),
        beats: parseBeats(value.beats),
      });
    }
    case "citeCard":
      return withDuration(value, {
        id,
        type,
        lines: requireStringArray(value, "lines"),
        vo,
        pose: optionalPose(value),
      });
    case "namedFrame":
      return withDuration(value, {
        id,
        type,
        left: requireString(value, "left"),
        right: requireString(value, "right"),
        caption: requireString(value, "caption"),
        vo,
        pose: optionalPose(value),
      });
    case "quoteCard":
      return withDuration(value, {
        id,
        type,
        quote: requireString(value, "quote"),
        attr: requireString(value, "attr"),
        caption: optionalString(value, "caption"),
        vo,
        pose: optionalPose(value),
      });
    case "numberCard":
      return withDuration(value, {
        id,
        type,
        kicker: requireString(value, "kicker"),
        stat: requireString(value, "stat"),
        note: requireString(value, "note"),
        footnote: optionalString(value, "footnote"),
        leftLabel: optionalString(value, "leftLabel"),
        rightLabel: optionalString(value, "rightLabel"),
        vo,
        pose: optionalPose(value),
      });
    case "limitsCard":
      return withDuration(value, {
        id,
        type,
        items: requireStringArray(value, "items"),
        vo,
        pose: optionalPose(value),
      });
    case "endCard":
      return withDuration(value, {
        id,
        type,
        title: requireString(value, "title"),
        cite: requireString(value, "cite"),
        cta: requireString(value, "cta"),
        footnote: optionalString(value, "footnote"),
        vo,
        pose: optionalPose(value),
      });
    default: {
      throw new Error(`Unknown scene type: ${type}`);
    }
  }
}

function parseShortBeat(value: unknown, index: string): ShortBeat {
  if (!isRecord(value)) {
    throw new Error(`Short beat ${index} must be an object`);
  }
  const pose = value.pose;
  if (!isPose(pose)) {
    throw new Error(`Short beat ${index} needs pose still|listen|point`);
  }
  const mood = value.mood;
  if (!isMood(mood)) {
    throw new Error(`Short beat ${index} needs mood default|warm|cold`);
  }
  const durationSec = optionalPositiveNumber(value, "durationSec");
  if (!durationSec) {
    throw new Error(`Short beat ${index} needs durationSec`);
  }
  return {
    id: requireString(value, "id"),
    pose,
    kicker: requireString(value, "kicker"),
    caption: requireString(value, "caption"),
    mood,
    vo: requireString(value, "vo"),
    durationSec,
    visual: optionalVisual(value),
  };
}

function requireNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${key} must be a number`);
  }
  return value;
}

function parseClip(value: unknown, index: string): EpisodeClip {
  if (!isRecord(value)) {
    throw new Error(`Clip ${index} must be an object`);
  }
  const startSec = requireNumber(value, "startSec");
  const endSec = requireNumber(value, "endSec");
  if (endSec <= startSec) {
    throw new Error(`Clip ${index} endSec must be after startSec`);
  }
  const picture = endSec - startSec + SPEECH_SETTLE_SEC;
  if (picture < CLIP_MIN_SEC || picture > CLIP_MAX_SEC) {
    throw new Error(
      `Clip ${index} picture ${picture.toFixed(2)}s is outside ${CLIP_MIN_SEC}–${CLIP_MAX_SEC}`,
    );
  }
  return {
    id: requireString(value, "id"),
    sceneId: requireString(value, "sceneId"),
    kicker: requireString(value, "kicker"),
    startSec,
    endSec,
  };
}

function parseClips(value: unknown, scenes: readonly Scene[]): EpisodeClip[] {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error("clips must be an array");
  }
  return value.map((item, i) => {
    const clip = parseClip(item, `[${i}]`);
    if (!scenes.some((scene) => scene.id === clip.sceneId)) {
      throw new Error(`Clip ${clip.id} points at missing scene ${clip.sceneId}`);
    }
    return clip;
  });
}

function parseShorts(value: unknown): Episode["shorts"] {
  if (!isRecord(value)) {
    throw new Error("shorts must be an object");
  }
  if (!Array.isArray(value.hook) || value.hook.length < 2) {
    throw new Error("shorts.hook needs at least two beats");
  }
  if (!Array.isArray(value.rule) || value.rule.length < 2) {
    throw new Error("shorts.rule needs at least two beats");
  }
  return {
    hook: value.hook.map((beat, i) => parseShortBeat(beat, `hook[${i}]`)),
    rule: value.rule.map((beat, i) => parseShortBeat(beat, `rule[${i}]`)),
  };
}

function parseEpisode(value: unknown): Episode {
  if (!isRecord(value)) {
    throw new Error("Episode JSON must be an object");
  }

  if (!isRecord(value.paper)) {
    throw new Error("paper must be an object");
  }
  if (!isRecord(value.palette)) {
    throw new Error("palette must be an object");
  }
  if (!Array.isArray(value.scenes)) {
    throw new Error("scenes must be an array");
  }

  const year = value.paper.year;
  if (typeof year !== "number") {
    throw new Error("paper.year must be a number");
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
    paper: {
      authors: requireString(value.paper, "authors"),
      year,
      journal: requireString(value.paper, "journal"),
      citation: requireString(value.paper, "citation"),
      doi: requireString(value.paper, "doi"),
      title: requireString(value.paper, "title"),
    },
    thesis: requireString(value, "thesis"),
    rule: requireString(value, "rule"),
    voice: requireString(value, "voice"),
    voiceLabel: requireString(value, "voiceLabel"),
    description: requireString(value, "description"),
    thumbLine: requireString(value, "thumbLine"),
    palette: {
      cream: requireString(value.palette, "cream"),
      terracotta: requireString(value.palette, "terracotta"),
      olive: requireString(value.palette, "olive"),
      stone: requireString(value.palette, "stone"),
      outline: requireString(value.palette, "outline"),
    },
    shorts: parseShorts(value.shorts),
    scenes,
    clips: parseClips(value.clips, scenes),
  };
}

export const episode = parseEpisode(raw);

const flagshipSec = flagshipDurationSec(episode.scenes);
if (flagshipSec < FLAGSHIP_MIN_SEC || flagshipSec > FLAGSHIP_MAX_SEC) {
  throw new Error(
    `Flagship duration ${flagshipSec}s is outside the feel window (${FLAGSHIP_MIN_SEC}–${FLAGSHIP_MAX_SEC})`,
  );
}

const shortLineSec = speechLedDurationSec(3);
if (shortLineSec !== 3.8 || shortLineSec >= MIN_SCENE_SEC) {
  throw new Error(
    `speech-led 3s line is ${shortLineSec}s; it must be 3.8s and under ${MIN_SCENE_SEC}s`,
  );
}

const hook = episode.scenes.find((scene) => scene.id === "hook");
if (!hook) {
  throw new Error("ep01 is missing the hook scene");
}
const hookVoSec = voDurationSec("hook");
const hookSettle = hook.durationSec - hookVoSec;
if (hookSettle < 0 || hookSettle > SPEECH_SETTLE_SEC + 1e-9) {
  throw new Error(
    `hook settle ${hookSettle}s must be 0–${SPEECH_SETTLE_SEC}s over the spoken line`,
  );
}

export function sceneById(id: string): Scene {
  const scene = episode.scenes.find((item) => item.id === id);
  if (!scene) {
    throw new Error(`No scene ${id}`);
  }
  return scene;
}

export function poseForScene(scene: Scene): Pose {
  if ("pose" in scene && scene.pose) {
    return scene.pose;
  }
  return "still";
}
