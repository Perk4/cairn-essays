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

const gap = ep.scenes.find((scene) => scene.id === "s5gap");
if (!gap || gap.type !== "numberCard" || gap.stat !== "2.75 vs 3.59") {
  fail("missing 2.75 vs 3.59 number card");
}
if (!gap.beats?.some((beat) => beat.pose === "point")) {
  fail("number card never points");
}

const people = ep.scenes.find((scene) => scene.id === "s3");
if (!people || people.stat !== "470") {
  fail("missing 470 number card");
}

if (!ep.scenes.some((scene) => scene.id === "quote" && scene.type === "quoteCard")) {
  fail("missing eggs quote");
}
if (!ep.scenes.some((scene) => scene.id === "stack" && scene.visual === "stoneDrop")) {
  fail("missing stone throw");
}
if (!ep.scenes.some((scene) => scene.type === "limitsCard")) {
  fail("missing limits wall");
}

const parts = ep.scenes.filter((scene) => scene.id.startsWith("part"));
for (const part of parts) {
  const first = part.beats?.[0];
  if (!first || first.pose !== "present") {
    fail(`${part.id} should open on present`);
  }
}

console.log(`kit ${KIT.join(" ")}`);
console.log(`poses used  ${[...used].join(" ")}`);
console.log("pose check ok");
