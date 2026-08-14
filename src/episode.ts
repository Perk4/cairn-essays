import type { Episode, Pose, Scene, SceneBody } from "./types";
import { POSES } from "./types";
import raw from "../episodes/ep01.json";
import {
  durationSecFromText,
  FLAGSHIP_MAX_SEC,
  FLAGSHIP_MIN_SEC,
  flagshipDurationSec,
  sceneVisibleText,
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

function withDuration(
  record: Record<string, unknown>,
  scene: SceneBody,
): Scene {
  const override = optionalPositiveNumber(record, "durationSec");
  const durationSec = override ?? durationSecFromText(sceneVisibleText(scene));
  return { ...scene, durationSec };
}

function parseScene(value: unknown): Scene {
  if (!isRecord(value)) {
    throw new Error("Scene must be an object");
  }

  const type = requireString(value, "type");
  const id = requireString(value, "id");

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
      });
    }
    case "citeCard":
      return withDuration(value, {
        id,
        type,
        lines: requireStringArray(value, "lines"),
      });
    case "namedFrame":
      return withDuration(value, {
        id,
        type,
        left: requireString(value, "left"),
        right: requireString(value, "right"),
        caption: requireString(value, "caption"),
      });
    case "quoteCard":
      return withDuration(value, {
        id,
        type,
        quote: requireString(value, "quote"),
        attr: requireString(value, "attr"),
      });
    case "numberCard":
      return withDuration(value, {
        id,
        type,
        kicker: requireString(value, "kicker"),
        stat: requireString(value, "stat"),
        note: requireString(value, "note"),
      });
    case "limitsCard":
      return withDuration(value, {
        id,
        type,
        items: requireStringArray(value, "items"),
      });
    case "endCard":
      return withDuration(value, {
        id,
        type,
        title: requireString(value, "title"),
        cite: requireString(value, "cite"),
        cta: requireString(value, "cta"),
      });
    default: {
      throw new Error(`Unknown scene type: ${type}`);
    }
  }
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
    palette: {
      cream: requireString(value.palette, "cream"),
      terracotta: requireString(value.palette, "terracotta"),
      olive: requireString(value.palette, "olive"),
      stone: requireString(value.palette, "stone"),
      outline: requireString(value.palette, "outline"),
    },
    scenes: value.scenes.map(parseScene),
  };
}

export const episode = parseEpisode(raw);

const flagshipSec = flagshipDurationSec(episode.scenes);
if (flagshipSec < FLAGSHIP_MIN_SEC || flagshipSec > FLAGSHIP_MAX_SEC) {
  throw new Error(
    `Flagship duration ${flagshipSec}s is outside the 8–12 minute bar (${FLAGSHIP_MIN_SEC}–${FLAGSHIP_MAX_SEC})`,
  );
}

export function sceneById(id: string): Scene {
  const scene = episode.scenes.find((item) => item.id === id);
  if (!scene) {
    throw new Error(`No scene ${id}`);
  }
  return scene;
}
