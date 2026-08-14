import { CairnSlot } from "../cairn/CairnSlot";
import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { EndCardScene } from "../types";
import { Stage, cardStyle } from "../components/Stage";

export const EndCard = ({ scene }: { scene: EndCardScene }) => {
  return (
    <Stage>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          width: "100%",
          maxWidth: 1400,
        }}
      >
        <CairnSlot pose="still" size={280} />
        <div style={cardStyle({ width: "100%", textAlign: "center" })}>
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: 72,
              color: palette.outline,
            }}
          >
            {scene.title}
          </div>
          <div
            style={{
              marginTop: 20,
              fontFamily: bodyFont,
              fontWeight: 600,
              fontSize: 32,
              color: palette.olive,
            }}
          >
            {scene.cite}
          </div>
          <div
            style={{
              marginTop: 36,
              fontFamily: displayFont,
              fontWeight: 600,
              fontSize: 40,
              color: palette.terracotta,
            }}
          >
            {scene.cta}
          </div>
        </div>
      </div>
    </Stage>
  );
};
