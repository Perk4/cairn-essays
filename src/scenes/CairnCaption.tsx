import { CairnSlot } from "../cairn/CairnSlot";
import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { CairnCaptionScene } from "../types";
import { Stage } from "../components/Stage";

type Props = {
  scene: CairnCaptionScene;
  layout: "flagship" | "short";
};

export const CairnCaption = ({ scene, layout }: Props) => {
  const short = layout === "short";
  const cairnSize = short ? 420 : 460;
  const fontSize = short ? 64 : 72;

  return (
    <Stage pad={short ? 72 : 80}>
      <div
        style={{
          display: "flex",
          flexDirection: short ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: short ? 48 : 72,
          width: "100%",
          maxWidth: short ? 900 : 1680,
        }}
      >
        <CairnSlot pose={scene.pose} live size={cairnSize} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            flex: 1,
            alignItems: short ? "center" : "flex-start",
          }}
        >
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 600,
              fontSize,
              lineHeight: 1.15,
              color: palette.outline,
              letterSpacing: "-0.02em",
              textAlign: short ? "center" : "left",
            }}
          >
            {scene.caption}
          </div>
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: 22,
              fontWeight: 600,
              color: palette.olive,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Cairn
          </div>
        </div>
      </div>
    </Stage>
  );
};
