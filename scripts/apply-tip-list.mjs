import { readFileSync, writeFileSync } from "node:fs";

const ep = JSON.parse(readFileSync("episodes/ep01.json", "utf8"));

function beats(items) {
  return items.map((item, i) => ({
    atSec: i * 6,
    pose: item.pose,
    caption: item.caption,
    mood: item.mood ?? "default",
  }));
}

function wc(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const hook = ep.scenes.find((scene) => scene.id === "hook");
hook.vo = hook.vo.replace("Four things Cairn does", "Five things Cairn does");
if (Array.isArray(hook.beats)) {
  for (const beat of hook.beats) {
    if (beat.caption === "4 PARTS") {
      beat.caption = "5 PARTS";
    }
  }
}

const part1Vo =
  "Part one. Fixed interest. Cairn treats a dull Thursday as proof he picked wrong. If the pile feels like homework, the passion must be fake. So Cairn closes the folder. He tells a friend it was not the one. That is the trap. A hard night is not a verdict. Find your passion is a fixed theory of interest. It makes Cairn loyal until the spark dies, then it makes him leave. Tuesday was allowed to feel like a calling. Thursday is not allowed to feel like work. The moment the desk goes cold, Cairn reads it as evidence he found the wrong thing. He does not ask what the pile needs. He asks whether he is still the kind of person who loves this. That question is the trap. Interests are not soulmates waiting in a drawer. They are built. The paper is O'Keefe, Dweck, and Walton, two thousand eighteen. One spoken mention. The warrant stays in the description. Cairn keeps the folder open. He does not perform a passion test at midnight. He does not audit his personality against a dull page. He names the theory that is talking. Fixed interest. Then he sits back down. The folder stays on the desk. The chair stays pulled in. That is Part one made visible.";

const part2Vo =
  "Part two. Interests develop. The warrant's actual claim is a rule Cairn can use. An interest is grown. It is not found like a coin under a bench. When Cairn sits with a mismatching article, a find theory cools him. A develop theory keeps him curious. Same page. Different theory. Different heat. Cairn uses that. Thursday feeling like homework is not a broken compass. It is the first hour of development. He does not need a new passion. He needs another pass. The spark is not a verdict. It is a starting temperature. Cairn treats the dull page as the work, not as a warning that he chose badly. He reads the hard paragraph again. He does not open a new folder to feel Tuesday again. Develop it means stay long enough for the interest to thicken. That is the rule. Cairn gives the pile a second hour before he gives it a funeral. He lets a mismatch stay on the desk. He writes one more sentence after the feeling leaves. Curiosity is a practice, not a weather report. If the page is cold, Cairn adds friction on purpose. He asks one better question of the same file. That is development. Not a new calling. In the studies, people handed a find theory cooled on the mismatch. People handed a develop theory did not. Cairn borrows that. He talks to himself like the develop group. The article can be wrong for his taste and still be worth a pass. Taste is not a locked door.";

const part3Vo =
  "Part three. Hard is not wrong. This is the thesis as a named part. Hard does not mean Cairn picked the wrong thing. Finish the session anyway. When the side project gets dull, Cairn used to treat that as evidence. He closed the lid. He told the table it was not the one. That sentence felt honest and it was the fixed theory talking. Urging people to find their passion can put all the eggs in one basket, then drop the basket when it gets heavy. Cairn will not drop this basket tonight. A heavy paragraph is not a sign to switch lives. It is a sign to keep the hands on the work. The mismatch does not cancel the pile. The pile is still the pile. Cairn names the feeling and stays. He says the night is hard and he does not add the word wrong. Those are different claims. Hard is a load. Wrong is a verdict. Cairn carries the load. He does not issue the verdict. If a friend asks whether this is still the one, Cairn answers with the session, not with the mood. The thesis has a body now. Hardness used to be a story about identity. Now it is a story about load. Cairn can carry a load without rewriting who he is. That is faster and it is funnier, because the joke and the lesson are the same sentence. Cairn does the hard bit. He does not audition a new self.";

const part4Vo =
  "Part four. Finish the session. This is the do-this move. Cairn sets a finish line he can see from the chair. One session. Not a new identity. Not a rebrand. When the spark dies, Cairn finishes the block he already started. He does not hunt a cleaner calling on the same night. He does not ask the room whether he is still passionate. He asks what the next stone is. Then he does that stone. The session ends when the block ends, not when the feeling ends. That is how Cairn stays in the work. Develop it is a verb he can do before bed. Cairn writes the finish line on a scrap. Twenty minutes. One function. One paragraph. He starts the timer. When it rings he stops, even if Tuesday never came back. The win is the ended block. Not a restored crush. Cairn can keep a promise to a pile. That is the move.";

const part5Vo =
  "Part five. Put the stone on the pile. Only if the close has not already said it. Tonight it has not. Cairn takes the finished block and puts it on the stack. The pile is the record. Not the mood. Not the Tuesday glow. A stone is a session that happened. Cairn can see it. Tomorrow the pile is still there even if Thursday comes back. That is the point of a cairn. Marks on a path. Not proof of a soulmate. Cairn does not need a new species of work. He needs another stone. He places it where he can see it. A note. A commit. A crossed line. The stack gets taller by one. That height is the only proof Cairn trusts after a cold Thursday. Mood lies. The pile does not. He leaves the room with a taller cairn than he entered.";

const closeVo =
  "Tuesday felt like the one. Thursday felt like homework. Fixed interest made Cairn want to walk. Interests develop. Hard is not wrong. Finish the session. Put the stone on the pile. Cairn recaps the night as a list he can keep. Then he does the last line. Cairn finishes the session anyway.";

const scenes = [
  hook,
  {
    id: "part1",
    type: "cairnCaption",
    pose: "listen",
    visual: "conceptLabel",
    mood: "default",
    label: "Fixed interest",
    caption: "Cairn treats a dull Thursday as proof he picked wrong.",
    vo: part1Vo,
    speechLed: true,
    beats: beats([
      { pose: "listen", caption: "FIXED INTEREST" },
      { pose: "still", caption: "DULL THURSDAY" },
      { pose: "still", caption: "THE TRAP" },
      { pose: "point", caption: "NOT A VERDICT" },
      { pose: "point", caption: "KEEP THE FOLDER" },
      { pose: "listen", caption: "NAME THE THEORY" },
      { pose: "point", caption: "SIT BACK DOWN" },
    ]),
  },
  {
    id: "part2",
    type: "cairnCaption",
    pose: "listen",
    visual: "conceptLabel",
    mood: "default",
    label: "Interests develop",
    caption: "An interest is grown. It is not found.",
    vo: part2Vo,
    speechLed: true,
    beats: beats([
      { pose: "listen", caption: "INTERESTS DEVELOP" },
      { pose: "still", caption: "GROWN NOT FOUND" },
      { pose: "listen", caption: "SAME PAGE" },
      { pose: "point", caption: "STARTING HEAT" },
      { pose: "point", caption: "STAY LONG ENOUGH" },
      { pose: "listen", caption: "SECOND HOUR" },
      { pose: "point", caption: "SAME FILE" },
    ]),
  },
  {
    id: "part3",
    type: "cairnCaption",
    pose: "point",
    visual: "conceptLabel",
    mood: "default",
    label: "Hard is not wrong",
    caption: "Hard does not mean Cairn picked the wrong thing.",
    vo: part3Vo,
    speechLed: true,
    beats: beats([
      { pose: "point", caption: "HARD ≠ WRONG" },
      { pose: "still", caption: "NOT EVIDENCE" },
      { pose: "listen", caption: "THE BASKET" },
      { pose: "point", caption: "KEEP THE HANDS" },
      { pose: "point", caption: "CAIRN STAYS" },
      { pose: "listen", caption: "LOAD NOT VERDICT" },
      { pose: "point", caption: "ANSWER WITH THE SESSION" },
    ]),
  },
  {
    id: "part4",
    type: "cairnCaption",
    pose: "point",
    visual: "conceptLabel",
    mood: "default",
    label: "Finish the session",
    caption: "Cairn finishes the block he already started.",
    vo: part4Vo,
    speechLed: true,
    beats: beats([
      { pose: "point", caption: "FINISH THE SESSION" },
      { pose: "listen", caption: "ONE BLOCK" },
      { pose: "still", caption: "NOT A REBRAND" },
      { pose: "point", caption: "NEXT STONE" },
      { pose: "point", caption: "A VERB TONIGHT" },
      { pose: "listen", caption: "WRITE THE LINE" },
      { pose: "point", caption: "ENDED BLOCK" },
    ]),
  },
  {
    id: "part5",
    type: "cairnCaption",
    pose: "point",
    visual: "conceptLabel",
    mood: "default",
    label: "Stone on the pile",
    caption: "Cairn puts the finished block on the stack.",
    vo: part5Vo,
    speechLed: true,
    beats: beats([
      { pose: "point", caption: "STONE ON THE PILE" },
      { pose: "listen", caption: "THE RECORD" },
      { pose: "still", caption: "NOT THE MOOD" },
      { pose: "point", caption: "MARKS ON A PATH" },
      { pose: "point", caption: "ANOTHER STONE" },
      { pose: "listen", caption: "MOOD LIES" },
      { pose: "point", caption: "TALLER CAIRN" },
    ]),
  },
  {
    id: "end",
    type: "endCard",
    pose: "still",
    title: "Find it or develop it",
    cite: "O’Keefe, Dweck & Walton, 2018",
    cta: "Cairn finishes the session anyway.",
    vo: closeVo,
    speechLed: true,
  },
];

const words = scenes.reduce((sum, scene) => sum + wc(scene.vo), 0);
const voSec = (words / 165) * 60;
const picture = voSec + scenes.length * 0.8;
console.log({
  scenes: scenes.map((s) => s.id),
  words,
  voSec: Number(voSec.toFixed(1)),
  picture: Number(picture.toFixed(1)),
  feelMin: Number((picture / 60).toFixed(2)),
});

ep.scenes = scenes;
ep.durationTargetSec = 450;
ep.voiceLabel =
  "Flagship lines are Qwen3-TTS CustomVoice / Ryan via mlx-audio, near 165 wpm. Not Perk. Not a clone. Not say.";
ep.thesis =
  "Hard does not mean you picked the wrong thing. Finish the session anyway.";

writeFileSync("episodes/ep01.json", `${JSON.stringify(ep, null, 2)}\n`);
