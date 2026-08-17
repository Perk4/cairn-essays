import { readFileSync } from "node:fs";

const SETTLE = 0.8;
const FEEL = 450;
const FEEL_SLACK = 50;

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (ep.title !== "Find it or develop it") {
  fail(`title drifted: ${ep.title}`);
}
if (ep.paper.authors !== "O’Keefe, Dweck & Walton" || ep.paper.year !== 2018) {
  fail("warrant drifted");
}

const parts = ep.scenes.filter((scene) => /^part\d+$/.test(scene.id));
if (parts.length < 4 || parts.length > 5) {
  fail(`want 4–5 Parts, got ${parts.length}`);
}

const hook = ep.scenes.find((scene) => scene.id === "hook");
const close = ep.scenes.find((scene) => scene.id === "end");
if (!hook || !close) {
  fail("missing hook or close");
}

let picture = 0;
for (const scene of ep.scenes) {
  if (scene.type === "citeCard") {
    fail(`${scene.id} is a cite card`);
  }
  if (scene.speechLed !== true) {
    fail(`${scene.id} is not speech-led`);
  }
  if (scene.durationSec !== undefined) {
    fail(`${scene.id} still has a hold`);
  }
  if (scene.id !== "hook" && scene.id !== "end" && !/\bCairn\b/.test(scene.vo)) {
    fail(`${scene.id} is not third-person Cairn`);
  }
  if (scene.id.startsWith("part") && (scene.visual !== "conceptLabel" || !scene.label)) {
    fail(`${scene.id} needs a concept label`);
  }
  const voSec = durations[scene.id];
  if (typeof voSec !== "number" || voSec <= 0) {
    fail(`${scene.id} VO duration missing`);
  }
  picture += voSec + SETTLE;
}

if (!/Tuesday/i.test(hook.vo) || !/Thursday/i.test(hook.vo)) {
  fail("hook is not the Tuesday/Thursday incident");
}

if (picture < FEEL - FEEL_SLACK) {
  fail(`feel ${picture.toFixed(0)}s is short of ${FEEL}s`);
}

console.log(
  `${parts.length} parts  picture ${picture.toFixed(1)}s  feel ${(picture / 60).toFixed(2)}m`,
);
console.log("tip-list check ok");
