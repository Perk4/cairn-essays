import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const board = readFileSync("episodes/ep01.board.md", "utf8");
const existing = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));
const durations = JSON.parse(readFileSync("public/vo/durations.json", "utf8"));

function spokenFor(title) {
  const parts = board.split(/^## Part: /m).slice(1);
  for (const part of parts) {
    const name = part.split("\n", 1)[0].trim();
    if (name !== title) {
      continue;
    }
    const match = part.match(/### Spoken\n([\s\S]*?)\n### Beat Board/);
    if (!match) {
      throw new Error(`no spoken block for ${title}`);
    }
    return match[1].trim();
  }
  throw new Error(`missing board part: ${title}`);
}

const CTA =
  "If this week's takeaway stuck, subscribe. Next one lands same time.";

const scenes = [
  {
    id: "hook",
    type: "cairnCaption",
    pose: "listen",
    visual: "callingHomework",
    mood: "warm",
    caption: "TUESDAY",
    vo: spokenFor("Tuesday calling, Thursday homework"),
    speechLed: true,
    beats: [
      { atSec: 0, pose: "listen", caption: "TUESDAY", mood: "warm" },
      { atSec: 1, pose: "still", caption: "THURSDAY", mood: "cold" },
      { atSec: 2, pose: "listen", caption: "HARD ≠ WRONG", mood: "default" },
      { atSec: 3, pose: "point", caption: "FINISH ANYWAY", mood: "default" },
    ],
  },
  {
    id: "trap",
    type: "cairnCaption",
    pose: "slump",
    visual: "deskStone",
    mood: "cold",
    caption: "THE VERDICT",
    vo: spokenFor("The verdict is the trap"),
    speechLed: true,
    beats: [
      { atSec: 0, pose: "slump", caption: "THE VERDICT", mood: "cold" },
      { atSec: 1, pose: "react", caption: "NAME THE TRAP" },
      { atSec: 2, pose: "listen", caption: "SIT BACK DOWN" },
      { atSec: 3, pose: "point", caption: "ANOTHER PASS" },
    ],
  },
  {
    id: "story",
    type: "cairnCaption",
    pose: "listen",
    visual: "hawkingPaper",
    mood: "warm",
    caption: "HAWKING VIDEO",
    vo: spokenFor("Hawking, then the hard page"),
    speechLed: true,
    beats: [
      { atSec: 0, pose: "listen", caption: "HAWKING VIDEO", mood: "warm" },
      { atSec: 1, pose: "still", caption: "HARD ARTICLE", mood: "cold" },
      {
        atSec: 2,
        pose: "listen",
        caption: "GROW GROUP STAYED",
        mood: "default",
      },
    ],
  },
  {
    id: "gap",
    type: "numberCard",
    pose: "listen",
    kicker: "When the article was hard",
    stat: "2.75 vs 3.59",
    leftLabel: "go find it",
    rightLabel: "you grow it",
    note: "Cairn points at the gap. The grow-it side stayed warmer.",
    footnote: "O’Keefe, Dweck & Walton, 2018",
    vo: spokenFor("The finding he can point at"),
    speechLed: true,
    beats: [
      { atSec: 0, pose: "listen" },
      { atSec: 1, pose: "point" },
    ],
  },
  {
    id: "eggs",
    type: "quoteCard",
    pose: "still",
    quote:
      "You put all your eggs in one basket, then drop the basket when it gets heavy.",
    caption: "Eggs in one basket. Then you drop it.",
    attr: "O’Keefe, Dweck & Walton, 2018",
    vo: spokenFor("Do not drop the basket"),
    speechLed: true,
  },
  {
    id: "stay",
    type: "cairnCaption",
    pose: "present",
    visual: "deskStone",
    mood: "default",
    caption: "FINISH THE SESSION",
    vo: spokenFor("Finish the session"),
    speechLed: true,
    beats: [
      { atSec: 0, pose: "present", caption: "ONE SESSION" },
      { atSec: 1, pose: "point", caption: "NEXT STONE" },
      { atSec: 2, pose: "react", caption: "ENDED BLOCK" },
    ],
  },
  {
    id: "stack",
    type: "cairnCaption",
    pose: "point",
    visual: "stoneDrop",
    mood: "default",
    caption: "THE STONE LEAVES THE HAND",
    vo: spokenFor("Stone on the pile"),
    speechLed: true,
    beats: [
      { atSec: 0, pose: "point", caption: "STONE LEAVES THE HAND" },
      { atSec: 1, pose: "point", caption: "PUT IT ON THE PILE" },
    ],
  },
  {
    id: "end",
    type: "endCard",
    pose: "still",
    title: "Hard does not mean you picked the wrong thing.",
    cite: "O’Keefe, Dweck & Walton, 2018",
    cta: CTA,
    vo: spokenFor("Close"),
    speechLed: true,
  },
];

for (const scene of scenes) {
  if (
    scene.vo.includes("Part one") ||
    scene.vo.includes("Part two") ||
    scene.vo.includes("Part three")
  ) {
    throw new Error(`${scene.id} still says Part N`);
  }
}

const ep = {
  ...existing,
  durationTargetSec: 600,
  thesis:
    "Hard does not mean you picked the wrong thing. Finish the session anyway.",
  voice: "kokoro",
  voiceLabel:
    "Kokoro-82M am_echo, local Apache. Not Perk. Not a clone. Not a human host. Cairn is the body.",
  description:
    "Cairn explains why a dull Thursday is not proof he picked the wrong passion. Warrant: O’Keefe, Dweck & Walton, 2018, Psychological Science.",
  shorts: {
    hook: [
      {
        id: "calling",
        pose: "listen",
        kicker: "TUESDAY",
        caption: "Tuesday it felt like a calling.",
        mood: "warm",
        visual: "callingHomework",
        vo: "Tuesday it felt like a calling.",
        durationSec: durations["short-hook-calling"],
      },
      {
        id: "homework",
        pose: "still",
        kicker: "THURSDAY",
        caption: "Thursday it felt like homework.",
        mood: "cold",
        visual: "callingHomework",
        vo: "Thursday it felt like homework.",
        durationSec: durations["short-hook-homework"],
      },
    ],
    rule: existing.shorts.rule,
  },
  clips: [
    { id: "hook", sceneId: "hook", kicker: "TUESDAY", startSec: 0, endSec: 26 },
    {
      id: "trap",
      sceneId: "trap",
      kicker: "THE VERDICT",
      startSec: 0,
      endSec: 32,
    },
    {
      id: "story",
      sceneId: "story",
      kicker: "HAWKING",
      startSec: 0,
      endSec: 32,
    },
    { id: "stay", sceneId: "stay", kicker: "FINISH", startSec: 0, endSec: 32 },
  ],
  scenes,
};

writeFileSync("episodes/ep01.json", `${JSON.stringify(ep, null, 2)}\n`);
const applied = spawnSync(
  process.execPath,
  ["scripts/apply-sentence-beats.mjs"],
  {
    stdio: "inherit",
  },
);
if (applied.status !== 0) {
  throw new Error("sentence pictures failed after compile");
}
console.log(`compiled ${scenes.length} scenes from board`);
