import { readFileSync, writeFileSync } from "node:fs";

const SETTLE = 0.8;
const CLIP_MIN = 20;
const CLIP_MAX = 45;

const TARGETS = {
  hook: 26,
  part1: 35,
  part2: 35,
  part3: 32,
  part4: 30,
  part5: 30,
};

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));

function words(text) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function sentenceEnds(text) {
  const chunks = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  let count = 0;
  return chunks.map((chunk) => {
    count += words(chunk).length;
    return { text: chunk.trim(), words: count };
  });
}

function pickEnd(voSec, text, targetSec) {
  const total = words(text).length;
  const spokenMin = CLIP_MIN - SETTLE;
  const spokenMax = CLIP_MAX - SETTLE;
  let best = { endSec: Math.min(voSec, spokenMax), sentence: text };
  let bestDist = Infinity;
  for (const end of sentenceEnds(text)) {
    const endSec = (end.words / total) * voSec;
    if (endSec < spokenMin || endSec > spokenMax) {
      continue;
    }
    const picture = endSec + SETTLE;
    const dist = Math.abs(picture - (targetSec + SETTLE));
    if (dist < bestDist) {
      best = { endSec, sentence: end.text };
      bestDist = dist;
    }
  }
  return best;
}

for (const clip of ep.clips) {
  const scene = ep.scenes.find((item) => item.id === clip.sceneId);
  const voSec = durations[clip.sceneId];
  const target = TARGETS[clip.sceneId] ?? 32;
  const pick = pickEnd(voSec, scene.vo, target);
  clip.startSec = 0;
  clip.endSec = Number(pick.endSec.toFixed(3));
  console.log(
    `${clip.id}  ${clip.startSec}-${clip.endSec}s  ${(clip.endSec + SETTLE).toFixed(2)}s pic  …${pick.sentence.slice(-80)}`,
  );
}

writeFileSync("episodes/ep01.json", `${JSON.stringify(ep, null, 2)}\n`);
