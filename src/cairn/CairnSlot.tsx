import { AnimatedImage, Img, getStaticFiles, staticFile } from "remotion";
import type { Pose } from "../types";

const IDLE_FILE = "cairn/idle.gif";

function hasPublicFile(name: string): boolean {
  return getStaticFiles().some((file) => file.name === name);
}

type CairnSlotProps = {
  pose: Pose;
  live?: boolean;
  size: number;
};

export const CairnSlot = ({ pose, live = false, size }: CairnSlotProps) => {
  const poseFile = `cairn/${pose}.png`;
  const useIdle = live && hasPublicFile(IDLE_FILE);
  const usePose = hasPublicFile(poseFile);

  if (useIdle) {
    return (
      <AnimatedImage
        src={staticFile(IDLE_FILE)}
        width={size}
        height={size}
        fit="contain"
        loopBehavior="loop"
        style={{ width: size, height: size }}
      />
    );
  }

  if (usePose) {
    return (
      <Img
        src={staticFile(poseFile)}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }

  return null;
};
