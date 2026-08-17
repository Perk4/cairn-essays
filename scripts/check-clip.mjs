import { readFileSync } from "node:fs";

const CLIP_MIN = 20;
const CLIP_MAX = 45;
const SETTLE = 0.8;

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));

function fail(message) {
  console.error(message);
  process.exit(1);
}

const clips = ep.clips ?? [];
if (clips.length < 4 || clips.length > 6) {
  fail(`want 4–6 Clips, got ${clips.length}`);
}
if (clips.some((clip) => clip.sceneId === "end")) {
  fail("close/recap must not be a Clip");
}

for (const clip of clips) {
  if (!clip.kicker) {
    fail(`${clip.id} needs a first-frame kicker`);
  }
  const scene = ep.scenes.find((item) => item.id === clip.sceneId);
  if (!scene) {
    fail(`${clip.id} missing flagship scene`);
  }
  const voSec = durations[clip.sceneId];
  if (typeof voSec !== "number" || voSec <= 0) {
    fail(`${clip.id} missing the flagship take`);
  }
  const picture = Math.min(CLIP_MAX, Math.max(CLIP_MIN, voSec + SETTLE));
  if (picture < CLIP_MIN || picture > CLIP_MAX) {
    fail(`${clip.id} picture ${picture}s is outside 20–45`);
  }
}

console.log(
  `${clips.length} clips  ${clips.map((c) => c.kicker).join(" | ")}`,
);
console.log("clip check ok");
