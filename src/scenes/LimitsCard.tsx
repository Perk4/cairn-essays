import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PlantedCairn } from "../cairn/CairnSlot";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { LimitsCardScene, Pose } from "../types";

export const LimitsCard = ({ scene }: { scene: LimitsCardScene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pose: Pose = scene.pose ?? "still";

  return (
    <Room mood="default">
      <PlantedCairn
        pose={pose}
        size={380}
        layout="flagship"
        left={20}
        vo={scene.vo}
      />
      <div
        style={{
          position: "absolute",
          left: 440,
          top: 72,
          right: 80,
        }}
      >
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 64,
            color: palette.outline,
            marginBottom: 28,
            letterSpacing: "-0.03em",
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
                marginBottom: 18,
                opacity: appear,
                transform: `translateX(${(1 - appear) * 24}px)`,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  marginTop: 14,
                  borderRadius: "50%",
                  backgroundColor: palette.terracotta,
                  border: `3px solid ${palette.outline}`,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontFamily: bodyFont,
                  fontWeight: 600,
                  fontSize: 32,
                  lineHeight: 1.3,
                  color: palette.outline,
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
      <CaptionBar text="A useful push, not a law." layout="flagship" />
    </Room>
  );
};
