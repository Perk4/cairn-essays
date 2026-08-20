import { readFileSync } from "node:fs";

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const flagship = readFileSync("src/compositions/Flagship.tsx", "utf8");
const root = readFileSync("src/Root.tsx", "utf8");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (ep.title !== "You booked it like a standup") {
  fail("title is not locked");
}
if (!/Book the passion like a job/.test(ep.thesis)) {
  fail("thesis is not locked");
}

const locked =
  "If this week's takeaway stuck, subscribe. Next one lands same time.";
const cta = ep.scenes.find((scene) => scene.id === "cta");
if (!cta || cta.vo !== locked) {
  fail("CTA is not the locked line");
}

const banned = ["habit", "app store", "download", "stay monkey"];
const surface = `${ep.description} ${cta.vo}`.toLowerCase();
for (const token of banned) {
  if (surface.includes(token)) {
    fail(`package has banned CTA: ${token}`);
  }
}

if (flagship.includes("MusicBed")) {
  fail("flagship still mixes a music bed");
}
if (root.includes("ep01-rule")) {
  fail("root still registers a second Short");
}

console.log(`thumb "${ep.thumbLine}"  ${ep.scenes.length} shots`);
console.log("package check ok");
