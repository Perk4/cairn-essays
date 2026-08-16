import { PlantedCairn } from "../cairn/CairnSlot";
import { CaptionBar } from "../components/CaptionBar";
import { Room } from "../components/Room";
import { bodyFont } from "../fonts";
import { palette } from "../palette";
import type { CiteCardScene, Pose } from "../types";

export const CiteCard = ({ scene }: { scene: CiteCardScene }) => {
  const pose: Pose = scene.pose ?? "listen";

  return (
    <Room mood="default">
      <PlantedCairn
        pose={pose}
        size={380}
        layout="flagship"
        left={32}
        vo={scene.vo}
      />
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 160,
          width: 720,
          backgroundColor: palette.stone,
          color: palette.cream,
          border: `4px solid ${palette.outline}`,
          borderRadius: 20,
          padding: "24px 28px",
        }}
      >
        {scene.lines.map((line) => (
          <div
            key={line}
            style={{
              fontFamily: bodyFont,
              fontWeight: 700,
              fontSize: 28,
              lineHeight: 1.35,
              marginBottom: 8,
            }}
          >
            {line}
          </div>
        ))}
      </div>
      <CaptionBar text={scene.lines[0] ?? "Paper"} layout="flagship" />
    </Room>
  );
};
