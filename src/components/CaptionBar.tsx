import { interpolate, useCurrentFrame } from "remotion";
import { bodyFont, displayFont } from "../fonts";
import { palette } from "../palette";

type CaptionBarProps = {
  text: string;
  kicker?: string;
  layout: "flagship" | "short";
  punch?: boolean;
  localFrame?: number;
};

export const CaptionBar = ({
  text,
  kicker,
  layout,
  punch = false,
  localFrame,
}: CaptionBarProps) => {
  const frame = useCurrentFrame();
  const short = layout === "short";
  const t = localFrame ?? frame;
  const rise = interpolate(t, [0, punch ? 8 : 14], [18, 0], {
    extrapolateRight: "clamp",
  });
  const kickerSize = short ? (punch && frame < 60 ? 92 : 56) : 28;

  return (
    <div
      style={{
        position: "absolute",
        left: short ? 48 : 80,
        right: short ? 48 : 80,
        bottom: short ? 72 : 48,
        transform: `translateY(${rise}px)`,
        backgroundColor: palette.stone,
        color: palette.cream,
        border: `4px solid ${palette.outline}`,
        borderRadius: 22,
        padding: short ? "22px 26px" : "18px 28px",
        zIndex: 4,
      }}
    >
      {kicker ? (
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 700,
            fontSize: kickerSize,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: palette.cream,
            marginBottom: 8,
            lineHeight: 0.95,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 600,
          fontSize: short ? 44 : 38,
          lineHeight: 1.18,
          letterSpacing: "-0.02em",
        }}
      >
        {text}
      </div>
    </div>
  );
};
