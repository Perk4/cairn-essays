import { CairnSlot } from "../cairn/CairnSlot";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { EndCardScene, Pose } from "../types";

export const EndCard = ({ scene }: { scene: EndCardScene }) => {
  const pose: Pose = scene.pose ?? "still";

  return (
    <Room mood="warm">
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 40,
          transform: "translateX(-50%)",
        }}
      >
        <CairnSlot pose={pose} size={300} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          top: 360,
          backgroundColor: palette.stone,
          color: palette.cream,
          border: `5px solid ${palette.outline}`,
          borderRadius: 28,
          padding: "36px 48px",
          textAlign: "center",
          boxShadow: `16px 16px 0 ${palette.terracotta}`,
        }}
      >
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 64,
          }}
        >
          {scene.title}
        </div>
        <div
          style={{
            marginTop: 28,
            fontFamily: displayFont,
            fontWeight: 600,
            fontSize: 36,
            color: "#E8D7A4",
          }}
        >
          {scene.cta}
        </div>
        <div
          style={{
            marginTop: 28,
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
