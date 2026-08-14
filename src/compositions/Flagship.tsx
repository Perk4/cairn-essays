import { AbsoluteFill, Sequence } from "remotion";
import { episode } from "../episode";
import { palette } from "../palette";
import { renderScene } from "../scenes/registry";
import { sceneDurationInFrames } from "../timing";

export const Flagship = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: palette.cream }}>
      {episode.scenes.map((scene, index) => (
        <Sequence
          key={scene.id}
          from={index * sceneDurationInFrames}
          durationInFrames={sceneDurationInFrames}
          name={scene.id}
        >
          {renderScene(scene, "flagship")}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
