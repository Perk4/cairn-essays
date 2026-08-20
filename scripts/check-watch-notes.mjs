import { existsSync, readFileSync } from "node:fs";

const MAX_HOLD = 4;
const TAIL = 0.05;
const LOCKED_CTA =
  "If this week's takeaway stuck, subscribe. Next one lands same time.";

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));
const flagship = readFileSync("src/compositions/Flagship.tsx", "utf8");
const short = readFileSync("src/compositions/Short.tsx", "utf8");
const timing = readFileSync("src/timing.ts", "utf8");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (flagship.includes("MusicBed")) {
  fail("flagship still has a music bed");
}
if (short.includes("MusicBed")) {
  fail("short still has a music bed");
}

const settle = timing.match(/SPEECH_SETTLE_SEC = ([0-9.]+)/);
if (!settle || Number(settle[1]) > TAIL) {
  fail(`speech settle ${settle?.[1] ?? "missing"} leaves a silent tail`);
}

const thuSit = ep.scenes.find((scene) => scene.id === "thu-sit");
if (!thuSit || thuSit.still !== "05-thursday-cairn-sits-down.png") {
  fail("Thursday sit must use 05-thursday-cairn-sits-down.png");
}
const gone = ep.scenes.find((scene) => scene.id === "move-gone");
if (!gone || gone.still !== "08-the-move-square-is-gone.png") {
  fail("Delete must show 08-the-move-square-is-gone.png");
}

const cta = ep.scenes.find((scene) => scene.id === "cta");
if (!cta || cta.vo !== LOCKED_CTA) {
  fail("CTA is not the locked line");
}

for (const beat of ep.shorts.hook) {
  const voSec = durations[`short-hook-${beat.id}`];
  if (typeof voSec !== "number" || voSec <= 0) {
    fail(`short-hook-${beat.id} VO duration missing`);
  }
  if (beat.durationSec !== undefined && beat.durationSec - voSec > TAIL) {
    fail(`short-hook-${beat.id} picture outlasts the line`);
  }
}

if (ep.shorts.rule) {
  fail("this encode has one Short only");
}

for (const scene of ep.scenes) {
  const voSec = durations[scene.id];
  if (typeof voSec !== "number" || voSec <= 0) {
    fail(`${scene.id} VO duration missing`);
  }
  if (scene.type !== "stillShot") {
    fail(`${scene.id} is not a stillShot`);
  }
  if (!existsSync(`public/ep01-stills/${scene.still}`)) {
    fail(`missing still ${scene.still}`);
  }
  if (voSec > MAX_HOLD + 1e-6 && !scene.altStill) {
    fail(
      `${scene.id} holds ${voSec.toFixed(2)}s of one picture past ${MAX_HOLD}s`,
    );
  }
  if (scene.altStill && !existsSync(`public/ep01-stills/${scene.altStill}`)) {
    fail(`missing alt still ${scene.altStill}`);
  }
  const banned = ["Part 1", "Part 2", "470", "HARD ≠ WRONG"];
  const surface = `${scene.vo} ${scene.caption} ${scene.still}`;
  for (const token of banned) {
    if (surface.includes(token)) {
      fail(`${scene.id} still has ${token}`);
    }
  }
}

const leftParked = ep.scenes.filter((scene) =>
  ["intro-cairn", "tue-walk-in", "thu-sit", "move-over", "move-past"].includes(
    scene.id,
  ),
);
if (leftParked.length < 5) {
  fail("acting stills for walk-in / sit / walk-over / walk-past are missing");
}

console.log("dry mix, shot ends with the line, stills move, sit and delete hold");
console.log("watch notes check ok");
