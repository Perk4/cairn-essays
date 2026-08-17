import { Composition } from "remotion";
import { Clip } from "./compositions/Clip";
import { Flagship } from "./compositions/Flagship";
import { Short } from "./compositions/Short";
import { Thumbnail } from "./compositions/Thumbnail";
import { episode } from "./episode";
import voDurations from "../public/vo/durations.json";
import {
  FLAGSHIP_HEIGHT,
  FLAGSHIP_WIDTH,
  FPS,
  SHORT_HEIGHT,
  SHORT_WIDTH,
  clipDurationSec,
  flagshipDurationInFrames,
  secondsToFrames,
  shortDurationInFrames,
} from "./timing";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ep01"
        component={Flagship}
        durationInFrames={flagshipDurationInFrames(episode.scenes)}
        fps={FPS}
        width={FLAGSHIP_WIDTH}
        height={FLAGSHIP_HEIGHT}
      />
      <Composition
        id="ep01-hook"
        component={Short}
        durationInFrames={shortDurationInFrames(episode.shorts.hook)}
        fps={FPS}
        width={SHORT_WIDTH}
        height={SHORT_HEIGHT}
        defaultProps={{ shortId: "hook" }}
      />
      <Composition
        id="ep01-thumb"
        component={Thumbnail}
        durationInFrames={1}
        fps={FPS}
        width={FLAGSHIP_WIDTH}
        height={FLAGSHIP_HEIGHT}
      />
      <Composition
        id="ep01-rule"
        component={Short}
        durationInFrames={shortDurationInFrames(episode.shorts.rule)}
        fps={FPS}
        width={SHORT_WIDTH}
        height={SHORT_HEIGHT}
        defaultProps={{ shortId: "rule" }}
      />
      {episode.clips.map((clip) => {
        const voSec = voDurations[clip.sceneId as keyof typeof voDurations];
        if (typeof voSec !== "number") {
          throw new Error(`Clip ${clip.id} missing VO duration`);
        }
        const durationSec = clipDurationSec(voSec);
        return (
          <Composition
            key={clip.id}
            id={`ep01-clip-${clip.id}`}
            component={Clip}
            durationInFrames={secondsToFrames(durationSec)}
            fps={FPS}
            width={SHORT_WIDTH}
            height={SHORT_HEIGHT}
            defaultProps={{ clipId: clip.id }}
          />
        );
      })}
    </>
  );
};
