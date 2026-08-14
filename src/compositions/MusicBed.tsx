import { Html5Audio, interpolate, staticFile, useVideoConfig } from "remotion";
import { episode } from "../episode";
import { sceneFrameRanges } from "../timing";

export const MUSIC_FILE = "music/bee-hive-pad.mp3";
export const MUSIC_CAPTION_VOLUME = 0.18;
export const MUSIC_CARD_VOLUME = 0.1;

export const MusicBed = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const ranges = sceneFrameRanges(episode.scenes);
  const fadeIn = Math.round(2.5 * fps);
  const fadeOut = Math.round(5 * fps);

  return (
    <Html5Audio
      src={staticFile(MUSIC_FILE)}
      loop
      name="music-bed"
      loopVolumeCurveBehavior="extend"
      volume={(frame) => {
        const fadeInAmt = interpolate(frame, [0, fadeIn], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fadeOutAmt = interpolate(
          frame,
          [durationInFrames - fadeOut, durationInFrames],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        const index = ranges.findIndex(
          (range) =>
            frame >= range.from && frame < range.from + range.durationInFrames,
        );
        const scene =
          episode.scenes[index === -1 ? episode.scenes.length - 1 : index];
        const bed =
          scene?.type === "cairnCaption"
            ? MUSIC_CAPTION_VOLUME
            : MUSIC_CARD_VOLUME;
        return fadeInAmt * fadeOutAmt * bed;
      }}
    />
  );
};
