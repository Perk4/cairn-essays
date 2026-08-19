import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { LimitsCardScene } from "../types";

export const LimitsCard = ({ scene }: { scene: LimitsCardScene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Room mood="default" plain>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 80,
          bottom: 180,
          backgroundColor: palette.stone,
          color: palette.cream,
          border: `5px solid ${palette.outline}`,
          borderRadius: 28,
          padding: "36px 40px",
          boxShadow: `16px 16px 0 ${palette.olive}`,
        }}
      >
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 56,
            marginBottom: 24,
          }}
        >
          Limits
        </div>
        {scene.items.map((item, index) => {
          const appear = interpolate(
            frame,
            [index * Math.round(0.7 * fps), index * Math.round(0.7 * fps) + 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <div
              key={item}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                marginBottom: 16,
                opacity: appear,
                transform: `translateX(${(1 - appear) * 24}px)`,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  marginTop: 12,
                  borderRadius: "50%",
                  backgroundColor: palette.terracotta,
                  border: `3px solid ${palette.cream}`,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontFamily: bodyFont,
                  fontWeight: 600,
                  fontSize: 32,
                  lineHeight: 1.3,
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
      <CaptionBar
        text="Believe the pattern. Do not pretend it is a law."
        layout="flagship"
      />
    </Room>
  );
};
