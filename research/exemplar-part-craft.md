# How the format exemplar writes a spoken Part

Findings for [How does the format exemplar write a spoken Part?](https://github.com/Perk4/cairn-essays/issues/71). This file records sentence-level measurements only. It does not recommend what Cairn should copy.

Channel structure (duration, WPM, numbered-unit rate, scene-change proxy) was already measured for this same video in [What do the three reference videos actually do?](https://github.com/Perk4/cairn-essays/issues/32). Those figures are not re-surveyed here. Sleep and Learn are out of scope.

## Question

At sentence level — not channel structure — how does [How To Get Rid Of Screen Addiction](https://www.youtube.com/watch?v=Iz_MHsiZ8KE) write and stage a spoken Part, and how does that compare to current `origin/main` ep01 Parts?

Settle:

- Typical spoken sentence length, restatement, and joke-or-move density per claim
- How on-screen labels relate to the spoken line (echo, shorten, or add a new claim)
- How often the picture is a staged action (mascot + prop + room) versus a title card
- How that compares to `origin/main` ep01 Parts `part1`–`part5` (long restating VO; last-caption padding such as “SIT BACK DOWN”)

## Method

Primary sources only:

- YouTube oEmbed JSON for the exemplar.[1]
- The exemplar watch page, player metadata extracted by yt-dlp, official auto-captions (`en-orig` timed text; no manual captions exist), and frames taken from the official 360p encode (`format 18`, 640×360, 30 fps).[2]
- `episodes/ep01.json` on `origin/main` (`0b3d3c7`), scenes `part1`–`part5`.[3]

Speech is reconstructed from unique last-lines of the rolling auto-caption window, then from word-timed `<c>` cues in the same VTT. Auto-captions mishear names (`Monkeykey`, `reensitizing`, `street` for streak, `monkeyy's`) and drop at least one clause (`remove all Now monkey mistakes`). They are not a human transcript.[2]

A **spoken sentence** is a period-, question-, or exclamation-terminated clause in that reconstruction. A **claim** is a distinct propositional move (definition, mechanism, contrast, instruction, or recap). A **restatement** is a later sentence in the same unit whose content is already stated, without a new mechanism, contrast, example, number, or instruction. A **joke** is a comic specific (banana, McFlurry, GTA, pee, caged rat). A **move** is an actionable instruction the viewer can do.

On-screen type and picture class are reported only from frames that were opened. Sixty stills were cut on an ~8s grid plus Part/Step starts (0s through 456s). Fifty-five of those stills were opened. Labels are classified against the spoken window at the same timestamp: **echo** (same or near-same words), **shorten** (subset of the spoken claim), **new claim** (wording or proposition not in the spoken line), or **no label**.

Picture class for this ticket:

- **Title card:** full-screen type, no mascot. The picture is the label.
- **Section header:** mascot presents a Part/Step name on the cream field.
- **Staged action with room:** mascot + prop + a depicted space (lab, forest, tree).
- **Staged action, no room:** mascot + prop on the cream void.
- **Diagram / comparison card:** flowchart, equation, before/after, or icon row.
- **Mascot + short label:** mascot presents a phrase on the cream void, no prop and no room.
- **Pose only:** mascot, no type.

Counts were taken on 2026-08-17 from the live YouTube objects and from `origin/main` `episodes/ep01.json`.[1][2][3]

## Object

oEmbed title: "How To Get Rid Of Screen Addiction." Author `monke`, `author_url` `https://www.youtube.com/@monkebiznis`.[1]

Watch-page metadata: duration 464s (7:44), upload date 20250930, category Entertainment, chapters none, manual captions none, official auto-captions present as `en-orig`.[2] Description: "Monke explains 4 steps to re-program your dopamine system so that it starts to work for you, making you want to do hard work."[2]

Auto-captions run 0.16–458.60s of 464s. No mid-video gap ≥2s. The only uncovered interval is a 5.4s end tail. Reconstructed word count is 1,307.[2]

Spoken unit labels in the captions, with first timestamp:

- Part one, dopamine — 16.6s.[2]
- Part two, why monkey can't focus — 51.9s.[2]
- Part three, reensitizing the dopamine system — 102.0s.[2]
- Step one, take boring breaks — 121.0s.[2]
- Step two, playing with time — 188.6s.[2]
- Step three, be bored more — 308.6s.[2]
- Step four, do everything one thing at a time — 368.2s.[2]

The three labeled Parts occupy about 16.6–121s. Part three is a short intro, then four Steps carry the body. The close begins at "So Monkey has now taught you" and recaps the four steps.[2]

## Spoken sentence length

Sentence counts below use the reconstructed transcript. Word counts ignore ASR artifacts as extra tokens; they do not correct them.[2]

| Unit | First spoken label | Sentences | Words | Median words | Mean words | Min–max |
| --- | --- | --- | --- | --- | --- | --- |
| Hook (before Part one) | — | 3 | 51 | 19 | 17.0 | 11–21 |
| Part one | Part one, dopamine. | 9 | 97 | 9 | 10.8 | 3–21 |
| Part two | Part two, why monkey can't focus. | 11 | 137 | 12 | 12.5 | 6–22 |
| Part three intro | Part three, reensitizing the dopamine system. | 5 | 52 | 10 | 10.4 | 4–22 |
| Step one | Step one, take boring breaks. | 13 | 207 | 12 | 15.9 | 5–42 |
| Step two | Step two, playing with time. | 24 | 349 | 13 | 14.5 | 4–35 |
| Step three | Step three, be bored more. | 20 | 184 | 8 | 9.2 | 4–27 |
| Step four | Step four, do everything one thing at a time. | 14 | 141 | 9 | 10.1 | 4–22 |
| Close | So Monkey has now taught you… | 10 | 92 | 10 | 9.2 | 3–18 |

Body of the labeled Parts plus the four Steps (96 sentences): median **10** words, mean 12.2, 25th percentile 7, 75th percentile 15.[2]

- ≤8 words: 34 / 96 (35%).[2]
- ≤12 words: 61 / 96 (64%).[2]
- ≤16 words: 75 / 96 (78%).[2]
- \>20 words: 14 / 96 (15%).[2]

The three labeled Parts themselves (25 sentences, 286 words) sit at median 10 words. The opener of each is a short label: "Part one, dopamine." (3 words), "Part two, why monkey can't focus." (6), "Part three, reensitizing the dopamine system." (6).[2]

A typical Part-one sentence is short and declarative: "Dopamine is a brain chemical." (5 words), then one longer evidence sentence (16 and 21 words for the 1990 rat beat), then a short punch: "In other words, monkey don't actually want the banana." (9).[2]

The longest reconstructed sentences sit in the Steps, not in the labeled Parts: a 42-word rat-cage sentence in Step one, and a 35-word ASR-damaged sentence in Step two.[2]

## Restatement

Operational test: a later sentence in the same unit that repeats a prior claim without a new mechanism, contrast, example, number, or instruction.

**Part one (9 sentences, 3 claims).** Claim A: dopamine is the chemical that makes monkey want things. Claim B: 1990 rat experiment — without dopamine, rats stop pursuing goals. Claim C: monkey wants the dopamine, not the banana.[2]

- Sentence 3 adds function (want) to sentence 2's definition. Not counted as restatement.[2]
- Sentences 6–7 restate claim C ("Monkey like rat only care about dopamine" / "Monkey only pay attention to things because of the dopamine…").[2]
- Sentences 8–9 are marked as restatement by the VO itself: "In other words, monkey don't actually want the banana. Monkey want the dopamine that the banana creates."[2]

Part one therefore states three claims, restates the third twice, and uses "In other words" to turn that restatement into the banana joke. It does not paraphrase the same trap eight times.[2]

**Part two (11 sentences, 3 claims).** Claim D: corporations design max-dopamine food and apps. Claim E: high sensitivity before, low sensitivity now. Claim F: the solution is not a dopamine detox; it is resensitizing.[2]

- Sentence 2 ("So monkey want dopamine above all else") bridges from Part one. That is the only cross-Part restatement inside Part two.[2]
- Sentences 6–9 are a contrast pair plus two examples (banana/walk; McFlurry and TikTok), not a paraphrase loop.[2]
- Sentences 10–11 are a not-X / it-is-Y pair for claim F.[2]

**Part three intro (5 sentences, 1 claim).** Label, then "find satisfaction in simple pleasures again," then the same claim as an outcome (work as happy as TikTok), then the same claim as a mechanism ("making his brain more sensitive"), then "There's a few steps."[2] One claim, restated twice as outcome and mechanism, then a handoff. Duration of this intro is about 19s (102–121s).[2]

**Steps.** Each Step states a problem, one number or comic specific, then a do-this. "Take boring breaks" appears as the Step-one label and once as the alternative ("So instead monkey take boring breaks…"). It is not then rephrased for the rest of the Step.[2] Step four's three parallel lines ("When eating he just eat. When working he just work. When talking he just talk.") are a list of moves, not restatement of one sentence.[2]

The close recaps the four steps in four short lines, then asks a question. It does not re-explain dopamine.[2]

## Joke-or-move density per claim

| Unit | Distinct claims | Jokes (comic specifics) | Moves (do-this) | Jokes per claim | Moves per claim |
| --- | --- | --- | --- | --- | --- |
| Part one | 3 | 1 (banana) | 0 | 0.33 | 0 |
| Part two | 3 | 2 (banana/walk; McFlurry + TikTok) | 0 | 0.67 | 0 |
| Part three intro | 1 | 0 | 1 ("There's a few steps.") | 0 | 1 |
| Step one | 3 | 3 (monkey times; 10× TikTok vs essay; caged rat) | 1 list (mindfulness, walk, foam rolling, light exercise) | 1.0 | 0.33 |
| Step two | 3 | 3 (Monkey theft auto 5; purpose questions; six-pack and passive income) | 2 (track habits; download Lockin) | 1.0 | 0.67 |
| Step three | 2 | 1 (friend goes to pee) | 1 (5 minutes of commute silence, then 7) | 0.5 | 0.5 |
| Step four | 2 | 3 (YouTube while eating; email every 2 minutes; phone during Netflix) | 3 (eat / work / talk as singular activities) | 1.5 | 1.5 |

A labeled Part in this video is explanation-plus-one-joke, not a do-this block. The do-this blocks are the Steps inside Part three. The description independently calls the body "4 steps."[2]

Part one attaches its one joke to claim C and flags it with "In other words."[2] Part two attaches comic specifics to the sensitivity contrast, not to a repeated definition.[2] No labeled Part spends a sentence telling the viewer that the joke and the lesson are the same sentence.[2]

## On-screen labels versus the spoken line

Opened frames that carry type, with the spoken window at that timestamp:[2]

| t (s) | On-screen type | Spoken window | Relation |
| --- | --- | --- | --- |
| 17 | Part 1: Dopamine | "show you how. Part one, dopamine." | Echo (numeral restyled) |
| 23 | Molecule of motivation | "the chemical that makes monkey want to do things" | New claim (nickname not spoken) |
| 28 | Dopamine removed with chemical | "stopped the rat brain from producing dopamine" | Shorten |
| 35 | The rats didn't drink or eat. | "wouldn't pursue any goal even if the goal was crucial to their survival" | New claim (drink/eat not in the spoken line; same beat) |
| 40 | Common ancestor | "Monkey like rat only care about dopamine" | New claim (ancestry diagram; spoken is analogy only) |
| 46 | 1. Monke see banana / 2. Monke brain release dopamine / 3. Monke feel good. Dopamine is the reward. | "monkey don't actually want the banana. Monkey want the dopamine that the banana creates" | Shorten + new wording (numbered comic strip) |
| 52 | Dopamine is all I care about | "Part two, why monkey can't focus. So monkey want dopamine" | New claim (brain as speaker) |
| 58 | That's all I want | "So monkey want dopamine above all else" | Shorten (character thought) |
| 65 | ChimpTok Agenda: Hijack brain / Install reward pathway / Profit | "Chief monkey scientists designed food apps and services that release maximum dopamine" | New claim (three-line agenda not spoken) |
| 72 | McChimp + Over-stimulation | "overstimulate his brain using Tik Tok and playing video games" | Shorten (plus brand joke not spoken) |
| 88 | Low dopamine sensitivity. | "But now monkey have low sensitivity to dopamine" | Echo |
| 94 | Dopamine Detox under a no-symbol | "the solution for monkey is not a dopamine detox" | Echo (negation drawn, not written as "not") |
| 102 | Re-sensitizing the brain. | "Part three, reensitizing the dopamine system" | Shorten |
| 115 | Before: This sucks / After: This is great! | "be as happy as before when he was scrolling Tik Tok" | New claim (plank thought-bubbles) |
| 121 | After: High Dopamine Sensitivity → Happy, motivated monke → Work becomes easy | "making his brain more sensitive to dopamine. There's a few steps. Step one, take boring breaks" | Shorten + new labels on a flowchart |
| 128 | High dopamine activities: Scrolling news / TikTok / Checking email / Eating sugary foods | "he take dopamine fueled breaks. He scroll Tik Tok, check his email and read monkey times" | Echo two items; new claim on two others (news, sugary foods) |
| 136 | Big mistake! | "This is a big mistake" | Shorten |
| 143 | Tik Tok > ESSAY | "Tik Tok released 10 times more dopamine than essay" | Shorten (drops the number) |
| 150 | Change what he does during work breaks | "So instead monkey take boring breaks that reset dopamine" | Shorten / rename |
| 158 | Boring break = more rewarding work | "make work feel like scrolling social media" | New claim (equation form) |
| 166 | Light exercise / Walk / Mindfulness | "mindfulness, walk, foam rolling or light exercise" | Echo three; drops foam rolling |
| 174 | I prefer working | "starve his brain of dopamine so that it craves getting back to work" | New claim (character line) |
| 212 | I will be rich very soon! | "he feels very motivated" / delayed-reward beat | New claim (thought bubble) |
| 230 | Money come soon! | "passive income is right around the corner" | Shorten (character grammar) |
| 250 | Will this make money? | "maybe it's not monkeyy's purpose to do this otherwise he'd be happier" | New claim (different question) |
| 280 | Completed tasks / Streaks → Dopamine | "check off a box or street go up, monkey get dopamine" | Shorten |
| 298 | Lock In panels: Transform your life in 75 days / Build discipline with daily tasks / Stay motivated with streaks | "habit tracking app for you to use called Lockin" | New claim (product copy not spoken) |
| 309 | 3. Being bored more | "Step three, be bored more" | Echo |
| 328 | phone = Dopamine Hit | "reach for his phone for that quick hit of dopamine" | Shorten |
| 338 | Sit quietly, doing nothing. | "Monkey can sit quietly without his phone" | Shorten |
| 348 | Day 1: 5 minutes walking in silence / Day 2: 7 minutes walking in silence | "He take 5 minutes of his commute in silence. Then next day he takes seven" | Echo |
| 386 | Constant, high baseline level of dopamine | "steady stream of dopamine hits" / "needs more and more to feel normal" | Shorten / rename |
| 406 | Hi | "When talking he just talk" | New claim (dialogue tag) |
| 426 | Did you learn? | "So Monkey has now taught you how to reprogram your dopamine" | New claim (different question) |
| 436 | 1. Take boring breaks / 2. Track progress / 3. Be bored more / 4. Do everything, one thing at a time | spoken recap of the four steps | Echo |
| 446 | I will make your life hell | "otherwise dopamine rat make life hell" | Echo (first-person from the rat) |
| 456 | Click the link in the description to get Lock In. | spoken close is "wish you a fine" (truncated); the click-the-link line was spoken at ~305s | New claim at this timestamp (CTA card after the VO has left the CTA) |

Of 37 labeled stills, 14 echo, 12 shorten, and 11 add a new claim or a character line the VO does not say.[2] Echo and shorten are the majority. New-claim labels are nicknames, thought-bubbles, agendas, product copy, or a late CTA card — not a second thesis.[2]

No opened frame holds the same last caption as padding while the VO continues. Labels change when the claim changes.[2]

## Picture: staged action versus title card

Fifty-five opened stills, classified as above:[2]

| Class | Opened stills | Examples |
| --- | --- | --- |
| Title card (type only, no mascot) | 1 | 17s: "Part 1: Dopamine" plus four banana icons |
| Section header (mascot + Part/Step name) | 2 | 102s "Re-sensitizing the brain."; 309s "3. Being bored more" |
| Diagram / comparison card | 11 | opening dopamine molecule; rat + arrow; banana comic strip; Over-stimulation equation; High Dopamine Sensitivity flowchart; TikTok > ESSAY; tasks/streaks → Dopamine; banana-vs-phone circles |
| Mascot + short label, cream void | 20 | Molecule of motivation; Big mistake!; Boring break = more rewarding work; Did you learn?; recap list |
| Staged action, mascot + prop, no room | 13 | phone-scratch; banana offered to rat; Lock In phone; brain wired to a thought-rat |
| Staged action, mascot + prop + room/environment | 5 | 8s and 108s lab (exposed brain, monitor, lab-coat figure); 65s gray room + whiteboard "ChimpTok Agenda"; 80s forest banana toss; 318s two mascots and a tree |
| Pose only, no type | 3 | 368s floating meditation; 396s slump; 416s arms wide |

Title cards are rare: one confirmed type-only card, plus two mascot-presented section headers.[2] Full room staging is also uncommon: 5 of 55 opened stills.[2] The dominant picture is a cream-field still in which the mascot presents a short label, a diagram, or a single prop.[2]

A spoken Part therefore usually opens on a header (title card or mascot + name), then spends the body on mascot-plus-label and mascot-plus-prop stills, with an occasional room. It does not hold one concept label for the length of the VO.[2]

## Comparison to `origin/main` ep01 Parts

Source: `episodes/ep01.json` scenes `part1`–`part5` on `origin/main`.[3] All five set `"visual": "conceptLabel"` and `"type": "cairnCaption"`.[3] `voiceLabel` states Ryan VO is "near 165 wpm."[3]

| Measure | Exemplar labeled Parts (1–3) | ep01 `part1`–`part5` |
| --- | --- | --- |
| VO words per Part | 97 / 137 / 52 (intro only) | 206 / 255 / 248 / 157 / 132 |
| Sentences per Part | 9 / 11 / 5 | 28 / 36 / 30 / 25 / 23 |
| Median words per sentence | 9 / 12 / 10 | 7.5 / 7 / 7 / 6 / 5 |
| Sentences \>20 words | 2 / 2 / 1 | 0 / 0 / 1 / 0 / 0 |
| Distinct claims before restatement | 3 / 3 / 1 | One thesis restated across the Part |
| Last unique caption | Labels change with the claim | `SIT BACK DOWN` / `SAME FILE` / `ANSWER WITH THE SESSION` / `ENDED BLOCK` / `TALLER CAIRN` |
| Last-caption repeats | none observed | 7 / 10 / 9 / 4 / 3 |
| First pad `atSec` | — | 36 / 36 / 36 / 36 / 36 |
| Picture | header, then mascot+label / prop / occasional room | `conceptLabel`; pose/caption swaps only |

ep01 sentences are **shorter** than the exemplar's (median 5–7.5 vs 10), not longer.[2][3] The length difference is in **how many sentences restate the same claim**, and in total VO words per Part.[3]

ep01 `part1` VO opens "Part one. Fixed interest." then states the trap, then restates it as homework-equals-fake, as "That is the trap," as "A hard night is not a verdict," as the desk going cold, as "That question is the trap," and as "Fixed interest" a second time, then adds sit-back-down / folder / chair / "That is Part one made visible."[3] That is one claim walked around the room. Exemplar Part one states three claims and uses "In other words" once.[2][3]

ep01 `part3` contains the line "That is faster and it is funnier, because the joke and the lesson are the same sentence."[3] The exemplar's captions do not announce that a joke is also the lesson; they tell the banana joke.[2]

Last-caption padding is in the ep01 `beats` arrays, not in the exemplar stills.[2][3]

- `part1`: caption `SIT BACK DOWN` at 36s, then again at 42, 48, 54, 60, 66, 72 (7 beats). Unique captions before the pad: `FIXED INTEREST`, `DULL THURSDAY`, `THE TRAP`, `NOT A VERDICT`, `KEEP THE FOLDER`, `NAME THE THEORY`.[3]
- `part2`: `SAME FILE` from 36s through 90s (10 beats).[3]
- `part3`: `ANSWER WITH THE SESSION` from 36s through 84s (9 beats).[3]
- `part4`: `ENDED BLOCK` from 36s through 54s (4 beats).[3]
- `part5`: `TALLER CAIRN` from 36s through 48s (3 beats).[3]

The spoken line that the `part1` pad is named for is "Then he sits back down." It is one sentence near the end of a 206-word VO, not a held on-screen claim that tracks new speech.[3] The exemplar's matching move is a new still when the claim changes (for example `Big mistake!` at the mistake sentence, then `Tik Tok > ESSAY` at the 10× sentence).[2]

ep01 on-screen captions are short all-caps phrases. Relative to their VO they shorten (`FIXED INTEREST` vs "Part one. Fixed interest.") or name a motif (`THE TRAP`, `THE BASKET`). They do not add a new claim the way "Molecule of motivation" or "ChimpTok Agenda" do.[2][3] After `atSec` 36 they stop changing.[3]

## Gaps (not invented)

- Auto-captions are not a human transcript. One Step-two clause is damaged; the close is truncated at "wish you a fine."[2]
- Five of the 60 cut stills were not opened (220s, 270s, 290s, 305s, 358s). Classification counts use the 55 opened stills.[2]
- Whether YouTube burned-in captions appear to a viewer depends on the viewer's caption setting. The files retrieved are auto-captions, not creator-uploaded subs.[2]
- Music bed, loudness, and whether VO is one take were not measured from audio.
- True editorial cut rate was not hand-scored. Picture class is from stills, not from a cut list.
- This file does not re-measure Sleep or Learn.

## Sources

[1] https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=Iz_MHsiZ8KE&format=json — YouTube oEmbed: How To Get Rid Of Screen Addiction
[2] https://www.youtube.com/watch?v=Iz_MHsiZ8KE — YouTube watch page: How To Get Rid Of Screen Addiction
[3] https://raw.githubusercontent.com/Perk4/cairn-essays/main/episodes/ep01.json — origin/main episodes/ep01.json
