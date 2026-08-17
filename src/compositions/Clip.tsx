import { AbsoluteFill } from "remotion";
import { MusicBed } from "./MusicBed";
import { VoAudio } from "../components/VoAudio";
import { episode } from "../episode";
import { renderScene } from "../scenes/registry";

export type ClipProps = {
  clipId: string;
};

export const Clip = ({ clipId }: ClipProps) => {
  const clip = episode.clips.find((item) => item.id === clipId);
  if (!clip) {
    throw new Error(`No clip ${clipId}`);
  }
  const scene = episode.scenes.find((item) => item.id === clip.sceneId);
  if (!scene) {
    throw new Error(`Clip ${clipId} missing scene ${clip.sceneId}`);
  }

  return (
    <AbsoluteFill>
      <MusicBed fadeInSec={0.25} fadeOutSec={1.2} volume={0.1} />
      <VoAudio
        name={clip.sceneId}
        startFromSec={clip.startSec}
        endAtSec={clip.endSec}
      />
      {renderScene(scene, "short", clip.kicker)}
    </AbsoluteFill>
  );
};
