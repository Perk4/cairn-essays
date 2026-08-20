import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CaptionBar } from "../components/CaptionBar";
import { VoAudio } from "../components/VoAudio";
import { episode } from "../episode";
import type { ShortBeat } from "../types";
import {
  FPS,
  MAX_HOLD_SEC,
  kenBurnsForSlice,
  pictureStills,
  secondsToFrames,
  stillSliceIndex,
} from "../timing";

export type ShortProps = {
  shortId: "hook";
};

export const Short = ({ shortId }: ShortProps) => {
  const beats = episode.shorts[shortId];
  let from = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#FCF2C6" }}>
      {beats.map((beat) => {
        const durationInFrames = secondsToFrames(beat.durationSec);
        const start = from;
        from += durationInFrames;
        return (
          <Sequence
            key={beat.id}
            from={start}
            durationInFrames={durationInFrames}
            name={`${shortId}-${beat.id}`}
          >
            <VoAudio name={`short-${shortId}-${beat.id}`} />
            <ShortBeatView beat={beat} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const ShortBeatView = ({ beat }: { beat: ShortBeat }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const holdFrames = MAX_HOLD_SEC * FPS;
  const stills = pictureStills(beat);
  const slice = stillSliceIndex(frame / FPS, stills.length);
  const still = stills[slice];
  if (!still) {
    throw new Error(`Short beat ${beat.id} is missing a still for slice ${slice}`);
  }
  const pan = kenBurnsForSlice("in", slice) === "in" ? 1.06 : 1.14;
  const zoom = interpolate(
    frame - slice * holdFrames,
    [0, Math.max(1, Math.min(holdFrames, durationInFrames - slice * holdFrames))],
    [pan, pan + 0.08],
    { extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#FCF2C6" }}>
      <Img
        src={staticFile(`ep01-stills/${still}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 35%",
          transform: `scale(${zoom})`,
          transformOrigin: "center 40%",
        }}
      />
      <CaptionBar text={beat.caption} kicker={beat.id.toUpperCase()} layout="short" punch />
    </AbsoluteFill>
  );
};
