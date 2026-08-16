import type { ReactNode } from "react";
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
  const floorTop = layout === "short" ? "58%" : "70%";
  const wash = washForMood(mood);

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
                right: layout === "short" ? "8%" : "6%",
                top: layout === "short" ? "10%" : "8%",
                width: layout === "short" ? 200 : 260,
                height: layout === "short" ? 240 : 300,
                backgroundColor: mood === "cold" ? "#CDB889" : "#E8D7A4",
                border: `5px solid ${palette.outline}`,
                borderRadius: 18,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: layout === "short" ? "11%" : "8%",
                top: layout === "short" ? "14%" : "12%",
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor:
                  mood === "cold" ? palette.stone : palette.terracotta,
                opacity: 0.7,
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
        {plain ? null : (
          <div
            style={{
              position: "absolute",
              left: layout === "short" ? "18%" : "8%",
              width: layout === "short" ? "64%" : "22%",
              top: `calc(${floorTop} - 14px)`,
              height: 22,
              backgroundColor: palette.stone,
              border: `4px solid ${palette.outline}`,
              borderRadius: 6,
            }}
          />
        )}
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
