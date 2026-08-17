import { AbsoluteFill, Sequence } from "remotion";
import { MusicBed } from "./MusicBed";
import { VoAudio } from "../components/VoAudio";
import { episode } from "../episode";
import { renderScene } from "../scenes/registry";
import { sceneFrameRanges } from "../timing";

export const Flagship = () => {
  const ranges = sceneFrameRanges(episode.scenes);

  return (
    <AbsoluteFill>
      <MusicBed fadeInSec={1} fadeOutSec={4} volume={0.07} duckUnderSpeech />
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
