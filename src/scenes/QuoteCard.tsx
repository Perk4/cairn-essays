import { PlantedCairn } from "../cairn/CairnSlot";
import { EggsDrop } from "../cairn/verbs";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { bodyFont } from "../fonts";
import { palette } from "../palette";
import type { Pose, QuoteCardScene } from "../types";

export const QuoteCard = ({ scene }: { scene: QuoteCardScene }) => {
  const pose: Pose = scene.pose ?? "still";
  const line = scene.caption ?? "Eggs in one basket. Then you drop it.";

  return (
    <Room mood="cold">
      <PlantedCairn
        pose={pose}
        size={400}
        layout="flagship"
        left={24}
        vo={scene.vo}
      />
      <EggsDrop layout="flagship" />
      <div
        style={{
          position: "absolute",
          right: 64,
          top: 72,
          fontFamily: bodyFont,
          fontWeight: 700,
          fontSize: 20,
          color: palette.stone,
        }}
      >
        {scene.attr}
      </div>
      <CaptionBar text={line} layout="flagship" />
    </Room>
  );
};
