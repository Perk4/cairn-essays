import { Html5Audio, interpolate, staticFile, useVideoConfig } from "remotion";

export const MUSIC_FILE = "music/bee-hive-pad.mp3";

type MusicBedProps = {
  fadeInSec?: number;
  fadeOutSec?: number;
  volume?: number;
};

export const MusicBed = ({
  fadeInSec = 1,
  fadeOutSec = 4,
  volume = 0.08,
}: MusicBedProps) => {
  const { fps, durationInFrames } = useVideoConfig();
  const fadeIn = Math.max(1, Math.round(fadeInSec * fps));
  const fadeOut = Math.max(1, Math.round(fadeOutSec * fps));

  return (
    <Html5Audio
      src={staticFile(MUSIC_FILE)}
      loop
      name="music-bed"
      loopVolumeCurveBehavior="extend"
      volume={(frame) => {
        const fadeInAmt = interpolate(frame, [0, fadeIn], [0.35, 1], {
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
        return fadeInAmt * fadeOutAmt * volume;
      }}
    />
  );
};
