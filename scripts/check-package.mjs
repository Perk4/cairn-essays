import { readFileSync } from "node:fs";

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const flagship = readFileSync("src/compositions/Flagship.tsx", "utf8");
const bed = readFileSync("src/compositions/MusicBed.tsx", "utf8");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!/^Cairn explains/i.test(ep.description ?? "")) {
  fail("description must start with Cairn explains");
}
if (!/O’Keefe, Dweck & Walton/.test(ep.description) || !/2018/.test(ep.description)) {
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
if (!/\bCairn\b/.test(end.cta) || !/\bCairn\b/.test(end.vo)) {
  fail("end closer must be spoken as Cairn");
}

if (!flagship.includes("speechWindows")) {
  fail("flagship bed is not ducked under speech");
}
if (!bed.includes("SPEECH_DUCK") || !bed.includes("speechWindows")) {
  fail("MusicBed has no speech duck");
}
if (!bed.includes("speaking")) {
  fail("MusicBed duck does not follow speech windows");
}

console.log(`thumb "${ep.thumbLine}"  description ${ep.description.length} chars`);
console.log("package check ok");
