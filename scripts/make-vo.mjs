import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const PYTHON = process.env.CAIRN_VO_PYTHON ?? "/tmp/cairn-vo-venv/bin/python";
const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));
const envelopes = existsSync("src/voEnvelopes.json")
  ? JSON.parse(readFileSync("src/voEnvelopes.json", "utf8"))
  : {};

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

function probeDuration(mp3) {
  const probe = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3],
    { encoding: "utf8" },
  );
  const duration = Number(probe.stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Could not read duration for ${mp3}`);
  }
  return duration;
}

function timeStretch(src, dest, tempo) {
  const stretched = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      src,
      "-filter:a",
      `atempo=${tempo}`,
      "-codec:a",
      "libmp3lame",
      "-b:a",
      "128k",
      dest,
    ],
    { stdio: "inherit" },
  );
  if (stretched.status !== 0) {
    throw new Error(`atempo failed for ${src}`);
  }
}

function synthEspeakLine(id, text) {
  refuseBanned(id);
  const wav = `/tmp/vo-${id}.wav`;
  const raw = `/tmp/vo-${id}.f32`;
  const mp3 = `public/vo/${id}.mp3`;
  const metaPath = `public/vo/${id}.meta.json`;
  const spoken = spawnSync(
    "espeak-ng",
    ["-v", "en-us", "-s", "120", "-w", wav, text],
    { stdio: "inherit" },
  );
  if (spoken.status !== 0) {
    throw new Error(`espeak-ng failed for ${id}`);
  }
  writeFileSync(
    metaPath,
    `${JSON.stringify({
      engine: "espeak-ng",
      model: "en-us",
      placeholder: true,
    })}\n`,
  );
  const mp3d = spawnSync(
    "ffmpeg",
    ["-y", "-i", wav, "-codec:a", "libmp3lame", "-b:a", "128k", mp3],
    { stdio: "inherit" },
  );
  if (mp3d.status !== 0) {
    throw new Error(`ffmpeg failed for ${id}`);
  }
  return {
    duration: probeDuration(mp3),
    envelope: envelopeFromMp3(mp3, raw),
    meta: JSON.parse(readFileSync(metaPath, "utf8")),
  };
}

function synthLocalLine(id, text) {
  if (!existsSync(PYTHON)) {
    return synthEspeakLine(id, text);
  }
  refuseBanned(id);
  const wav = `/tmp/vo-${id}.wav`;
  const raw = `/tmp/vo-${id}.f32`;
  const mp3 = `public/vo/${id}.mp3`;
  const metaPath = `public/vo/${id}.meta.json`;
  const spoken = spawnSync(
    PYTHON,
    ["scripts/synth-local-vo.py", "--text", text, "--out", wav, "--meta", metaPath],
    { stdio: "inherit" },
  );
  if (spoken.status !== 0) {
    throw new Error(`local synth failed for ${id}`);
  }
  const meta = JSON.parse(readFileSync(metaPath, "utf8"));
  refuseBanned(meta.engine);
  refuseBanned(meta.model);
  const rawMp3 = `/tmp/vo-${id}-raw.mp3`;
  const mp3d = spawnSync(
    "ffmpeg",
    ["-y", "-i", wav, "-codec:a", "libmp3lame", "-b:a", "128k", rawMp3],
    { stdio: "inherit" },
  );
  if (mp3d.status !== 0) {
    throw new Error(`ffmpeg failed for ${id}`);
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const rawSec = probeDuration(rawMp3);
  const targetSec = (words / 165) * 60;
  const tempo = rawSec / targetSec;
  if (tempo > 1.02 || tempo < 0.98) {
    timeStretch(rawMp3, mp3, Math.min(2, Math.max(0.5, tempo)));
  } else {
    spawnSync("ffmpeg", ["-y", "-i", rawMp3, "-c", "copy", mp3], {
      stdio: "inherit",
    });
  }
  return {
    duration: probeDuration(mp3),
    envelope: envelopeFromMp3(mp3, raw),
    meta,
  };
}

const lines = ep.scenes.filter((item) => item.speechLed === true);
if (lines.length === 0) {
  throw new Error("no speechLed scenes to synth");
}

for (const scene of lines) {
  const result = synthLocalLine(scene.id, scene.vo);
  durations[scene.id] = result.duration;
  envelopes[scene.id] = result.envelope;
  const words = scene.vo.trim().split(/\s+/).filter(Boolean).length;
  const wpm = (words / result.duration) * 60;
  console.log(
    `${scene.id} ${result.meta.engine} vo ${result.duration.toFixed(2)}s  ${wpm.toFixed(0)} wpm  envelope ${result.envelope.length} frames`,
  );
}

writeFileSync(
  "public/vo/durations.json",
  `${JSON.stringify(durations, null, 2)}\n`,
);
writeFileSync("src/voEnvelopes.json", `${JSON.stringify(envelopes)}\n`);
