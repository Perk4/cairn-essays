import { AbsoluteFill, Sequence } from "remotion";
import { MusicBed } from "./MusicBed";
import { episode } from "../episode";
import { palette } from "../palette";
import { renderScene } from "../scenes/registry";
import { sceneFrameRanges } from "../timing";

export const Flagship = () => {
  const ranges = sceneFrameRanges(episode.scenes);

  return (
    <AbsoluteFill style={{ backgroundColor: palette.cream }}>
      <MusicBed />
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
            {renderScene(scene, "flagship")}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
