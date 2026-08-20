import { existsSync, readFileSync } from "node:fs";

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));

function fail(message) {
  console.error(message);
  process.exit(1);
}

const names = new Set();
for (const scene of ep.scenes) {
  names.add(scene.still);
  if (scene.altStill) {
    names.add(scene.altStill);
  }
  for (const extra of scene.holdStills ?? []) {
    names.add(extra);
  }
}
for (const beat of ep.shorts.hook) {
  names.add(beat.still);
  if (beat.altStill) {
    names.add(beat.altStill);
  }
  for (const extra of beat.holdStills ?? []) {
    names.add(extra);
  }
}
names.add(ep.thumbStill);

for (const name of names) {
  const path = `public/ep01-stills/${name}`;
  if (!existsSync(path)) {
    fail(`missing ${path}`);
  }
}

const required = [
  "01-intro-this-is-cairn.png",
  "05-thursday-cairn-sits-down.png",
  "08-the-move-square-is-gone.png",
  "08-the-move-walks-over.png",
  "08-the-move-walks-past.png",
  "09-cta.png",
];
for (const name of required) {
  if (!existsSync(`public/ep01-stills/${name}`)) {
    fail(`required still missing: ${name}`);
  }
}

console.log(`${names.size} stills on disk`);
console.log("stills check ok");
