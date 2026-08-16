import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { palette } from "../palette";
import { floorTopPct, floorY, type Layout } from "./stage";

export type Point = { x: number; y: number };

export const SparkInRoom = ({
  layout,
  wallAtSec,
}: {
  layout: Layout;
  wallAtSec: number;
}) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const wallAt = Math.round(wallAtSec * fps);
  const rise = Math.round(0.85 * fps);
  const wall = interpolate(frame, [wallAt, wallAt + rise], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const sparkAlive = interpolate(
    frame,
    [wallAt + Math.round(0.25 * fps), wallAt + Math.round(0.7 * fps)],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const pulse = 0.55 + Math.sin(frame / 7) * 0.45;
  const floor = floorY(layout, height);
  const sparkLeft = layout === "short" ? width * 0.42 : width * 0.58;
  const sparkTop = layout === "short" ? height * 0.28 : height * 0.26;
  const wallWidth = layout === "short" ? width * 0.72 : width * 0.46;
  const wallLeft = layout === "short" ? width * 0.14 : width * 0.48;
  const wallHeight = floor - sparkTop + 80;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 1 }}>
      <div
        style={{
          position: "absolute",
          left: sparkLeft,
          top: sparkTop,
          width: 88,
          height: 88,
          borderRadius: "50%",
          backgroundColor: palette.terracotta,
          border: `5px solid ${palette.outline}`,
          opacity: (0.4 + pulse * 0.6) * sparkAlive,
          transform: `scale(${0.82 + pulse * 0.28})`,
          boxShadow: `0 0 ${28 + pulse * 48}px rgba(165, 83, 45, ${0.75 * sparkAlive})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: wallLeft,
          top: floor - wallHeight * wall,
          width: wallWidth,
          height: wallHeight * wall,
          backgroundColor: palette.stone,
          border: `6px solid ${palette.outline}`,
          borderBottom: "none",
          transformOrigin: "bottom",
        }}
      />
    </AbsoluteFill>
  );
};

export const FloorPile = ({
  layout,
  dropping,
  throwFrom,
  pileLeft,
}: {
  layout: Layout;
  dropping: boolean;
  throwFrom?: Point;
  pileLeft?: number;
}) => {
  const { height, width, fps } = useVideoConfig();
  const floor = floorY(layout, height);
  const pileWidth = layout === "short" ? 300 : 260;
  const pileHeight = 150;
  const left = pileLeft ?? (layout === "short" ? width * 0.52 : width * 0.58);
  const top = floor - pileHeight + 8;
  const land: Point = {
    x: left + pileWidth * 0.42,
    y: top + 28,
  };
  const from: Point = throwFrom ?? {
    x: left - 160,
    y: top - 90,
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: pileWidth,
          height: pileHeight,
          zIndex: 1,
        }}
      >
        <Stone left={18} bottom={10} w={96} h={50} color={palette.terracotta} />
        <Stone left={98} bottom={8} w={86} h={46} color={palette.stone} />
        <Stone left={58} bottom={46} w={74} h={42} color={palette.olive} />
      </div>
      {dropping ? (
        <FlyingStone
          from={from}
          to={land}
          startFrame={Math.round(0.25 * fps)}
        />
      ) : null}
    </>
  );
};

export const FlyingStone = ({
  from,
  to,
  startFrame,
  durationFrames = 20,
}: {
  from: Point;
  to: Point;
  startFrame: number;
  durationFrames?: number;
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 0.15, 0.25, 1),
    },
  );
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t - Math.sin(Math.PI * t) * 140;
  const visible = frame >= startFrame;

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 56,
        height: 36,
        backgroundColor: palette.terracotta,
        border: `4px solid ${palette.outline}`,
        borderRadius: "50%",
        zIndex: 3,
        transform: `rotate(${t * 48}deg)`,
      }}
    />
  );
};

export const EggsDrop = ({ layout }: { layout: Layout }) => {
  const frame = useCurrentFrame();
  const { fps, height, durationInFrames } = useVideoConfig();
  const floor = floorY(layout, height);
  const tipAt = Math.min(
    Math.round(7 * fps),
    Math.round(durationInFrames * 0.4),
  );
  const tip = interpolate(
    frame,
    [tipAt, tipAt + Math.round(0.55 * fps)],
    [0, 68],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    },
  );
  const shelfTop = floor - 260;
  const eggStart = shelfTop + 8;
  const eggLand = floor - 52;
  const fall = interpolate(
    frame,
    [tipAt + 4, tipAt + Math.round(1.15 * fps)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 0, 0.55, 1),
    },
  );
  const scatter = [
    { x: 0, rot: -18 },
    { x: 36, rot: 8 },
    { x: -28, rot: 22 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: layout === "short" ? "18%" : "52%",
        top: 0,
        width: 340,
        height: height,
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 40,
          top: shelfTop + 88,
          width: 220,
          height: 16,
          backgroundColor: palette.stone,
          border: `4px solid ${palette.outline}`,
          borderRadius: 6,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 70,
          top: shelfTop,
          width: 170,
          height: 100,
          border: `8px solid ${palette.outline}`,
          borderTop: "none",
          borderRadius: "0 0 80px 80px",
          backgroundColor: palette.terracotta,
          transform: `rotate(${tip}deg)`,
          transformOrigin: "18% 88%",
        }}
      />
      {scatter.map((egg, i) => {
        const y = eggStart + (eggLand - eggStart) * fall;
        const x = 88 + i * 48 + egg.x * fall;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 42,
              height: 54,
              backgroundColor: palette.cream,
              border: `4px solid ${palette.outline}`,
              borderRadius: "50%",
              transform: `rotate(${egg.rot * fall}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};

export const FloorProp = ({
  layout,
  left,
  right,
  width,
  height,
  children,
}: {
  layout: Layout;
  left?: number | string;
  right?: number | string;
  width: number;
  height: number;
  children: ReactNode;
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left,
        right,
        width,
        height,
        top: `calc(${floorTopPct(layout)}% - ${height}px)`,
        zIndex: 1,
      }}
    >
      {children}
    </div>
  );
};

const Stone = ({
  left,
  bottom,
  w,
  h,
  color,
}: {
  left: number;
  bottom: number;
  w: number;
  h: number;
  color: string;
}) => (
  <div
    style={{
      position: "absolute",
      left,
      bottom,
      width: w,
      height: h,
      backgroundColor: color,
      border: `4px solid ${palette.outline}`,
      borderRadius: "50%",
    }}
  />
);
