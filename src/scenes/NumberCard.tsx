import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { NumberCardScene } from "../types";
import { Stage, cardStyle } from "../components/Stage";

export const NumberCard = ({ scene }: { scene: NumberCardScene }) => {
  return (
    <Stage>
      <div style={cardStyle({ maxWidth: 1500, width: "100%", textAlign: "center" })}>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 700,
            fontSize: 32,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: palette.olive,
            marginBottom: 20,
          }}
        >
          {scene.kicker}
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 120,
            letterSpacing: "-0.03em",
            color: palette.outline,
            lineHeight: 1,
          }}
        >
          {scene.stat}
        </div>
        <div
          style={{
            marginTop: 36,
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 36,
            lineHeight: 1.3,
            color: palette.stone,
          }}
        >
          {scene.note}
        </div>
      </div>
    </Stage>
  );
};
