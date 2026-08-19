import { readFileSync } from "node:fs";

const MIN_WPM = 150;
const SHORT_MIN_WPM = 130;
const MAX_WPM = 190;

function fail(message) {
  console.error(message);
  process.exit(1);
}

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const voice = JSON.parse(readFileSync("public/vo/voice.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));
const envelopes = JSON.parse(readFileSync("src/voEnvelopes.json", "utf8"));
const banned = ["say", "samantha", "xtts", "eleven", "openai", "azure", "google"];

const voiceKeys = Object.keys(voice).sort();
if (voiceKeys.join(" ") !== "engine gapSec model speed voice") {
  fail(`voice.json shape drifted: ${voiceKeys.join(" ")}`);
}
if (
  voice.engine !== "kokoro" ||
  voice.model !== "hexgrad/Kokoro-82M" ||
  voice.voice !== "am_echo"
) {
  fail(`voice.json is not kokoro am_echo: ${JSON.stringify(voice)}`);
}
if (
  Math.abs(Number(voice.speed) - 1.25) > 1e-9 ||
  Math.abs(Number(voice.gapSec) - 0.45) > 1e-9
) {
  fail(`voice pacing drifted: speed ${voice.speed}, gap ${voice.gapSec}`);
}

const lines = ep.scenes.filter((scene) => scene.speechLed === true);
if (lines.length === 0) {
  fail("no speechLed lines");
}

const generatedLines = [
  ...lines.map((scene) => ({ id: scene.id, vo: scene.vo, flagship: true })),
  ...Object.entries(ep.shorts).flatMap(([shortId, beats]) =>
    beats.map((beat) => ({
      id: `short-${shortId}-${beat.id}`,
      vo: beat.vo,
      flagship: false,
    })),
  ),
];

for (const line of generatedLines) {
  const meta = JSON.parse(readFileSync(`public/vo/${line.id}.meta.json`, "utf8"));
  const stamp = `${meta.engine} ${meta.model} ${meta.voice ?? ""}`.toLowerCase();
  for (const token of banned) {
    if (stamp.includes(token)) {
      fail(`banned show voice on ${line.id}: ${stamp}`);
    }
  }
  if (!stamp.includes("kokoro") || !stamp.includes("am_echo")) {
    fail(`${line.id} is not Kokoro am_echo: ${stamp}`);
  }
  if (stamp.includes("espeak")) {
    fail(`${line.id} fell back to espeak`);
  }
  if (
    meta.engine !== voice.engine ||
    meta.model !== voice.model ||
    meta.voice !== voice.voice ||
    meta.speed !== voice.speed ||
    meta.gapSec !== voice.gapSec ||
    typeof meta.sampleRate !== "number" ||
    meta.sampleRate <= 0
  ) {
    fail(`${line.id} metadata drifted from voice.json`);
  }

  const voSec = durations[line.id];
  const envelope = envelopes[line.id];
  if (typeof voSec !== "number" || voSec <= 0) {
    fail(`${line.id} duration missing`);
  }
  if (!Array.isArray(envelope) || envelope.length < 8) {
    fail(`${line.id} envelope missing`);
  }
  if (!envelope.some((n) => n > 0.05)) {
    fail(`${line.id} envelope is silent`);
  }

  const words = line.vo.trim().split(/\s+/).filter(Boolean).length;
  const wpm = (words / voSec) * 60;
  const minimum = voSec < 20 ? SHORT_MIN_WPM : MIN_WPM;
  if (line.flagship && (wpm < minimum || wpm > MAX_WPM)) {
    fail(`${line.id} is ${wpm.toFixed(0)} wpm, want ${minimum}–${MAX_WPM}`);
  }

  console.log(
    `${line.id} ${meta.engine} ${meta.voice} ${voSec.toFixed(2)}s  ${wpm.toFixed(0)} wpm  envelope ${envelope.length}`,
  );
}

console.log("kokoro vo check ok");
