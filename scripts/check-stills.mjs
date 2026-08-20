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
  "01-intro-full-body.png",
  "01-intro-this-is-cairn.png",
  "02-tue-keyboard-day.png",
  "03-tue-walk-in.png",
  "04-tue-play-dusk.png",
  "05-keys-square.png",
  "05-thursday-cairn-sits-down.png",
  "06-keys-deleted.png",
  "07-thu-clock-seven.png",
  "08-thu-meeting-sit.png",
  "08-the-move-square-is-gone.png",
  "08-the-move-walks-over.png",
  "08-the-move-walks-past.png",
  "09-cta.png",
  "09-thu-lid-close.png",
  "10-fri-walk-mug.png",
  "11-want-vs-homework.png",
  "12-one-stone.png",
  "13-cta-quiet.png",
];
for (const name of required) {
  if (!existsSync(`public/ep01-stills/${name}`)) {
    fail(`required still missing: ${name}`);
  }
}

console.log(`${names.size} stills on disk`);
console.log("stills check ok");
