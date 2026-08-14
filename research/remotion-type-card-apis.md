# Remotion APIs for type, number, and citation cards

Research for [Remotion APIs for type, number, and citation cards](https://github.com/Perk4/cairn-essays/issues/4). Facts from first-party remotion.dev pages fetched 2026-08-14. Remotion skills under `/home/cursor/.cursor/plugins/cache/cursor-public/49339676/` were not present in this environment.

This note lists APIs that exist. It does **not** lock generate-vs-draw. That lock lives on [Generated vs drawn cards](https://github.com/Perk4/cairn-essays/issues/11). Figma is out of scope.

Scene types in scope: `cairnCaption`, `citeCard`, `namedFrame`, `quoteCard`, `numberCard`, `limitsCard`, `endCard`.

## What exists vs what does not

Remotion has first-party APIs to:

- Measure and fit text from data (`@remotion/layout-utils`)
- Load Google Fonts and local fonts (`@remotion/google-fonts`, `@remotion/fonts`)
- Lay out type with CSS in React (`AbsoluteFill`, `Sequence`, inline styles, CSS imports)
- Draw geometry as SVG (`@remotion/shapes`, `@remotion/paths`, native `<svg>`)
- Place still image files (`Img`, `staticFile()`, `public/`)
- Pass episode data in as JSON-serializable composition props
- Time scenes (`Sequence`, `Series`)
- Animate numbers and type from `useCurrentFrame()` (`interpolate()`, `spring()`)

Remotion does **not** ship a Card, CitationCard, NumberCard, or QuoteCard component. Cards are ordinary React trees. There is no first-party “draw this card in Figma / export PNG” pipeline.

Two different meanings of “still” appear in the docs:

1. **Still assets in a video** — PNG/JPEG/WebP/SVG files shown with `<Img>`.
2. **Still output** — `<Still>` compositions and `npx remotion still` / `renderStill()`, which write one frame to an image file.

(1) is how drawn card chrome would enter a composition. (2) is how a generated card could be exported as a PNG. Neither is a generate-vs-draw decision.

## 1. Fit and measure text — `@remotion/layout-utils`

Package: <https://www.remotion.dev/docs/layout-utils/>

Install: `npm i @remotion/layout-utils`. All of the functions below are documented as **browser-only** (not Node.js or Bun).

### `measureText()`

<https://www.remotion.dev/docs/layout-utils/measure-text>

Returns `{ height, width }` for a string given font CSS properties.

```ts
import {measureText} from '@remotion/layout-utils';

measureText({
  text: 'remotion',
  fontFamily: 'Arial',
  fontWeight: '500',
  fontSize: 12,
  letterSpacing: '1px',
}); // { height: 14, width: 20 }
```

Arguments documented: `text`, `fontFamily`, `fontSize` (number or string since v4.0.125), `fontWeight`, `letterSpacing`, `fontVariantNumeric`, `textTransform`, `validateFontIsLoaded?`, `additionalStyles?`. Results are cached on duplicate inputs.

### `fitText()` — available from v4.0.88

<https://www.remotion.dev/docs/layout-utils/fit-text>

Returns `{ fontSize }` (pixels) that fits `text` into `withinWidth`. Official example caps size with `Math.min(80, fitText(...).fontSize)` because the function itself has no max-size argument.

Arguments documented: `text`, `withinWidth`, `fontFamily`, `fontWeight?`, `letterSpacing?`, `fontVariantNumeric?`, `textTransform`, `validateFontIsLoaded?`, `additionalStyles?`.

The docs state the font must be loaded before calling. With `@remotion/google-fonts`, wait for `waitUntilDone()` first.

`withinWidth` note: the default Remotion stylesheet uses `box-sizing: border-box`, so borders shrink the box. Docs say subtract borders or use `outline` instead of `border`.

### `fitTextOnNLines()` — available from v4.0.313

<https://www.remotion.dev/docs/layout-utils/fit-text-on-n-lines>

Returns `{ fontSize, lines }` to fit text into `maxBoxWidth` with at most `maxLines`. Optional `maxFontSize` (default 2000). `lines` is `string[]` of how the text split at that size.

Same font-loaded / border / `validateFontIsLoaded` rules as `fitText()`.

### `fillTextBox()`

<https://www.remotion.dev/docs/layout-utils/fill-text-box>

Word-by-word overflow test. `fillTextBox({ maxLines, maxBoxWidth })` returns an object with `.add({ text, fontFamily, fontSize, ... })`. Each `add()` returns `{ exceedsBox, newLine }`. `fontSize` here is numbers only (px).

Use: decide whether a citation, quote, or limits list overflows a fixed box at a fixed size (as opposed to shrinking the size).

### Measurement constraints (all four)

From <https://www.remotion.dev/docs/layout-utils/best-practices>:

- Call only after the font is loaded. Official pattern: `waitUntilDone()` then measure, or a `WaitForFonts` HOC that mounts children only after fonts are ready. Google Font loading is already wrapped in `delayRender()`, so a second `delayRender()` is not required for the font fetch itself.
- `validateFontIsLoaded` defaults to `true` in Remotion 5.0 (was `false`). It re-measures with a fallback font and throws if the measurements match (assumes the real font never loaded). Pass `false` to disable.
- Match `fontFamily`, `fontSize`, `fontWeight`, `letterSpacing`, `fontVariantNumeric` between the measure call and the rendered node.
- Padding and `border` skew measurements. Docs: avoid padding; use `outline` instead of `border`.
- Internally the text is wrapped in a span with `display: inline-block` and `white-space: pre`. Markup must use those two properties to match.
- Server-side React render: call inside `useEffect`, not during the first render.

## 2. Fonts

### Google Fonts — `@remotion/google-fonts`

Overview: <https://www.remotion.dev/docs/fonts> (available from v3.2.40). Per-font `loadFont()`: <https://www.remotion.dev/docs/google-fonts/load-font>.

```ts
import {loadFont} from '@remotion/google-fonts/Lobster';

const {fontFamily, waitUntilDone, fonts, unicodeRanges} = loadFont('normal', {
  weights: ['400'],
  subsets: ['latin'],
});
```

Documented behavior:

- Import from `@remotion/google-fonts/<FontImportName>` (e.g. `Inter`, `TitanOne`, `Lobster`).
- Blocks the render until the font is ready.
- Returns `fontFamily` (CSS name), `fonts` (URL map by style/weight/subset), `unicodeRanges`, `waitUntilDone()`.
- Options: `weights`, `subsets`, `document?` (for injecting into an iframe), `ignoreTooManyRequestsWarning?` (warns if more than 20 network requests).
- Remotion 4.0: `loadFont()` with no args loads every style, weight, and subset — can timeout. Remotion 5.0: `weights` and `subsets` must be non-empty arrays or `loadFont()` throws. Same warning: <https://www.remotion.dev/docs/troubleshooting/font-loading-errors>, <https://www.remotion.dev/docs/5-0-migration>.
- Multiple styles: multiple `loadFont()` calls.
- Multiple fonts: load in one module; export `waitForFonts()`. Required before layout-utils if you measure.

Also documented:

- `getInfo()` per font — <https://www.remotion.dev/docs/google-fonts/get-info> — runtime metadata: `fontFamily`, `importName`, `version`, CSS URL, `unicodeRanges`, `fonts`, `subsets`.
- `getAvailableFonts()` — <https://www.remotion.dev/docs/google-fonts/get-available-fonts> — array of `{ fontFamily, importName, load }` for every bundled Google Font. `.load()` is ES-module only (from v3.3.64); CommonJS `require()` cannot lazy-load a font.
- `loadFontFromInfo()` — <https://www.remotion.dev/docs/google-fonts/load-font-from-info> — `import {loadFontFromInfo} from '@remotion/google-fonts/from-info'`. Same API as `loadFont()` plus a `getInfo()` JSON blob first, so metadata can live on a server. No autocomplete.

Google Fonts can also be loaded with a CSS `@import` of the Google CSS URL. From Remotion 2.2, Remotion waits until those fonts are loaded. <https://www.remotion.dev/docs/fonts>

### Local fonts — `@remotion/fonts` `loadFont()`

Available from v4.0.164. Docs: <https://www.remotion.dev/docs/fonts>, API: <https://www.remotion.dev/docs/fonts-api/load-font>.

```ts
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

loadFont({
  family: 'Inter',
  url: staticFile('Inter-Regular.woff2'),
  weight: '500',
});
```

This is a **different** `loadFont` from the Google Fonts one. It also blocks the render until ready. Options documented: `family`, `url` (`staticFile()` or remote URL), `format?` (`woff2` | `woff` | `opentype` | `truetype`), `weight?`, `style?`, `stretch?`, `display?`, `unicodeRange?`, `featureSettings?`, `ascentOverride?`, `descentOverride?`, `lineGapOverride?`.

Manual alternative: `new FontFace(...)` plus `delayRender()` / `continueRender()`. Same fonts page.

## 3. CSS layout

Remotion compositions are React. Type and cards are HTML/CSS.

### `AbsoluteFill`

<https://www.remotion.dev/docs/absolute-fill>

Absolutely positioned flex column filling the parent (`position: absolute; inset 0; width/height 100%; display: flex; flex-direction: column`). Forwards `div` props (`className`, `style`). Also inherits `Sequence` timing props (`from`, `durationInFrames`, `trimBefore`, `freeze`, `hidden`, `name`, `showInTimeline`). Later siblings paint on top (HTML stacking). Tailwind `flex-row` on `className` is detected from v4.0.249 so it can override the inline `flexDirection`.

Layering pattern: <https://www.remotion.dev/docs/layers> — nested `AbsoluteFill`s; later tree order is on top; `z-index` usually unnecessary. Video canvases have fixed pixel size, so `position: "absolute"` is expected.

### `Sequence`

<https://www.remotion.dev/docs/sequence>

Times a subtree. Default `layout` is `"absolute-fill"` (overlay). `layout="none"` opts out so CSS flow can be used. `from` shifts `useCurrentFrame()` for children. `durationInFrames` unmounts outside the window (default `Infinity`). `width` / `height` set CSS size **and** override `useVideoConfig()` for descendants (a component designed for 1920×1080 can be nested at another size). `freeze` freezes children at a frame. Crop props (`cropLeft` etc.) are ratios 0–1, `absolute-fill` only.

### `Series` / `Series.Sequence`

<https://www.remotion.dev/docs/series>

Stitches scenes sequentially. `Series` layout defaults to `"none"`. `Series.Sequence` layout defaults to `"absolute-fill"`. `offset` delays or overlaps the next scene. Documented as the way to concatenate components that each take their own props.

### CSS files and inline styles

<https://www.remotion.dev/docs/assets> — put `.css` next to source and `import './style.css'`. SASS/Tailwind need bundler overrides. Inline `style={{}}` is the documented layout style in almost every example.

Caption display docs also document CSS type treatments: `whiteSpace: 'pre'`, `WebkitTextStroke`, `paintOrder: 'stroke'`. <https://www.remotion.dev/docs/captions/displaying>

### Animation constraint on CSS

<https://www.remotion.dev/docs/animating-properties> and <https://www.remotion.dev/docs/troubleshooting/css-animations>: do **not** drive motion with CSS `animation`, `transition`, `@keyframes`, or `setTimeout`. Remotion renders frames independently (frame 30 may render before frame 10). Drive opacity, scale, position from `useCurrentFrame()` via `interpolate()` / `spring()`.

`@remotion/animation-utils` `interpolateStyles()` interpolates CSS style objects from a numeric driver: <https://www.remotion.dev/docs/animation-utils/interpolate-styles>.

## 4. SVG

Three first-party layers, plus native SVG:

### Native `<svg>` in JSX

Used in official examples (e.g. <https://www.remotion.dev/docs/client-side-rendering/limitations>). Standard React SVG. Text can live in `<text>` / `<tspan>`, or HTML can sit beside SVG chrome.

### `@remotion/shapes`

<https://www.remotion.dev/docs/shapes>

Package of SVG shape components and path generators. Documented examples:

- `<Rect width={200} height={200} fill="red" />` — <https://www.remotion.dev/docs/shapes/rect>
- `makeRect({ width, height })` → `{ path, width, height, transformOrigin }` — <https://www.remotion.dev/docs/shapes/make-rect>
- `makeCircle({ radius })` — <https://www.remotion.dev/docs/shapes/make-circle>
- `makeStar({ innerRadius, outerRadius, points })` — <https://www.remotion.dev/docs/shapes/make-star>

Shapes are documented as easy to animate and compatible with `@remotion/paths`.

### `@remotion/paths`

<https://www.remotion.dev/docs/paths>

SVG path string utilities (no Remotion runtime required). Documented functions include `evolvePath()`, `interpolatePath()`, `getLength()`, `cutPath()`, `reversePath()`, `normalizePath()`, `translatePath()`, `scalePath()`, `warpPath()`, `getBoundingBox()`, `parsePath()`, and others listed at <https://www.remotion.dev/docs/standalone>. `evolvePath(progress, path)` returns `strokeDasharray` / `strokeDashoffset` for draw-on effects: <https://www.remotion.dev/docs/paths/evolve-path>.

### `Interactive.Svg`

<https://www.remotion.dev/docs/interactive> — Studio-editable SVG wrappers (`Interactive.Svg`, `Interactive.Rect`, `Interactive.Text`, …) with fill/stroke controls. Render-time SVG does not require this. It is a Studio authoring surface, not a card renderer.

### Output scaling and SVG/text

<https://www.remotion.dev/docs/scaling> — `--scale` / `scale` option upscales **text, SVG, and images** (if the bitmap has enough pixels). Canvas/WebGL bitmaps do not upscale automatically. Max scale 16. Values below 1 are allowed.

## 5. Still images as assets (drawn cards)

### `public/` + `staticFile()` + `<Img>`

- Assets: <https://www.remotion.dev/docs/assets>
- `staticFile()`: <https://www.remotion.dev/docs/staticfile>
- `<Img>`: <https://www.remotion.dev/docs/img>
- Prefer Remotion tags: <https://www.remotion.dev/docs/use-img-and-iframe>

`public/` lives next to the `package.json` that depends on `remotion`. `staticFile('hi.png')` turns that file into a URL that works under subdirectory deploys (Lambda, Cloud Run, Player). Since v4.0 it `encodeURIComponent`s the path.

`<Img src={staticFile('hi.png')} />` waits until the image is loaded before painting the frame. Official rule: use `<Img>` (or `@remotion/gif` for GIFs) instead of native `<img>`, Next.js `<Image>`, or CSS `background-image`. Remote URLs are allowed. GIFs must use `@remotion/gif`, not `<Img>`.

`<Img>` also inherits `Sequence` timing (`from`, `durationInFrames`, …). `onError` must unmount or change `src` or the render times out. Default retries: 2 (from v3.3.82). Chrome max image resolution inherited: 2^29 pixels.

Alternative import: `import logo from './logo.png'` then `<Img src={logo} />`. Supported still extensions: `.png`, `.svg`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.bmp`. Docs now prefer `staticFile()`. Dynamic `require('img' + frame + '.png')` is documented as unreliable. Max bundled file size 2GB.

Image sequences: `staticFile(\`/frame${frame}.png\`)` with `useCurrentFrame()`.

`getStaticFiles()` lists `public/` (Studio + render only; empty elsewhere; first 10_000 files). Prefer `@remotion/studio`. <https://www.remotion.dev/docs/getstaticfiles>

Remotion has no `fs` access to arbitrary disk paths. Absolute paths outside `public/` are not bundled. <https://www.remotion.dev/docs/miscellaneous/absolute-paths>

Assets added to `public/` **after** `bundle()` are not in the bundle unless you copy them into the bundled `public/` when using SSR APIs.

## 6. Still images as output (not the same as drawn assets)

<https://www.remotion.dev/docs/stills>

- `<Still>` — single-frame `<Composition>`; no `fps` or `durationInFrames`. <https://www.remotion.dev/docs/still>
- CLI: `npx remotion still --props='{"custom": "data"}' my-comp out.png` — <https://www.remotion.dev/docs/cli/still>. Formats: `png` (default), `jpeg`, `webp`, `pdf`. `--frame` selects the frame (default 0). `--scale` applies.
- Node: `renderStill()` in `@remotion/renderer` — <https://www.remotion.dev/docs/renderer/render-still>. `imageFormat`: `png` | `jpeg` | `webp` | `pdf`. `inputProps` is a JSON object.
- Browser: `renderStillOnWeb()`.
- Lambda: `renderStillOnLambda()` / `npx remotion lambda still` (`pdf` not supported on Lambda).
- Cloud Run: `renderStillOnCloudRun()` / `npx remotion cloudrun still`.

Preview a still in a normal React app: `<Thumbnail>` from `@remotion/player`.

This path can snapshot a React-generated card to PNG. It is an export API, not a requirement to draw cards by hand.

## 7. Data in — composition props

<https://www.remotion.dev/docs/passing-props>

Cards generated from episode JSON use ordinary React props:

- Type the component `React.FC<Props>`.
- Register `defaultProps` on `<Composition>`.
- Override at render with `--props` JSON or a JSON file, or `inputProps` on `renderMedia()` / `renderStill()`. Input props must be a JSON-serializable object.
- The composition component receives those props directly. Root-level reads use `getInputProps()`.
- Zod schemas are documented for Studio type-safety: <https://www.remotion.dev/docs/schemas>.
- The same component can also be used as `<MyComponent propOne="hi" propTwo={10} />` inside a `Series`.

`useVideoConfig()` returns `width`, `height`, `fps`, `durationInFrames`, `id`, `defaultProps`, `props` (after transformations), plus codec/sample-rate defaults. <https://www.remotion.dev/docs/use-video-config>

Flagship 1920×1080 vs Shorts 1080×1920 is therefore `width`/`height` on `<Composition>` (or `calculateMetadata()`), readable at runtime via `useVideoConfig()`. A nested `Sequence` can override `width`/`height` for a child designed at a different size. Dual-format render hosts are a separate ticket.

## 8. Captions — `@remotion/captions` (cairnCaption)

Package from v4.0.216: <https://www.remotion.dev/docs/captions>, API: <https://www.remotion.dev/docs/captions/api>.

This package is subtitle utilities around a `Caption` token type (millisecond timings). Official sources that convert *into* `Caption[]` are Whisper / ElevenLabs transcription helpers. Display guide: <https://www.remotion.dev/docs/captions/displaying>.

Documented display path:

1. Load `Caption[]` (example: `fetch(staticFile('captions.json'))` behind `useDelayRender()`).
2. `createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds })` → `{ pages }` of `TikTokPage` (`text`, `startMs`, `durationMs` from v4.0.261, `tokens[]` with `text`/`fromMs`/`toMs`). <https://www.remotion.dev/docs/captions/create-tiktok-style-captions>
3. Map pages to `<Sequence from={startFrame} durationInFrames={...}>`. Convert ms → frames with `useVideoConfig().fps`.
4. Render tokens as `<span>`s; highlight by comparing `useCurrentFrame()` time to `fromMs`/`toMs`.

Whitespace: token `text` is delimiter-sensitive; include spaces (ideally before each word). Apply `white-space: pre` on the container.

The display guide explicitly recommends `fitText()` to scale caption type to video width, plus `interpolate()`/`spring()` for enter/exit, plus `WebkitTextStroke` for contrast.

Nothing in this package requires audio at display time. The *generation* helpers assume a transcript. Timed caption pages can also be authored as `Caption[]` or skipped in favor of plain React text inside `Sequence`s. There is no first-party “cairnCaption” component.

## 9. Numbers

No `NumberTicker` / `CountUp` package is documented on remotion.dev.

What exists:

- Render the number as text: `{value}` in JSX.
- `interpolate(frame, [0, 60], [0, 100], { extrapolateRight: 'clamp' })` maps frames to a numeric range. Display `Math.round(...)` if an integer is wanted. <https://www.remotion.dev/docs/interpolate>
- `spring({ frame, fps })` for motion of the numeral (scale/opacity), not for formatting. Needs `useVideoConfig().fps`. <https://www.remotion.dev/docs/spring>
- `fontVariantNumeric` is a first-class argument on `measureText` / `fitText` / `fitTextOnNLines` / `fillTextBox` (CSS `font-variant-numeric`: tabular nums, etc.).
- `fitText()` / `fitTextOnNLines()` scale a numeric string (and its unit, e.g. `"42%"`) into a box the same way as any other string.

## 10. Scene-type mapping (APIs only, no lock)

| Scene type | Generate-from-data APIs that exist | Draw-as-asset APIs that exist |
|---|---|---|
| `cairnCaption` | React text or `@remotion/captions` pages + `Sequence`; `fitText()`; Google/local fonts; CSS (`whiteSpace`, `WebkitTextStroke`); `useVideoConfig()` for width/fps | `<Img>` of a pre-rasterized caption plate is possible but not a caption API |
| `citeCard` | Props (`author`, `year`, `title`, …) + CSS/`AbsoluteFill` chrome + `fitText` / `fitTextOnNLines` / `fillTextBox` + fonts | PNG/SVG of the card via `staticFile` + `<Img>`; SVG chrome via `@remotion/shapes` or hand SVG |
| `namedFrame` | Name string prop + `fitText()` into a fixed name box; CSS/SVG frame | Drawn frame PNG/SVG as `<Img>` with HTML name on top, or fully rasterized |
| `quoteCard` | Quote string + `fitTextOnNLines` or `fillTextBox`; CSS quotes | Same as citeCard |
| `numberCard` | Number/unit as props; `interpolate()` for count-up; `fontVariantNumeric`; `fitText()` | Raster of the numeral; or SVG numeral |
| `limitsCard` | List fields as props; CSS flex/stack; `fillTextBox` for overflow | Raster of the whole limits plate |
| `endCard` | Same layout stack; optional `<Still>` if the end card is also exported as a thumbnail PNG | Drawn end-card PNG |

Hybrid that the docs also make possible (still not a lock): generate the card in React, `renderStill()` / `npx remotion still` it to PNG, then `<Img>` that PNG later.

## 11. Constraints that apply to every generated card

1. Layout-utils run in the browser only; fonts must be loaded first; Remotion 5 validates that by default.
2. Default `box-sizing: border-box` — borders eat width; use `outline` or subtract.
3. Measurement uses `white-space: pre` + `display: inline-block`.
4. Dual 16:9 / 9:16 is `useVideoConfig().width/height` (and optional `Sequence` width/height override), not a separate text API.
5. `--scale` / `scale` upscales text and SVG; it does not invent a second layout.
6. Motion must be frame-driven. CSS transitions on cards will flicker in render.
7. `<Img>` (not native `<img>` / `background-image`) for any drawn still, so the frame waits for decode.
8. Input props are JSON. Episode JSON can feed cards directly; it cannot carry functions or class instances.
9. There is no first-party citation formatter, hanging-indent helper, or APA/MLA component.

## Sources (fetched)

- https://www.remotion.dev/docs/layout-utils/
- https://www.remotion.dev/docs/layout-utils/measure-text
- https://www.remotion.dev/docs/layout-utils/fit-text
- https://www.remotion.dev/docs/layout-utils/fit-text-on-n-lines
- https://www.remotion.dev/docs/layout-utils/fill-text-box
- https://www.remotion.dev/docs/layout-utils/best-practices
- https://www.remotion.dev/docs/fonts
- https://www.remotion.dev/docs/google-fonts/load-font
- https://www.remotion.dev/docs/google-fonts/get-info
- https://www.remotion.dev/docs/google-fonts/get-available-fonts
- https://www.remotion.dev/docs/google-fonts/load-font-from-info
- https://www.remotion.dev/docs/fonts-api/load-font
- https://www.remotion.dev/docs/troubleshooting/font-loading-errors
- https://www.remotion.dev/docs/5-0-migration
- https://www.remotion.dev/docs/absolute-fill
- https://www.remotion.dev/docs/sequence
- https://www.remotion.dev/docs/series
- https://www.remotion.dev/docs/layers
- https://www.remotion.dev/docs/assets
- https://www.remotion.dev/docs/staticfile
- https://www.remotion.dev/docs/getstaticfiles
- https://www.remotion.dev/docs/img
- https://www.remotion.dev/docs/use-img-and-iframe
- https://www.remotion.dev/docs/stills
- https://www.remotion.dev/docs/still
- https://www.remotion.dev/docs/cli/still
- https://www.remotion.dev/docs/renderer/render-still
- https://www.remotion.dev/docs/lambda/renderstillonlambda
- https://www.remotion.dev/docs/use-video-config
- https://www.remotion.dev/docs/passing-props
- https://www.remotion.dev/docs/the-fundamentals/
- https://www.remotion.dev/docs/shapes
- https://www.remotion.dev/docs/shapes/rect
- https://www.remotion.dev/docs/shapes/make-rect
- https://www.remotion.dev/docs/shapes/make-circle
- https://www.remotion.dev/docs/shapes/make-star
- https://www.remotion.dev/docs/paths
- https://www.remotion.dev/docs/paths/evolve-path
- https://www.remotion.dev/docs/interactive
- https://www.remotion.dev/docs/captions
- https://www.remotion.dev/docs/captions/api
- https://www.remotion.dev/docs/captions/displaying
- https://www.remotion.dev/docs/captions/create-tiktok-style-captions
- https://www.remotion.dev/docs/interpolate
- https://www.remotion.dev/docs/spring
- https://www.remotion.dev/docs/animating-properties
- https://www.remotion.dev/docs/troubleshooting/css-animations
- https://www.remotion.dev/docs/animation-utils/interpolate-styles
- https://www.remotion.dev/docs/scaling
- https://www.remotion.dev/docs/miscellaneous/absolute-paths
- https://www.remotion.dev/docs/standalone
- https://www.remotion.dev/docs/client-side-rendering/limitations
