import { PlantedCairn } from "../cairn/CairnSlot";
import { FloorPile } from "../cairn/verbs";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { EndCardScene, Pose } from "../types";
import voDurations from "../../public/vo/durations.json";

const durationMap = voDurations as Record<string, number>;

export const EndCard = ({ scene }: { scene: EndCardScene }) => {
  const pose: Pose = scene.pose ?? "still";

  return (
    <Room mood="warm">
      <PlantedCairn
        layout="flagship"
        center
        pose={pose}
        size={340}
        nod
        vo={scene.vo}
        voName={durationMap[scene.id] ? scene.id : undefined}
        spokenSec={durationMap[scene.id]}
      />
      <FloorPile layout="flagship" dropping={false} pileLeft={120} />
      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          top: 120,
          backgroundColor: palette.stone,
          color: palette.cream,
          border: `5px solid ${palette.outline}`,
          borderRadius: 28,
          padding: "28px 48px",
          textAlign: "center",
          boxShadow: `16px 16px 0 ${palette.terracotta}`,
          zIndex: 3,
        }}
      >
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 52,
          }}
        >
          {scene.title}
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: displayFont,
            fontWeight: 600,
            fontSize: 32,
            color: "#E8D7A4",
          }}
        >
          {scene.cta}
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 18,
            color: "#E8D7A4",
            lineHeight: 1.4,
          }}
        >
          {scene.cite}
          {scene.footnote ? ` · ${scene.footnote}` : ""}
        </div>
      </div>
      <CaptionBar text="Develop it." layout="flagship" />
    </Room>
  );
};
