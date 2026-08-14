import { AbsoluteFill } from "remotion";
import { sceneById } from "../episode";
import { palette } from "../palette";
import { renderScene } from "../scenes/registry";

export type ShortProps = {
  sceneId: string;
};

export const Short = ({ sceneId }: ShortProps) => {
  const scene = sceneById(sceneId);

  return (
    <AbsoluteFill style={{ backgroundColor: palette.cream }}>
      {renderScene(scene, "short")}
    </AbsoluteFill>
  );
};
