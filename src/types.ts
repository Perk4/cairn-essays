export const POSES = ["still", "listen", "point"] as const;
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

type SceneTiming = {
  id: string;
  durationSec: number;
  vo: string;
};

export type SceneBeat = {
  atSec: number;
  pose?: Pose;
  caption?: string;
  mood?: Mood;
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

export type Scene =
  | CairnCaptionScene
  | CiteCardScene
  | NamedFrameScene
  | QuoteCardScene
  | NumberCardScene
  | LimitsCardScene
  | EndCardScene;

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

export type SceneBody = DistributiveOmit<Scene, "durationSec">;

export type ShortBeat = {
  id: string;
  pose: Pose;
  kicker: string;
  caption: string;
  mood: Mood;
  vo: string;
  durationSec: number;
  visual?: Visual;
};

export type EpisodePaper = {
  authors: string;
  year: number;
  journal: string;
  citation: string;
  doi: string;
  title: string;
};

export type Episode = {
  id: string;
  slug: string;
  title: string;
  durationTargetSec: number;
  paper: EpisodePaper;
  thesis: string;
  rule: string;
  voice: string;
  voiceLabel: string;
  description: string;
  thumbLine: string;
  palette: {
    cream: string;
    terracotta: string;
    olive: string;
    stone: string;
    outline: string;
  };
  shorts: {
    hook: ShortBeat[];
    rule: ShortBeat[];
  };
  clips: EpisodeClip[];
  scenes: Scene[];
};

export type EpisodeClip = {
  id: string;
  sceneId: string;
  kicker: string;
};
