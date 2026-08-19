import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { PlantedCairn } from "../cairn/CairnSlot";
import { handPosition } from "../cairn/stage";
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
            <ShortBeatView beat={beat} shortId={shortId} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const ShortBeatView = ({
  beat,
  shortId,
}: {
  beat: ShortBeat;
  shortId: "hook" | "rule";
}) => {
  const { width, height } = useVideoConfig();
  const drop = beat.id === "stone" || beat.visual === "stoneDrop";
  const cairnSize = 560;
  const cairnLeft = width / 2 - cairnSize / 2;
  const throwFrom = drop
    ? handPosition({
        left: cairnLeft,
        size: cairnSize,
        layout: "short",
        height,
      })
    : undefined;
  return (
    <Room mood={beat.mood} layout="short">
      <PlantedCairn
        layout="short"
        center
        pose={beat.pose}
        size={cairnSize}
        mood={beat.mood}
        vo={beat.vo}
        voName={`short-${shortId}-${beat.id}`}
      />
      {beat.visual === "callingHomework" ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 680,
            transform: "translateX(-50%)",
          }}
        >
          <SceneVisual
            visual={beat.visual}
            layout="short"
            drop={drop}
            mood={beat.mood}
            throwFrom={throwFrom}
          />
        </div>
      ) : beat.visual ? (
        <SceneVisual
          visual={beat.visual}
          layout="short"
          drop={drop}
          mood={beat.mood}
          throwFrom={throwFrom}
        />
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
