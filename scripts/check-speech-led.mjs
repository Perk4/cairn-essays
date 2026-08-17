import { readFileSync } from "node:fs";

const SETTLE = 0.8;

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));

function fail(message) {
  console.error(message);
  process.exit(1);
}

const hook = ep.scenes.find((scene) => scene.id === "hook");
if (!hook) {
  fail("missing hook scene");
}
if (hook.speechLed !== true) {
  fail("hook must be speechLed");
}
if (hook.durationSec !== undefined) {
  fail("speech-led hook must not set durationSec");
}

const voSec = durations.hook;
if (typeof voSec !== "number" || voSec <= 0) {
  fail("hook VO duration missing");
}

if (ep.title !== "Find it or develop it") {
  fail(`title drifted: ${ep.title}`);
}
if (ep.paper.authors !== "O’Keefe, Dweck & Walton" || ep.paper.year !== 2018) {
  fail("warrant drifted");
}

const others = ep.scenes.filter((scene) => scene.id !== "hook");
if (others.length === 0) {
  fail("rest of episode missing");
}
for (const scene of others) {
  if (scene.speechLed === true) {
    if (scene.durationSec !== undefined) {
      fail(`${scene.id} is speech-led; drop durationSec`);
    }
    continue;
  }
  if (typeof scene.durationSec !== "number" || scene.durationSec <= 0) {
    fail(`${scene.id} no longer has a duration`);
  }
}

console.log(
  `hook VO ${voSec.toFixed(3)}s  picture ${(voSec + SETTLE).toFixed(3)}s  settle ${SETTLE}s`,
);
console.log(`other scenes ${others.length} still have durationSec`);
console.log("speech-led check ok");
