import { AbsoluteFill, Sequence } from "remotion";
import { MusicBed } from "./MusicBed";
import { VoAudio } from "../components/VoAudio";
import { episode } from "../episode";
import voDurations from "../../public/vo/durations.json";
import { renderScene } from "../scenes/registry";
import { sceneFrameRanges, secondsToFrames } from "../timing";

export const Flagship = () => {
  const ranges = sceneFrameRanges(episode.scenes);
  const speechWindows = ranges.flatMap((range) => {
    const voSec = voDurations[range.id as keyof typeof voDurations];
    if (typeof voSec !== "number" || voSec <= 0) {
      return [];
    }
    return [{ from: range.from, durationInFrames: secondsToFrames(voSec) }];
  });

  return (
    <AbsoluteFill>
      <MusicBed
        fadeInSec={1}
        fadeOutSec={4}
        volume={0.07}
        speechWindows={speechWindows}
      />
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
