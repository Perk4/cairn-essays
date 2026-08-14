import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { QuoteCardScene } from "../types";
import { Stage, cardStyle } from "../components/Stage";

export const QuoteCard = ({ scene }: { scene: QuoteCardScene }) => {
  return (
    <Stage>
      <div style={cardStyle({ maxWidth: 1500, width: "100%" })}>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 600,
            fontSize: 52,
            lineHeight: 1.28,
            color: palette.outline,
          }}
        >
          “{scene.quote}”
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: bodyFont,
            fontWeight: 700,
            fontSize: 32,
            color: palette.terracotta,
          }}
        >
          {scene.attr}
        </div>
      </div>
    </Stage>
  );
};
