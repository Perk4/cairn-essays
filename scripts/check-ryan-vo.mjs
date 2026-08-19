import { readFileSync } from "node:fs";

const TARGET_WPM = 165;
const WPM_SLACK = 15;

function fail(message) {
  console.error(message);
  process.exit(1);
}

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));
const envelopes = JSON.parse(readFileSync("src/voEnvelopes.json", "utf8"));
const banned = ["say", "samantha", "xtts", "eleven", "openai", "azure", "google"];

const lines = ep.scenes.filter((scene) => scene.speechLed === true);
if (lines.length === 0) {
  fail("no speechLed lines");
}

for (const scene of lines) {
  const meta = JSON.parse(readFileSync(`public/vo/${scene.id}.meta.json`, "utf8"));
  const stamp = `${meta.engine} ${meta.model}`.toLowerCase();
  for (const token of banned) {
    if (stamp.includes(token)) {
      fail(`banned show voice on ${scene.id}: ${stamp}`);
    }
  }
  if (!stamp.includes("ryan") && !stamp.includes("af_heart") && !stamp.includes("espeak")) {
    fail(`${scene.id} is not Ryan, Kokoro, or labeled placeholder TTS: ${stamp}`);
  }

  const voSec = durations[scene.id];
  const envelope = envelopes[scene.id];
  if (typeof voSec !== "number" || voSec <= 0) {
    fail(`${scene.id} duration missing`);
  }
  if (!Array.isArray(envelope) || envelope.length < 8) {
    fail(`${scene.id} envelope missing`);
  }
  if (!envelope.some((n) => n > 0.05)) {
    fail(`${scene.id} envelope is silent`);
  }

  const words = scene.vo.trim().split(/\s+/).filter(Boolean).length;
  const wpm = (words / voSec) * 60;
  const target = stamp.includes("espeak") ? 120 : TARGET_WPM;
  const slack = stamp.includes("espeak") ? 25 : WPM_SLACK;
  if (Math.abs(wpm - target) > slack) {
    fail(`${scene.id} is ${wpm.toFixed(0)} wpm, want ~${target}`);
  }

  console.log(
    `${scene.id} ${meta.engine} ${voSec.toFixed(2)}s  ${wpm.toFixed(0)} wpm  envelope ${envelope.length}`,
  );
}

console.log("ryan vo check ok");
