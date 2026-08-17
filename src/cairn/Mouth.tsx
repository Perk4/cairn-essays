import { palette } from "../palette";
import envelopes from "../voEnvelopes.json";

export type Viseme = "closed" | "mid" | "open";

type MouthProps = {
  viseme: Viseme;
  size: number;
};

const SHAPE: Record<Viseme, { w: number; h: number; radius: string }> = {
  closed: { w: 0.11, h: 0.02, radius: "3px" },
  mid: { w: 0.1, h: 0.07, radius: "50%" },
  open: { w: 0.14, h: 0.13, radius: "50%" },
};

const envelopeMap = envelopes as Record<string, number[]>;

function visemeFromEnvelope(envelope: number[], frame: number): Viseme {
  const peak = Math.max(...envelope, 0.0001);
  const sample =
    envelope[Math.min(Math.max(frame, 0), envelope.length - 1)] ?? 0;
  const n = sample / peak;
  if (n < 0.16) {
    return "closed";
  }
  if (n < 0.48) {
    return "mid";
  }
  return "open";
}

export function mouthViseme(frame: number, voName?: string): Viseme {
  const envelope = voName ? envelopeMap[voName] : undefined;
  if (!envelope || envelope.length === 0) {
    return "closed";
  }
  return visemeFromEnvelope(envelope, frame);
}

export const Mouth = ({ viseme, size }: MouthProps) => {
  const shape = SHAPE[viseme];
  const width = size * shape.w;
  const height = size * shape.h;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "51.5%",
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
        backgroundColor: palette.outline,
        borderRadius: shape.radius,
        pointerEvents: "none",
      }}
    />
  );
};
