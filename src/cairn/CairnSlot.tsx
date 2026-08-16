import { Img, getStaticFiles, staticFile } from "remotion";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Pose } from "../types";

type CairnSlotProps = {
  pose: Pose;
  size: number;
};

function hasPublicFile(name: string): boolean {
  return getStaticFiles().some((file) => file.name === name);
}

export const poseFileName = (pose: Pose): string => `cairn/${pose}.png`;

export const CairnSlot = ({ pose, size }: CairnSlotProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const poseFile = poseFileName(pose);
  const usePose = hasPublicFile(poseFile);

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 90 },
  });
  const bob = Math.sin(frame / 16) * 7;
  const sway = Math.sin(frame / 22) * 1.4;

  if (!usePose) {
    return null;
  }

  return (
    <Img
      src={staticFile(poseFile)}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        transform: `translateY(${(1 - enter) * 40 + bob}px) rotate(${sway}deg) scale(${0.92 + enter * 0.08})`,
        transformOrigin: "50% 85%",
      }}
    />
  );
};
