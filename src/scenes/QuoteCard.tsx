import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CairnSlot } from "../cairn/CairnSlot";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { bodyFont } from "../fonts";
import { palette } from "../palette";
import type { Pose, QuoteCardScene } from "../types";

export const QuoteCard = ({ scene }: { scene: QuoteCardScene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const tipAt = Math.round(durationInFrames * 0.45);
  const tip = interpolate(
    frame,
    [tipAt, tipAt + Math.round(0.8 * fps)],
    [0, 52],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    },
  );
  const fall = interpolate(
    frame,
    [tipAt + 6, tipAt + Math.round(1.4 * fps)],
    [0, 140],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 0, 0.8, 1),
    },
  );
  const pose: Pose = scene.pose ?? "still";
  const line = scene.caption ?? "Eggs in one basket. Then you drop it.";

  return (
    <Room mood="cold">
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 30,
        }}
      >
        <CairnSlot pose={pose} size={380} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 180,
          top: 180,
          width: 280,
          height: 220,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 40,
            width: 200,
            height: 120,
            border: `8px solid ${palette.outline}`,
            borderTop: "none",
            borderRadius: "0 0 80px 80px",
            backgroundColor: palette.terracotta,
            transform: `rotate(${tip}deg)`,
            transformOrigin: "20% 80%",
          }}
        />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 70 + i * 42,
              top: 20 + fall,
              width: 36,
              height: 48,
              backgroundColor: palette.cream,
              border: `4px solid ${palette.outline}`,
              borderRadius: "50%",
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 180,
          fontFamily: bodyFont,
          fontWeight: 700,
          fontSize: 20,
          color: palette.stone,
        }}
      >
        {scene.attr}
      </div>
      <CaptionBar text={line} layout="flagship" />
    </Room>
  );
};
