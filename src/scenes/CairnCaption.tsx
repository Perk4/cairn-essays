import { CairnSlot } from "../cairn/CairnSlot";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { activeBeat } from "../timing";
import type { CairnCaptionScene, Mood, Pose, Visual } from "../types";
import { SceneVisual } from "../visuals";
import { useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  scene: CairnCaptionScene;
  layout: "flagship" | "short";
};

export const CairnCaption = ({ scene, layout }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = activeBeat(scene.beats, frame, fps);
  const pose: Pose = beat?.pose ?? scene.pose;
  const caption = beat?.caption ?? scene.caption;
  const mood: Mood = beat?.mood ?? scene.mood ?? "default";
  const visual: Visual = scene.visual ?? "none";
  const short = layout === "short";
  const cairnSize = short ? 520 : 500;
  const drop =
    visual === "stoneDrop" &&
    Boolean(beat?.caption?.toLowerCase().includes("stone"));

  return (
    <Room mood={mood} layout={layout}>
      <div
        style={{
          position: "absolute",
          left: short ? "50%" : "7%",
          top: short ? "10%" : "6%",
          transform: short ? "translateX(-50%)" : undefined,
          zIndex: 2,
        }}
      >
        <CairnSlot
          pose={pose}
          size={cairnSize}
          voName={scene.id === "hook" ? scene.id : undefined}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: short ? "50%" : "8%",
          top: short ? "46%" : "22%",
          transform: short ? "translateX(50%)" : undefined,
          zIndex: 2,
        }}
      >
        <SceneVisual visual={visual} layout={layout} drop={drop} mood={mood} />
      </div>
      <CaptionBar text={caption} layout={layout} />
    </Room>
  );
};
