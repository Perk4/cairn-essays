import { Composition } from "remotion";
import { Flagship } from "./compositions/Flagship";
import { Short } from "./compositions/Short";
import { episode } from "./episode";
import {
  FLAGSHIP_HEIGHT,
  FLAGSHIP_WIDTH,
  FPS,
  SHORT_HEIGHT,
  SHORT_WIDTH,
  flagshipDurationInFrames,
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
        id="ep01-rule"
        component={Short}
        durationInFrames={shortDurationInFrames(episode.shorts.rule)}
        fps={FPS}
        width={SHORT_WIDTH}
        height={SHORT_HEIGHT}
        defaultProps={{ shortId: "rule" }}
      />
    </>
  );
};
