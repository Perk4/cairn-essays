import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PlantedCairn } from "../cairn/CairnSlot";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";
import type { NamedFrameScene } from "../types";

export const NamedFrame = ({ scene }: { scene: NamedFrameScene }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const size = 300;
  const half = width / 2;

  return (
    <Room mood="default" plain>
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
            transform: `translateX(${(1 - enter) * -80}px)`,
          }}
        />
        <div
          style={{
            width: "50%",
            backgroundColor: "rgba(121, 102, 53, 0.38)",
            transform: `translateX(${(1 - enter) * 80}px)`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          width: "50%",
          textAlign: "center",
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 96,
          color: palette.terracotta,
          letterSpacing: "0.06em",
        }}
      >
        {scene.left}
      </div>
      <div
        style={{
          position: "absolute",
          top: 120,
          left: "50%",
          width: "50%",
          textAlign: "center",
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 96,
          color: palette.olive,
          letterSpacing: "0.06em",
        }}
      >
        {scene.right}
      </div>
      <PlantedCairn
        pose="still"
        size={size}
        layout="flagship"
        left={Math.round(half / 2 - size / 2)}
        vo={scene.vo}
      />
      <PlantedCairn
        pose="listen"
        size={size}
        layout="flagship"
        left={Math.round(half + half / 2 - size / 2)}
        vo={scene.vo}
      />
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
