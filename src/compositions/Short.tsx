import { AbsoluteFill, Sequence } from "remotion";
import { MusicBed } from "./MusicBed";
import { CairnSlot } from "../cairn/CairnSlot";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { VoAudio } from "../components/VoAudio";
import { episode } from "../episode";
import type { ShortBeat } from "../types";
import { secondsToFrames } from "../timing";
import { SceneVisual } from "../visuals";

export type ShortProps = {
  shortId: "hook" | "rule";
};

export const Short = ({ shortId }: ShortProps) => {
  const beats = episode.shorts[shortId];
  let from = 0;

  return (
    <AbsoluteFill>
      <MusicBed fadeInSec={0.25} fadeOutSec={1.2} volume={0.1} />
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
  const drop = beat.id === "stone";
  return (
    <Room mood={beat.mood} layout="short">
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 80,
          transform: "translateX(-50%)",
        }}
      >
        <CairnSlot pose={beat.pose} size={560} />
      </div>
      {beat.visual ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 680,
            transform: "translateX(-50%)",
          }}
        >
          <SceneVisual visual={beat.visual} layout="short" drop={drop} />
        </div>
      ) : null}
      <CaptionBar
        text={beat.caption}
        kicker={beat.kicker}
        layout="short"
        punch
      />
    </Room>
  );
};
