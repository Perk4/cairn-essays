import { readFileSync } from "node:fs";

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

const hook = ep.scenes.find((scene) => scene.id === "hook");
const part1 = ep.scenes.find((scene) => scene.id === "part1");
if (!hook || !part1) {
  fail("missing hook or part1");
}
if (hook.speechLed !== true || part1.speechLed !== true) {
  fail("hook and part1 must be speechLed");
}
if (hook.type === "citeCard" || part1.type === "citeCard") {
  fail("tip-list beats must not be cite cards");
}
if (part1.visual !== "conceptLabel" || !part1.label) {
  fail("part1 needs an on-screen concept label");
}

for (const scene of [hook, part1]) {
  if (!/\bCairn\b/.test(scene.vo)) {
    fail(`${scene.id} is not third-person Cairn`);
  }
  if (/^\s*I\b/.test(scene.vo)) {
    fail(`${scene.id} starts in first person`);
  }
  const voSec = durations[scene.id];
  if (typeof voSec !== "number" || voSec <= 0) {
    fail(`${scene.id} VO duration missing`);
  }
}

if (!/Tuesday/i.test(hook.vo) || !/Thursday/i.test(hook.vo)) {
  fail("hook is not the Tuesday/Thursday incident");
}

const hookSec = durations.hook;
if (hookSec < 20 || hookSec > 34) {
  fail(`hook VO ${hookSec}s is not a ~26s feel`);
}

console.log(
  `hook ${durations.hook.toFixed(2)}s  part1 ${durations.part1.toFixed(2)}s  label ${part1.label}`,
);
console.log("tip-list check ok");
