import { readFileSync } from "node:fs";

const SETTLE = 0.8;
const FEEL_MIN = 480;
const FEEL_MAX = 720;
const CTA =
  "If this week's takeaway stuck, subscribe. Next one lands same time.";

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));
const board = readFileSync("episodes/ep01.board.md", "utf8");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (ep.title !== "Find it or develop it") {
  fail(`title drifted: ${ep.title}`);
}
if (ep.paper.authors !== "O’Keefe, Dweck & Walton" || ep.paper.year !== 2018) {
  fail("warrant drifted");
}
if (ep.durationTargetSec !== 600) {
  fail(`duration target drifted: ${ep.durationTargetSec}`);
}

const ids = ep.scenes.map((scene) => scene.id);
if (ids.join(" ") !== "hook trap story gap eggs stay stack end") {
  fail(`spine drifted: ${ids.join(" ")}`);
}
const spokenSections = [
  ...board.matchAll(
    /## Part: ([^\n]+)\n\n### Spoken\n([\s\S]*?)\n\n### Beat Board/g,
  ),
];
if (spokenSections.length !== ids.length) {
  fail(`board has ${spokenSections.length} Spoken sections for ${ids.length} scenes`);
}

const hook = ep.scenes.find((scene) => scene.id === "hook");
const close = ep.scenes.find((scene) => scene.id === "end");
if (!hook || !close) {
  fail("missing hook or close");
}

let picture = 0;
for (const scene of ep.scenes) {
  if (scene.type === "citeCard") {
    fail(`${scene.id} is a cite card`);
  }
  if (scene.speechLed !== true) {
    fail(`${scene.id} is not speech-led`);
  }
  if (scene.durationSec !== undefined) {
    fail(`${scene.id} still has a hold`);
  }
  if (scene.visual === "conceptLabel") {
    fail(`${scene.id} is still a title card`);
  }
  if (scene.type === "limitsCard") {
    fail(`${scene.id} is a limits wall`);
  }
  if (String(scene.stat ?? "") === "470") {
    fail(`${scene.id} makes 470 the hero`);
  }
  if (/Part\s+(one|two|three|four|five|\d+)/i.test(scene.vo)) {
    fail(`${scene.id} still says Part N`);
  }
  if (scene.id !== "hook" && scene.id !== "end" && !/\bCairn\b/.test(scene.vo)) {
    fail(`${scene.id} is not third-person Cairn`);
  }
  const spoken = spokenSections[ids.indexOf(scene.id)]?.[2];
  if (scene.vo !== spoken) {
    fail(`${scene.id} VO drifted from the board Spoken section`);
  }
  const voSec = durations[scene.id];
  if (typeof voSec !== "number" || voSec <= 0) {
    fail(`${scene.id} VO duration missing`);
  }
  picture += voSec + SETTLE;
}

if (!/Tuesday/i.test(hook.vo) || !/Thursday/i.test(hook.vo)) {
  fail("hook is not the Tuesday/Thursday incident");
}

const gap = ep.scenes.find((scene) => scene.id === "gap");
if (
  !gap ||
  gap.stat !== "2.75 vs 3.59" ||
  gap.leftLabel !== "go find it" ||
  gap.rightLabel !== "you grow it"
) {
  fail("missing 2.75 vs 3.59 finding");
}

if (
  close.title !== "Hard does not mean you picked the wrong thing." ||
  close.cta !== CTA ||
  !close.vo.includes(CTA)
) {
  fail("end CTA is not the subscribe line");
}

if (picture < FEEL_MIN || picture > FEEL_MAX) {
  fail(`feel ${picture.toFixed(0)}s is outside ${FEEL_MIN}–${FEEL_MAX}`);
}

const endCard = readFileSync("src/scenes/EndCard.tsx", "utf8");
if (!endCard.includes("voName=")) {
  fail("speech-led end card must drive CairnSlot from its envelope");
}

console.log(`spine ${ids.join(" ")}  picture ${picture.toFixed(1)}s  ${(picture / 60).toFixed(2)}m`);
console.log("tip-list check ok");
