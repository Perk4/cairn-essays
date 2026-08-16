import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { palette } from "../palette";
import type { Mood } from "../types";

const washForMood = (mood: Mood): string | null => {
  switch (mood) {
    case "warm":
      return "rgba(165, 83, 45, 0.22)";
    case "cold":
      return "rgba(87, 53, 28, 0.28)";
    case "default":
      return null;
    default: {
      const exhaustive: never = mood;
      return exhaustive;
    }
  }
};

type RoomProps = {
  children: ReactNode;
  mood?: Mood;
  layout?: "flagship" | "short";
};

export const Room = ({
  children,
  mood = "default",
  layout = "flagship",
}: RoomProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(
    frame,
    [0, Math.max(1, durationInFrames)],
    [0, 14],
    {
      extrapolateRight: "clamp",
    },
  );
  const floorTop = layout === "short" ? "62%" : "68%";
  const wash = washForMood(mood);

  return (
    <AbsoluteFill
      style={{ backgroundColor: palette.cream, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${drift}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "6%",
            right: "18%",
            top: layout === "short" ? "8%" : "6%",
            height: layout === "short" ? "48%" : "52%",
            backgroundColor: "#E8D7A4",
            border: `5px solid ${palette.outline}`,
            borderRadius: 28,
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: floorTop,
            bottom: 0,
            backgroundColor: palette.olive,
            borderTop: `8px solid ${palette.outline}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "10%",
            width: "28%",
            top: layout === "short" ? "58%" : "64%",
            height: 18,
            backgroundColor: palette.stone,
            border: `4px solid ${palette.outline}`,
            borderRadius: 8,
            transform: "skewX(-18deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "8%",
            width: 90,
            top: layout === "short" ? "18%" : "14%",
            height: 90,
            borderRadius: "50%",
            backgroundColor:
              mood === "cold" ? palette.stone : palette.terracotta,
            border: `5px solid ${palette.outline}`,
            opacity: 0.55,
          }}
        />
      </div>
      {wash ? (
        <AbsoluteFill
          style={{
            backgroundColor: wash,
            pointerEvents: "none",
          }}
        />
      ) : null}
      {children}
    </AbsoluteFill>
  );
};

export const panelStyle = (extra?: CSSProperties): CSSProperties => ({
  backgroundColor: palette.cream,
  border: `5px solid ${palette.outline}`,
  borderRadius: 28,
  boxShadow: `14px 14px 0 ${palette.stone}`,
  padding: "28px 32px",
  ...extra,
});
