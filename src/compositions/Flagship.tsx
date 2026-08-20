import { AbsoluteFill, Sequence } from "remotion";
import { VoAudio } from "../components/VoAudio";
import { episode } from "../episode";
import { renderScene } from "../scenes/registry";
import { sceneFrameRanges } from "../timing";

export const Flagship = () => {
  const ranges = sceneFrameRanges(episode.scenes);

  return (
    <AbsoluteFill style={{ backgroundColor: "#FCF2C6" }}>
      {episode.scenes.map((scene, index) => {
        const range = ranges[index];
        if (!range) {
          throw new Error(`Missing frame range for ${scene.id}`);
        }
        return (
          <Sequence
            key={scene.id}
            from={range.from}
            durationInFrames={range.durationInFrames}
            name={scene.id}
          >
            <VoAudio name={scene.id} />
            {renderScene(scene, "flagship")}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
