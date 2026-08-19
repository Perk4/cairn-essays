import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function hash(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

const kit = [
  "still",
  "listen",
  "point",
  "mouth-closed",
  "mouth-mid",
  "mouth-open",
  "tue-open",
  "thu-slits",
];
for (const name of kit) {
  const path = `public/cairn/${name}.png`;
  if (!existsSync(path)) {
    fail(`missing ${path}`);
  }
}

if (hash("public/cairn/still.png") === hash("public/cairn/listen.png")) {
  fail("still and listen are the same file");
}
if (hash("public/cairn/tue-open.png") === hash("public/cairn/thu-slits.png")) {
  fail("tue-open and thu-slits are the same file");
}
if (hash("public/cairn/mouth-closed.png") === hash("public/cairn/mouth-open.png")) {
  fail("mouth-closed and mouth-open are the same file");
}

const slot = readFileSync("src/cairn/CairnSlot.tsx", "utf8");
if (slot.includes("Math.sin(frame") || slot.includes("talkingListen")) {
  fail("CairnSlot still bobs");
}
if (!slot.includes("PlantedCairn")) {
  fail("PlantedCairn missing");
}

const room = readFileSync("src/components/Room.tsx", "utf8");
if (room.includes("floorTop} - 14px")) {
  fail("hover pad still in Room");
}

const limits = readFileSync("src/scenes/LimitsCard.tsx", "utf8");
if (limits.includes("CairnSlot") || limits.includes("PlantedCairn")) {
  fail("Limits still has a Cairn PiP");
}

const json = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
if (json.scenes.some((scene) => scene.type === "limitsCard")) {
  fail("limits wall is still in the cut");
}

const kitSrc = readFileSync("src/cairn/kit.ts", "utf8");
if (!kitSrc.includes("VOWELS") || !kitSrc.includes("TUE_OPEN")) {
  fail("kit.ts missing vowel visemes or tue/thu files");
}

const verbs = readFileSync("src/cairn/verbs.tsx", "utf8");
if (!verbs.includes("EggsDrop") || !verbs.includes("FlyingStone")) {
  fail("verbs missing eggs or flying stone");
}

console.log("acting kit files differ");
console.log("planted, no hover pad, no limits PiP, vowels, eggs, stone");
console.log("acting check ok");
