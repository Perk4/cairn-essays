import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { LimitsCardScene } from "../types";
import { Stage, cardStyle } from "../components/Stage";

export const LimitsCard = ({ scene }: { scene: LimitsCardScene }) => {
  return (
    <Stage>
      <div style={cardStyle({ maxWidth: 1500, width: "100%" })}>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 56,
            color: palette.outline,
            marginBottom: 32,
          }}
        >
          Limits
        </div>
        {scene.items.map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                marginTop: 10,
                borderRadius: "50%",
                backgroundColor: palette.terracotta,
                border: `3px solid ${palette.outline}`,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontFamily: bodyFont,
                fontWeight: 600,
                fontSize: 36,
                lineHeight: 1.3,
                color: palette.outline,
              }}
            >
              {item}
            </div>
          </div>
        ))}
      </div>
    </Stage>
  );
};
