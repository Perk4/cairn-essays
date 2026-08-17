import { existsSync, readFileSync } from "node:fs";

const NEW_POSES = ["react", "present", "slump"];
const OLD_POSES = ["still", "listen", "point"];

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));

function fail(message) {
  console.error(message);
  process.exit(1);
}

for (const pose of [...OLD_POSES, ...NEW_POSES]) {
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

for (const pose of NEW_POSES) {
  if (!used.has(pose)) {
    fail(`${pose} is never selected on a Part`);
  }
}
for (const pose of OLD_POSES) {
  if (!used.has(pose)) {
    fail(`${pose} dropped off the episode`);
  }
}

const parts = ep.scenes.filter((scene) => scene.id.startsWith("part"));
for (const part of parts) {
  const first = part.beats?.[0];
  if (!first || first.pose !== "present") {
    fail(`${part.id} should open on present`);
  }
}

console.log(`poses used  ${[...used].join(" ")}`);
console.log("pose check ok");
