import type { ReactNode } from "react";
import { StillShot } from "./StillShot";
import type { Scene } from "../types";

export function renderScene(
  scene: Scene,
  layout: "flagship" | "short",
  kicker?: string,
): ReactNode {
  return <StillShot scene={scene} layout={layout} kicker={kicker} />;
}
