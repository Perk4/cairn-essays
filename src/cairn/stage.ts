export type Layout = "flagship" | "short";

/** Opaque base of still/listen/point PNGs (measured, 800×800). */
export const CAIRN_BASE_PCT = 0.858;

export const FLOOR_TOP_PCT = {
  flagship: 70,
  short: 58,
} as const;

/** Point pose: twig hand, top-right of the sprite. */
export const POINT_HAND_PCT = { x: 0.94, y: 0.13 } as const;

export function floorTopPct(layout: Layout): number {
  return FLOOR_TOP_PCT[layout];
}

export function floorY(layout: Layout, height: number): number {
  return (floorTopPct(layout) / 100) * height;
}

export function plantedTopPx(
  size: number,
  layout: Layout,
  height: number,
): number {
  return floorY(layout, height) - size * CAIRN_BASE_PCT;
}

export function plantedTopStyle(size: number, layout: Layout): string {
  return `calc(${floorTopPct(layout)}% - ${size * CAIRN_BASE_PCT}px)`;
}

export function handPosition(args: {
  left: number;
  size: number;
  layout: Layout;
  height: number;
}): { x: number; y: number } {
  const top = plantedTopPx(args.size, args.layout, args.height);
  return {
    x: args.left + args.size * POINT_HAND_PCT.x,
    y: top + args.size * POINT_HAND_PCT.y,
  };
}

export function leanForPose(pose: "still" | "listen" | "point"): number {
  switch (pose) {
    case "listen":
      return 7;
    case "point":
      return 3;
    case "still":
      return 0;
    default: {
      const exhaustive: never = pose;
      return exhaustive;
    }
  }
}
