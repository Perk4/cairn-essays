import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Mood, Pose } from "../types";
import { mouthViseme, resolveCairnFile } from "./kit";
import {
  LISTEN_TALK_LEAN,
  leanForPose,
  plantedTopStyle,
  type Layout,
} from "./stage";

type CairnSlotProps = {
  pose: Pose;
  size: number;
  lean?: number;
  nod?: boolean;
  nodAtSec?: number;
  mood?: Mood;
  facing?: 1 | -1;
  vo?: string;
};

export const CairnSlot = ({
  pose,
  size,
  lean,
  nod = false,
  nodAtSec = 0.45,
  mood,
  facing = 1,
  vo,
}: CairnSlotProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const viseme =
    pose === "point" ? null : mouthViseme(vo, frame, fps);
  const poseFile = resolveCairnFile(pose, mood, viseme);
  const settle = interpolate(frame, [0, 8], [-16, 0], {
    extrapolateRight: "clamp",
  });
  const nodAt = Math.round(nodAtSec * fps);
  const nodAngle = nod
    ? interpolate(frame, [nodAt, nodAt + 6, nodAt + 16], [0, 13, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const talkingListen =
    pose === "listen" && poseFile.startsWith("cairn/mouth-");
  const poseLean = lean ?? (talkingListen ? LISTEN_TALK_LEAN : leanForPose(pose));

  return (
    <Img
      src={staticFile(poseFile)}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        transform: `translateY(${settle}px) rotate(${poseLean + nodAngle}deg) scaleX(${facing})`,
        transformOrigin: "50% 80%",
      }}
    />
  );
};

type PlantedCairnProps = CairnSlotProps & {
  layout: Layout;
  left?: number | string;
  right?: number | string;
  center?: boolean;
};

export const PlantedCairn = ({
  layout,
  left,
  right,
  center = false,
  size,
  ...slot
}: PlantedCairnProps) => {
  return (
    <div
      style={{
        position: "absolute",
        left: center ? "50%" : left,
        right: center ? undefined : right,
        top: plantedTopStyle(size, layout),
        width: size,
        height: size,
        marginLeft: center ? -size / 2 : undefined,
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      <CairnSlot size={size} {...slot} />
    </div>
  );
};
