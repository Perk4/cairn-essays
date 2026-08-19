import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PlantedCairn } from "../cairn/CairnSlot";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import { activeBeat } from "../timing";
import type { NumberCardScene, Pose } from "../types";
import voDurations from "../../public/vo/durations.json";
import { FINDING_TYPE_PX, splitStat } from "../visuals";

const durationMap = voDurations as Record<string, number>;

export const NumberCard = ({ scene }: { scene: NumberCardScene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = activeBeat(scene.beats, frame, fps);
  const pose: Pose = beat?.pose ?? scene.pose ?? "point";
  const parts = splitStat(scene.stat);
  const leftEnter = interpolate(frame, [6, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightEnter = interpolate(frame, [20, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Room mood="default">
      <PlantedCairn
        layout="flagship"
        left={40}
        pose={pose}
        size={360}
        vo={scene.vo}
        voName={durationMap[scene.id] ? scene.id : undefined}
        spokenSec={durationMap[scene.id]}
      />
      <div
        style={{
          position: "absolute",
          left: 420,
          right: 80,
          top: 90,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: palette.olive,
          }}
        >
          {scene.kicker}
        </div>
        {parts ? (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 28,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <StatBlock
              value={parts.left}
              label={scene.leftLabel ?? "fixed"}
              color={palette.terracotta}
              scale={leftEnter}
            />
            <div
              style={{
                fontFamily: displayFont,
                fontWeight: 600,
                fontSize: 40,
                color: palette.stone,
                paddingBottom: 36,
              }}
            >
              vs
            </div>
            <StatBlock
              value={parts.right}
              label={scene.rightLabel ?? "growth"}
              color={palette.olive}
              scale={rightEnter}
            />
          </div>
        ) : (
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: FINDING_TYPE_PX,
              color: palette.outline,
              lineHeight: 1,
            }}
          >
            {scene.stat}
          </div>
        )}
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 28,
            color: palette.outline,
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {scene.note}
        </div>
        {scene.footnote ? (
          <div
            style={{
              fontFamily: bodyFont,
              fontWeight: 600,
              fontSize: 20,
              color: palette.stone,
              letterSpacing: "0.04em",
            }}
          >
            {scene.footnote}
          </div>
        ) : null}
      </div>
      <CaptionBar
        text={beat?.caption ?? scene.note}
        layout="flagship"
        localFrame={frame - Math.round((beat?.atSec ?? 0) * fps)}
      />
    </Room>
  );
};

const StatBlock = ({
  value,
  label,
  color,
  scale,
}: {
  value: string;
  label: string;
  color: string;
  scale: number;
}) => {
  return (
    <div
      style={{
        textAlign: "center",
        transform: `translateY(${(1 - scale) * 24}px) scale(${0.86 + scale * 0.14})`,
        backgroundColor: palette.cream,
        border: `5px solid ${palette.outline}`,
        borderRadius: 24,
        boxShadow: `12px 12px 0 ${palette.stone}`,
        padding: "20px 28px 16px",
        minWidth: 280,
      }}
    >
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: FINDING_TYPE_PX,
          lineHeight: 1,
          color,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: bodyFont,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: palette.stone,
        }}
      >
        {label}
      </div>
    </div>
  );
};
