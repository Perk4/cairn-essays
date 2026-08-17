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

const FPS = 30;
const SILENCE = 0.02;
const SILENCE_RUN = 6;
const SETTLE_FRAMES = Math.round(SETTLE * FPS);

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));
const envelopes = JSON.parse(readFileSync("src/voEnvelopes.json", "utf8"));

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

function isQuietRun(samples, start, run) {
  if (start < 0 || start + run > samples.length) {
    return start >= samples.length;
  }
  for (let i = 0; i < run; i++) {
    if (samples[start + i] >= SILENCE) {
      return false;
    }
  }
  return true;
}

function quietThroughSettle(samples, start) {
  const end = Math.min(samples.length, start + SETTLE_FRAMES);
  if (end <= start) {
    return true;
  }
  let loud = 0;
  for (let i = start; i < end; i++) {
    if (samples[i] >= SILENCE) {
      loud += 1;
    }
  }
  return loud / (end - start) < 0.15;
}

function snapToSilence(endSec, samples, spokenMin, spokenMax) {
  const guess = Math.round(endSec * FPS);
  const minI = Math.round(spokenMin * FPS);
  const maxI = Math.min(samples.length - SILENCE_RUN, Math.round(spokenMax * FPS));
  for (let i = guess; i <= maxI; i++) {
    if (isQuietRun(samples, i, SILENCE_RUN) && quietThroughSettle(samples, i)) {
      return i / FPS;
    }
  }
  for (let i = guess; i >= minI; i--) {
    if (isQuietRun(samples, i, SILENCE_RUN) && quietThroughSettle(samples, i)) {
      return i / FPS;
    }
  }
  return Math.min(endSec, spokenMax);
}

function pickEnd(voSec, text, targetSec, samples) {
  const total = words(text).length;
  const spokenMin = CLIP_MIN - SETTLE;
  const spokenMax = CLIP_MAX - SETTLE;
  let best = {
    endSec: snapToSilence(Math.min(voSec, spokenMax), samples, spokenMin, spokenMax),
    sentence: text,
  };
  let bestDist = Infinity;
  for (const end of sentenceEnds(text)) {
    const guessed = (end.words / total) * voSec;
    const endSec = snapToSilence(guessed, samples, spokenMin, spokenMax);
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
  const pick = pickEnd(voSec, scene.vo, target, envelopes[clip.sceneId] ?? []);
  clip.startSec = 0;
  clip.endSec = Number(pick.endSec.toFixed(3));
  console.log(
    `${clip.id}  ${clip.startSec}-${clip.endSec}s  ${(clip.endSec + SETTLE).toFixed(2)}s pic  …${pick.sentence.slice(-80)}`,
  );
}

writeFileSync("episodes/ep01.json", `${JSON.stringify(ep, null, 2)}\n`);
