# What the three monke reference videos actually do

Findings for [What do the three reference videos actually do?](https://github.com/Perk4/cairn-essays/issues/32). This file records measurements only. It does not recommend what Cairn should copy.

## Question

What do these three [monke](https://www.youtube.com/@monkebiznis) videos do with pacing, information density, character and visual language, and how sources or claims appear on screen?

- [5 habits for good sleep.](https://www.youtube.com/watch?v=bt5ue-1wLvc)
- [How to Learn More in 2 Hours Than Most Do in a Full Day](https://www.youtube.com/watch?v=6-TDjSIroRQ)
- [How To Get Rid Of Screen Addiction](https://www.youtube.com/watch?v=Iz_MHsiZ8KE)

## Method

Primary sources only: YouTube oEmbed JSON, watch-page player metadata extracted by yt-dlp, official auto-captions (`en-orig` timed text; no manual captions exist on any of the three), the channel page and About panel, official thumbnails, and sampled 160p video frames plus ffmpeg scene-change detection on those encodes.

Speech continuity is measured from caption coverage against official duration, not from a full audio waveform. Word counts and words-per-minute are derived from unique last-lines of the rolling auto-caption window divided by official duration; auto-captions mishear names (`Monkeykey`, `reensitizing`) and are not a human transcript. Scene-change counts use ffmpeg `gt(scene,0.25)` on 160p video and are a proxy, not an editorial cut list. On-screen claims are reported only from frames that were actually opened.

Counts below were taken on 2026-08-17 from the live YouTube objects. Table cells are a summary; each figure is cited in the following prose or in the per-video sections.[4][5][6]

## Channel

YouTube oEmbed names the author of all three videos `monke` and points `author_url` at `https://www.youtube.com/@monkebiznis`.[1][2][3]

The About panel states: "Monke teach you to become better monke, and master monke self through science and old techniques."[8]
It lists country as United Kingdom (`Reino Unido` on the fetched page), 154k subscribers, 8,875,387 views, 58 videos, and joined 27 Sept 2025.[8]
The first listed channel link is titled "Habit tracker app" and points at `monke.short.gy/lock-in`.[8]
Channel tabs present on the page are Videos, Shorts, and Posts.[8]

The public channel URL is `https://www.youtube.com/@monkebiznis`.[7] The same channel is also addressed as `https://www.youtube.com/channel/UCC2nLqBUIy8bagyNMDRiRcA`.[9] Player metadata on the sleep watch page repeats channel name `monke`, handle `@monkebiznis`, and 154000 followers.[4]

## Cross-video measurements

| Measure | Sleep | Learn | Screen |
| --- | --- | --- | --- |
| Official title | 5 habits for good sleep. | How to Learn More in 2 Hours Than Most Do in a Full Day | How To Get Rid Of Screen Addiction |
| Duration | 251s / 4:11 | 229s / 3:49 | 464s / 7:44 |
| Upload date (YYYYMMDD) | 20260126 | 20260419 | 20250930 |
| Views / likes / comments | 1,599,012 / 84,170 / 1,860 | 650,152 / 48,358 / 820 | 37,189 / 2,302 / 102 |
| Encode | 1920×1080, 24 fps | 1920×1080, 30 fps | 1920×1080, 30 fps |
| YouTube chapters | none | none | none |
| Manual captions | none | none | none |
| Category | Entertainment | Entertainment | Entertainment |
| Auto-caption words | 739 | 599 | 1,310 |
| Derived WPM | 177 | 157 | 169 |
| Caption coverage | 245.7s of 251s; 5.3s tail only | 230.4s of 229s (timing overrun) | 458.4s of 464s; 5.4s tail only |
| Mid-video caption gaps ≥2s | none | none | none |
| Numbered spoken units | 5 habits in 4.18 min → 1.20/min | 4 named blocks in 3.82 min → 1.05/min | 3 parts + 4 steps in 7.73 min → 0.91/min |
| ffmpeg scene-changes @0.25 | 66 (15.8/min); longest quiet 29.5s | 41 (10.7/min); longest quiet 31.7s | 33 (4.3/min); longest quiet 59.8s |

Speech is continuous on all three.
Auto-captions start at 0.00s on sleep and learn, or 0.16s on screen, and run to the last line.[4][5][6]
The only uncovered intervals ≥2s are end tails of about 5s on sleep and screen.[4][6]
There are no long silent holds in the middle of the caption timeline.[4][5][6]

All three descriptions open with a habit-app CTA (`monke.short.gy/lock-in` or `/focus`) and describe the video in third person ("Monke explains…").[4][5][6]
Sleep and learn also link Featurebase and Substack.[4][5]
Screen links Discord and Substack.[6]

No paper title, DOI, journal name, or author–year citation appears in any of the three auto-captions.[4][5][6]
Sampled frames show concept labels, icons, diagrams, and handwritten callouts — not citation cards.[4][5][6]

## 1. 5 habits for good sleep. (4:11)

Watch page and oEmbed title: "5 habits for good sleep."[1][4]

### Pacing

Auto-captions cover 245.68s of the 251s runtime and then stop; the remaining 5.32s is the only ≥2s uncovered interval.[4] Speech is a single continuous pass.[4]

ffmpeg scene-change detection on the 160p encode fired 66 times (about 16 per minute).[4] Holds ≥8s without a detection sit at 52–63s, 93–104s, 129–158s (29.5s), and 162–172s.[4] Those intervals coincide with explanation beats (circadian, temperature, scrolling replacement), not with silent pads.[4]

### Information density

The VO promises "five things" at 41.2s and recaps five practical rules at the end.[4] Named scientific concepts in the auto-captions, with first timestamp:

- Andrew Huberman, as a named person attached to "sleep routine," at 17.9s — not as a paper.[4]
- circadian rhythm at 53.9s.[4]
- suprachiasmatic nucleus at 58.6s.[4]
- core temperature drop "about 1° C" at 98.5s.[4]
- melatonin and blue light at 129.4s.[4]
- dopamine, only as a scrolling-replacement aside, at 149.8s.[4]
- caffeine cutoff after 2:00 p.m. at 201.7s / recap 231.8s.[4]

That is five numbered habits plus about six named body/brain terms in 4.18 minutes (roughly 1.2 numbered units/min and 1.4 named-concept introductions/min). Claims are stated as facts ("this temperature drop tell Monkey brain it is time for night-night") without a study name.[4]

The five spoken habits, in recap order: same bedtime and wake time plus morning sunlight; replace scrolling by stepping down short-form video → long-form → audio; keep cool (feet out, hot shower); dim lights; no caffeine after 2:00 p.m.[4]

### How sources appear

On-screen type in sampled frames is a concept label or a number, not a citation.[4] Frames opened:

- 0s: bedroom set, mascot standing by a bed; no text citation.[4]
- 18s (Huberman line): a muscular "approve" mascot with sunglasses and the handwritten line "i don't approve"; Huberman's name is not on screen in this frame.[4]
- 41s / ~45s: RPG-style "Stats" panel (`Sleep`, `Focus`, and meme stats) with habit icons (keyboard, mug, lamp, "–2°C" or "–1°C", phone). No paper.[4]
- 54s: two mascots; one has an analog clock in its chest (circadian metaphor). No paper.[4]
- 99s: standing mascot presenting a sleeping mascot labeled "–1°C" with an arrow to a blue cooling mark. The number is the claim; no author.[4]
- 129s: mascot pointing at a phone labeled "blue light."[4]
- 220s: night bedroom, clock "22:00" labeled "bedtime."[4]

No sampled frame shows a paper thumbnail, author name, or DOI.[4]

### Character and voice

Third-person mascot throughout: "Monkey get into bed," "Monkey teach you five things," close "Stay Monkey."[4] Grammar is the broken-English mascot voice, not a first-person host.

Story hook (0–41s): cannot sleep, relives embarrassing moments, watches "500 10-second videos," is "stuck" between scrolling and lying awake.[4] Practical-rule close (219–245s): recites the five habits, then "If Monkey do this, he will wake up in a few weeks and think, 'Damn, this Monkey feels amazing.' Stay Monkey."[4]

Thumbnail (official `maxresdefault` / yt-dlp webp): pale yellow field, sleeping brown mascot face-down with a drool drop, hand-lettered "SLEEP TUTORIAL" and an arrow pointing at the body.[4]

Visible visual language from frames: flat pale-yellow or dark-gray rooms; thick black outlines; one mascot (sometimes two); props limited to bed, nightstand, clock, phone, mug, lamp; handwritten lowercase labels with arrows; occasional gamified stats UI.[4] Character motion in stills is pose-to-pose (stand, present, sleep), not lip-sync-readable at 160p.[4]

## 2. How to Learn More in 2 Hours Than Most Do in a Full Day (3:49)

Watch page and oEmbed title: "How to Learn More in 2 Hours Than Most Do in a Full Day."[2][5]

### Pacing

Auto-captions cover the full 229s (last cue ends 230.44s, a timing overrun of 1.44s).[5] No uncovered interval ≥1s.[5] Speech is continuous.[5]

ffmpeg scene-change detection fired 41 times (about 11 per minute).[5] The longest detection-quiet span is 63–95s (31.7s), during the active-recall demonstration.[5] Other ≥8s quiets sit on spaced-repetition and ultradian explanation beats.[5]

### Information density

Four named teaching blocks, first spoken at:

- Active recall at 32.9s, with "fluency illusion" at 52.7s.[5]
- Spaced repetition at 93.0s, with "forgetting curve" at 100.9s and Anki at 115.7s.[5]
- Ultradian rhythms at 128.8s, with "basic rest activity cycle" and "90 to 120 minutes" at 133.9s.[5]
- Memory formation at 172.9s, with hippocampus and "deep slow wave sleep" at 189.0s, and "around 40% of what he studied never get stored" at 202.4s.[5]

That is 1.05 numbered/named blocks per minute. Additional hook numbers: "exam in 3 days," "study for 9 hours," "wasting 80% of his study time."[5]

### How sources appear

No author, paper, or Ebbinghaus attribution in the captions.[5] Anki is named as a tool, not a citation.[5] The 40% sleep-storage figure has no study attached.[5]

On-screen type in sampled frames:

- 33s: centered title card, hash mark plus "Active Recall" on a cream field. Concept name only.[5]
- 52s: diagram brain → eyes → "INFORMATION" in a red prohibition circle (fluency-illusion beat). No citation.[5]
- 93–100s: mascot sitting cross-legged writing on paper; analog clock; later a Monday→Friday calendar stack for the forgetting-curve beat. No paper.[5]
- 129s: centered title card "#3 Ultradian Rhythms." Number plus concept name only.[5]
- 173s: three rest-phase poses (walk with staff and hat, sit/meditate, stand by a window). No title card in this sample.[5]
- 189s: sleeping mascot on a pillow, yellow label "Deep slow-wave sleep." Term only.[5]

A dedicated "#2" or "#4" title card was not in the timestamps sampled.[5] The "#3" card is the only explicit numeral-plus-term card confirmed by a frame.[5]

### Character and voice

Third-person mascot: "Monkey have exam in 3 days," "So today Monkey teach you the science of studying the right way," close "Good luck, Monkey. And always remember, stay Monkey."[5]

Story hook (0–33s): exam in three days, last-minute nine-hour library session, "wasting 80%."[5] The ending is a failed-exam story that still closes on a rule: he gets an F, but "he now know how to study for next exam."[5]

Thumbnail: pale yellow field, grinning mascot holding an exam paper marked green "A*," hand-lettered "HOW TO STUDY."[5]

Visible visual language: same cream field and brown mascot; study props (paper, pen, clock, calendars, window); occasional full-screen concept title cards; rest-phase illustrated as three simultaneous poses rather than a montage of live footage.[5]

## 3. How To Get Rid Of Screen Addiction (7:44)

Watch page and oEmbed title: "How To Get Rid Of Screen Addiction."[3][6] Description: "Monke explains 4 steps to re-program your dopamine system so that it starts to work for you, making you want to do hard work."[6]

This is the oldest of the three (uploaded 2025-09-30, three days after the channel joined) and the longest.[6][8]

### Pacing

Auto-captions run 0.16–458.60s of 464s; the only ≥2s uncovered interval is a 5.4s tail.[6] Speech is continuous for the body of the video.[6]

ffmpeg scene-change detection fired only 33 times (about 4.3 per minute), the slowest of the three.[6] Detection-quiet spans of 36–60s occur at 17–60s (Part 1), 108–148s, 204–241s, 354–414s, and 422–464s.[6] Visual holds are longer here even though speech does not stop.[6]

### Information density

Spoken structure is labeled in the captions:

- Part one, dopamine — 16.6s.[6]
- Part two, why monkey can't focus — 51.9s.[6]
- Part three, reensitizing the dopamine system — 102.0s.[6]
- Step one, take boring breaks — 121.0s.[6]
- Step two, playing with time — 188.6s.[6]
- Step three, be bored more — 308.6s.[6]
- Step four, do everything one thing at a time — 368.2s.[6]

Seven numbered labels in 7.73 minutes → 0.91/min. The description independently calls the body "4 steps."[6]

Named concepts and one-off study talk:

- Dopamine as "the chemical that makes monkey want to do things," from the first line.[6]
- "In 1990, scientists did experiments on rats where they stopped the rat brain from producing dopamine" at 23.4s — year plus anonymous "scientists," no paper or author.[6]
- Rejection of "dopamine detox" at 94.3s, replaced by "reensitizing."[6]
- "Tik Tok released 10 times more dopamine than essay" at 142.6s — a number with no source.[6]
- Delayed rewards / time perception, micro-rewards, habit tracking, then a named product CTA: "habit tracking app for you to use called Lockin" at 297.8s.[6]

### How sources appear

The 1990 rat line is the only dated study gesture in any of the three videos, and it still omits author and title.[6] Sampled frames at that beat show a line-drawn rat labeled "Dopamine removed with chemical," not a paper card.[6]

Other opened frames:

- 17s: title card "Part 1: Dopamine" with four banana icons.[6]
- 23s: mascot gesturing at the phrase "Molecule of motivation."[6]
- 52s: brain with speech bubble "Dopamine is all I care about."[6]
- 102s: mascot presenting "Re-sensitizing the brain" plus a brain icon.[6]
- 121s: flowchart "After: High Dopamine Sensitivity" — low dopamine molecule → "Happy, motivated monke" → "Work becomes easy."[6]
- 298s: mascot presenting three Lock In app screenshots ("Transform your life in 75 days," "Build discipline with daily tasks," "Stay motivated with streaks").[6]
- 368s: mascot sitting cross-legged, eyes closed, on the cream field (step-four / one-thing beat).[6]

No sampled frame shows a paper, DOI, or author name.[6] Scientific look is a molecule sketch, a brain icon, a lab-coat gorilla with a monitor (opening frame), and flowchart arrows.[6]

### Character and voice

Third-person mascot again: "Monkey is going to show you how," "monkey don't actually want the banana."[6] The closer is not "Stay Monkey." After recapping the four steps it asks "Will you start to use the techniques that Monkey has taught you?" and ends "Monkey, hope you enjoy this video and wish you a fine day."[6]

Story hook is concept-first rather than incident-first: dopamine as the chemical that causes self-distract / overeat / TikTok, then a promise to "reprogram his dopamine system."[6] Practical-rule close: recap of the four steps, "Start small, be consistent, and track your habits," plus the Lockin CTA in both VO and description.[6]

Thumbnail: pale field, squatting mascot holding a phone and scratching its head, bold type "You Can Fix It."[6]

Opening sampled frame (0s): small brown monkey with an exposed brain wired to a monitor, facing a white gorilla in a lab coat and glasses.[6] Later frames return to the single brown presenting mascot.[6] Props include phone, brain, rat, molecule, paper-with-checkmark, and the Lock In UI.[6]

## Character / visual language (what is actually visible)

Shared, from oEmbed thumbnails and opened frames:

- One brown gorilla mascot, thick outlines, flat fills, cream or pale-yellow void backgrounds, occasional dark-gray night rooms.[4][5][6]
- On-screen type is short: habit labels, "#3 Ultradian Rhythms," "Part 1: Dopamine," "blue light," "–1°C," "Deep slow-wave sleep," "Molecule of motivation." Hand-lettered or bold sans-serif, often with an arrow.[4][5][6]
- Claims appear as those labels and as simple diagrams (clock-in-chest, brain→eyes→no-information, dopamine flowchart). They do not appear as stacked paper cards.[4][5][6]
- Character acting is posed illustration: stand-and-point, sleep, write, meditate, walk. 160p stills are not sufficient to score mouth sync or cut-length in frames.[4][5][6]
- Thumbnails use the same mascot plus a three-word hook ("SLEEP TUTORIAL," "HOW TO STUDY," "You Can Fix It").[4][5][6]

## Voice pattern (from captions, not recaps)

All three use a third-person mascot teacher.[4][5][6]
Sleep and learn open on a comic incident, promise a numbered lesson, teach named concepts as practical rules, and close "Stay Monkey."[4][5]
Screen opens on a chemical hook, uses Part/Step labels, inserts a product CTA, and closes with a question plus "wish you a fine day."[6]
Channel copy matches the voice: "Monke teach you to become better monke… through science and old techniques."[7]

## Gaps (not invented)

- Music bed, loudness, and whether VO is one take were not measured from audio.
- True editorial cut rate was not hand-scored; only ffmpeg scene-change proxy on 160p.
- Not every second of picture was inspected. Title cards for learn "#2" / "#4" were not confirmed.
- Whether YouTube burned-in captions appear to viewers depends on the viewer's caption setting; the files retrieved are auto-captions, not creator-uploaded subs.
- Heatmaps exist on the sleep and learn player objects and not on screen; they were not interpreted.

## Sources

[1] https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=bt5ue-1wLvc&format=json — YouTube oEmbed: 5 habits for good sleep.
[2] https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=6-TDjSIroRQ&format=json — YouTube oEmbed: How to Learn More in 2 Hours Than Most Do in a Full Day
[3] https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=Iz_MHsiZ8KE&format=json — YouTube oEmbed: How To Get Rid Of Screen Addiction
[4] https://www.youtube.com/watch?v=bt5ue-1wLvc — YouTube watch page: 5 habits for good sleep.
[5] https://www.youtube.com/watch?v=6-TDjSIroRQ — YouTube watch page: How to Learn More in 2 Hours Than Most Do in a Full Day
[6] https://www.youtube.com/watch?v=Iz_MHsiZ8KE — YouTube watch page: How To Get Rid Of Screen Addiction
[7] https://www.youtube.com/@monkebiznis — YouTube channel: monke (@monkebiznis)
[8] https://www.youtube.com/@monkebiznis/about — YouTube channel About: monke
[9] https://www.youtube.com/channel/UCC2nLqBUIy8bagyNMDRiRcA — YouTube channel ID page: UCC2nLqBUIy8bagyNMDRiRcA
