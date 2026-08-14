import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { NamedFrameScene } from "../types";
import { Stage, cardStyle } from "../components/Stage";

export const NamedFrame = ({ scene }: { scene: NamedFrameScene }) => {
  return (
    <Stage>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 48,
          width: "100%",
          maxWidth: 1600,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: 36,
          }}
        >
          <div
            style={cardStyle({
              flex: 1,
              textAlign: "center",
              backgroundColor: palette.cream,
              borderColor: palette.terracotta,
            })}
          >
            <div
              style={{
                fontFamily: displayFont,
                fontWeight: 700,
                fontSize: 96,
                letterSpacing: "0.04em",
                color: palette.terracotta,
              }}
            >
              {scene.left}
            </div>
          </div>
          <div
            style={cardStyle({
              flex: 1,
              textAlign: "center",
              borderColor: palette.olive,
            })}
          >
            <div
              style={{
                fontFamily: displayFont,
                fontWeight: 700,
                fontSize: 96,
                letterSpacing: "0.04em",
                color: palette.olive,
              }}
            >
              {scene.right}
            </div>
          </div>
        </div>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 44,
            color: palette.outline,
            textAlign: "center",
          }}
        >
          {scene.caption}
        </div>
      </div>
    </Stage>
  );
};
