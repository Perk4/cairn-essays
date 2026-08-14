import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { CiteCardScene } from "../types";
import { Stage, cardStyle } from "../components/Stage";

export const CiteCard = ({ scene }: { scene: CiteCardScene }) => {
  return (
    <Stage>
      <div style={cardStyle({ maxWidth: 1400, width: "100%" })}>
        <div
          style={{
            fontFamily: bodyFont,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: palette.terracotta,
            marginBottom: 28,
          }}
        >
          Paper
        </div>
        {scene.lines.map((line) => (
          <div
            key={line}
            style={{
              fontFamily: displayFont,
              fontWeight: 600,
              fontSize: 48,
              lineHeight: 1.25,
              color: palette.outline,
              marginBottom: 12,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </Stage>
  );
};
