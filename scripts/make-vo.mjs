import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";

const PYTHON = process.env.CAIRN_VO_PYTHON ?? "/tmp/cairn-vo-venv/bin/python";
const VOICE_CONFIG =
  process.env.CAIRN_VOICE_CONFIG ?? "public/vo/voice.json";
const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const voiceConfig = JSON.parse(readFileSync(VOICE_CONFIG, "utf8"));

mkdirSync("public/vo", { recursive: true });

const ENV_RATE = 3000;
const FPS = 30;
const SAMPLES_PER_FRAME = ENV_RATE / FPS;
const BANNED = ["say", "samantha", "xtts", "eleven", "openai", "azure", "google"];

function refuseBanned(label) {
  const lower = String(label).toLowerCase();
  for (const token of BANNED) {
    if (lower.includes(token)) {
      throw new Error(`refusing banned voice path: ${label}`);
    }
  }
}

function envelopeFromMp3(mp3, raw) {
  const envd = spawnSync(
    "ffmpeg",
    ["-y", "-i", mp3, "-ac", "1", "-ar", String(ENV_RATE), "-f", "f32le", raw],
    { stdio: "inherit" },
  );
  if (envd.status !== 0) {
    throw new Error(`envelope failed for ${mp3}`);
  }
  const buf = readFileSync(raw);
  const envelope = [];
  for (let frame = 0; frame * SAMPLES_PER_FRAME * 4 < buf.length; frame++) {
    let sum = 0;
    let n = 0;
    const start = Math.round(frame * SAMPLES_PER_FRAME);
    for (let s = 0; s < SAMPLES_PER_FRAME; s++) {
      const offset = (start + s) * 4;
      if (offset + 4 > buf.length) {
        break;
      }
      const sample = buf.readFloatLE(offset);
      sum += sample * sample;
      n += 1;
    }
    envelope.push(n === 0 ? 0 : Number(Math.sqrt(sum / n).toFixed(5)));
  }
  return envelope;
}

function probeDuration(file) {
  const probe = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { encoding: "utf8" },
  );
  const duration = Number(probe.stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`could not read duration for ${file}`);
  }
  return duration;
}

function synthLocalLine(id, text) {
  refuseBanned(id);
  const wav = `/tmp/vo-${id}.wav`;
  const raw = `/tmp/vo-${id}.f32`;
  const mp3 = `public/vo/${id}.mp3`;
  const metaPath = `public/vo/${id}.meta.json`;
  const spoken = spawnSync(
    PYTHON,
    [
      "scripts/synth-local-vo.py",
      "--text",
      text,
      "--out",
      wav,
      "--meta",
      metaPath,
      "--config",
      VOICE_CONFIG,
    ],
    { stdio: "inherit" },
  );
  if (spoken.status !== 0) {
    throw new Error(`Kokoro synth failed for ${id}`);
  }
  const meta = JSON.parse(readFileSync(metaPath, "utf8"));
  const stamp = `${meta.engine} ${meta.model} ${meta.voice}`;
  refuseBanned(stamp);
  if (
    meta.engine !== voiceConfig.engine ||
    meta.model !== voiceConfig.model ||
    meta.voice !== voiceConfig.voice ||
    meta.speed !== voiceConfig.speed ||
    meta.gapSec !== voiceConfig.gapSec
  ) {
    throw new Error(`voice metadata drifted for ${id}: ${stamp}`);
  }
  const mp3d = spawnSync(
    "ffmpeg",
    ["-y", "-i", wav, "-codec:a", "libmp3lame", "-b:a", "128k", mp3],
    { stdio: "inherit" },
  );
  if (mp3d.status !== 0) {
    throw new Error(`ffmpeg failed for ${id}`);
  }
  const duration = probeDuration(mp3);
  const envelope = envelopeFromMp3(mp3, raw);
  rmSync(wav, { force: true });
  rmSync(raw, { force: true });
  return { duration, envelope, meta };
}

if (!existsSync(PYTHON)) {
  throw new Error(`Kokoro Python is missing: ${PYTHON}`);
}

const sceneLines = ep.scenes
  .filter((scene) => scene.speechLed === true)
  .map((scene) => ({ id: scene.id, text: scene.vo }));
const shortLines = Object.entries(ep.shorts).flatMap(([shortId, beats]) =>
  beats.map((beat) => ({
    id: `short-${shortId}-${beat.id}`,
    text: beat.vo,
  })),
);
const lines = [...sceneLines, ...shortLines];
if (sceneLines.length === 0) {
  throw new Error("no speechLed scenes to synth");
}

const expected = new Set();
for (const line of lines) {
  if (
    typeof line.id !== "string" ||
    typeof line.text !== "string" ||
    !line.text.trim()
  ) {
    throw new Error("every VO line needs a non-empty id and text");
  }
  if (expected.has(line.id)) {
    throw new Error(`duplicate VO id ${line.id}`);
  }
  expected.add(line.id);
}

for (const file of readdirSync("public/vo")) {
  const match = file.match(/^(.+?)(?:\.mp3|\.meta\.json)$/);
  if (match && !expected.has(match[1])) {
    unlinkSync(`public/vo/${file}`);
  }
}

const durations = {};
const envelopes = {};
for (const line of lines) {
  const result = synthLocalLine(line.id, line.text);
  durations[line.id] = result.duration;
  envelopes[line.id] = result.envelope;
  const words = line.text.trim().split(/\s+/).filter(Boolean).length;
  const wpm = (words / result.duration) * 60;
  console.log(
    `${line.id} ${result.meta.engine}/${result.meta.voice} ${result.duration.toFixed(2)}s  ${wpm.toFixed(0)} wpm  envelope ${result.envelope.length} frames`,
  );
}

writeFileSync(
  "public/vo/durations.json",
  `${JSON.stringify(durations, null, 2)}\n`,
);
writeFileSync("src/voEnvelopes.json", `${JSON.stringify(envelopes)}\n`);
