# What beat board, animatic, thumbnail, and staging mean here

Findings for [What do beat board, animatic, thumbnail, and staging mean here?](https://github.com/Perk4/cairn-essays/issues/70). This file records primary-source definitions and factory analogs only. It does not recommend what Cairn should adopt.

## Question

In primary animation-production sources, what is a Story Beat / Beat Board, an Animatic / Leica Reel, a Thumbnail, and Staging — and which of those already exist in this Remotion factory as episode JSON `beats`, the cheap table on [Show a rewritten beat sheet for one scene](https://github.com/Perk4/cairn-essays/issues/39), Remotion Studio playback, or nothing?

## Method

Definitions are taken from first-party owners of the wording: Walt Disney Animation Studios process pages, Frank Thomas and Ollie Johnston’s own site paraphrasing *The Illusion of Life*, Leica Camera’s account of the Disney Leica reel, Toon Boom Storyboard Pro’s glossary and product docs (studio storyboard/animatic software), Animation Mentor’s official storyboarding workshop, Nancy Beiman’s own production-handbook proposal (*Prepare to Board!*), and Remotion’s official Studio terminology.

Factory analogs are taken from `origin/main` of this repo (`episodes/ep01.json`, `src/types.ts`, `src/timing.ts`, `src/scenes/CairnCaption.tsx`, `src/compositions/Flagship.tsx`, `src/compositions/Short.tsx`, `src/compositions/Thumbnail.tsx`, `src/Root.tsx`, `package.json`) and from the owner comment on [Show a rewritten beat sheet for one scene](https://github.com/Perk4/cairn-essays/issues/39).

No product recommendation is recorded.

## Analog at a glance

| Production term | Factory analog on `origin/main` |
| --- | --- |
| Story Beat / Beat Board | **Nothing as a visual beat board.** JSON `beats` share the word and are timed pose/caption/mood swaps. The #39 table is a written `t / pose / on-screen / spoken` sheet, not a board of images. |
| Animatic / Leica Reel | **Partial: Remotion Studio playback of Flagship.** Timed still plates + VO + music on a timeline. Not a named animatic, and not a storyboard reel separate from the show. |
| Thumbnail | **Nothing.** `Thumbnail.tsx` / `ep01-thumb` is a one-frame YouTube packshot, not exploratory production thumbnails. |
| Staging | **Nothing as a named artifact.** Pose enum + fixed Room layout arrange the frame. There is no staging field and no thumbnail pass that explores composition. |

## 1. Story Beat / Beat Board

### Production definition

A **story beat** is a significant turn in the narrative — a moment that moves the story — not a unit of animation drawing. Animation Mentor’s official Storyboarding Fundamentals workshop states that “Storyboarding is all about identifying the main beats that provide the core structure of the story,” and dedicates a session to “beat boards and what role they play in storyboarding to help tell a complete story.”[1]

A **beat board** is an early visual outline of those turns, before a full storyboard. Disney Feature story artist Normand Lemay (GRIZandNORM Tuesday Tips) writes that beat boards are “often the clearest way to pitch an early concept,” useful “to plan out the larger beats of a large physical sequence,” and “sort of like your Key Poses in animation, but put on a story scale.”[2] They sit before timed boarding: a roadmap of key images, not every camera cut.

Nancy Beiman — Disney / Warner story artist and author of the production handbook *Prepare to Board!* — titles the matching chapter “Boarding Time: Getting With The Story Beat,” with subsections “Establishing the main story beats on your first storyboards” and “Working to the Beat: Story Beats and Boards / Establishing the framework of the story.”[3] Walt Disney Animation Studios’ own Story process page does not use the phrase “beat board”; it says story artists “start by drawing thumbnails based on the script” and then refine toward clearer drawings, while thinking about “emotion, expression, timing, staging, and framing.”[4]

Toon Boom Storyboard Pro’s glossary defines a **storyboard** as “a visual plan of all the scenes and shots in an animation” that “indicates what will happen, when it will happen and how the objects in a scene are laid out.”[5] It does not define “beat board.” The beat board is the sparser predecessor of that plan: key images of story turns, not the full shot list.

### Factory analog

**Nothing as a visual beat board.**

`SceneBeat` on `origin/main` is `{ atSec, pose?, caption?, mood? }`.[6] `parseBeats` requires only a non-negative `atSec`; pose, caption, and mood are optional overlays.[7] `activeBeat` walks the array and returns the last beat whose `atSec` is ≤ current time in seconds (`frame / fps`).[8] `CairnCaption` then uses that beat to swap the PNG pose, caption text, and room mood.[9]

`episodes/ep01.json` attaches `beats` to the six `cairnCaption` scenes (hook 5, part1 13, part2 16, part3 15, part4 10, part5 9; 68 `atSec` entries). The end card has none.[10] Hook beats are caption/pose swaps at 0 / 5 / 11 / 17 / 22 seconds (`TUESDAY`, `THURSDAY`, `WRONG THING?`, `THE WORK`, `5 PARTS`).[10] Later parts pad the last caption when VO overruns (part1 repeats `SIT BACK DOWN`; part2 repeats `SAME FILE`).[10]

Those objects are timed on-screen swaps. They are not standalone visual panels of emotional mood or core concept, and they are not drawn before boarding.

The cheap table on [Show a rewritten beat sheet for one scene](https://github.com/Perk4/cairn-essays/issues/39) is a written four-column sheet: `t | pose | on-screen | spoken`.[11] The owner comment calls it a “rewritten hook beat sheet,” “the density lock made visible,” and “Not a factory edit of `episodes/ep01.json`.”[11] It is the closest factory-adjacent object to a *written* beat list. It is not a board of images.

`shorts.hook` / `shorts.rule` are a different type, `ShortBeat`: each row has its own `id`, `pose`, `kicker`, `caption`, `mood`, `vo`, and `durationSec`.[6][12] They time vertical Shorts, not a beat board.

## 2. Animatic / Leica Reel

### Production definition

Leica Camera, writing as the owner of the camera name, defines a **Leica Reel** as “a storyboard technique that combines illustrations and soundtrack. The images align with prominent sound details and are linked to the sound as a photograph. This gives you a sense of the pace of a sequence.” Disney used Leica cameras and projectors to “bring storyboard animations to life.”[13]

Toon Boom Storyboard Pro’s glossary defines an **animatic** as “a movie made by sequencing the panels in a storyboard, and timing each panel for the rough duration of the action they represent, and in sync with the soundtrack.” Animatics “convert the storyboard into a very rough draft of the final movie, to determine the time allotted to each scene and each action and to synchronize the action with the sound track.”[5] The getting-started guide repeats: “An animatic is a video that plays out each panel of your storyboard,” timed to intended action and story pace, with provisional or final voice, music, and effects so “action can be paced around them.”[14] The product page lists the same pipeline: “thumbnailing your first pass… pitching your boards or timing out camera moves in an animatic.”[15]

Beiman’s handbook proposal treats **story reel** and **animatic** as the same assembly step: “Assembling a Story Reel or Animatic with a Scratch Track,” including “Definition of ‘story reel’ and ‘animatic’,” slugging, rough timing, and preview/review.[3] She also notes that animated storyboards “ARE the film” and that a student who under-boards cannot “accurately time scenes for a story reel or animatic.”[3]

The owned wording is: still (or barely moving) storyboard pictures, sequenced, timed, synced to scratch or production audio, used to test pace *before* committing to finished animation.

### Factory analog

**Partial: Remotion Studio playback of the Flagship composition.**

Remotion’s terminology page defines Studio as “the editor that opens when you run `npx remotion studio`” and says it “allows for fast editing and playback of compositions.” The former name was Preview.[16] A composition is “something you can render”: a React component plus width, height, fps, duration, and id, registered in Studio.[17] Studio playback shortcuts include Space (play/pause), frame-step, J/K/L, jump-to-frame, and In/Out playback range.[18] This repo’s `dev` script is `remotion studio`.[19] Official Remotion docs do not call Studio an animatic.

On `origin/main`, `Flagship` lays `episode.scenes` on a Remotion timeline: each scene is a `Sequence` with `VoAudio` and the rendered scene, plus a music bed ducked around speech windows.[20] `CairnCaption` holds a PNG pose and a caption for each `activeBeat` interval — still plates that change on `atSec`, not drawn motion.[9] That mechanical shape matches a Leica reel: photographs of pictures synced to a soundtrack to show pace.

What is missing from the production definition: there is no storyboard layer separate from the show. Studio plays the product compositions (`ep01`, shorts, clips, `ep01-thumb`) registered in `Root.tsx`.[21] There is no scratch-track reel of boarded panels used to decide whether to animate. The analog is playback of the factory cut, which happens to be made of timed stills.

## 3. Thumbnail

### Production definition

Walt Disney Animation Studios: “Story Artists often start by drawing thumbnails based on the script. Thumbnails are refined. And refined further with clearer drawings and toning/shading.”[4] Story artists work “from rough to fine, creating clear drawings,” using “quick and gestural sketches” and “narrative staging.”[4][22]

Animation Mentor’s official workshop: thumbnails exist so you “clearly and simply communicate your ideas in as few drawings as possible.” A storyboard may be “very basic (often referred to as thumbnail storyboard) featuring just rough sketches.”[1] Week 3 is “Incorporating Thumbnails Into Your Storyboarding Process.”[1]

Toon Boom’s glossary defines **thumbnail** as “a very small image used as a reference or indicator.”[5] Storyboard Pro’s Thumbnailing Page is “ideal for sketching out concepts and ideas” in numbered panels “proportional to the project’s scene resolution,” later convertible to timeline panels.[23] The product page puts thumbnailing as “your first pass” before pitching boards and timing an animatic.[15]

Beiman’s handbook includes “All Thumbs: Quick Sketch and Thumbnails.”[3]

Owned wording: small, rough, disposable drawings that explore pose, staging, and composition for individual beats *before* the board is cleaned up or timed.

### Factory analog

**Nothing.**

`src/compositions/Thumbnail.tsx` is a one-frame Remotion composition: Cairn in the `point` pose at 720px and `episode.thumbLine` (`THE WORK` on ep01) as display type.[24][10] `Root.tsx` registers it as `ep01-thumb` with `durationInFrames={1}`.[21] Remotion calls a one-frame composition a still.[17] That is a YouTube packshot, not a production thumbnail pass.

JSON `beats` name a pose from the locked kit (`still`, `listen`, `point`, `react`, `present`, `slump`) and a caption string.[6][10] They do not store sketches, alternate compositions, or exploratory poses. The #39 table also only names kit poses and on-screen words.[11]

## 4. Staging

### Production definition

Frank Thomas and Ollie Johnston own the industry wording. Their site paraphrases *The Illusion of Life* (pp. 47–69) and tells the reader to “look these up and read the original version.” For **Staging**:

> A pose or action should clearly communicate to the audience the attitude, mood, reaction or idea of the character as it relates to the story and continuity of the story line. The effective use of long, medium, or close up shots, as well as camera angles also helps in telling the story. … Do not confuse the audience with too many actions at once. Use one action clearly stated to get the idea across… Staging directs the audience’s attention to the story or idea being told. Care must be taken in background design so it isn’t obscuring the animation or competing with it…[25]

Walt Disney Animation Studios lists staging among what story artists think about, alongside emotion, expression, timing, and framing,[4] and requires “an understanding of cinematography and narrative staging.”[22] Beiman’s handbook has “Roughing It: Basic Staging” (positive/negative space, the 180-degree line) before the story-beat chapter.[3] Animation Mentor’s workshop promises “foundational techniques for staging, clarity, emotion.”[1]

Owned wording: how characters and elements are arranged in frame — pose, camera, light, background — so the idea of the beat is “completely and unmistakably clear” (the book phrasing Thomas and Johnston point back to).[25] Staging is a principle applied to drawings and shots, not a file format.

### Factory analog

**Nothing as a named artifact.**

`CairnCaption` places Cairn on the left (or centered on shorts), the scene visual on the right, and a `CaptionBar` on the frame. Pose comes from `activeBeat` or the scene default; mood tints the `Room`.[9] The pose kit is six PNGs.[6] Scene `visual` is a separate enum (`conceptLabel`, `callingHomework`, `stoneDrop`, …), not a staging note.[6][10]

There is no `staging` field on `SceneBeat` or `Scene`.[6] The #39 table has `pose` and `on-screen` but no composition, camera, or silhouette note.[11] Layout is a fixed template. That is implicit arrangement. It is not a staging pass in the Thomas–Johnston or Disney story-artist sense.

## Factory objects that are not these terms

- **`beats` in episode JSON** — timed pose / caption / mood keyframes for `cairnCaption` scenes.[6][8][9][10]
- **`ShortBeat`** — self-contained timed rows for vertical Shorts.[6][12]
- **#39 cheap table** — written hook sheet (`t / pose / on-screen / spoken`), explicitly not a factory edit.[11]
- **Remotion Studio** — official preview/playback of registered compositions; this repo starts it with `npm run dev`.[16][18][19]
- **`ep01-thumb`** — one-frame YouTube still, not a production thumbnail.[21][24]

## Gaps (not invented)

- *The Illusion of Life* page-53 sentence is widely quoted as “the presentation of any idea so that it is completely and unmistakably clear.” This file cites Thomas and Johnston’s own site paraphrase rather than a scanned book page.
- Pixar in a Box (Pixar + Khan Academy) pages that discuss major/minor beats and pitching did not load here; Pixar.com confirms the collaboration exists but does not publish those definitions on the studio site.[26]
- Toon Boom’s glossary has no “beat board” or “staging” entry.[5]
- ASIFA and Aardman first-party glossaries for these four terms were not found as owned wording.
- Studio playback was not run in this pass; analog claims are from Remotion docs plus composition source, not from a timed Studio session.

## Sources

[1] https://www.animationmentor.com/workshops/storyboarding-fundamentals/ — Animation Mentor, Storyboarding Fundamentals (official workshop: story beats, beat boards, thumbnails, staging).
[2] https://grizandnorm.tumblr.com/post/82384291973/tuesday-tip-beat-boards-storyboards-it-can-be — GRIZandNORM Tuesday Tip, Normand Lemay (Disney Feature story artist): beat boards.
[3] https://repository.rit.edu/cgi/viewcontent.cgi?article=8863&context=theses — Nancy Beiman, *Prepare to Board!* MFA thesis / handbook proposal (RIT, 2007): story beats, staging, thumbnails, story reel / animatic.
[4] https://disneyanimation.com/process/story/ — Walt Disney Animation Studios, Filmmaking Process: Story (thumbnails, refine, staging).
[5] https://docs.toonboom.com/help/storyboard-pro-25/glossary/glossary.html — Toon Boom Storyboard Pro 25 glossary: animatic, storyboard, thumbnail.
[6] `src/types.ts` on `origin/main` — `SceneBeat`, `CairnCaptionScene.beats`, `ShortBeat`, pose/visual enums.
[7] `src/episode.ts` on `origin/main` — `parseBeats`.
[8] `src/timing.ts` on `origin/main` — `activeBeat`.
[9] `src/scenes/CairnCaption.tsx` on `origin/main` — pose/caption/mood from `activeBeat`; fixed left/right layout.
[10] `episodes/ep01.json` on `origin/main` — scene `beats` arrays, shorts, `thumbLine`.
[11] https://github.com/Perk4/cairn-essays/issues/39#issuecomment-5311293799 — owner cheap hook beat sheet (`t / pose / on-screen / spoken`).
[12] `src/compositions/Short.tsx` on `origin/main` — Shorts sequenced from `ShortBeat` rows.
[13] https://leica-camera.com/en-US/discover-leica-q2-disney — Leica Camera, official Leica Q2 | Disney page: definition of “Leica Reel.”
[14] https://docs.toonboom.com/help/storyboard-pro-24/storyboard/getting-started/animatic.html — Toon Boom, How to Create an Animatic.
[15] https://www.toonboom.com/products/storyboard-pro — Toon Boom Storyboard Pro product page (thumbnailing → pitch → animatic).
[16] https://www.remotion.dev/docs/terminology/studio — Remotion, official Studio terminology.
[17] https://www.remotion.dev/docs/terminology/composition — Remotion, official Composition terminology (1-frame composition = still).
[18] https://www.remotion.dev/docs/studio/shortcuts — Remotion Studio playback shortcuts.
[19] `package.json` on `origin/main` — `"dev": "remotion studio"`.
[20] `src/compositions/Flagship.tsx` on `origin/main` — scenes sequenced with `VoAudio` and music bed.
[21] `src/Root.tsx` on `origin/main` — registered compositions: `ep01`, shorts, `ep01-thumb`, clips.
[22] https://disneyanimation.com/team/story-artist/ — Walt Disney Animation Studios, Story Artist role (narrative staging).
[23] https://docs.toonboom.com/help/storyboard-pro-25/storyboard/drawing/thumbnailing-page.html — Toon Boom, Thumbnailing Page.
[24] `src/compositions/Thumbnail.tsx` on `origin/main` — YouTube packshot still.
[25] https://frankandollie.com/PhysicalAnimation.html — Frank Thomas & Ollie Johnston, “12 Basic Principles of Animation” paraphrase of *The Illusion of Life* pp. 47–69: Staging.
[26] https://www.pixar.com/pixar-in-a-box — Pixar Animation Studios, Pixar In A Box (collaboration with Khan Academy; definitions not on this page).
