import { readFileSync } from "node:fs";

const MAX_HOLD = 4;
const TAIL = 0.05;

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));
const slot = readFileSync("src/cairn/CairnSlot.tsx", "utf8");
const kit = readFileSync("src/cairn/kit.ts", "utf8");
const stage = readFileSync("src/cairn/stage.ts", "utf8");
const timing = readFileSync("src/timing.ts", "utf8");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (slot.includes("talkingListen")) {
  fail("talk lean still snaps with the mouth sheet");
}
if (stage.includes("LISTEN_TALK_LEAN")) {
  fail("LISTEN_TALK_LEAN is still a wide talk wobble");
}
if (kit.includes('viseme !== "closed"')) {
  fail("mouth sheets still yield to tue-open mid-word");
}

const settle = timing.match(/SPEECH_SETTLE_SEC = ([0-9.]+)/);
if (!settle || Number(settle[1]) > TAIL) {
  fail(`speech settle ${settle?.[1] ?? "missing"} leaves a silent tail`);
}
if (timing.includes("clamp(total, SHORT_MIN_SEC")) {
  fail("Short picture is still padded up to SHORT_MIN_SEC");
}

for (const beat of ep.shorts.hook) {
  const voSec = durations[`short-hook-${beat.id}`];
  if (typeof voSec !== "number" || voSec <= 0) {
    fail(`short-hook-${beat.id} VO duration missing`);
  }
  if (beat.durationSec - voSec > TAIL) {
    fail(
      `short-hook-${beat.id} picture ${beat.durationSec}s after ${voSec}s of line is a silent tail`,
    );
  }
}

function pictureKey(beat) {
  return `${beat.pose ?? ""}|${beat.mood ?? ""}|${beat.caption ?? ""}`;
}

for (const scene of ep.scenes) {
  const voSec = durations[scene.id];
  if (typeof voSec !== "number" || voSec <= 0) {
    fail(`${scene.id} VO duration missing`);
  }
  const cues = JSON.parse(readFileSync(`public/vo/${scene.id}.cues.json`, "utf8"));
  const beats = [...(scene.beats ?? [])].sort((a, b) => a.atSec - b.atSec);
  if (beats.length === 0) {
    fail(`${scene.id} has no picture beats for ${cues.length} sentences`);
  }
  for (const cue of cues) {
    const hit = beats.some((beat) => Math.abs(beat.atSec - cue.start) <= 0.08);
    if (!hit) {
      fail(`${scene.id} sentence at ${cue.start}s has no new picture`);
    }
  }
  const edges = [...beats.map((beat) => beat.atSec), voSec];
  let prev = 0;
  let prevKey = pictureKey(beats[0]);
  for (let i = 0; i < edges.length; i += 1) {
    const at = edges[i];
    const hold = at - prev;
    if (hold > MAX_HOLD + 1e-6) {
      fail(`${scene.id} holds ${hold.toFixed(2)}s of one picture past ${MAX_HOLD}s`);
    }
    if (i < beats.length) {
      const key = pictureKey(beats[i]);
      if (i > 0 && key === prevKey) {
        fail(`${scene.id} repeats the same picture at ${beats[i].atSec}s`);
      }
      prevKey = key;
    }
    prev = at;
  }
}

console.log("talk planted, shorts end with the line, picture moves with each sentence");
console.log("watch notes check ok");
