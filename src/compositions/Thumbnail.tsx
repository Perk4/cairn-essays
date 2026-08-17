import { AbsoluteFill } from "remotion";
import { CairnSlot } from "../cairn/CairnSlot";
import { episode } from "../episode";
import { displayFont } from "../fonts";
import { palette } from "../palette";

export const Thumbnail = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: palette.cream }}>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 80,
        }}
      >
        <CairnSlot pose="point" size={720} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 120,
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          color: palette.outline,
          textAlign: "right",
          maxWidth: 720,
        }}
      >
        {episode.thumbLine}
      </div>
    </AbsoluteFill>
  );
};
