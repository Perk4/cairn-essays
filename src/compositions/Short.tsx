import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { MusicBed } from "./MusicBed";
import { PlantedCairn } from "../cairn/CairnSlot";
import { FloorPile } from "../cairn/verbs";
import { handPosition } from "../cairn/stage";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { VoAudio } from "../components/VoAudio";
import { episode } from "../episode";
import type { ShortBeat } from "../types";
import { secondsToFrames } from "../timing";

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
  const { height, width } = useVideoConfig();
  const drop = beat.id === "stone";
  const size = 520;
  const cairnLeft = Math.round((width - size) * 0.18);
  const throwFrom = handPosition({
    left: cairnLeft,
    size,
    layout: "short",
    height,
  });
  const showPile = beat.visual === "stoneDrop";

  return (
    <Room mood={beat.mood} layout="short">
      {showPile ? (
        <FloorPile
          layout="short"
          dropping={drop}
          throwFrom={throwFrom}
          pileLeft={width * 0.48}
        />
      ) : null}
      <PlantedCairn
        pose={beat.pose}
        size={size}
        layout="short"
        left={cairnLeft}
        mood={beat.mood}
        vo={beat.vo}
      />
      <CaptionBar
        text={beat.caption}
        kicker={beat.kicker}
        layout="short"
        punch
      />
    </Room>
  );
};
