# Cairn script and beat craft

How scripts and scene beatsheets get made so animation is **directed**, not decorated after the VO. Fail a draft here. Do not treat this as a licence to rewrite ep01 or rebuild the kit.

Sits on top of [What source-to-script contract should we lock?](https://github.com/Perk4/cairn-essays/issues/35) and [Spec: Production spec for the next Cairn essay](https://github.com/Perk4/cairn-essays/issues/51) (tip-list, warrant, speech-led, stone-stack, Ryan VO). Narrowly revises “no second store”: JSON is still the only **render** seam. The board file is the writer artifact.

Compiled from [Wayfinder: Script craft and scene beat language](https://github.com/Perk4/cairn-essays/issues/69).

## What a writer does

1. For each Part, write spoken lines and a Beat Board with written Thumbnails in `episodes/<id>.board.md`.
2. Compile into `episodes/<id>.json` (Scenes, `vo`, Cues). Flagship reads JSON only.
3. Animatic: watch that Part’s Flagship Sequence in Studio against the VO, board in hand.
4. Fail the board, the line, or the Cues — not the mouth or the springs — until the gate passes.
5. Polish only after a pass.

## Craft bar

A Part has **one named claim**. “Horrible” is **restatement without a move**.

1. **One named claim per Part.** Extra laps of the same idea fail.
2. **At most one restatement**, and only as a joke or contrast. A second explanation or “that is Part N made visible” fails.
3. **The Part ends on a move** — a do-this, or a joke that *is* the lesson. A thesis recap is not a move.
4. **Caption changes when the claim changes.** Parking on the last label because the line ran out of new claims fails.
5. **Sentence length is not a fail line.** Short sentences that lap the same idea still fail.

From [What does horrible scripting mean as a craft standard?](https://github.com/Perk4/cairn-essays/issues/72). Measured against [How does the format exemplar write a spoken Part?](https://github.com/Perk4/cairn-essays/issues/71).

## Beat language

**Essay** → **Parts** → **Beat Board** (one per Part) → **Story Beats**. Each Beat has **Staging**, written as a **Thumbnail**. A **Scene** plus **Cues** implement it.

| Term | Meaning |
| --- | --- |
| **Story Beat** | One staged change that makes the Part’s current claim or Move visible. If the frame’s argument did not change, it is not a new Beat. |
| **Beat Board** | Ordered Story Beats for **one Part**. Not one board for the Essay. |
| **Thumbnail** | Written staging note: pose, where Cairn sits, room verb, what the muted frame argues. Drawn frames optional. The YouTube packshot is not this. |
| **Staging** | Arrangement so the Beat’s action is instantly clear. Cairn, visual, and caption are directed, not decoration. |
| **Cue** | One JSON `beats[]` row. A machine keyframe. **Not** a Story Beat. One Story Beat is implemented by **one or more** Cues. Many Cues with the same muted-frame argument are still one Beat. |
| **Scene** | Remotion render unit. Not a story unit. One Scene per Part. Do not split a Part across Scenes to change the set. |
| **Part** | One named claim in the tip-list; ends on a Move. Hook and close count. |
| **Move** | The do-this or joke-as-lesson that ends a Part. |
| **Animatic** | The Beat Board played in time against VO (or scratch). |

Fails: calling a Cue a Story Beat; treating `beats[]` as the Beat Board; a board that is only caption swaps; an Essay-wide board; requiring drawn Thumbnails; saying “scene” when you mean Part or Beat; requiring a 1:1 Cue-to-Beat count.

From [What is the beat language for this factory?](https://github.com/Perk4/cairn-essays/issues/73). Definitions measured in [What do beat board, animatic, thumbnail, and staging mean here?](https://github.com/Perk4/cairn-essays/issues/70).

## Staging contract

A Story Beat is a **staged action**. A caption swap is a Cue.

**Mute the frame.** If that still does not argue the claim or Move, the Thumbnail fails.

A new Beat must change **what the room is doing** — a different pose-as-action, a prop that enters or leaves, or a spatial change. Caption may echo that verb. Caption is not the verb.

A room verb is the **muted-frame argument**, not the pose PNG name. Two `point` Cues can be different Beats if the room changed. Same pose, same set, new caption is still a Cue.

Pose-as-action on existing Cue fields (pose, caption, mood) is a legal room verb. Scene-level visual is Part set dressing. Cue-level visual is **not** required in this factory. Do not split one Part into many Scenes to change the set. Flagship names one Sequence per Scene. The Animatic watch needs that Sequence to be the Part.

Prefer **Cairn + a readable room verb** over planted-Cairn-plus-cycling-`conceptLabel`. Existing kit verbs are enough to start. Does not rebuild the kit or reopen the stone-stack look.

Fails: a muted still that needs the VO; listing a caption-only Cue as a Beat; a Part whose board never changes the room; a “new” Beat whose muted-frame argument matches the last Beat. Same pose PNG does not by itself fail.

From [Is a beat a staged action or a caption swap?](https://github.com/Perk4/cairn-essays/issues/75).

## Animatic gate

**Required before polish.** Not a drawn reel. Not a new app.

For each Part, play its existing Flagship Sequence in Remotion Studio against the **real VO** (scratch only if that take is missing). Hold the board next to the picture.

Fail — do not polish:

1. A Story Beat does not change when the claim or Move changes.
2. The Part restates without a Move.
3. A Beat overstays because the line ran out of new claims.
4. The picture is only Cue swaps with no Thumbnail.
5. Studio is playing Cues that were never checked against the board.

Record the pass or fail **on that Part’s board heading**. Do not add a second file.

Mouth, springs, kit motion, and visual-kit rebuild are **polish**. They start only after this pass fails nothing.

From [Does an animatic step belong before Remotion polish?](https://github.com/Perk4/cairn-essays/issues/74).

## Artifact split

| | Writer | Machine |
| --- | --- | --- |
| File | `episodes/<id>.board.md` | `episodes/<id>.json` |
| Holds | Spoken lines, Beat Board, Thumbnails | Scenes, `vo`, Cues, timings, Clips |
| Fail here | Craft, staging, Animatic | Render, VO compile, duration |

Board compiles **into** JSON. Flagship, Clips, and `npm run vo` read JSON only. If they disagree, the board is craft truth; JSON is what is on tape until recompile. A check must be able to see that the Cues came from the board. Do not “fix” Cues while the board still restates.

Board shape:

```
# ep01 — Find it or develop it

## Part: Fixed interest

### Spoken
<the line, under the craft bar>

### Beat Board
1. <Story Beat name>
   Thumbnail: pose / Cairn / room verb / frame argument

### Animatic
pass | fail
<which fail line, or empty on pass>
```

From [Where does the script live versus episode JSON?](https://github.com/Perk4/cairn-essays/issues/76).

## Out of scope

- VO pipeline and voice model (working). Local Ryan stays.
- The edit pass that is already improving.
- Rewriting ep01, shipping, or uploading as this spec’s job.
- Reopening the locked paper or title.
- Cloud TTS, Perk clone, human host, kit species change, habit-app CTA.
- Factory render host, Content ID, upload, Figma, CapCut.
- A script-generation product.
- A full visual-kit rebuild.

## Not locked (fog)

- How agents draft the board (checklist vs prompt vs human-only). The fail lines above are the bar either way.
- Motion quality past staging (easing, camera, squash).
- Whether a shorter Part (now that it ends on a move) is clamped to Clip length.
- How much of `conceptLabel` / SVG verbs gets rebuilt after staging.

Voice files: `public/vo/VOICE.md`.
