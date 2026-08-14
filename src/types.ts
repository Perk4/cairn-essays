export const POSES = ["still", "listen", "point"] as const;
export type Pose = (typeof POSES)[number];

type SceneTiming = {
  id: string;
  durationSec: number;
};

export type CairnCaptionScene = SceneTiming & {
  type: "cairnCaption";
  pose: Pose;
  caption: string;
};

export type CiteCardScene = SceneTiming & {
  type: "citeCard";
  lines: string[];
};

export type NamedFrameScene = SceneTiming & {
  type: "namedFrame";
  left: string;
  right: string;
  caption: string;
};

export type QuoteCardScene = SceneTiming & {
  type: "quoteCard";
  quote: string;
  attr: string;
};

export type NumberCardScene = SceneTiming & {
  type: "numberCard";
  kicker: string;
  stat: string;
  note: string;
};

export type LimitsCardScene = SceneTiming & {
  type: "limitsCard";
  items: string[];
};

export type EndCardScene = SceneTiming & {
  type: "endCard";
  title: string;
  cite: string;
  cta: string;
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
  palette: {
    cream: string;
    terracotta: string;
    olive: string;
    stone: string;
    outline: string;
  };
  scenes: Scene[];
};
