import type { ReactNode } from "react";
import { CairnCaption } from "./CairnCaption";
import { CiteCard } from "./CiteCard";
import { EndCard } from "./EndCard";
import { LimitsCard } from "./LimitsCard";
import { NamedFrame } from "./NamedFrame";
import { NumberCard } from "./NumberCard";
import { QuoteCard } from "./QuoteCard";
import type { Scene } from "../types";

export function renderScene(
  scene: Scene,
  layout: "flagship" | "short",
): ReactNode {
  switch (scene.type) {
    case "cairnCaption":
      return <CairnCaption scene={scene} layout={layout} />;
    case "citeCard":
      return <CiteCard scene={scene} />;
    case "namedFrame":
      return <NamedFrame scene={scene} />;
    case "quoteCard":
      return <QuoteCard scene={scene} />;
    case "numberCard":
      return <NumberCard scene={scene} />;
    case "limitsCard":
      return <LimitsCard scene={scene} />;
    case "endCard":
      return <EndCard scene={scene} />;
    default: {
      const exhaustive: never = scene;
      return exhaustive;
    }
  }
}
