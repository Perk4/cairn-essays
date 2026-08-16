import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const SPEED = "120";
const VOICE = "en-us";
const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));

mkdirSync("public/vo", { recursive: true });

function synth(id, text) {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error(`Missing vo text for ${id}`);
  }
  const wav = `/tmp/vo-${id}.wav`;
  const mp3 = `public/vo/${id}.mp3`;
  const spoken = spawnSync(
    "espeak-ng",
    ["-s", SPEED, "-v", VOICE, "-w", wav, text],
    { stdio: "inherit" },
  );
  if (spoken.status !== 0) {
    throw new Error(`espeak-ng failed for ${id}`);
  }
  const mp3d = spawnSync(
    "ffmpeg",
    ["-y", "-i", wav, "-codec:a", "libmp3lame", "-b:a", "64k", mp3],
    { stdio: "inherit" },
  );
  if (mp3d.status !== 0) {
    throw new Error(`ffmpeg failed for ${id}`);
  }
  const probe = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3],
    { encoding: "utf8" },
  );
  const duration = Number(probe.stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Could not read duration for ${id}`);
  }
  return duration;
}

const durations = {};

for (const scene of ep.scenes) {
  durations[scene.id] = synth(scene.id, scene.vo);
}

for (const shortId of ["hook", "rule"]) {
  for (const beat of ep.shorts[shortId]) {
    const id = `short-${shortId}-${beat.id}`;
    durations[id] = synth(id, beat.vo);
  }
}

writeFileSync(
  "public/vo/durations.json",
  `${JSON.stringify(durations, null, 2)}\n`,
);

console.log("\nVO durations (espeak-ng placeholder, not Perk)\n");
for (const [id, sec] of Object.entries(durations)) {
  const scene = ep.scenes.find((item) => item.id === id);
  const hold = scene ? scene.durationSec - sec : null;
  const flag =
    scene && sec > scene.durationSec - 3 ? "  WARN: VO longer than hold" : "";
  console.log(
    `${id.padEnd(28)} vo ${sec.toFixed(1)}s` +
      (hold === null
        ? ""
        : `  scene ${scene.durationSec}s  hold ${hold.toFixed(1)}s`) +
      flag,
  );
}
