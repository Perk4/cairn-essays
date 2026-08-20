import { AbsoluteFill, Img, staticFile } from "remotion";
import { episode } from "../episode";
import { displayFont } from "../fonts";
import { palette } from "../palette";

export const Thumbnail = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: palette.cream }}>
      <Img
        src={staticFile(`ep01-stills/${episode.thumbStill}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 72,
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: 92,
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          color: palette.outline,
          textAlign: "center",
        }}
      >
        {episode.thumbLine}
      </div>
    </AbsoluteFill>
  );
};
