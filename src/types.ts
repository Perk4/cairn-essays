export const POSES = [
  "still",
  "listen",
  "point",
  "react",
  "present",
  "slump",
] as const;
export type Pose = (typeof POSES)[number];

export const MOODS = ["default", "warm", "cold"] as const;
export type Mood = (typeof MOODS)[number];

export const VISUALS = [
  "none",
  "deskStone",
  "callingHomework",
  "citeChip",
  "articles",
  "underpowered",
  "sparkWall",
  "hawkingPaper",
  "stoneDrop",
  "conceptLabel",
] as const;
export type Visual = (typeof VISUALS)[number];

export type SceneBeat = {
  atSec: number;
  pose?: Pose;
  caption?: string;
  mood?: Mood;
};

export const BEATS = [
  "00-hook",
  "01-tuesday",
  "02-books",
  "03-wednesday",
  "04-thursday",
  "05-weekend",
  "06-name",
  "07-move",
  "cta",
] as const;
export type BeatId = (typeof BEATS)[number];

export const KEN_BURNS = ["in", "out", "left", "right"] as const;
export type KenBurns = (typeof KEN_BURNS)[number];

export type VoiceConfig = {
  engine: "kokoro";
  model: "hexgrad/Kokoro-82M";
  voice: string;
  speed: number;
  gapSec: number;
};

export type StillShotScene = {
  id: string;
  type: "stillShot";
  still: string;
  altStill?: string;
  vo: string;
  caption: string;
  beat: BeatId;
  kenBurns: KenBurns;
  durationSec: number;
};

export type Scene = StillShotScene;
export type SceneBody = Omit<StillShotScene, "durationSec">;

type SceneTiming = {
  id: string;
  durationSec: number;
  vo: string;
};

export type CairnCaptionScene = SceneTiming & {
  type: "cairnCaption";
  pose: Pose;
  caption: string;
  visual?: Visual;
  mood?: Mood;
  label?: string;
  beats?: SceneBeat[];
};

export type CiteCardScene = SceneTiming & {
  type: "citeCard";
  lines: string[];
  pose?: Pose;
};

export type NamedFrameScene = SceneTiming & {
  type: "namedFrame";
  left: string;
  right: string;
  caption: string;
  pose?: Pose;
};

export type QuoteCardScene = SceneTiming & {
  type: "quoteCard";
  quote: string;
  attr: string;
  caption?: string;
  pose?: Pose;
};

export type NumberCardScene = SceneTiming & {
  type: "numberCard";
  kicker: string;
  stat: string;
  note: string;
  footnote?: string;
  leftLabel?: string;
  rightLabel?: string;
  pose?: Pose;
};

export type LimitsCardScene = SceneTiming & {
  type: "limitsCard";
  items: string[];
  pose?: Pose;
};

export type EndCardScene = SceneTiming & {
  type: "endCard";
  title: string;
  cite: string;
  cta: string;
  footnote?: string;
  pose?: Pose;
};

export type ShortBeat = {
  id: string;
  still: string;
  altStill?: string;
  vo: string;
  caption: string;
  durationSec: number;
};

export type Episode = {
  id: string;
  slug: string;
  title: string;
  durationTargetSec: number;
  thesis: string;
  voice: string;
  voiceLabel: string;
  description: string;
  thumbLine: string;
  thumbStill: string;
  palette: {
    cream: string;
    terracotta: string;
    olive: string;
    stone: string;
    outline: string;
  };
  shorts: {
    hook: ShortBeat[];
  };
  scenes: Scene[];
};
