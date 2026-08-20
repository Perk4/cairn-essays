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
const VOICE_CONFIG = process.env.CAIRN_VOICE_CONFIG ?? "public/vo/voice.json";
const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const voiceConfig = JSON.parse(readFileSync(VOICE_CONFIG, "utf8"));

mkdirSync("public/vo", { recursive: true });

const BANNED = ["say", "samantha", "xtts", "eleven", "openai", "azure", "google"];

function refuseBanned(label) {
  const lower = String(label).toLowerCase();
  for (const token of BANNED) {
    if (lower.includes(token)) {
      throw new Error(`refusing banned voice path: ${label}`);
    }
  }
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

function metaMatches(metaPath) {
  if (!existsSync(metaPath)) {
    return false;
  }
  const meta = JSON.parse(readFileSync(metaPath, "utf8"));
  return (
    meta.engine === voiceConfig.engine &&
    meta.model === voiceConfig.model &&
    meta.voice === voiceConfig.voice &&
    meta.speed === voiceConfig.speed &&
    meta.gapSec === voiceConfig.gapSec
  );
}

function encodeMp3(id, wav) {
  const mp3 = `public/vo/${id}.mp3`;
  const mp3d = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      "-i",
      wav,
      "-codec:a",
      "libmp3lame",
      "-b:a",
      "128k",
      mp3,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  if (mp3d.status !== 0) {
    throw new Error(`ffmpeg failed for ${id}\n${mp3d.stderr}`);
  }
  return mp3;
}

function synthBatch(jobs) {
  if (jobs.length === 0) {
    return;
  }
  mkdirSync("/tmp/vo-batch", { recursive: true });
  const batch = jobs.map((job) => ({
    id: job.id,
    text: job.text,
    out: `/tmp/vo-batch/${job.id}.wav`,
    meta: `public/vo/${job.id}.meta.json`,
    cues: `public/vo/${job.id}.cues.json`,
  }));
  const batchPath = "/tmp/vo-batch/jobs.json";
  writeFileSync(batchPath, `${JSON.stringify(batch, null, 2)}\n`);
  const spoken = spawnSync(
    PYTHON,
    ["scripts/synth-local-vo.py", "--batch", batchPath, "--config", VOICE_CONFIG],
    { stdio: "inherit" },
  );
  if (spoken.status !== 0) {
    throw new Error("Kokoro batch synth failed");
  }
  for (const job of batch) {
    if (!metaMatches(job.meta)) {
      throw new Error(`voice metadata drifted for ${job.id}`);
    }
    encodeMp3(job.id, job.out);
    rmSync(job.out, { force: true });
  }
}

if (!existsSync(PYTHON)) {
  throw new Error(`Kokoro Python is missing: ${PYTHON}`);
}

if (
  voiceConfig.engine !== "kokoro" ||
  voiceConfig.model !== "hexgrad/Kokoro-82M" ||
  voiceConfig.voice !== "am_echo" ||
  voiceConfig.speed !== 1.25
) {
  throw new Error("voice.json must be Kokoro-82M am_echo 1.25");
}

const sceneLines = ep.scenes.map((scene) => ({ id: scene.id, text: scene.vo }));
const shortLines = ep.shorts.hook.map((beat) => ({
  id: `short-hook-${beat.id}`,
  text: beat.vo,
}));
const lines = [...sceneLines, ...shortLines];
const expected = new Set(lines.map((line) => line.id));

for (const file of readdirSync("public/vo")) {
  const match = file.match(/^(.+?)(?:\.mp3|\.meta\.json|\.cues\.json)$/);
  if (match && !expected.has(match[1]) && match[1] !== "voice") {
    unlinkSync(`public/vo/${file}`);
  }
}

const durations = {};
const pending = [];
for (const line of lines) {
  const mp3 = `public/vo/${line.id}.mp3`;
  const metaPath = `public/vo/${line.id}.meta.json`;
  if (existsSync(mp3) && metaMatches(metaPath)) {
    durations[line.id] = probeDuration(mp3);
    const words = line.text.trim().split(/\s+/).filter(Boolean).length;
    const wpm = (words / durations[line.id]) * 60;
    console.log(
      `${line.id} skip ${voiceConfig.engine}/${voiceConfig.voice} ${durations[line.id].toFixed(2)}s  ${wpm.toFixed(0)} wpm`,
    );
    continue;
  }
  pending.push(line);
}

if (pending.length > 0) {
  synthBatch(pending);
}

for (const line of pending) {
  durations[line.id] = probeDuration(`public/vo/${line.id}.mp3`);
  const meta = JSON.parse(readFileSync(`public/vo/${line.id}.meta.json`, "utf8"));
  const words = line.text.trim().split(/\s+/).filter(Boolean).length;
  const wpm = (words / durations[line.id]) * 60;
  console.log(
    `${line.id} ${meta.engine}/${meta.voice} ${durations[line.id].toFixed(2)}s  ${wpm.toFixed(0)} wpm`,
  );
}

writeFileSync(
  "public/vo/durations.json",
  `${JSON.stringify(durations, null, 2)}\n`,
);
writeFileSync("src/voEnvelopes.json", "{}\n");
