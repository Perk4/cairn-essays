import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CaptionBar } from "../components/CaptionBar";
import type { KenBurns, StillShotScene } from "../types";
import { FPS, MAX_HOLD_SEC } from "../timing";

const motionFor = (
  kind: KenBurns,
  alt: boolean,
): { scaleFrom: number; scaleTo: number; xFrom: number; xTo: number } => {
  if (alt) {
    switch (kind) {
      case "in":
        return { scaleFrom: 1.12, scaleTo: 1.2, xFrom: -28, xTo: 22 };
      case "out":
        return { scaleFrom: 1.08, scaleTo: 1.02, xFrom: 22, xTo: -18 };
      case "left":
        return { scaleFrom: 1.1, scaleTo: 1.1, xFrom: -24, xTo: 36 };
      case "right":
        return { scaleFrom: 1.1, scaleTo: 1.1, xFrom: 24, xTo: -36 };
      default: {
        const exhaustive: never = kind;
        return exhaustive;
      }
    }
  }
  switch (kind) {
    case "in":
      return { scaleFrom: 1.04, scaleTo: 1.12, xFrom: 0, xTo: 0 };
    case "out":
      return { scaleFrom: 1.12, scaleTo: 1.04, xFrom: 0, xTo: 0 };
    case "left":
      return { scaleFrom: 1.08, scaleTo: 1.08, xFrom: 32, xTo: -36 };
    case "right":
      return { scaleFrom: 1.08, scaleTo: 1.08, xFrom: -36, xTo: 32 };
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
};

type Props = {
  scene: StillShotScene;
  layout: "flagship" | "short";
  kicker?: string;
};

export const StillShot = ({ scene, layout, kicker }: Props) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const holdFrames = MAX_HOLD_SEC * FPS;
  const split = Boolean(scene.altStill) || durationInFrames > holdFrames;
  const secondHalf = split && frame >= Math.min(holdFrames, durationInFrames - 1);
  const still = secondHalf && scene.altStill ? scene.altStill : scene.still;
  const motion = motionFor(scene.kenBurns, secondHalf);
  const localDuration = secondHalf
    ? Math.max(1, durationInFrames - holdFrames)
    : split
      ? Math.min(holdFrames, durationInFrames)
      : durationInFrames;
  const localFrame = secondHalf ? frame - holdFrames : frame;
  const scale = interpolate(
    localFrame,
    [0, Math.max(1, localDuration)],
    [motion.scaleFrom, motion.scaleTo],
    { extrapolateRight: "clamp" },
  );
  const x = interpolate(
    localFrame,
    [0, Math.max(1, localDuration)],
    [motion.xFrom, motion.xTo],
    { extrapolateRight: "clamp" },
  );
  const objectPosition = layout === "short" ? "center 40%" : "center center";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#FCF2C6",
      }}
    >
      <Img
        src={staticFile(`ep01-stills/${still}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          transform: `translateX(${x}px) scale(${scale})`,
          transformOrigin: "center center",
        }}
      />
      <CaptionBar
        text={scene.caption}
        kicker={kicker}
        layout={layout}
        punch={Boolean(kicker)}
      />
    </div>
  );
};
