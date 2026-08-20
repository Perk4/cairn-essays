import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
  renameSync,
} from "node:fs";
import { spawnSync } from "node:child_process";

const SETTLE = 0;
const MIN_CHUNK = 60;
const MAX_CHUNK = 150;
const OVERLAP = 8;
const MAX_BYTES = 12 * 1024 * 1024;
const SRC = "out/ep01.mp4";
const BEAT_ORDER = [
  "00-hook",
  "01-tuesday",
  "02-books",
  "03-wednesday",
  "04-thursday",
  "05-weekend",
  "06-name",
  "07-move",
  "cta",
];

function fail(message) {
  throw new Error(message);
}

function run(cmd, args) {
  const result = spawnSync(cmd, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(
      `${cmd} ${args.join(" ")} failed\n${result.stderr || result.stdout}`,
    );
  }
  return result.stdout;
}

function probeSec(path) {
  const sec = Number(
    run("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "csv=p=0",
      path,
    ]).trim(),
  );
  if (!Number.isFinite(sec) || sec <= 0) {
    fail(`duration missing for ${path}`);
  }
  return sec;
}

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));
if (!existsSync(SRC)) {
  fail("out/ep01.mp4 is missing; render the flagship first");
}

const scenes = [];
let cursor = 0;
for (const scene of ep.scenes) {
  const voSec = durations[scene.id];
  if (typeof voSec !== "number" || voSec <= 0) {
    fail(`missing VO for ${scene.id}`);
  }
  const duration = voSec + SETTLE;
  scenes.push({
    id: scene.id,
    beat: scene.beat,
    start: cursor,
    end: cursor + duration,
  });
  cursor += duration;
}

const byBeat = [];
for (const beat of BEAT_ORDER) {
  const members = scenes.filter((scene) => scene.beat === beat);
  if (members.length === 0) {
    continue;
  }
  byBeat.push({
    ids: members.map((scene) => scene.id),
    beat,
    start: members[0].start,
    end: members[members.length - 1].end,
  });
}

function dur(unit) {
  return unit.end - unit.start;
}

const packed = [];
for (const unit of byBeat) {
  const last = packed[packed.length - 1];
  if (!last) {
    packed.push({ ...unit, ids: [...unit.ids] });
    continue;
  }
  if (dur(last) < MIN_CHUNK && dur(last) + dur(unit) <= MAX_CHUNK) {
    last.ids.push(...unit.ids);
    last.end = unit.end;
    continue;
  }
  if (dur(unit) < MIN_CHUNK && dur(last) + dur(unit) <= MAX_CHUNK) {
    last.ids.push(...unit.ids);
    last.end = unit.end;
    continue;
  }
  packed.push({ ...unit, ids: [...unit.ids] });
}

if (packed.length >= 2 && dur(packed[packed.length - 1]) < MIN_CHUNK) {
  const last = packed.pop();
  const prev = packed[packed.length - 1];
  if (prev && dur(prev) + dur(last) <= MAX_CHUNK) {
    prev.ids.push(...last.ids);
    prev.end = last.end;
  } else {
    packed.push(last);
  }
}

for (const chunk of packed) {
  const len = dur(chunk);
  if (len > MAX_CHUNK + 0.05) {
    fail(`chunk ${chunk.beat} is ${len.toFixed(1)}s, over ${MAX_CHUNK}`);
  }
}

mkdirSync("review", { recursive: true });
mkdirSync("review/stills", { recursive: true });

const totalSec = probeSec(SRC);
const names = packed.map((chunk, index) => {
  if (index === packed.length - 1) {
    return "cta";
  }
  return chunk.beat;
});

const cuts = packed.map((chunk, index) => {
  const start = index === 0 ? chunk.start : Math.max(0, chunk.start - OVERLAP);
  const end = Math.min(totalSec, chunk.end);
  return { ...chunk, name: names[index], cutStart: start, cutEnd: end };
});

function extract(outPath, start, end) {
  run("ffmpeg", [
    "-y",
    "-ss",
    start.toFixed(3),
    "-to",
    end.toFixed(3),
    "-i",
    SRC,
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "28",
    "-c:a",
    "aac",
    "-b:a",
    "96k",
    "-movflags",
    "+faststart",
    outPath,
  ]);
  if (statSync(outPath).size > MAX_BYTES) {
    run("ffmpeg", [
      "-y",
      "-i",
      outPath,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "32",
      "-c:a",
      "aac",
      "-b:a",
      "64k",
      "-movflags",
      "+faststart",
      `${outPath}.tmp.mp4`,
    ]);
    renameSync(`${outPath}.tmp.mp4`, outPath);
  }
  if (statSync(outPath).size > MAX_BYTES) {
    fail(`${outPath} is over 12MB`);
  }
}

for (const cut of cuts) {
  const outPath = `review/${cut.name}.mp4`;
  extract(outPath, cut.cutStart, cut.cutEnd);
  const still = `review/stills/${cut.name}.png`;
  const mid = (cut.start + cut.end) / 2;
  run("ffmpeg", [
    "-y",
    "-ss",
    mid.toFixed(3),
    "-i",
    SRC,
    "-frames:v",
    "1",
    still,
  ]);
  console.log(
    `${cut.name}  ${cut.cutStart.toFixed(1)}-${cut.cutEnd.toFixed(1)}s  ${(statSync(outPath).size / 1024 / 1024).toFixed(2)}MB`,
  );
}

const stillFiles = cuts.map((cut) => `review/stills/${cut.name}.png`);
run("ffmpeg", [
  "-y",
  ...stillFiles.flatMap((path) => ["-i", path]),
  "-filter_complex",
  `tile=3x3`,
  "review/contact-sheet.png",
]);

const seamParts = [];
for (let i = 1; i < packed.length; i += 1) {
  const join = packed[i].start;
  const a0 = Math.max(0, join - OVERLAP);
  const b1 = Math.min(totalSec, join + OVERLAP);
  const left = `review/.seam-${i}-a.mp4`;
  const right = `review/.seam-${i}-b.mp4`;
  extract(left, a0, join);
  extract(right, join, b1);
  seamParts.push(left, right);
}

const listPath = "review/.seams.txt";
writeFileSync(
  listPath,
  seamParts.map((path) => `file '${process.cwd()}/${path}'`).join("\n") + "\n",
);
run("ffmpeg", [
  "-y",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  listPath,
  "-c",
  "copy",
  "review/seams.mp4",
]);
for (const path of seamParts) {
  spawnSync("rm", ["-f", path]);
}
spawnSync("rm", ["-f", listPath]);

const wavParts = [];
const transcript = [];
let clock = 0;
for (const scene of ep.scenes) {
  const mp3 = `public/vo/${scene.id}.mp3`;
  const wav = `review/.${scene.id}.wav`;
  run("ffmpeg", [
    "-y",
    "-i",
    mp3,
    "-ac",
    "1",
    "-ar",
    "24000",
    "-c:a",
    "pcm_s16le",
    wav,
  ]);
  wavParts.push(wav);
  const cuesPath = `public/vo/${scene.id}.cues.json`;
  if (existsSync(cuesPath)) {
    const cues = JSON.parse(readFileSync(cuesPath, "utf8"));
    for (const cue of cues) {
      transcript.push({
        start: Number((clock + cue.start).toFixed(3)),
        end: Number((clock + cue.end).toFixed(3)),
        scene: scene.id,
        text: cue.text,
      });
    }
  } else {
    transcript.push({
      start: Number(clock.toFixed(3)),
      end: Number((clock + durations[scene.id]).toFixed(3)),
      scene: scene.id,
      text: scene.vo,
    });
  }
  clock += durations[scene.id] + SETTLE;
}

const wavList = "review/.vo.txt";
writeFileSync(
  wavList,
  wavParts.map((path) => `file '${process.cwd()}/${path}'`).join("\n") + "\n",
);
run("ffmpeg", [
  "-y",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  wavList,
  "-c",
  "pcm_s16le",
  "review/vo.wav",
]);
for (const path of wavParts) {
  spawnSync("rm", ["-f", path]);
}
spawnSync("rm", ["-f", wavList]);

const stamp = (sec) => {
  const ms = Math.round(sec * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const milli = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(milli).padStart(3, "0")}`;
};

const vtt = ["WEBVTT", ""];
for (const row of transcript) {
  vtt.push(`${stamp(row.start)} --> ${stamp(row.end)}`, row.text, "");
}
writeFileSync("review/transcript.vtt", `${vtt.join("\n")}\n`);
writeFileSync(
  "review/transcript.tsv",
  [
    "start\tend\tscene\ttext",
    ...transcript.map(
      (row) =>
        `${row.start}\t${row.end}\t${row.scene}\t${row.text.replace(/\t/g, " ")}`,
    ),
  ].join("\n") + "\n",
);

writeFileSync(
  "review/README.md",
  [
    "# Review kit",
    "",
    "You booked it like a standup. Beat-split chunks of `out/ep01.mp4`.",
    "60–150s, under 12MB, 8s overlap. Last file is `cta`.",
    "Seams reel is last 8s plus first 8s of each join.",
    "",
    ...cuts.map(
      (cut) =>
        `- \`${cut.name}.mp4\`  ${cut.ids.join(" + ")}  ${cut.cutStart.toFixed(1)}–${cut.cutEnd.toFixed(1)}s`,
    ),
    "",
  ].join("\n"),
);

console.log(
  `review kit ${cuts.length} chunks  seams ${seamParts.length / 2} joins  ${transcript.length} cues`,
);
