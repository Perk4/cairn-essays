import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FloorPile } from "./cairn/verbs";
import { bodyFont, displayFont } from "./fonts";
import { palette } from "./palette";
import type { Mood, Visual } from "./types";

const FINDING_SIZE = 120;

export const FINDING_TYPE_PX = FINDING_SIZE;

type VisualProps = {
  visual: Visual;
  layout: "flagship" | "short";
  drop?: boolean;
  mood?: Mood;
};

export const SceneVisual = ({
  visual,
  layout,
  drop = false,
  mood = "default",
}: VisualProps) => {
  switch (visual) {
    case "none":
      return null;
    case "deskStone":
      return <DeskStone layout={layout} />;
    case "callingHomework":
      return <CallingHomework layout={layout} mood={mood} />;
    case "citeChip":
      return <CiteChip />;
    case "articles":
      return <ArticlePair />;
    case "underpowered":
      return <UnderpoweredChip />;
    case "sparkWall":
      return null;
    case "hawkingPaper":
      return <HawkingPaper />;
    case "stoneDrop":
      return <FloorPile layout={layout} dropping={drop} />;
    default: {
      const exhaustive: never = visual;
      return exhaustive;
    }
  }
};

const DeskStone = ({ layout }: { layout: "flagship" | "short" }) => {
  const frame = useCurrentFrame();
  const glow = 0.45 + Math.sin(frame / 10) * 0.25;
  const width = layout === "short" ? 220 : 260;
  return (
    <div
      style={{
        width,
        height: 120,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 18,
          bottom: 0,
          width: 12,
          height: 44,
          backgroundColor: palette.stone,
          border: `4px solid ${palette.outline}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 18,
          bottom: 0,
          width: 12,
          height: 44,
          backgroundColor: palette.stone,
          border: `4px solid ${palette.outline}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 40,
          height: 18,
          backgroundColor: palette.stone,
          border: `4px solid ${palette.outline}`,
          borderRadius: 6,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "38%",
          bottom: 54,
          width: 64,
          height: 44,
          backgroundColor: palette.terracotta,
          border: `4px solid ${palette.outline}`,
          borderRadius: "50%",
          boxShadow: `0 0 ${22 + glow * 18}px rgba(165, 83, 45, ${glow})`,
        }}
      />
    </div>
  );
};

const CallingHomework = ({
  layout,
  mood,
}: {
  layout: "flagship" | "short";
  mood: Mood;
}) => {
  const calling = mood !== "cold";
  const width = layout === "short" ? 420 : 520;
  return (
    <div style={{ display: "flex", gap: 16, width }}>
      <MoodCard label="CALLING" color={palette.terracotta} active={calling} />
      <MoodCard label="HOMEWORK" color={palette.stone} active={!calling} />
    </div>
  );
};

const MoodCard = ({
  label,
  color,
  active,
}: {
  label: string;
  color: string;
  active: boolean;
}) => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: color,
        color: palette.cream,
        border: `4px solid ${palette.outline}`,
        borderRadius: 18,
        padding: "18px 12px",
        textAlign: "center",
        fontFamily: displayFont,
        fontWeight: 700,
        fontSize: 28,
        opacity: active ? 1 : 0.4,
        transform: `scale(${active ? 1 : 0.92})`,
      }}
    >
      {label}
    </div>
  );
};

const CiteChip = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: Math.max(0, frame - Math.round(1.2 * fps)),
    fps,
    config: { damping: 16 },
  });
  return (
    <div
      style={{
        backgroundColor: palette.stone,
        color: palette.cream,
        border: `4px solid ${palette.outline}`,
        borderRadius: 18,
        padding: "16px 22px",
        maxWidth: 520,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 24}px)`,
        fontFamily: bodyFont,
        fontWeight: 700,
        fontSize: 22,
        lineHeight: 1.35,
      }}
    >
      O’Keefe, Dweck & Walton, 2018
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginTop: 6,
          color: "#E8D7A4",
        }}
      >
        Psychological Science · DOI 10.1177/0956797618780643
      </div>
    </div>
  );
};

const ArticlePair = () => {
  const frame = useCurrentFrame();
  const cool = interpolate(frame, [40, 90], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ display: "flex", gap: 20 }}>
      <Article label="match" opacity={1} />
      <Article label="mismatch" opacity={cool} />
    </div>
  );
};

const Article = ({ label, opacity }: { label: string; opacity: number }) => (
  <div
    style={{
      width: 160,
      height: 210,
      backgroundColor: palette.cream,
      border: `4px solid ${palette.outline}`,
      borderRadius: 12,
      boxShadow: `8px 8px 0 ${palette.stone}`,
      opacity,
      padding: 14,
      fontFamily: bodyFont,
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: palette.outline,
    }}
  >
    {label}
    <div
      style={{
        marginTop: 16,
        height: 8,
        backgroundColor: palette.olive,
        borderRadius: 4,
      }}
    />
    <div
      style={{
        marginTop: 10,
        height: 8,
        width: "70%",
        backgroundColor: palette.terracotta,
        borderRadius: 4,
      }}
    />
    <div
      style={{
        marginTop: 10,
        height: 8,
        width: "86%",
        backgroundColor: palette.olive,
        borderRadius: 4,
      }}
    />
  </div>
);

const UnderpoweredChip = () => (
  <div
    style={{
      backgroundColor: palette.terracotta,
      color: palette.cream,
      border: `4px solid ${palette.outline}`,
      borderRadius: 18,
      padding: "18px 24px",
      fontFamily: displayFont,
      fontWeight: 700,
      fontSize: 32,
    }}
  >
    underpowered
    <div
      style={{
        marginTop: 8,
        fontFamily: bodyFont,
        fontSize: 18,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      sample size stays a footnote
    </div>
  </div>
);

const HawkingPaper = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const toPaper = interpolate(
    frame,
    [durationInFrames * 0.35, durationInFrames * 0.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div style={{ display: "flex", gap: 18, alignItems: "flex-end" }}>
      <div
        style={{
          width: 150,
          height: 100,
          backgroundColor: palette.terracotta,
          border: `4px solid ${palette.outline}`,
          borderRadius: 12,
          opacity: interpolate(toPaper, [0, 1], [1, 0.45]),
          fontFamily: bodyFont,
          fontWeight: 700,
          color: palette.cream,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "0.08em",
        }}
      >
        VIDEO
      </div>
      <div
        style={{
          width: 130,
          height: 180,
          backgroundColor: palette.cream,
          border: `4px solid ${palette.outline}`,
          borderRadius: 10,
          boxShadow: `8px 8px 0 ${palette.stone}`,
          transform: `translateY(${(1 - toPaper) * 40}px)`,
          opacity: 0.35 + toPaper * 0.65,
          padding: 12,
          fontFamily: bodyFont,
          fontWeight: 700,
          fontSize: 16,
          color: palette.outline,
        }}
      >
        SCIENCE
        <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600 }}>
          Begelman, 2003
        </div>
      </div>
    </div>
  );
};

export const splitStat = (
  stat: string,
): { left: string; right: string } | null => {
  const parts = stat.split(/\s+vs\.?\s+/i);
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null;
  }
  return { left: parts[0], right: parts[1] };
};
