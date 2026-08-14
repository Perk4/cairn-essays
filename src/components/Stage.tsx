import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { palette } from "../palette";

type StageProps = {
  children: ReactNode;
  pad?: number;
};

export const Stage = ({ children, pad = 80 }: StageProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const fade = Math.round(0.35 * fps);
  const opacity = interpolate(
    frame,
    [0, fade, durationInFrames - fade, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.cream,
        color: palette.outline,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: pad,
      }}
    >
      <div
        style={{
          opacity,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

export const cardStyle = (extra?: CSSProperties): CSSProperties => ({
  backgroundColor: palette.cream,
  border: `6px solid ${palette.outline}`,
  borderRadius: 36,
  boxShadow: `12px 12px 0 ${palette.stone}`,
  padding: "56px 64px",
  ...extra,
});
