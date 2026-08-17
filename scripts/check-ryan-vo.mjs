import { readFileSync } from "node:fs";

const TARGET_WPM = 165;
const WPM_SLACK = 35;

function fail(message) {
  console.error(message);
  process.exit(1);
}

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));
const envelopes = JSON.parse(readFileSync("src/voEnvelopes.json", "utf8"));
const meta = JSON.parse(readFileSync("public/vo/hook.meta.json", "utf8"));
const hook = ep.scenes.find((scene) => scene.id === "hook");
if (!hook) {
  fail("missing hook");
}

const banned = ["say", "samantha", "xtts", "eleven", "openai", "azure", "google"];
const stamp = `${meta.engine} ${meta.model}`.toLowerCase();
for (const token of banned) {
  if (stamp.includes(token)) {
    fail(`banned show voice: ${stamp}`);
  }
}
if (!stamp.includes("ryan") && !stamp.includes("af_heart")) {
  fail(`engine is not Ryan or the Kokoro fallback: ${stamp}`);
}

const voSec = durations.hook;
const envelope = envelopes.hook;
if (typeof voSec !== "number" || voSec <= 0) {
  fail("hook duration missing");
}
if (!Array.isArray(envelope) || envelope.length < 8) {
  fail("hook envelope missing");
}
if (!envelope.some((n) => n > 0.05)) {
  fail("hook envelope is silent");
}

const words = hook.vo.trim().split(/\s+/).filter(Boolean).length;
const wpm = (words / voSec) * 60;
if (Math.abs(wpm - TARGET_WPM) > WPM_SLACK) {
  fail(`hook is ${wpm.toFixed(0)} wpm, want ~${TARGET_WPM}`);
}

console.log(
  `hook ${meta.engine} ${voSec.toFixed(2)}s  ${wpm.toFixed(0)} wpm  envelope ${envelope.length}`,
);
console.log("ryan vo check ok");
