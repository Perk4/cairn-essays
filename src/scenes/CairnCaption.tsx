import { PlantedCairn } from "../cairn/CairnSlot";
import { handPosition } from "../cairn/stage";
import { FloorPile, FloorProp, SparkInRoom } from "../cairn/verbs";
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
  const { fps, height, width } = useVideoConfig();
  const beat = activeBeat(scene.beats, frame, fps);
  const pose: Pose = beat?.pose ?? scene.pose;
  const caption = beat?.caption ?? scene.caption;
  const mood: Mood = beat?.mood ?? scene.mood ?? "default";
  const visual: Visual = scene.visual ?? "none";
  const short = layout === "short";
  const cairnSize = short ? 500 : 440;
  const cairnLeft = short ? Math.round((width - cairnSize) * 0.22) : 36;
  const drop =
    visual === "stoneDrop" &&
    Boolean(beat?.caption?.toLowerCase().includes("stone"));
  const wallBeat =
    scene.beats?.find((item) => item.mood === "cold") ??
    scene.beats?.find((item) => item.caption?.toLowerCase().includes("wall")) ??
    scene.beats?.[1];
  const throwFrom = handPosition({
    left: cairnLeft,
    size: cairnSize,
    layout,
    height,
  });

  return (
    <Room mood={mood} layout={layout}>
      {visual === "sparkWall" ? (
        <SparkInRoom layout={layout} wallAtSec={wallBeat?.atSec ?? 12} />
      ) : visual === "stoneDrop" ? (
        <FloorPile
          layout={layout}
          dropping={drop}
          throwFrom={throwFrom}
          pileLeft={short ? width * 0.5 : width * 0.55}
        />
      ) : visual === "deskStone" ? (
        <FloorProp
          layout={layout}
          left={short ? "18%" : "58%"}
          width={short ? 220 : 260}
          height={120}
        >
          <SceneVisual visual={visual} layout={layout} mood={mood} />
        </FloorProp>
      ) : visual === "none" ? null : (
        <div
          style={{
            position: "absolute",
            right: short ? "50%" : "7%",
            top: short ? "22%" : "16%",
            transform: short ? "translateX(50%)" : undefined,
            zIndex: 1,
          }}
        >
          <SceneVisual visual={visual} layout={layout} mood={mood} />
        </div>
      )}
      <PlantedCairn
        pose={pose}
        size={cairnSize}
        layout={layout}
        left={cairnLeft}
        mood={mood}
        vo={scene.vo}
      />
      <CaptionBar text={caption} layout={layout} />
    </Room>
  );
};
