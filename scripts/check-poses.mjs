import { existsSync, readFileSync } from "node:fs";

const KIT = [
  "still",
  "listen",
  "point",
  "mouth-closed",
  "mouth-mid",
  "mouth-open",
  "tue-open",
  "thu-slits",
];
const NEW_POSES = ["react", "present", "slump"];
const OLD_POSES = ["still", "listen", "point"];

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));

function fail(message) {
  console.error(message);
  process.exit(1);
}

for (const pose of [...KIT, ...NEW_POSES]) {
  if (!existsSync(`public/cairn/${pose}.png`)) {
    fail(`missing public/cairn/${pose}.png`);
  }
}

const used = new Set();
for (const scene of ep.scenes) {
  if (scene.pose) {
    used.add(scene.pose);
  }
  for (const beat of scene.beats ?? []) {
    if (beat.pose) {
      used.add(beat.pose);
    }
  }
}
for (const beat of [...(ep.shorts?.hook ?? []), ...(ep.shorts?.rule ?? [])]) {
  if (beat.pose) {
    used.add(beat.pose);
  }
}

for (const pose of [...NEW_POSES, ...OLD_POSES]) {
  if (!used.has(pose)) {
    fail(`${pose} is never selected`);
  }
}

const hook = ep.scenes.find((scene) => scene.id === "hook");
const tue = hook?.beats?.find((beat) => beat.caption === "TUESDAY");
const thu = hook?.beats?.find((beat) => beat.caption === "THURSDAY");
if (!tue || tue.mood !== "warm" || tue.pose !== "listen") {
  fail("Tuesday must be listen + warm (tue-open)");
}
if (!thu || thu.mood !== "cold" || thu.pose !== "still") {
  fail("Thursday must be still + cold (thu-slits)");
}

const gap = ep.scenes.find((scene) => scene.id === "gap");
if (!gap || gap.type !== "numberCard" || gap.stat !== "2.75 vs 3.59") {
  fail("missing 2.75 vs 3.59 number card");
}
if (!gap.beats?.some((beat) => beat.pose === "point")) {
  fail("number card never points");
}

if (ep.scenes.some((scene) => String(scene.stat ?? "") === "470")) {
  fail("470 is still a hero number");
}
if (ep.scenes.some((scene) => scene.type === "limitsCard")) {
  fail("limits wall is still in the cut");
}

if (!ep.scenes.some((scene) => scene.id === "eggs" && scene.type === "quoteCard")) {
  fail("missing eggs quote");
}
if (!ep.scenes.some((scene) => scene.id === "stack" && scene.visual === "stoneDrop")) {
  fail("missing stone throw");
}

console.log(`kit ${KIT.join(" ")}`);
console.log(`poses used  ${[...used].join(" ")}`);
console.log("pose check ok");
