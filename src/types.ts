export const POSES = ["still", "listen", "point"] as const;
export type Pose = (typeof POSES)[number];

export type CairnCaptionScene = {
  id: string;
  type: "cairnCaption";
  pose: Pose;
  caption: string;
};

export type CiteCardScene = {
  id: string;
  type: "citeCard";
  lines: string[];
};

export type NamedFrameScene = {
  id: string;
  type: "namedFrame";
  left: string;
  right: string;
  caption: string;
};

export type QuoteCardScene = {
  id: string;
  type: "quoteCard";
  quote: string;
  attr: string;
};

export type NumberCardScene = {
  id: string;
  type: "numberCard";
  kicker: string;
  stat: string;
  note: string;
};

export type LimitsCardScene = {
  id: string;
  type: "limitsCard";
  items: string[];
};

export type EndCardScene = {
  id: string;
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
