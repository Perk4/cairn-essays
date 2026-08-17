import { Html5Audio, interpolate, staticFile, useVideoConfig } from "remotion";

export const MUSIC_FILE = "music/bee-hive-pad.mp3";

export const SPEECH_DUCK = 0.35;

export type SpeechWindow = {
  from: number;
  durationInFrames: number;
};

type MusicBedProps = {
  fadeInSec?: number;
  fadeOutSec?: number;
  volume?: number;
  speechWindows?: readonly SpeechWindow[];
};

export const MusicBed = ({
  fadeInSec = 1,
  fadeOutSec = 4,
  volume = 0.08,
  speechWindows = [],
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
        const speaking = speechWindows.some(
          (window) =>
            frame >= window.from &&
            frame < window.from + window.durationInFrames,
        );
        const ducked = speaking ? SPEECH_DUCK : 1;
        return fadeInAmt * fadeOutAmt * volume * ducked;
      }}
    />
  );
};
