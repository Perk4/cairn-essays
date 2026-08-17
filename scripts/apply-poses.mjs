import { readFileSync, writeFileSync } from "node:fs";

const POSE_BY_CAPTION = {
  TUESDAY: "listen",
  THURSDAY: "slump",
  "WRONG THING?": "react",
  "THE WORK": "present",
  "5 PARTS": "point",
  "FIXED INTEREST": "present",
  "DULL THURSDAY": "slump",
  "THE TRAP": "slump",
  "NOT A VERDICT": "react",
  "KEEP THE FOLDER": "point",
  "NAME THE THEORY": "listen",
  "SIT BACK DOWN": "present",
  "INTERESTS DEVELOP": "present",
  "GROWN NOT FOUND": "listen",
  "SAME PAGE": "listen",
  "STARTING HEAT": "point",
  "STAY LONG ENOUGH": "point",
  "SECOND HOUR": "listen",
  "SAME FILE": "react",
  "HARD ≠ WRONG": "present",
  "NOT EVIDENCE": "slump",
  "THE BASKET": "slump",
  "KEEP THE HANDS": "point",
  "CAIRN STAYS": "point",
  "LOAD NOT VERDICT": "react",
  "ANSWER WITH THE SESSION": "present",
  "FINISH THE SESSION": "present",
  "ONE BLOCK": "listen",
  "NOT A REBRAND": "slump",
  "NEXT STONE": "point",
  "A VERB TONIGHT": "point",
  "WRITE THE LINE": "listen",
  "ENDED BLOCK": "react",
  "STONE ON THE PILE": "present",
  "THE RECORD": "listen",
  "NOT THE MOOD": "slump",
  "MARKS ON A PATH": "point",
  "ANOTHER STONE": "point",
  "MOOD LIES": "react",
  "TALLER CAIRN": "present",
};

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));

for (const scene of ep.scenes) {
  if (!Array.isArray(scene.beats)) {
    continue;
  }
  for (const beat of scene.beats) {
    const pose = POSE_BY_CAPTION[beat.caption];
    if (pose) {
      beat.pose = pose;
    }
  }
  if (scene.beats[0]?.pose) {
    scene.pose = scene.beats[0].pose;
  }
}

writeFileSync("episodes/ep01.json", `${JSON.stringify(ep, null, 2)}\n`);
console.log("applied hard pose cuts");
