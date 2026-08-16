import { Html5Audio, getStaticFiles, staticFile } from "remotion";

function hasPublicFile(name: string): boolean {
  return getStaticFiles().some((file) => file.name === name);
}

export const voPath = (name: string): string => `vo/${name}.mp3`;

export const VoAudio = ({ name }: { name: string }) => {
  const file = voPath(name);
  if (!hasPublicFile(file)) {
    return null;
  }
  return (
    <Html5Audio src={staticFile(file)} volume={0.95} name={`vo-${name}`} />
  );
};
