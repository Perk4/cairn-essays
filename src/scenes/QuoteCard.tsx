import { PlantedCairn } from "../cairn/CairnSlot";
import { EggsDrop } from "../cairn/verbs";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { bodyFont } from "../fonts";
import { palette } from "../palette";
import type { Pose, QuoteCardScene } from "../types";
import voDurations from "../../public/vo/durations.json";

const durationMap = voDurations as Record<string, number>;

export const QuoteCard = ({ scene }: { scene: QuoteCardScene }) => {
  const pose: Pose = scene.pose ?? "still";
  const line = scene.caption ?? "Eggs in one basket. Then you drop it.";

  return (
    <Room mood="cold">
      <PlantedCairn
        layout="flagship"
        left={40}
        pose={pose}
        size={400}
        mood="cold"
        vo={scene.vo}
        voName={durationMap[scene.id] ? scene.id : undefined}
        spokenSec={durationMap[scene.id]}
      />
      <EggsDrop layout="flagship" />
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 180,
          fontFamily: bodyFont,
          fontWeight: 700,
          fontSize: 20,
          color: palette.stone,
          zIndex: 3,
        }}
      >
        {scene.attr}
      </div>
      <CaptionBar text={line} layout="flagship" />
    </Room>
  );
};
