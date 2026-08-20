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

function synthLocalLine(id, text) {
  refuseBanned(id);
  const wav = `/tmp/vo-${id}.wav`;
  const mp3 = `public/vo/${id}.mp3`;
  const metaPath = `public/vo/${id}.meta.json`;
  const cuesWav = `/tmp/vo-${id}.cues.json`;
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
  const cuesSrc = existsSync(cuesWav)
    ? cuesWav
    : metaPath.replace(".meta.json", ".cues.json");
  if (existsSync(cuesSrc) && cuesSrc !== `public/vo/${id}.cues.json`) {
    writeFileSync(`public/vo/${id}.cues.json`, readFileSync(cuesSrc));
  }
  rmSync(wav, { force: true });
  rmSync(cuesWav, { force: true });
  return { duration: probeDuration(mp3), meta };
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
for (const line of lines) {
  const result = synthLocalLine(line.id, line.text);
  durations[line.id] = result.duration;
  const words = line.text.trim().split(/\s+/).filter(Boolean).length;
  const wpm = (words / result.duration) * 60;
  console.log(
    `${line.id} ${result.meta.engine}/${result.meta.voice} ${result.duration.toFixed(2)}s  ${wpm.toFixed(0)} wpm`,
  );
}

writeFileSync(
  "public/vo/durations.json",
  `${JSON.stringify(durations, null, 2)}\n`,
);
writeFileSync("src/voEnvelopes.json", "{}\n");
