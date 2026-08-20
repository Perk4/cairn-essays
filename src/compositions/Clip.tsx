import { AbsoluteFill } from "remotion";

export type ClipProps = {
  clipId: string;
};

export const Clip = ({ clipId }: ClipProps) => {
  if (clipId) {
    throw new Error(`Clips are not in this encode (${clipId})`);
  }
  return <AbsoluteFill />;
};
