import { PlantedCairn } from "../cairn/CairnSlot";
import { handPosition } from "../cairn/stage";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { activeBeat } from "../timing";
import type { CairnCaptionScene, Mood, Pose, Visual } from "../types";
import voDurations from "../../public/vo/durations.json";
import { SceneVisual } from "../visuals";
import { useCurrentFrame, useVideoConfig } from "remotion";

const durationMap = voDurations as Record<string, number>;

type Props = {
  scene: CairnCaptionScene;
  layout: "flagship" | "short";
  kicker?: string;
};

export const CairnCaption = ({ scene, layout, kicker }: Props) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const beat = activeBeat(scene.beats, frame, fps);
  const pose: Pose = beat?.pose ?? scene.pose;
  const caption = beat?.caption ?? scene.caption;
  const mood: Mood = beat?.mood ?? scene.mood ?? "default";
  const visual: Visual = scene.visual ?? "none";
  const short = layout === "short";
  const cairnSize = short ? 520 : 500;
  const cairnLeft = short ? width / 2 - cairnSize / 2 : width * 0.07;
  const drop =
    visual === "stoneDrop" &&
    (Boolean(beat?.caption?.toLowerCase().includes("stone")) || pose === "point");
  const throwFrom =
    visual === "stoneDrop"
      ? handPosition({
          left: cairnLeft,
          size: cairnSize,
          layout,
          height,
        })
      : undefined;

  return (
    <Room mood={mood} layout={layout}>
      <PlantedCairn
        layout={layout}
        left={short ? undefined : cairnLeft}
        center={short}
        pose={pose}
        size={cairnSize}
        mood={mood}
        vo={scene.vo}
        voName={durationMap[scene.id] ? scene.id : undefined}
        spokenSec={durationMap[scene.id]}
      />
      {visual === "stoneDrop" ||
      visual === "eggsDrop" ||
      visual === "sparkWall" ? (
        <SceneVisual
          visual={visual}
          layout={layout}
          drop={drop}
          mood={mood}
          label={scene.label}
          throwFrom={throwFrom}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            right: short ? "50%" : "8%",
            top: short ? "18%" : "12%",
            transform: short ? "translateX(50%)" : undefined,
            zIndex: 2,
          }}
        >
          <SceneVisual
            visual={visual}
            layout={layout}
            drop={drop}
            mood={mood}
            label={scene.label}
            throwFrom={throwFrom}
          />
        </div>
      )}
      <CaptionBar
        text={caption}
        kicker={kicker}
        layout={layout}
        punch={Boolean(kicker)}
      />
    </Room>
  );
};
