import { readFileSync } from "node:fs";

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const flagship = readFileSync("src/compositions/Flagship.tsx", "utf8");
const short = readFileSync("src/compositions/Short.tsx", "utf8");
const clip = readFileSync("src/compositions/Clip.tsx", "utf8");
const render = readFileSync("scripts/render.mjs", "utf8");
const CTA =
  "If this week's takeaway stuck, subscribe. Next one lands same time.";

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!/^Cairn explains/i.test(ep.description ?? "")) {
  fail("description must start with Cairn explains");
}
if (
  !/O’Keefe, Dweck & Walton/.test(ep.description) ||
  !/2018/.test(ep.description)
) {
  fail("description must credit the warrant");
}

const banned = ["habit", "app store", "download", "stay monkey", "staymonkey"];
const surface = `${ep.description} ${ep.scenes.find((s) => s.id === "end")?.cta ?? ""} ${ep.scenes.find((s) => s.id === "end")?.vo ?? ""}`.toLowerCase();
for (const token of banned) {
  if (surface.includes(token)) {
    fail(`package has banned CTA: ${token}`);
  }
}

const words = String(ep.thumbLine ?? "")
  .trim()
  .split(/\s+/)
  .filter(Boolean);
if (words.length < 2 || words.length > 4) {
  fail(`thumbLine must be 2–4 words, got ${words.length}`);
}

const end = ep.scenes.find((scene) => scene.id === "end");
if (!end || end.type !== "endCard") {
  fail("missing authored end card");
}
if (end.cta !== CTA) {
  fail("end CTA must be the subscribe line");
}

if (
  flagship.includes("MusicBed") ||
  short.includes("MusicBed") ||
  clip.includes("MusicBed")
) {
  fail("package still plays a music bed");
}
const outputs = [...render.matchAll(/out\/[^"]+\.mp4/g)].map((match) => match[0]);
if (outputs.join(" ") !== "out/ep01.mp4 out/ep01-hook.mp4") {
  fail(`render outputs drifted: ${outputs.join(" ")}`);
}

const shortHook = ep.shorts?.hook ?? [];
if (
  shortHook.length !== 2 ||
  shortHook[0]?.pose !== "listen" ||
  shortHook[0]?.mood !== "warm" ||
  shortHook[0]?.visual !== "callingHomework" ||
  shortHook[1]?.pose !== "still" ||
  shortHook[1]?.mood !== "cold" ||
  shortHook[1]?.visual !== "callingHomework"
) {
  fail("hook Short must act Tuesday calling then Thursday homework");
}
if (!Array.isArray(ep.shorts?.rule) || ep.shorts.rule.length < 2) {
  fail("rule Short must remain renderable");
}

console.log(`thumb "${ep.thumbLine}"  description ${ep.description.length} chars`);
console.log("package check ok");
