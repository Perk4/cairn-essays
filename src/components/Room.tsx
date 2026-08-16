import type { ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { floorTopPct, type Layout } from "../cairn/stage";
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
  layout?: Layout;
  plain?: boolean;
};

export const Room = ({
  children,
  mood = "default",
  layout = "flagship",
  plain = false,
}: RoomProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(
    frame,
    [0, Math.max(1, durationInFrames)],
    [0, 10],
    {
      extrapolateRight: "clamp",
    },
  );
  const floorTop = `${floorTopPct(layout)}%`;
  const wash = washForMood(mood);
  const short = layout === "short";

  return (
    <AbsoluteFill style={{ backgroundColor: "#F6E8B0", overflow: "hidden" }}>
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
            left: 0,
            right: 0,
            top: 0,
            height: floorTop,
            backgroundColor: palette.cream,
          }}
        />
        {plain ? null : (
          <>
            <div
              style={{
                position: "absolute",
                right: short ? "8%" : "6%",
                top: short ? "10%" : "8%",
                width: short ? 200 : 260,
                height: short ? 240 : 300,
                backgroundColor: mood === "cold" ? "#CDB889" : "#E8D7A4",
                border: `5px solid ${palette.outline}`,
                borderRadius: 8,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: short ? "11%" : "9%",
                top: short ? "14%" : "12%",
                width: short ? 140 : 180,
                height: short ? 160 : 200,
                border: `4px solid ${palette.outline}`,
                borderRadius: 4,
                backgroundColor: mood === "cold" ? "#E8D7A4" : "#F6E8B0",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: short ? "11%" : "9%",
                top: short ? `calc(14% + 80px)` : `calc(12% + 100px)`,
                width: short ? 140 : 180,
                height: 4,
                backgroundColor: palette.outline,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: short ? `calc(11% + 70px)` : `calc(9% + 90px)`,
                top: short ? "14%" : "12%",
                width: 4,
                height: short ? 160 : 200,
                backgroundColor: palette.outline,
              }}
            />
          </>
        )}
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
