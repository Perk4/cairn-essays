import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CairnSlot } from "../cairn/CairnSlot";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { NamedFrameScene } from "../types";

export const NamedFrame = ({ scene }: { scene: NamedFrameScene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <Room mood="default">
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
        }}
      >
        <div
          style={{
            width: "50%",
            backgroundColor: "rgba(165, 83, 45, 0.34)",
            borderRight: `6px solid ${palette.outline}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            transform: `translateX(${(1 - enter) * -80}px)`,
          }}
        >
          <CairnSlot pose="still" size={300} />
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: 96,
              color: palette.terracotta,
              letterSpacing: "0.06em",
            }}
          >
            {scene.left}
          </div>
        </div>
        <div
          style={{
            width: "50%",
            backgroundColor: "rgba(121, 102, 53, 0.38)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            transform: `translateX(${(1 - enter) * 80}px)`,
          }}
        >
          <CairnSlot pose="listen" size={300} />
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: 96,
              color: palette.olive,
              letterSpacing: "0.06em",
            }}
          >
            {scene.right}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: bodyFont,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: palette.stone,
          fontSize: 22,
        }}
      >
        two theories
      </div>
      <CaptionBar text={scene.caption} layout="flagship" />
    </Room>
  );
};
