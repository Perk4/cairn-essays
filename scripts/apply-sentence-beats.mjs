import { readFileSync, writeFileSync } from "node:fs";

const MAX_HOLD = 4;

const POSES = {
  hook: ["listen", "present", "point", "listen", "react", "still"],
  trap: ["slump", "react", "listen", "point", "present", "slump"],
  story: ["listen", "still", "react", "point", "present", "listen"],
  gap: ["listen", "point", "listen", "point"],
  eggs: ["still", "react", "slump", "present", "listen"],
  stay: ["present", "point", "listen", "react", "present"],
  stack: ["point", "present", "listen", "point"],
  end: ["still", "listen", "point", "present", "still", "point"],
};

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));

function fail(message) {
  throw new Error(message);
}

function roundSec(sec) {
  return Number(sec.toFixed(3));
}

function captionFor(sceneId, text) {
  if (sceneId === "hook") {
    if (/^Tuesday\b/i.test(text)) {
      return "TUESDAY";
    }
    if (/^Thursday\b/i.test(text)) {
      return "THURSDAY";
    }
    if (/Hard does not mean you picked the wrong thing/i.test(text)) {
      return "HARD ≠ WRONG";
    }
    if (/^Finish the session anyway/i.test(text)) {
      return "FINISH ANYWAY";
    }
  }
  return text;
}

function moodFor(sceneId, text, thursday) {
  if (sceneId === "hook") {
    if (/Hard does not mean you picked the wrong thing/i.test(text)) {
      return "default";
    }
    if (thursday || /^Thursday\b/i.test(text)) {
      return "cold";
    }
    return "warm";
  }
  if (sceneId === "trap") {
    return /Thursday|lid|trap|verdict/i.test(text) ? "cold" : "default";
  }
  if (sceneId === "story") {
    return /article|wall|hard page/i.test(text) ? "cold" : "warm";
  }
  if (sceneId === "eggs") {
    return "cold";
  }
  if (sceneId === "end") {
    return "warm";
  }
  return "default";
}

function poseFor(sceneId, text, cyclePose) {
  if (sceneId === "hook" && /^Tuesday\b/i.test(text)) {
    return "listen";
  }
  if (sceneId === "hook" && /^Thursday\b/i.test(text)) {
    return "still";
  }
  if (sceneId === "hook" && /^Finish the session anyway/i.test(text)) {
    return "point";
  }
  if (sceneId === "gap" && /point/i.test(text)) {
    return "point";
  }
  if (sceneId === "stack" && /lands|pile|throw/i.test(text)) {
    return "point";
  }
  return cyclePose;
}

function beatRow(atSec, pose, caption, mood) {
  const beat = { atSec, pose, caption };
  if (mood) {
    beat.mood = mood;
  }
  return beat;
}

function fillSpan(start, end, caption, mood, poses, poseIndex, forcedPose) {
  const rows = [];
  let t = start;
  let i = poseIndex;
  let lastPose = null;
  while (end - t > MAX_HOLD + 1e-6) {
    const pose =
      t === start && forcedPose ? forcedPose : poses[i % poses.length];
    const used = pose === lastPose ? poses[(i + 1) % poses.length] : pose;
    if (used !== pose) {
      i += 1;
    }
    rows.push(beatRow(roundSec(t), used, caption, mood));
    lastPose = used;
    t = roundSec(t + MAX_HOLD);
    i += 1;
  }
  let pose = t === start && forcedPose ? forcedPose : poses[i % poses.length];
  if (pose === lastPose) {
    i += 1;
    pose = poses[i % poses.length];
  }
  rows.push(beatRow(roundSec(t), pose, caption, mood));
  return { rows, nextIndex: i + 1 };
}

for (const scene of ep.scenes) {
  const voSec = durations[scene.id];
  if (typeof voSec !== "number" || voSec <= 0) {
    fail(`${scene.id} VO duration missing`);
  }
  const cues = JSON.parse(
    readFileSync(`public/vo/${scene.id}.cues.json`, "utf8"),
  );
  const poses = POSES[scene.id];
  if (!poses) {
    fail(`${scene.id} has no pose cycle`);
  }
  const beats = [];
  let poseIndex = 0;
  let thursday = false;
  for (let i = 0; i < cues.length; i += 1) {
    const cue = cues[i];
    if (/^Thursday\b/i.test(cue.text)) {
      thursday = true;
    }
    const caption = captionFor(scene.id, cue.text);
    const mood = moodFor(scene.id, cue.text, thursday);
    const forced = poseFor(scene.id, cue.text, null);
    const end = i + 1 < cues.length ? cues[i + 1].start : voSec;
    const filled = fillSpan(
      cue.start,
      end,
      caption,
      mood,
      poses,
      poseIndex,
      forced,
    );
    beats.push(...filled.rows);
    poseIndex = filled.nextIndex;
  }
  scene.beats = beats;
  if (beats[0]?.pose) {
    scene.pose = beats[0].pose;
  }
  if (beats[0]?.mood && "mood" in scene) {
    scene.mood = beats[0].mood;
  }
  if (beats[0]?.caption && scene.type === "cairnCaption") {
    scene.caption = beats[0].caption;
  }
}

for (const [shortId, beats] of Object.entries(ep.shorts)) {
  for (const beat of beats) {
    const voSec = durations[`short-${shortId}-${beat.id}`];
    if (typeof voSec !== "number" || voSec <= 0) {
      fail(`short-${shortId}-${beat.id} VO duration missing`);
    }
    beat.durationSec = voSec;
  }
}

writeFileSync("episodes/ep01.json", `${JSON.stringify(ep, null, 2)}\n`);
const beatCount = ep.scenes.reduce(
  (sum, scene) => sum + (scene.beats?.length ?? 0),
  0,
);
console.log(
  `sentence pictures ${beatCount}  shorts ${ep.shorts.hook.map((b) => b.durationSec).join("+")}s`,
);
