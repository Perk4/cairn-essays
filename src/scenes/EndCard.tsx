import { useVideoConfig } from "remotion";
import { PlantedCairn } from "../cairn/CairnSlot";
import { FloorPile } from "../cairn/verbs";
import { plantedTopPx } from "../cairn/stage";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { EndCardScene, Pose } from "../types";

export const EndCard = ({ scene }: { scene: EndCardScene }) => {
  const { height, width } = useVideoConfig();
  const pose: Pose = scene.pose ?? "still";
  const size = 380;
  const left = Math.round((width - size) / 2 - 90);
  const top = plantedTopPx(size, "flagship", height);
  const throwFrom = { x: left + size * 0.7, y: top + size * 0.38 };

  return (
    <Room mood="warm">
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 56,
          color: palette.outline,
          letterSpacing: "-0.03em",
        }}
      >
        {scene.title}
      </div>
      <PlantedCairn
        pose={pose}
        size={size}
        layout="flagship"
        left={left}
        nod
        nodAtSec={1.6}
        vo={scene.vo}
      />
      <FloorPile
        layout="flagship"
        dropping
        throwFrom={throwFrom}
        pileLeft={left + size - 20}
      />
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 128,
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 18,
          color: palette.stone,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {scene.cite}
        {scene.footnote ? ` · ${scene.footnote}` : ""}
      </div>
      <CaptionBar text={scene.cta} layout="flagship" />
    </Room>
  );
};
