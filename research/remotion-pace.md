# Remotion 4.0.512: what is allowed for a fast explainer

Ticket: [What does Remotion allow for matching that pace?](https://github.com/Perk4/cairn-essays/issues/33).
Primary sources: official Remotion 4.x docs.
Repo facts are the current constraint surface, cited without changing it.

## Answer

Remotion does not impose a minimum scene length or a maximum cut rate.
A `<Sequence>` can last one frame.[1]
Springs can be delayed or stretched to a fixed frame count.[4]
Audio amplitude can drive motion on every frame.[10]
Word-level captions can switch on millisecond timestamps.[26]
This repo pins `remotion` and `@remotion/cli` at 4.0.512.[32]
The 16–72 second scene clamp and 8–12 minute flagship bar live in `src/timing.ts` and the README, not in Remotion.[33][37]
Matching a fast explainer is a `durationSec` / beat contract change.
It is not blocked by a first-party API gap.

## Repo constraint surface (do not change)

`src/timing.ts` on `origin/main` sets `FPS = 30`.[33]
The same file sets `MIN_SCENE_SEC = 16` and `MAX_SCENE_SEC = 72`.[33]
Flagship bounds are `FLAGSHIP_MIN_SEC = 480` and `FLAGSHIP_MAX_SEC = 720`.[33]
Shorts clamp to `SHORT_MIN_SEC = 12` and `SHORT_MAX_SEC = 30`.[33]
Fallback duration when `durationSec` is missing is `clamp(round(12 + wordCount / 2.2), 16, 72)`.[33][37]
The README calls `episodes/ep01.json` the source of truth and says ep01 sits inside the 8–12 minute week-1 bar.[37]

On `origin/main`, `episodes/ep01.json` has `durationTargetSec: 572` across 14 scenes (holds from 28s to 64s).[unverified]
Working-tree `episodes/ep01.json` (branch `cursor/ep01-acting-cut-9932`, not this research commit) retargets to 540s across 11 scenes.[unverified]
Spoken MP3s there are about 1.8–11.8s inside 36–64s holds.[unverified]
That hold pattern is authorship, not a Remotion limit.

The flagship maps each scene to a `<Sequence>` with `from` and `durationInFrames` from `sceneFrameRanges`.[34]
`<VoAudio>` is mounted inside that sequence.[34]
`VoAudio` plays `public/vo/{name}.mp3` through `<Html5Audio>`.[35]
Compositions are registered at 30 fps.[36][33]
The flagship is 1920×1080; Shorts are 1080×1920.[36][33]

Working-tree talking kit is uncommitted and is not saved on this branch.[unverified]
`public/cairn/KIT.md` says mouth is drawn on the body and driven by the VO envelope.[unverified]
Optional PNG swaps are `still` / `listen` / `point`, plus mouth and Tuesday/Thursday faces.[unverified]
`src/cairn/Mouth.tsx` overlays a three-state mouth.[unverified]
`src/cairn/kit.ts` prefers `src/voEnvelopes.json` (one RMS sample per frame at 30 fps) and falls back to 150 wpm letter visemes.[unverified]
Envelopes are written by `scripts/make-vo.mjs` via ffmpeg at 3000 Hz, then RMS-binned per frame.[unverified]
Captions in this repo are scene- or beat-level strings (`beats[].atSec`), not `@remotion/captions` tokens.[33]
The README on main still says captions support the line and are not the show.[37]

None of `@remotion/media-utils`, `@remotion/captions`, `@remotion/rive`, `@remotion/lottie`, or `@remotion/transitions` are in `package.json` today.[32]

## Rapid Sequence cuts

`<Sequence>` time-shifts children.[1]
`from` is the composition frame at which children assume time starts.[1]
`durationInFrames` is how long they stay mounted and defaults to `Infinity`.[1]
Children that call `useCurrentFrame()` receive a value shifted by `from`.[1][7]
Sequences nest and cascade.[1]
A sequence starting at 60 inside one starting at 30 starts its children at 90.[1]

There is no documented minimum `durationInFrames` other than how long the sequence should be displayed.[1]
A one-frame cut is therefore legal.
`<Series>` stitches sequences back-to-back so you do not hand-compute `from`.[2]
Only the last `<Series.Sequence>` may use `Infinity`.[2]
Every previous series sequence must be a positive integer.[2]
`offset` on a series sequence can delay (positive) or overlap the previous scene (negative).[2]

`<TransitionSeries>` from `@remotion/transitions` (available since 4.0.59) adds crossfades or overlays between scenes.[3]
A transition shortens total duration because both scenes overlap; an overlay does not.[3]
A transition must not be longer than the previous or next sequence.[3]
Two transitions cannot be adjacent.[3]
`springTiming({config: {damping: 200}}).getDurationInFrames({fps: 30})` is documented as 23 frames.[3][30]
That is under a second at this repo’s 30 fps.[33]

In Remotion 4.x, `<Sequence>` is not premounted by default.[28]
`premountFor` exists; the default becomes `fps` (one second) only in v5.[1][28]
Premounting mounts the next scene early so assets can load before the cut.[28]
A premounted sequence cannot use `layout="none"` because there is no container for the hide styles.[28]
For a fast cut that swaps PNGs or VO, premount the next `<Sequence>`.[20][28]

`<Img>` waits until the image is loaded before a frame is considered ready.[20]
That is the documented way to avoid a loading-state screenshot on a hard cut.[20][9]
`<Img>` also inherits `from` and `durationInFrames` from `<Sequence>`.[20]
A pose PNG can therefore be its own timed clip.[20]

## Springs

`spring()` is a physics-based primitive.[4]
Pass `frame` (usually `useCurrentFrame()`) and `fps` from `useVideoConfig()`.[4]
Defaults are `from` 0, `to` 1, `mass` 1, `damping` 10, `stiffness` 100, and `overshootClamping` false.[4]
Reducing mass makes the animation faster.[4]
`durationInFrames` stretches the curve to an exact length.[4]
`delay` holds the initial value for N frames; `reverse` plays it backward.[4]
Order of operations is stretch, then reverse, then delay.[4]

`measureSpring({fps, config})` returns how many frames until the spring is considered settled.[6]
A spring theoretically never ends; the default settle threshold is `0.005`.[6]
Example in the docs: `{damping: 200}` at 30 fps measures 23 frames.[6]
`springTiming` for transitions uses the same default rest threshold.[31]
The transition docs recommend `0.001` to avoid a visible cutoff.[31]
A lower threshold also lengthens the transition unless `durationInFrames` is fixed.[31]

`interpolate()` maps any driver — including a spring — onto pixels, opacity, or CSS transform strings.[5]
`extrapolateRight: "clamp"` stops values from growing after the last keyframe.[5]
From 4.0.509, `Easing.step1` switches discrete strings without blending.[5]
`posterize` samples an animation every N frames instead of every frame.[5]

Animations must be driven by `useCurrentFrame()`.[8]
CSS transitions flicker under Remotion’s multi-tab renderer because tabs do not share state.[8][9]
Frames are not guaranteed to render in order.[9]
`--concurrency=1` is documented as a slower bypass, not a real timing fix, and it blocks Lambda.[9]

This repo already uses `spring()` for NamedFrame / visual enters.[unverified]
It uses `interpolate()` for Cairn settle (8 frames) and nod (16 frames).[unverified]
Those are in-composition motion, independent of the 16–72s scene hold.[33]

## Audio-driven motion

First-party path is `@remotion/media-utils`.[10]
`useAudioData(src)` or `getAudioData(src)` loads waveform data.[11][12]
`visualizeAudio({audioData, frame, fps, numberOfSamples})` returns a per-frame spectrum.[10]
`useAudioData` wraps fetch in `delayRender` / `continueRender` and returns `null` until loaded.[11]
`numberOfSamples` must be a power of two (`32`, `64`, `128`, …).[10]
Returned values are amplitudes 0–1; left of the array is lows, right is highs.[10]
`smoothing` defaults to true (average of previous, current, next frame).[10]
If the audio is shifted or trimmed, the `frame` passed to `visualizeAudio` must be the position in the audio file.[10]

`getAudioData` returns `channelWaveforms`, `durationInSeconds`, and `numberOfChannels`.[12]
The `sampleRate` field is the AudioContext rate (default 48000 from 4.0.121), not the file’s native rate.[12]
Results are memoized for the page lifetime.[12]
`useAudioData` loads the entire file; the docs say that is fine for small files and slow for large ones.[14]
`useWindowedAudioData` loads a window around the current frame via HTTP range requests.[13]
Before 4.0.383 it was WAV-only; at 4.0.512 it supports Mediabunny formats.[13]

This repo does not use those APIs.[32]
Working-tree mouth motion is a precomputed RMS envelope in `src/voEnvelopes.json`.[unverified]
That is a valid local substitute for `visualizeAudio` on short VO clips.[10]
First-party `useAudioData` would drive motion from the same MP3 without a sidecar JSON.[11]
The cost is a `delayRender` on first load and a full-file decode.[11][29]

`<Html5Audio>` (what `VoAudio` uses) plays Chrome-supported audio from `staticFile()`.[15][35]
`volume` may be a number or a per-frame callback.[15]
`trimBefore` / `trimAfter` crop the file in frames.[15]
`playbackRate` is unbounded in Remotion.[15]
Chrome throws below `0.0625` or above `16` in preview; reverse playback is not supported.[15]
In Studio/Player, Remotion seeks if audio drifts more than `acceptableTimeShiftInSeconds` (default `0.45`).[15]
That 450 ms default is preview sync slop, not a render-time lip-sync guarantee.[15]

`getAudioDurationInSeconds()` is deprecated.[16]
Docs point to Mediabunny `getMediaMetadata()` / `computeDuration()`.[16][17]
`calculateMetadata()` on `<Composition>` can set `durationInFrames` from that duration.[18][17]
A composition can therefore match the spoken file instead of a hand-set hold.[17]
`calculateMetadata` runs once per composition and may be async.[18]
It must finish within the `delayRender` timeout.[18]

## Character rigs versus PNG pose swaps

`@remotion/rive` renders a `.riv` file on `<RemotionRiveCanvas>` synchronized to Remotion time.[21][22]
`src` may be `staticFile()` or a URL.[22]
`animation` and `artboard` select named clips.[22]
A ref exposes `getAnimationInstance()`, `getArtboard()`, `getRenderer()`, and `getCanvas()`.[22]
Text runs can be set at load (example: a run named `city`).[22]
The component inherits Sequence timing props (`from`, `durationInFrames`, `trimBefore`).[22]

`@remotion/lottie` plays Lottie JSON with `<Lottie animationData={...} />`.[23]
`direction` is `forward` or `backward`; `loop` defaults false; `playbackRate` defaults 1.[23]
`renderer` defaults to `svg`.[23]
Changing `animationData` identity re-initializes the animation.[23]

Neither package is installed.[32]
First-party docs treat them as optional integrations, not as a requirement over `<Img>`.[20][21]

PNG pose swaps are first-class.
`<Img src={staticFile('hi.png')} />` blocks the frame until the bitmap is loaded.[20]
Chrome’s inherited resolution cap is `2^29` pixels (539 megapixels).[20]
Failed loads retry twice by default (`maxRetries: 2`).[20]
Then `cancelRender` runs unless `onError` handles it.[20]
Discrete pose names can be stepped with `interpolate` and `Easing.step1` from 4.0.509.[5]
Do not use `<Img>` for GIFs; use `@remotion/gif`.[20]

This repo’s current surface is the PNG path plus an overlay mouth.[unverified]
`still` / `listen` / `point` bodies keep their arms while a drawn mouth talks.[unverified]
A Rive or Lottie rig would be a new dependency and a new asset pipeline.[21][23]
It is not a Remotion unlock that PNG cannot match for hard cuts.[20]

## Caption and VO sync

`@remotion/captions` shipped in 4.0.216 and is the first-party caption package.[24]
The shared `Caption` shape is `{text, startMs, endMs, timestampMs, confidence}`.[26][25]
Transcribe locally with `@remotion/install-whisper-cpp` or `@remotion/whisper-web` (`toCaptions()`).[27]
Cloud options are `@remotion/openai-whisper` and `@remotion/elevenlabs`.[27]
You may also define your own caption format and skip the `Caption` type.[27]

`createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds})` pages tokens.[26]
A high combine window fits many words on one page; a low window is word-by-word.[26]
Example combine window in the docs is 1200 ms.[26]
`text` is whitespace-sensitive: include the space before each word.[26]
Render with `white-space: pre` or the page merges into one line.[26]
Each page has `startMs`, `durationMs` (from 4.0.261), and `tokens[]` with absolute `fromMs` / `toMs`.[26]

The display recipe maps each page to a `<Sequence>`.[25]
It highlights the active token with `useCurrentFrame()` converted to ms plus `page.startMs`.[25]
Because `useCurrentFrame()` is relative to the sequence, that addition is required for absolute times.[25][7]
Load caption JSON with `useDelayRender()` so the render waits.[25][29]
Docs say put captions alongside the video content so they stay in sync.[25]
Use one captions JSON per video.[25]

This repo does not install `@remotion/captions`.[32]
Captions are full-line or beat-line strings in episode JSON.[33]
They swap at `beats[].atSec` via `activeBeat()` in `src/timing.ts`.[33]
VO starts when the parent `<Sequence>` mounts.[34]
Caption and audio therefore share the scene clock only at scene granularity unless beats are added.[34]
Word-level karaoke is possible at 4.0.512 without changing Remotion.[24][25]
It needs caption tokens and Sequences, not a new engine.[25]

To tighten VO to picture, set `durationInFrames` from the MP3 via `calculateMetadata` plus Mediabunny duration.[17][18]
Or keep a hold but drive captions from `Caption.startMs`.[25]
Or trim `<Html5Audio>` with `trimBefore` / `trimAfter` if the file has silence.[15]
Preview drift up to 0.45s is the documented `<Html5Audio>` seek threshold.[15]

## Documented limits that actually bind a fast cut

There is no minimum `durationInFrames`; the default is `Infinity`.[1]
Finite values unmount children when the range ends.[1]
Sub-second scenes are legal.

Series previous durations must be a positive integer; only the last may be `Infinity`.[2]
A mid-series scene cannot be left open-ended.[2]

A transition must not exceed the previous or next sequence.[3]
Transitions cannot sit next to each other.[3]
A 23-frame spring wipe needs adjacent scenes of at least 23 frames.[3][30]

`premountFor` defaults to 0 until v5.[28]
Fast PNG/VO cuts should set `premountFor` explicitly if Studio or Player flashes.[28][20]

`continueRender` must run within 30 seconds or the render fails.[29]
`useAudioData` and caption `fetch` must resolve inside that window.[11][25]

`useAudioData` loads the whole file; use `useWindowedAudioData` for long files.[14][13]
That is fine for 2–12s VO clips.[14]

`<Html5Audio>` seeks after 0.45s of drift in Studio/Player.[15]
Render is frame-exact; preview is not a lip-sync spec.[15]

Preview throws if `playbackRate` is below 0.0625 or above 16.[15]
Reverse playback is unsupported.[15]

`<Img>` waits for decode; GIFs must not use `<Img>`.[20]
Hard pose cuts are safe if every pose is an `<Img>`.[20]
The Chrome image cap of `2^29` pixels is irrelevant to talking-kit PNGs.[20]

No CSS animations; no order-dependent state.[8][9]
Mouth and springs must stay on `useCurrentFrame` or precomputed envelopes.[8]

`@remotion/captions`, `media-utils`, `rive`, `lottie`, and `transitions` are not dependencies.[32]
Those APIs exist at 4.0.512; this repo has not opted in.[32]

`<Composition>` takes `fps` and `durationInFrames` as numbers with no documented numeric cap on those fields.[19]
An 8–12 minute flagship at 30 fps is 14,400–21,600 frames.[33][37]
That is ordinary Remotion usage, not a ceiling.[19]

## What this does not decide

Remotion will render a monke-like cut if `durationSec` and beats say so.
It will also render the current 30–50s holds.
The engine does not prefer either.
A pacing contract that wishes for rapid cuts without lowering `durationSec` is asking the JSON to do something the timeline is not doing.

This note does not implement a faster cut, does not add packages, and does not commit working-tree VO or mouth work.

## Sources

[1] https://www.remotion.dev/docs/sequence
[2] https://www.remotion.dev/docs/series
[3] https://www.remotion.dev/docs/transitions/transitionseries
[4] https://www.remotion.dev/docs/spring
[5] https://www.remotion.dev/docs/interpolate
[6] https://www.remotion.dev/docs/measure-spring
[7] https://www.remotion.dev/docs/use-current-frame
[8] https://www.remotion.dev/docs/animating-properties
[9] https://www.remotion.dev/docs/flickering
[10] https://www.remotion.dev/docs/visualize-audio
[11] https://www.remotion.dev/docs/use-audio-data
[12] https://www.remotion.dev/docs/get-audio-data
[13] https://www.remotion.dev/docs/use-windowed-audio-data
[14] https://www.remotion.dev/docs/audio/visualization
[15] https://www.remotion.dev/docs/html5-audio
[16] https://www.remotion.dev/docs/get-audio-duration-in-seconds
[17] https://www.remotion.dev/docs/videos/align-duration
[18] https://www.remotion.dev/docs/calculate-metadata
[19] https://www.remotion.dev/docs/composition
[20] https://www.remotion.dev/docs/img
[21] https://www.remotion.dev/docs/rive
[22] https://www.remotion.dev/docs/rive/remotionrivecanvas
[23] https://www.remotion.dev/docs/lottie/lottie
[24] https://www.remotion.dev/docs/captions/api
[25] https://www.remotion.dev/docs/captions/displaying
[26] https://www.remotion.dev/docs/captions/create-tiktok-style-captions
[27] https://www.remotion.dev/docs/captions/transcribing
[28] https://www.remotion.dev/docs/player/premounting
[29] https://www.remotion.dev/docs/delay-render
[30] https://www.remotion.dev/docs/transitions/timings
[31] https://www.remotion.dev/docs/transitions/timings/springtiming
[32] https://github.com/Perk4/cairn-essays/blob/c9a5547/package.json
[33] https://github.com/Perk4/cairn-essays/blob/c9a5547/src/timing.ts
[34] https://github.com/Perk4/cairn-essays/blob/c9a5547/src/compositions/Flagship.tsx
[35] https://github.com/Perk4/cairn-essays/blob/c9a5547/src/components/VoAudio.tsx
[36] https://github.com/Perk4/cairn-essays/blob/c9a5547/src/Root.tsx
[37] https://github.com/Perk4/cairn-essays/blob/c9a5547/README.md
