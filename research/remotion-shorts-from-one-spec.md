# Remotion patterns for 1920×1080 and 1080×1920 from one spec

Facts from official Remotion docs (fetched 2026-08-14). This note does not lock a Shorts cut. That lock lives on [Shorts cut from the same spec](https://github.com/Perk4/cairn-essays/issues/12).

Ticket: [Remotion patterns for Shorts from one spec](https://github.com/Perk4/cairn-essays/issues/5).

## Question answered

Official Remotion has **no single “dual-aspect” primitive**. Shipping 1920×1080 and 1080×1920 from one project is done by registering **two compositions** (two `id`s, two canvases) and sharing React components plus props. Layout that should survive both canvases must read **`useVideoConfig()`** (and/or `fitText`) rather than hard-coded pixel boxes.

`--scale` does not change aspect ratio. Sequence / `<Video>` / `<Img>` **crop** props clip edges of an existing canvas or media box; they do not retarget a 16:9 composition into a 9:16 file.

## 1. Composition API: two canvases in one Root

A composition is a React component plus video metadata: `id`, `width`, `height`, `fps`, `durationInFrames`. Register it with `<Composition>` in the root (typically `src/Root.tsx`). Multiple compositions are registered by wrapping them in a fragment.

Sources:

- [The fundamentals](https://www.remotion.dev/docs/the-fundamentals)
- [`<Composition>`](https://www.remotion.dev/docs/composition)

Facts from those pages:

- Fundamentals example registers one composition at `width={1920} height={1080}`.
- Fundamentals: “You can register multiple compositions in `src/Root.tsx` by wrapping them in a React Fragment.”
- Composition docs: “Additional compositions can be rendered” next to the first `<Composition>`.
- `id` is the unique render target (sidebar + CLI). Allowed characters: letters, numbers, `-`.
- `width` / `height` are composition size in pixels. That is the output canvas unless later overridden (see §4).
- Same `component` (or `lazyComponent`) may be passed to more than one `<Composition>`.
- `defaultProps` must be JSON-serializable (plus `Date`, `Map`, `Set`, `staticFile()`). Huge `defaultProps` payloads are discouraged.
- `<Folder>` only groups sidebar entries. No render behavior. ([Folder](https://www.remotion.dev/docs/folder))

Official 9:16 example: the [TikTok template](https://www.remotion.dev/templates/tiktok) (`npx create-video@latest --tiktok`) registers a single composition at **1080×1920**:

```tsx
<Composition
  id="CaptionedVideo"
  component={CaptionedVideo}
  calculateMetadata={calculateCaptionedVideoMetadata}
  schema={captionedVideoSchema}
  width={1080}
  height={1920}
  defaultProps={{ src: staticFile("sample-video.mp4") }}
/>
```

Source: [remotion-dev/template-tiktok `src/Root.tsx`](https://github.com/remotion-dev/template-tiktok/blob/main/src/Root.tsx). Promo metadata for that template is also `width: 1080, height: 1920` in Remotion’s create-video catalog.

That template is one portrait composition, not dual output. Dual 16:9 + 9:16 from one project is the **multiple `<Composition>`** pattern from the fundamentals page, with two `id`s and two dimension pairs, sharing a component and (via `defaultProps` / `--props`) the same episode spec.

Render is **one composition id per `npx remotion render` invocation**. To render several ids, loop `npx remotion compositions` then `npx remotion render … $composition`, or loop `getCompositions` + `renderMedia`. ([Render all compositions](https://www.remotion.dev/docs/render-all), [npx remotion render](https://www.remotion.dev/docs/cli/render))

Input props (`--props` / `inputProps`) are the official way to pass the same JSON into a render. Resolution order: `defaultProps` → input props → `calculateMetadata()` transform. ([How props get resolved](https://www.remotion.dev/docs/props-resolution))

## 2. `calculateMetadata`: duration, dimensions, and props from data

[`calculateMetadata()`](https://www.remotion.dev/docs/calculate-metadata) is a `<Composition>` callback. Official reasons to use it include making `durationInFrames`, `width`, `height`, or `fps` dynamic from data, transforming props (including fetches), and setting per-composition codec/output defaults.

It runs **once** per metadata calculation (separate tab / `selectComposition()`), not per frame. It may be `async`. It must finish within the delay-render timeout.

Arguments include `props` (resolved), `defaultProps`, `abortSignal`, `compositionId` (v4.0.98+), `isRendering` (v4.0.342+).

Returned fields (all optional): `props`, `durationInFrames`, `width`, `height`, `fps`, `defaultCodec`, `defaultOutName`, image/pixel/ProRes/sample-rate defaults. Returned fields take precedence over the matching `<Composition>` props.

[Variable duration and dimensions](https://www.remotion.dev/docs/dynamic-metadata):

- Return `durationInFrames` and/or `fps`, `width`, `height`.
- Official sample aligns duration to a source video via Mediabunny metadata; it does **not** have to return width/height.
- TikTok template `calculateCaptionedVideoMetadata` returns `{ fps: 30, durationInFrames }` from `getVideoMetadata(props.src)` and leaves **1080×1920 on the `<Composition>`**.
- CLI `--width` / `--height` override dimensions from `calculateMetadata()`.
- `--scale` is applied **after** those overrides and has the highest priority.

`compositionId` in the callback is the official hook for “same function, different composition” (flagship vs Shorts id) without inventing a second data format. That is an API fact, not a cut decision.

Combining scene components into a longer composition is a different problem: wrap them in `<Series>` and register a third `<Composition>`. Scale advice there is `calculateMetadata()` for duration-from-props and `.map()` over a scene array. ([How do I combine compositions?](https://www.remotion.dev/docs/miscellaneous/snippets/combine-compositions)) That concatenates time, not aspect ratios.

## 3. `useVideoConfig`: reflow to the current canvas

[`useVideoConfig()`](https://www.remotion.dev/docs/use-video-config) returns the composition (or enclosing sequence) you are in:

- `width`, `height` — composition pixels, **or** the `width` / `height` of an ancestor `<Sequence>` if that sequence sets them
- `fps`, `durationInFrames` — composition, or sequence duration if inside a `<Sequence>`
- `id` — composition id
- `defaultProps`, `props` (after transformations)
- `defaultCodec`, `defaultSampleRate`

Fundamentals: a video has four properties (`width`, `height`, `durationInFrames`, `fps`); read them from this hook rather than assuming a canvas.

[`<Sequence>` `width` / `height`](https://www.remotion.dev/docs/sequence): “Gives the sequence a specific `style={{width}}` / `height` and **overrides `width` / `height` returned by `useVideoConfig()` in child components**. Useful for including a component that was designed for a specific width.” That is the official nested-canvas pattern: a 1920×1080-designed child can keep seeing 1920×1080 while mounted inside a 1080×1920 composition (or the reverse). Positioning/scaling that nested box on the parent canvas is left to layout CSS; Remotion does not auto-letterbox it.

[Supporting multiple frame rates](https://www.remotion.dev/docs/multiple-fps): time animation and `from` / `durationInFrames` from `fps` (`1 * fps`, not hardcoded `30`). Same hook. FPS convert snippets that wrap media tags are discouraged.

TikTok template caption layout already reflows width:

```ts
const { width, fps } = useVideoConfig();
const fittedText = fitText({
  fontFamily,
  text: page.text,
  withinWidth: width * 0.9,
  textTransform: "uppercase",
});
const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);
```

Source: [template-tiktok `Page.tsx`](https://github.com/remotion-dev/template-tiktok/blob/main/src/CaptionedVideo/Page.tsx).

## 4. Scale is same-aspect output, not 16:9 → 9:16

[Output scaling](https://www.remotion.dev/docs/scaling):

> Output scaling is useful if you would like to render the video in **multiple resolutions in the same aspect ratio**.
>
> Example: canvas Full HD (`1920x1080`), render 4K (`3840x2160` or `2x`).

`--scale` (CLI), `Config.setScale`, and renderer `scale` options multiply **both** dimensions. Values in `(0, 16]`. Example from [render CLI](https://www.remotion.dev/docs/cli/render): 1280×720 at `1.5` → 1920×1080.

Dynamic-metadata page: if you designed at one resolution and want another **in the same aspect**, use output scaling. Changing FPS is a separate refactor ([multiple FPS](https://www.remotion.dev/docs/multiple-fps)).

What `--scale` does **not** do: turn 1920×1080 into 1080×1920.

What does not upscale under `--scale`: **videos** (bitmap). Text, SVG, and sufficiently large images do. Canvas/WebGL need an explicit `pixelDensity` / `usePixelDensity()`.

CLI `--width` / `--height` and `Config.overrideWidth` / `overrideHeight` change the composition canvas. The `--width` / `--height` flags beat the config helpers. They also beat `calculateMetadata()` dimensions. `--scale` is applied last. Changing canvas this way without `useVideoConfig` / fluid layout does not reflow hardcoded pixel UI (see §7).

## 5. Crop APIs clip a box; they do not retarget the composition

[`<Sequence>` crop props](https://www.remotion.dev/docs/sequence) (`cropLeft`, `cropRight`, `cropTop`, `cropBottom`):

- Ratio `0`–`1`.
- “Crops the Sequence from the [edge] **without changing its size or transform origin**.”
- Only with `layout="absolute-fill"`.
- Overlapping opposite crops meet in the center.
- Inline `border-radius` is inherited by the crop; class-based radius is not.

Same ratio crop props exist on [`<Video>` from `@remotion/media`](https://www.remotion.dev/docs/media/video) and [`<Img>`](https://www.remotion.dev/docs/img). They crop the **media**, not the composition metadata.

`<Video>` `objectFit` (CSS `object-fit` is **not** supported on that component; use the prop):

- `contain` (default): letterbox if aspect differs
- `cover`: fill box, **clip** overflow
- `fill`: stretch, aspect not preserved
- `none` / `scale-down`

Official cover example fills `width/height: 100%` of an `AbsoluteFill`. TikTok template uses `<OffthreadVideo style={{ objectFit: "cover" }} />` on a **1080×1920** composition so a (likely landscape) source file fills portrait by clipping.

[`<OffthreadVideo>`](https://www.remotion.dev/docs/offthreadvideo): frame-accurate video via FFmpeg → `<Img>` at render, `<video>` in preview. `style` is passed through. `trimBefore` / `trimAfter` trim **time**, not spatial crop. No `objectFit` prop in the OffthreadVideo API; the template uses CSS `objectFit` on `style` (preview is a `<video>`, render is an `<img>`). Newer docs prefer `<Video>` from `@remotion/media`; OffthreadVideo is the documented fallback. OffthreadVideo is not supported in `@remotion/web-renderer`.

None of these APIs change `<Composition width height>`. A 1920×1080 composition that crops its children still **encodes 1920×1080**.

## 6. Still and sequence reuse (same components, not a second show)

[`<Still>`](https://www.remotion.dev/docs/still): single-frame `<Composition>`. Same API except `durationInFrames` and `fps` are not required. Official example registers **the same `MyComp`** as both a video composition and a still, each with its own `id` and `width`/`height`.

[`<Sequence>`](https://www.remotion.dev/docs/sequence) + [Making components reusable](https://www.remotion.dev/docs/reusability): factor visuals into components; time-shift with `from` / `durationInFrames`. `useCurrentFrame()` is relative to the sequence. Default layout is `AbsoluteFill` overlay; `layout="none"` opts out.

Other sequence facts relevant to reuse, not to a Shorts edit:

- `freeze` — freeze children at a frame (equivalent to `<Freeze>` without remounting)
- `trimBefore` — start children later on their own timeline
- Nested sequences cascade `from`

This is how one episode spec’s scene components can be mounted in two compositions with different `from`/`durationInFrames`. Which scenes appear in the 9:16 output is the Shorts-cut lock, not this note.

## 7. Caption and card layout constraints at 9:16

Remotion videos have **fixed pixel dimensions**. Absolute positioning is the documented layout model. [`AbsoluteFill`](https://www.remotion.dev/docs/absolute-fill) is `position: absolute; inset 0; width/height 100%; display: flex; flex-direction: column`. Later siblings paint on top. ([Layers](https://www.remotion.dev/docs/layers))

Default stylesheet uses `box-sizing: border-box`; **borders shrink the content box**. `fitText` docs: subtract borders or use `outline`.

### Official caption stack (portrait template)

[Displaying captions](https://www.remotion.dev/docs/captions/displaying) and [`createTikTokStyleCaptions()`](https://www.remotion.dev/docs/captions/create-tiktok-style-captions):

- Input is `Caption[]` with `text`, `startMs`, `endMs` (token stream, typically from transcription).
- `createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds })` pages tokens. High ms → many words per page; low ms → word-by-word.
- **Whitespace is significant.** Spaces belong on `text` (ideally before each word). Render with `white-space: pre` or pages collapse.
- Map pages to `<Sequence from={startFrame} durationInFrames={…}>` using `fps` from `useVideoConfig()`.
- Displaying-captions sample: centered `AbsoluteFill`, `fontSize: 80`, bold, `whiteSpace: "pre"`, word highlight by comparing token `fromMs`/`toMs` to playhead.
- Recommended next steps on that page: [`fitText()`](https://www.remotion.dev/docs/layout-utils/fit-text) to the **video width**, enter/exit animation, `WebkitTextStroke` + `paintOrder: "stroke"` for contrast.

TikTok template constraints on a **1080×1920** canvas ([`Page.tsx`](https://github.com/remotion-dev/template-tiktok/blob/main/src/CaptionedVideo/Page.tsx)):

- Caption box: `AbsoluteFill` with `bottom: 350`, `height: 150`, centered. `top` is unset so the block sits **350px above the bottom** of 1920.
- `fitText` to `width * 0.9` (972px at 1080).
- Cap `fontSize` at 120. Stroke `20px black`.
- `OffthreadVideo` `objectFit: "cover"` behind captions.

Those pixel constants (`bottom: 350`, `height: 150`, font 120, stroke 20) are 9:16-template choices, not a Remotion engine rule. They will not map 1:1 onto a 1920×1080 canvas without `useVideoConfig` / proportional layout.

[`fitText()`](https://www.remotion.dev/docs/layout-utils/fit-text) (v4.0.88+): returns `fontSize` to fit **one width**. Font must be loaded first (`waitUntilDone()` for `@remotion/google-fonts`). [`fitTextOnNLines()`](https://www.remotion.dev/docs/layout-utils/fit-text-on-n-lines) (v4.0.313+): same idea with `maxLines` and optional `maxFontSize` (default 2000); returns `{ fontSize, lines }`.

There is **no official Remotion “safe area for YouTube Shorts chrome”** in the pages fetched. The 350px bottom inset in the TikTok template is the only first-party numeric caption-clearance example.

Cairn constraint (from the map, not from Remotion): no spoken VO this week; captions carry prose. Official `@remotion/captions` paging assumes timed **tokens** (`startMs`/`endMs`). Essay cards (`citeCard`, `numberCard`, …) are not covered by `createTikTokStyleCaptions`. Timing those cards is a separate lock ([Caption timing without spoken VO](https://github.com/Perk4/cairn-essays/issues/9)).

## 8. What breaks if you only scale or only crop

### Only `--scale`

- Aspect ratio is unchanged. 1920×1080 × any allowed scale is still 16:9. No 1080×1920 file.
- Videos do not gain resolution from scale.
- Does not reflow layout; it rasterizes the same composition larger or smaller.

### Only CLI `--width=1080 --height=1920` on a 16:9 composition

- Canvas becomes 1080×1920 (overrides Composition / `calculateMetadata` size).
- Layout that uses `AbsoluteFill` percentages **stretches** (16:9 UI squashed into 9:16).
- Layout that uses hardcoded px (e.g. `width: 1920`, `left: 400`, TikTok `bottom: 350` on a 1080-tall canvas) **overflows or sits in the wrong place**.
- Layout that uses `useVideoConfig().width/height` and `fitText({ withinWidth: width * … })` **reflows**.
- Sequence children that were designed for 1920×1080 keep that design unless the sequence overrides `width`/`height` as in §3.

### Only crop / `objectFit: "cover"` of a 16:9 render into 9:16

- Spatial crop does not change encoded `width`×`height`. You still need a 1080×1920 composition (or `--width`/`--height`) to ship 9:16.
- `cover` of a 16:9 **video file** on a 9:16 canvas clips left/right (centered by default). Content on the sides of a landscape plate is gone.
- Sequence crop “without changing size”: a 1920×1080 sequence cropped on the left/right is still a 1920×1080 layer with transparent or empty edges, not a 1080×1920 output.
- Cards, captions, named frames, and a puppet placed for 16:9 (wide row, side-by-side cite + number, landscape title) are clipped or letterboxed. `fitText` against 1920 then drawn on 1080 overflows unless width is taken from `useVideoConfig`.
- `objectFit: "fill"` distorts. `"contain"` letterboxes (black bars) and does not fill Shorts.

### Only registering one composition and hoping Studio “exports both”

- Each `<Composition>` is one renderable id. Render CLI takes one id. Dual files require two renders (or a render-all loop).

## 9. Pattern map (facts only; no cut lock)

| Approach | Official? | What it actually does | Enough for 1920×1080 **and** 1080×1920? |
| --- | --- | --- | --- |
| Second `<Composition>` (second `id`, other `width`/`height`, same `component` + props) | Yes. Fundamentals + Composition | Two canvases, two render targets, shared React tree | Yes, if layout reads `useVideoConfig` / fluid CSS / `fitText` |
| `useVideoConfig` reflow | Yes | Children see live canvas (or Sequence override) | Required for shared components; not a second file by itself |
| `calculateMetadata` returning `width`/`height` | Yes | Per-render canvas from data / `compositionId` / props | Can drive one composition’s size; dual files still need two ids or two override renders |
| `--scale` | Yes | Same aspect, more/fewer pixels | No |
| `--width` / `--height` override | Yes | Replaces canvas size | Can emit 9:16 **pixels**; layout still must reflow |
| Sequence / Video / Img crop | Yes | Clip edges of a box; size unchanged | No, by itself |
| `<Video objectFit="cover">` / OffthreadVideo CSS cover | Yes (media) | Fill current canvas, clip source video | Fills a 9:16 canvas with a 16:9 **asset**; does not reflow Remotion-drawn cards |
| `<Still>` + same component | Yes | Single-frame sibling of a composition | Stills / cards / thumbs; not the Shorts video |
| `<Sequence>` reuse (`from`, duration, `freeze`, nested `width`/`height`) | Yes | Time-shift and/or nest a designed size | Shared scenes; which subset is the Shorts cut is out of scope here |
| `@remotion/captions` TikTok paging | Yes, for timed tokens | Pages + sequences on current `fps` | Layout helpers for portrait captions; not a dual-aspect factory |

**Not locked here:** whether Shorts is a full-episode reflow, a cover-crop of the 16:9 plate, a shorter `<Sequence>` subset of the same spec, a different `durationInFrames` from `calculateMetadata`, or some mix. That is [Shorts cut from the same spec](https://github.com/Perk4/cairn-essays/issues/12).

## Sources fetched

- https://www.remotion.dev/docs/the-fundamentals
- https://www.remotion.dev/docs/composition
- https://www.remotion.dev/docs/calculate-metadata
- https://www.remotion.dev/docs/dynamic-metadata
- https://www.remotion.dev/docs/use-video-config
- https://www.remotion.dev/docs/offthreadvideo
- https://www.remotion.dev/docs/media/video
- https://www.remotion.dev/docs/img
- https://www.remotion.dev/docs/sequence
- https://www.remotion.dev/docs/still
- https://www.remotion.dev/docs/folder
- https://www.remotion.dev/docs/scaling
- https://www.remotion.dev/docs/cli/render
- https://www.remotion.dev/docs/render-all
- https://www.remotion.dev/docs/config
- https://www.remotion.dev/docs/props-resolution
- https://www.remotion.dev/docs/reusability
- https://www.remotion.dev/docs/miscellaneous/snippets/combine-compositions
- https://www.remotion.dev/docs/absolute-fill
- https://www.remotion.dev/docs/layers
- https://www.remotion.dev/docs/captions/displaying
- https://www.remotion.dev/docs/captions/create-tiktok-style-captions
- https://www.remotion.dev/docs/layout-utils/fit-text
- https://www.remotion.dev/docs/layout-utils/fit-text-on-n-lines
- https://www.remotion.dev/docs/multiple-fps
- https://www.remotion.dev/templates/tiktok
- https://github.com/remotion-dev/template-tiktok/blob/main/src/Root.tsx
- https://github.com/remotion-dev/template-tiktok/blob/main/src/CaptionedVideo/index.tsx
- https://github.com/remotion-dev/template-tiktok/blob/main/src/CaptionedVideo/Page.tsx
