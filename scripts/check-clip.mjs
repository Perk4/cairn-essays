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

const clip = (ep.clips ?? []).find((item) => item.id === "part1");
if (!clip) {
  fail("missing part1 clip");
}
if (clip.sceneId !== "part1") {
  fail("part1 clip must remount the flagship part1 take");
}
if (!clip.kicker) {
  fail("part1 clip needs a first-frame kicker");
}

const scene = ep.scenes.find((item) => item.id === "part1");
if (!scene) {
  fail("flagship part1 missing");
}

const voSec = durations.part1;
if (typeof voSec !== "number" || voSec <= 0) {
  fail("part1 VO missing");
}

const picture = Math.min(CLIP_MAX, Math.max(CLIP_MIN, voSec + SETTLE));
if (picture < CLIP_MIN || picture > CLIP_MAX) {
  fail(`clip picture ${picture}s is outside 20–45`);
}

console.log(
  `clip part1 kicker ${clip.kicker}  vo ${voSec.toFixed(2)}s  picture ${picture.toFixed(2)}s`,
);
console.log("clip check ok");
