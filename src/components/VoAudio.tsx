import { Html5Audio, getStaticFiles, staticFile } from "remotion";
import { FPS } from "../timing";

function hasPublicFile(name: string): boolean {
  return getStaticFiles().some((file) => file.name === name);
}

export const voPath = (name: string): string => `vo/${name}.mp3`;

type VoAudioProps = {
  name: string;
  startFromSec?: number;
  endAtSec?: number;
};

export const VoAudio = ({
  name,
  startFromSec = 0,
  endAtSec,
}: VoAudioProps) => {
  const file = voPath(name);
  if (!hasPublicFile(file)) {
    return null;
  }
  return (
    <Html5Audio
      src={staticFile(file)}
      volume={0.95}
      name={`vo-${name}`}
      startFrom={Math.round(startFromSec * FPS)}
      endAt={endAtSec === undefined ? undefined : Math.round(endAtSec * FPS)}
    />
  );
};
