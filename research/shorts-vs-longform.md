# How monke packages long-form versus Shorts

Research for [How do the reference channels package shorts versus long-form?](https://github.com/Perk4/cairn-essays/issues/41). Facts from first-party YouTube surfaces fetched 2026-08-16: the [monke](https://www.youtube.com/@monkebiznis) channel, its Videos and Shorts tabs, the three named watch pages, oEmbed, custom thumbnails, auto-captions on those pages, and the Shorts / long-form pairs that actually share a topic.

This note records how **monke** packages the flagship versus Shorts/clips. It does **not** lock Cairn's full-video or shorts rules. It is a different question from [What do the three reference videos actually do?](https://github.com/Perk4/cairn-essays/issues/32), which measures pacing and claims *inside* the long videos.

Method: `yt-dlp` metadata on the channel tabs and watch pages; YouTube oEmbed; YouTube Data RSS; Innertube `next` for end screens; auto-captions / watch-page transcripts; downloaded `maxresdefault` / `oar2` thumbnails. No secondary recaps.

## Answer in brief

The three reference videos are **landscape 1920×1080 flagships** (3:49, 4:11, 7:44).[6][7][8] None of them has a matching official Short or clip on the channel.[2][3]

When monke *does* cut the same research two ways, the short is not a two-beat hook/rule crop of the flagship. Observed pairings are either a **near-full vertical remount of the same script** or a **separate compressed script** that restates the thesis plus steps.[17][20][16] The short package is vertical 1080×1920, usually untitled in the description, and often carries its hook as on-screen type inside the frame rather than as a designed 16:9 thumbnail.[3][29]

## Channel inventory

Handle `@monkebiznis`, channel id `UCC2nLqBUIy8bagyNMDRiRcA`, display name `monke`.[1][4][5] RSS lists the channel as published `2025-09-27`.[5] Innertube and `yt-dlp` both report **154K subscribers** / `channel_follower_count` 154000.[1][6]

Two public tabs, no Playlists tab:

| Tab | Count (2026-08-16) | Aspect (from `yt-dlp`) | Duration range |
| --- | --- | --- | --- |
| [Videos](https://www.youtube.com/@monkebiznis/videos) | 40 | 1920×1080, aspect 1.78 | 1:00–7:56 |
| [Shorts](https://www.youtube.com/@monkebiznis/shorts) | 18 | 1080×1920, aspect 0.56 | 0:17–2:47 |

No video on the Videos tab is 8 minutes or longer. Of the 40: 4 under 3:00, 23 in 3:00–4:59, 13 in 5:00–7:56. Median 4:33, mean ~4:41.[2]

The channel about / latest RSS description is an app CTA plus Featurebase, Substack, and Discord — the same stack used on flagship descriptions.[5]

```
Build good productivity habits with Monke's app - https://monke.short.gy/02QPrE
Join the Android app waitlist - https://staymonke.com
...
Let monke know what video you want on the channel - https://monkebiznis.featurebase.app/
Get more Monke wisdom here - https://monkebiznis.substack.com/
Chat to other likeminded monkes in Monke's troop (Discord) - https://discord.gg/KT4V7su8rG
```

A 59-second landscape video, [Give monke 59 sec, he'll MAX out your focus](https://www.youtube.com/watch?v=9ThamuLyCB8) (1920×1080, 2025-11-11), sits on the **Videos** tab, not Shorts. Short duration alone does not make a monke upload a Short.[2][3][23]

## Typical long-form package

### Length

Typical flagship is a **3–8 minute 16:9 video**.[2] The three references sit inside that band (3:49, 4:11) except screen addiction, which is at the long end (7:44).[6][7][8]

### Title pattern

Recurring shapes on the Videos tab:[2]

- **Numbered habits / minutes:** `5 habits for good sleep.`, `5 habits for great mornings`, `5 habits for clean, glassy skin`, `7 habits that make you so productive it's unfair`, `How to quit gooning forever in 5 mins.`
- **How-to outcome:** `How to Learn More in 2 Hours Than Most Do in a Full Day`, `How To Get Rid Of Screen Addiction`, `How To Escape the Dopamine Trap (and Actually Build Something)`
- **Explained by Monke:** `How To Grow Taller Explained By Monke`, `How To Focus Explained By Monke`
- **Provocative claim:** `Lack Of Sleep Shrinks Your Balls`, `High testosterone will solve all your problems.`

The three references use the first two shapes, not the "Explained by Monke" tag.

### Thumbnail (visible 16:9 custom art)

Each of the three has a designed 1280×720 `maxresdefault` on a flat cream field, large black hand-lettered type, and the brown gorilla mascot:[12][13][14]

- Sleep: **"SLEEP TUTORIAL"** plus a sleeping hooded monkey and a drawn arrow.
- Learn: **"HOW TO STUDY"** plus a grinning monkey holding an exam paper marked **A\***.
- Screen: **"You Can Fix It"** plus a crouched monkey holding a black phone.

These are custom 16:9 compositions, not a frame-grab of the video and not a vertical crop.

### Description / CTA

All three descriptions open with the habit-app short link, then a one-line "Monke explains…" blurb, then Featurebase and/or Substack (screen also has Discord).[6][7][8]

| Video | Spoken close (auto-caption) | Description CTA |
| --- | --- | --- |
| Sleep | Recap of the five habits, then **"Stay Monkey."** | `monke.short.gy/lock-in`, staymonke.com, Featurebase, Substack |
| Learn | Story close (exam F, now he knows), **"Good luck, Monkey. And always remember, stay Monkey."** | `monke.short.gy/focus` (twice), Featurebase, Substack |
| Screen | Mid-video **"click the link in the description to download the app"** (Lockin), recap of four steps, **"wish you a fine day."** | `monke.short.gy/lock-in`, Discord, Substack |

None of the three has creator chapters (`chapters: None` in `yt-dlp`).[6][7][8] Innertube `isShortsEligible` is **false** on all three.[6][7][8]

### End screen

Innertube `next` exposes a `watchNextEndScreenRenderer` of **12 related-video tiles**, not a creator-authored subscribe-plus-one-video end card. Tiles mix monke flagships with other channels (sleep-adjacent explainers, other self-help). Autoplay is YouTube's "Up next," not a pinned sequel.[6][7][8]

So the **authored** end of a flagship is the spoken recap + "Stay Monkey" (or the Lockin line) plus the description link stack. The on-player end screen is YouTube's default related grid.

## The three reference videos

oEmbed confirms title, author `monke`, author URL `@monkebiznis`, and a 16:9 embed (`width` 200 / `height` 113) for each.[9][10][11]

| | [5 habits for good sleep.](https://www.youtube.com/watch?v=bt5ue-1wLvc) | [How to Learn More in 2 Hours Than Most Do in a Full Day](https://www.youtube.com/watch?v=6-TDjSIroRQ) | [How To Get Rid Of Screen Addiction](https://www.youtube.com/watch?v=Iz_MHsiZ8KE) |
| --- | --- | --- | --- |
| Upload | 2026-01-26 | 2026-04-19 | 2025-09-30 |
| Duration | 4:11 (251s) | 3:49 (229s) | 7:44 (464s) |
| Pixels | 1920×1080 @ 24fps | 1920×1080 @ 30fps | 1920×1080 @ 30fps |
| Aspect | 1.78 | 1.78 | 1.78 |
| Views (fetch) | 1,599,012 | 650,152 | 37,189 |
| Shorts-eligible | false | false | false |
| Matching Short on channel | **None** | **None** | **None** |

Neighboring long-form on the same themes exist and are **separate videos**, not clips of these three: [Lack Of Sleep Shrinks Your Balls](https://www.youtube.com/watch?v=GFge24IUcy8) (5:11, 2025-10-28) and [Why Studying Feels Impossible (And How To Fix)](https://www.youtube.com/watch?v=MW0tWY_tEr0) (4:13, 2026-04-08).[22][25] Same for [The REAL Danger Of TikTok](https://www.youtube.com/watch?v=teyV8EFTxPc) (4:20, 2025-10-21) and [How to Escape the Dopamine Trap](https://www.youtube.com/watch?v=u_DfrP-oaRQ) (6:12, 2026-05-03).[24][26]

A YouTube title search for each reference returns the flagship first and **no monke Short with that title**. Third-party copy channels appear in search (for example Fact Sketch's `5 habits for good sleep.`); those are not this channel.

No official YouTube Clip objects showed up on the three watch pages (no clips engagement panel in Innertube `next`).[6][7][8]

## Matching Shorts for the three? No.

The Shorts tab on 2026-08-16, with duration and upload date from `yt-dlp`:[3]

| Id | Length | Date | Title |
| --- | --- | --- | --- |
| `aeKqwWXfmwM` | 1:09 | 2025-12-19 | Why You Can't Stick To Anything |
| `2i22ZYPzwk0` | 1:03 | 2025-12-17 | 4 Signs You're An NPC |
| `vfbh6Xf2Cmg` | 1:06 | 2025-12-15 | Why You Feel Purposeless |
| `Ub849Qt6ZtE` | 0:42 | 2025-12-14 | Why Is Porn So Addictive |
| `spvYGKTdWto` | 0:48 | 2025-12-13 | Why Bad Sleep Lower Testosterone |
| `y7zM1iTcUB8` | 0:53 | 2025-12-12 | Peter Pan Syndrome Explained By Monke |
| `5_cvpfQ0e3w` | 0:22 | 2025-12-01 | How human build discipline over motivation (explained by Monke) |
| `VEIpTTMtcj0` | 0:19 | 2025-11-19 | How to win the morning |
| `nGnTJ4tjM2A` | 0:19 | 2025-11-18 | Find your purpose by being bored more |
| `Mr1Y2pX5p94` | 0:17 | 2025-11-17 | Discipline is easy when you understand this |
| `LIlVniqN6ws` | 0:21 | 2025-11-16 | How to level up this winter |
| `idcm7bEC1Ts` | 0:18 | 2025-11-15 | Are you jacked? If not, do this. |
| `oKAlbaeCQQY` | 0:23 | 2025-11-14 | Why dumb monkes are more successful |
| `N2nR_7LkuJg` | 0:17 | 2025-11-09 | Corn is the problem |
| `Vwm0FMZYOLc` | 0:37 | 2025-11-07 | Does No Nut Nov Make You More Attractive? |
| `Y5ivQ48Q1Yw` | 0:20 | 2025-11-06 | 5 ways to increase testosterone naturally |
| `7XeYK9S3Pdc` | 0:42 | 2025-09-29 | Monke explain how to find purpose |
| `0Yz-r78vWEE` | 2:47 | 2025-09-28 | How to grow taller explained by monke |

All 18 are 1080×1920, aspect 0.56. Innertube `isShortsEligible` is **true** on the ones checked (`0Yz-r78vWEE`, `Vwm0FMZYOLc`).[3][17][16]

Closest *topic* overlaps, and why they are not cuts of the three references:

- **Sleep.** [Why Bad Sleep Lower Testosterone](https://www.youtube.com/shorts/spvYGKTdWto) (48s, 2025-12-13) is about LH, cortisol, and testicular size. Auto-caption: "Monkey who sleep 5 hours per night have much smaller testicle than monkey who sleeps seven or more."[15] That opening matches [Lack Of Sleep Shrinks Your Balls](https://www.youtube.com/watch?v=GFge24IUcy8) ("Studies show that monkeys who sleep 5 hours per night have significantly smaller testicles…"), not the five-habit sleep video (circadian rhythm, cool room, replace scrolling, dim lights, caffeine cutoff).[22][6] The short also predates the 2026-01-26 sleep flagship.
- **Learn.** No Short title or caption on the tab is about active recall, spaced repetition, ultradian rhythms, or the 2-hour study claim.[3][7]
- **Screen.** No Short is titled as a cut of screen addiction. [Find your purpose by being bored more](https://www.youtube.com/shorts/nGnTJ4tjM2A) (19s) shares a *phrase* with step three of the long video ("be bored more") but is a different 19-second upload with an empty description; auto-captions were not available at fetch (HTTP 429).[3][8] Adjacent long-form on dopamine/TikTok is a new 4–6 minute video, not a Short cut from `Iz_MHsiZ8KE`.[24][26]

## How the channel *does* pair a Short with a long video

Because the three references have no matching Short, the pairing pattern has to be read from other same-research pairs on this channel.

### 1. Near-full vertical remount (same script)

[How To Grow Taller Explained By Monke](https://www.youtube.com/watch?v=Fq0eLMR_nlA) is 2:51, 1920×1080, uploaded 2025-09-27, 889,787 views, description with app + Featurebase + Substack.[20] [How to grow taller explained by monke](https://www.youtube.com/shorts/0Yz-r78vWEE) is 2:47, 1080×1920, uploaded the next day, 6,848 views, one-line description ("Monke explains the science of growing taller naturally.") and **no app links**.[17]

Auto-captions of the two are the same story: genes vs food/exercise/hormones/sleep, growth plates, four (then five) actions, Lockin habit-app close, "short king" vs "tall jungle tree."[17][20] Runtime differs by four seconds. This is a **re-encode / remount of the full script into 9:16**, not an excerpt.

Thumbnails differ. The long uses a designed 16:9 "Height Maxxing" composition (buff monkey, smaller admirer, thought bubble).[32] The Short's vertical `oar2` poster is a waist-up buff monkey on cream, no title type.[28]

### 2. Compressed restatement (same thesis, new shorter script)

[Does NoFap Actually Make You More Attractive?](https://www.youtube.com/watch?v=j-0kuiAlyk8) is 3:46, 1920×1080, 2025-11-03.[21] [Does No Nut Nov Make You More Attractive?](https://www.youtube.com/shorts/Vwm0FMZYOLc) is 0:37, 1080×1920, 2025-11-07, empty description.[16]

The Short restates the long's spine in one breath: no scientific proof testosterone doubles; corn damages self-image / T / confidence; three moves (remove triggers, replace with another high-dopamine activity, track good and bad days); "Get Monkeyy's app…"[16] The long spends the extra minutes on the story hook, the seven-day study caveat, the corn-escalation narrative, and a slower climb-down of the three steps, then **"stay monkey."**[21]

This is a **separate compressed script**, not a two-beat crop and not a silent vertical crop of the 16:9 master. The 16:9 thumbnail is a designed "NO-NUT-NOV" gooner-vs-NoFap contrast.[31] The Short's public 16:9 `maxresdefault` is a frame of the vertical video (sad face, thought bubble "Why can't I stop?") with blurred side panels filling 16:9.[30]

A still-shorter example of the same "one claim + one rule + app" Short shape: [How human build discipline over motivation](https://www.youtube.com/shorts/5_cvpfQ0e3w) (22s) — keep small promises, five push-ups for 30 days, Lockin 75-day CTA.[18] [Why You Can't Stick To Anything](https://www.youtube.com/shorts/aeKqwWXfmwM) (1:09) is the same shape at longer Short length: fantasy-motivation diagnosis, then "life is mostly boring," no flagship remount beside it.[19]

### 3. Hook taken from a *different* long, not from the named reference

The 48s sleep-testosterone Short is a hook-plus-three-tips cut that belongs with [Lack Of Sleep Shrinks Your Balls](https://www.youtube.com/watch?v=GFge24IUcy8), not with [5 habits for good sleep.](https://www.youtube.com/watch?v=bt5ue-1wLvc).[15][22][6] The Short's close ("Go to bed and wake up same time. Make room cold and dark. Make bed only for sleep.") overlaps the long's regularity / bed-for-sleep tips but drops WHO, daylight-savings, alcohol/weed myths, and the "Stay a monkey" closer.[15][22]

Winter is the same idea at title level only: Short [How to level up this winter](https://www.youtube.com/shorts/LIlVniqN6ws) (21s, 2025-11-16) versus long [How To Max Your Stats This Winter](https://www.youtube.com/watch?v=nuesDJf4EYA) (3:28, 2025-11-08). The Short has an empty description; captions were not retrieved (429). Treat as **title-adjacent, relation unverified** until captions exist.[3][27]

## What is unique to the Short package versus a crop of the flagship

Observed on this channel, a Short is **not** "take the 16:9 master, crop the center, cut two beats."

| | Flagship (Videos tab) | Short (Shorts tab) |
| --- | --- | --- |
| Aspect | 1920×1080 (1.78) | 1080×1920 (0.56) |
| Typical length | 3–8 min (median 4:33) | 17–69s for most; one 2:47 remount |
| Title | Outcome / numbered habits / claim | "Why X", "How to X", "X Explained By Monke", question |
| Description | App short-link, "Monke explains…", Featurebase / Substack / Discord | Usually **empty**; the 2:47 remount has one sentence and no links |
| Thumbnail | Designed 16:9 type + mascot pose | Vertical poster, or a 16:9 letterbox of a vertical frame with blurred sides |
| Hook type | Custom thumbnail text ("SLEEP TUTORIAL", "HOW TO STUDY", "You Can Fix It") | On-frame title ("Why bad sleep lower testosterone (explained by monke)") or a thought-bubble line |
| Close | Spoken recap + "Stay Monkey" / "stay monkey"; app lives in the description (screen also speaks the link) | Often ends on the tip or a spoken Lockin line; "Stay Monkey" is not the Short closer in the captions checked |
| Relation to long | Canonical essay | Same-script remount, **or** a new short script of thesis+steps, **or** a hook from a *different* long. Not a two-beat excerpt of the three references |
| Eligibility | `isShortsEligible: false` | `isShortsEligible: true` |

A crop of the flagship would keep the 16:9 art, the description stack, and a slice of the same audio. The Shorts that share research with a long video instead **re-frame for 9:16**, drop or empty the description, and either remount the whole narration or rewrite it down to one claim and a few steps.

## Gaps (not observed)

- Visual last-frame of the three videos (whether a drawn "Stay Monkey" card exists under the YouTube related grid) was not screen-grabbed; the authored close is taken from captions + description + Innertube end-screen payload.
- Captions for several 17–21s Shorts (`nGnTJ4tjM2A`, `VEIpTTMtcj0`, `LIlVniqN6ws`, `Mr1Y2pX5p94`) failed with HTTP 429. Their titles are listed; their scripts are not claimed.
- No official Clip objects were found on the three watch pages. Absence of a clips panel is not a proof that a viewer never created a clip.
- This file does not measure cut rate, hold length, or claim density inside the longs — that is issue 32.

## Sources

[1] https://www.youtube.com/@monkebiznis
[2] https://www.youtube.com/@monkebiznis/videos
[3] https://www.youtube.com/@monkebiznis/shorts
[4] https://www.youtube.com/channel/UCC2nLqBUIy8bagyNMDRiRcA
[5] https://www.youtube.com/feeds/videos.xml?channel_id=UCC2nLqBUIy8bagyNMDRiRcA
[6] https://www.youtube.com/watch?v=bt5ue-1wLvc
[7] https://www.youtube.com/watch?v=6-TDjSIroRQ
[8] https://www.youtube.com/watch?v=Iz_MHsiZ8KE
[9] https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=bt5ue-1wLvc&format=json
[10] https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=6-TDjSIroRQ&format=json
[11] https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=Iz_MHsiZ8KE&format=json
[12] https://i.ytimg.com/vi/bt5ue-1wLvc/maxresdefault.jpg
[13] https://i.ytimg.com/vi/6-TDjSIroRQ/maxresdefault.jpg
[14] https://i.ytimg.com/vi/Iz_MHsiZ8KE/maxresdefault.jpg
[15] https://www.youtube.com/shorts/spvYGKTdWto
[16] https://www.youtube.com/shorts/Vwm0FMZYOLc
[17] https://www.youtube.com/shorts/0Yz-r78vWEE
[18] https://www.youtube.com/shorts/5_cvpfQ0e3w
[19] https://www.youtube.com/shorts/aeKqwWXfmwM
[20] https://www.youtube.com/watch?v=Fq0eLMR_nlA
[21] https://www.youtube.com/watch?v=j-0kuiAlyk8
[22] https://www.youtube.com/watch?v=GFge24IUcy8
[23] https://www.youtube.com/watch?v=9ThamuLyCB8
[24] https://www.youtube.com/watch?v=teyV8EFTxPc
[25] https://www.youtube.com/watch?v=MW0tWY_tEr0
[26] https://www.youtube.com/watch?v=u_DfrP-oaRQ
[27] https://www.youtube.com/watch?v=nuesDJf4EYA
[28] https://i.ytimg.com/vi/0Yz-r78vWEE/oar2.jpg
[29] https://i.ytimg.com/vi/spvYGKTdWto/maxresdefault.jpg
[30] https://i.ytimg.com/vi/Vwm0FMZYOLc/maxresdefault.jpg
[31] https://i.ytimg.com/vi/j-0kuiAlyk8/maxresdefault.jpg
[32] https://i.ytimg.com/vi/Fq0eLMR_nlA/maxresdefault.jpg
