# Remotion render hosts for dual 16:9 and 9:16

Facts only. Does not lock a pipeline. Pipeline lock belongs on [Render pipeline shape](https://github.com/Perk4/cairn-essays/issues/10).

**Repo state:** Perk4/cairn-essays is README-only. No Remotion project, compositions, or render scripts exist yet. Destination (from the map, not this ticket): episode JSON in, two outputs — 1920×1080 flagship and 1080×1920 Shorts.

**Scope of this note:** first-party Remotion hosts plus the GitHub Actions path Remotion documents. Product facts from [remotion.dev](https://www.remotion.dev) pages fetched for this note. GitHub Actions facts from GitHub docs when GHA is mentioned.

---

## Dual-composition model (all hosts)

A composition is a React component plus `id`, `width`, `height`, `fps`, `durationInFrames`. Multiple compositions register in one root by wrapping them in a fragment. Official example uses `width={1920}` `height={1080}` for a single composition; additional compositions are the documented way to register more renderables.

Sources: [The fundamentals](https://www.remotion.dev/docs/the-fundamentals), [`<Composition>`](https://www.remotion.dev/docs/composition).

For two aspect ratios, first-party pattern is two composition IDs with different `width`/`height`, not one render that emits two files. Each render command takes **one** composition ID.

CLI shape (local, Docker, GitHub Actions — same command):

```bash
npx remotion render <entry-point|serve-url>? <composition-id> <output-location>
```

If `composition-id` is omitted, the CLI prompts. If `output-location` is omitted, output goes under `out/`. Default codec is H.264 (`h264`) → typically `.mp4`. `--props` accepts inline JSON or a JSON file path.

Sources: [`npx remotion render`](https://www.remotion.dev/docs/cli/render), [Passing props](https://www.remotion.dev/docs/passing-props).

`--width` and `--height` exist on local CLI and Lambda CLI and override composition dimensions at render time. That is an override, not a second artifact from one invocation.

Combining two compositions into **one** timeline (`<Series>`) is a different FAQ ([How do I combine compositions?](https://www.remotion.dev/docs/miscellaneous/snippets/combine-compositions)). That concatenates scenes into a single composition ID. Dual 16:9 + 9:16 outputs are two renders, not a Series merge.

**Dual invocation (any host):** two commands, two composition IDs, two output paths. Same `--props` / episode JSON can be passed to both. Hosts do not fan out one call into two aspect ratios.

List IDs:

- Local: `npx remotion compositions`
- Lambda: `npx remotion lambda compositions <serve-url>` (use this if the machine cannot run Chrome)

Sources: [CLI compositions](https://www.remotion.dev/docs/cli/compositions), [Lambda compositions](https://www.remotion.dev/docs/lambda/cli/compositions).

---

## Chrome / headless (shared)

Remotion installs **Chrome Headless Shell** into `node_modules/.remotion/chrome-headless-shell/`. Ensure with `npx remotion browser ensure` or `ensureBrowser()`. Linux needs shared libraries ([Linux dependencies](https://www.remotion.dev/docs/miscellaneous/linux-dependencies)). Alpine and nixOS are not supported for that Chrome/FFmpeg shipping model.

**Chrome for Testing** is the GPU path (`--chrome-mode="chrome-for-testing"`). Docs say use it only for GPU-accelerated Linux. **Not applicable on Lambda or Cloud Run.**

On Lambda and Cloud Run, Chrome is already in the runtime; no local browser install.

Best-practice bullets from the same page: Remotion ≥ v4.0.208 so it does not pick up an external browser; do not install Chrome in a Dockerfile (do install Linux libs); do not override with an incompatible `--browser-executable`.

Source: [Chrome Headless Shell](https://www.remotion.dev/docs/miscellaneous/chrome-headless-shell).

---

## Options table

| Host | First-party surface | Chrome / headless | Time / cost shape (docs, not this repo) | Artifacts | Dual 16:9 + 9:16 |
| --- | --- | --- | --- | --- | --- |
| Local CLI | `npx remotion render <id> <out>` after a Remotion project exists | Chrome Headless Shell in `node_modules`; Linux libs if Linux | Wall-clock on one machine; no Remotion cloud bill; company cloud-rendering license N/A for local | File at `<output-location>` or `out/`; default H.264 | Two CLI invocations, two IDs, two paths |
| GitHub Actions | Remotion documents `workflow_dispatch` + `npx remotion render` + `actions/upload-artifact@v4` | Same as local CLI on `ubuntu-latest`. Remotion’s sample does not `apt install` extra libs | Public repos: standard hosted runners free. Private: plan minutes + artifact storage. Hosted job cap **6 hours**. `ubuntu-latest`: public 4 CPU / 16 GB; private 2 CPU / 8 GB | Workflow artifacts; default retention **90 days** (org can set 1–90 public, 1–400 private) | Two `render` steps (or two jobs) + two `upload-artifact` names |
| Remotion Lambda (`@remotion/lambda`) | IAM + `lambda functions deploy` + `lambda sites create` + `lambda render <serve-url> <id>` | Chromium **layer hosted by Remotion**; Chrome for Testing N/A | Distributed chunks; pay while rendering. Docs: “multiple minutes of video for just a few pennies”; Hello World ~$0.001 / ~8–11s; 1 min in-bucket video ~$0.017–$0.021 / ~16–19s; plus S3, egress, CloudWatch, possible Remotion company license | Default: S3 object (`out.mp4` unless `--out-name`); optional download to local path; `privacy` public/private/no-acl | Two `lambda render` calls (or two `renderMediaOnLambda()`); same site/serve URL, different composition IDs |
| Cloud Run (`@remotion/cloudrun`) | **Alpha, not actively developed.** GCP project + installer + `cloudrun services deploy` + `cloudrun sites create` + `cloudrun render` | Chrome in Cloud Run image; Chrome for Testing N/A | Single instance (no distributed rendering). Docs: cheaper compute than Lambda because of that; still “a few pennies” for minutes of video; idle instances not billed if `minInstances` 0. Service timeout default **300s**, Cloud Run max **60 min**, up to 32 GB / 8 vCPU | Cloud Storage `gs://{bucket}/renders/{render-id}/{file-name}`; optional local download | Two `cloudrun render` calls; same site, different IDs; need `--cloud-run-url` or `--service-name` + `--region` |
| Node/Bun `@remotion/renderer` | `bundle()` + `selectComposition({ id })` + `renderMedia()` | Same Chrome Headless Shell as CLI; Docker recipe: Debian + Linux libs + `npx remotion browser ensure` | One machine; you own queue, spikes, progress, logs, provisioning. Compare-SSR: cheapest compute if the server stays busy, you also pay idle | `outputLocation` you choose (Docker example: `out/${composition.id}.mp4`) | Two `selectComposition` + `renderMedia` calls (or two CLI renders inside the image) |
| Vercel Sandbox (`@remotion/vercel`) | Vercel account + Blob store; `npx create-video@latest --template vercel`; `renderMediaOnVercel({ compositionId })` | Sandbox image includes Chrome and FFmpeg; cold start “a few seconds” | Single VM, slower than Lambda. Hobby timeout 45 min / 10 concurrent; Pro 5 h / 2000 concurrent. Functions 800s unless `detached: true` | Vercel Blob (`vercelBlob` token); snapshots/videos persist until deleted | Two `renderMediaOnVercel` calls with two `compositionId`s |
| Docker (wraps CLI or renderer) | Official Dockerfile: `node:22-bookworm-slim` + libs + `npx remotion browser ensure` | Headless Shell inside image; do not apt-install Chrome | Whatever runs the container (local, GHA, Cloud Run DIY, etc.) | Whatever the CMD writes | Two renders in the container or two containers |

**Also documented, not separate products:** [Azure Container Apps](https://www.remotion.dev/docs/azure-container-apps) (community guide, Remotion team has not tested; uses Node APIs + Docker). [Cloudflare Containers](https://www.remotion.dev/docs/cloudflare-containers) (beta platform; official demo is a proof of concept: no auth/queue, R2 with random names, no progress/errors to client).

**SSR comparison overall recommendation:** Lambda for most people (speed, setup, maturity, total cost, scale). Vercel Sandbox if already on Vercel and simplest setup. Highest-volume Remotion customers use Lambda. Cloud Run is Alpha; Remotion is considering porting the Lambda runtime to Cloud Run and is only making essential Cloud Run changes now.

Source: [Comparison of SSR options](https://www.remotion.dev/docs/compare-ssr).

---

## Local CLI

**Setup:** Remotion project with `registerRoot()` / compositions. No extra Remotion cloud package. Command: `npx remotion render` ([docs](https://www.remotion.dev/docs/cli/render)).

**Chrome:** Headless Shell auto-install; `npx remotion browser ensure` for SSR-like machines; Linux shared libs.

**Time/cost:** Single-machine encode. No AWS/GCP/Vercel render bill. Remotion company license is required for teams of 4+ using cloud rendering; local CLI is not a cloud host.

**Artifacts:** Path you pass, or `out/`. Codecs include `h264` (default), `h265`, `av1` (not on Linux ARM64 GNU), `vp8`/`vp9`, `prores`, audio-only, `png` sequence via `--sequence`. `--overwrite` defaults on.

**Dual:**

```bash
npx remotion render src/index.ts Flagship out/flagship.mp4 --props=./episode.json
npx remotion render src/index.ts Shorts out/shorts.mp4 --props=./episode.json
```

IDs above are placeholders; this repo has none yet.

Stills: `npx remotion still` — one frame, one composition ([docs](https://www.remotion.dev/docs/cli/still)).

---

## GitHub Actions

Remotion’s first-party GHA path is the local CLI on a hosted runner ([Server-side rendering](https://www.remotion.dev/docs/ssr#render-using-github-actions)).

Documented workflow (one composition `MyComp`):

```yaml
name: Render video
on:
  workflow_dispatch:
jobs:
  render:
    name: Render video
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@main
      - uses: actions/setup-node@main
      - run: npm i
      - run: npx remotion render MyComp out/video.mp4
      - uses: actions/upload-artifact@v4
        with:
          name: out.mp4
          path: out/video.mp4
```

Props: `workflow_dispatch.inputs` → write `input-props.json` → `--props="./input-props.json"`. Inputs must be wired to match prop shape ([Passing input props in GitHub Actions](https://www.remotion.dev/docs/passing-props#passing-input-props-in-github-actions)).

Remotion: “running the workflow may incur costs. However, the workflow will only run if you actively trigger it.”

**Chrome:** Same Headless Shell as CLI. Sample YAML does not install extra apt packages.

**GHA limits / cost (GitHub docs, not Remotion):**

- Standard hosted runners **free and unlimited on public repos**; private repos consume plan minutes then per-minute billing. Linux 2-core x64 baseline **$0.006/min** after quota.
- Included minutes (private): Free 2,000; Pro 3,000; Team 3,000; Enterprise 50,000. Artifact storage shared with Packages: Free 500 MB; Pro 1 GB; Team 2 GB; Enterprise 50 GB. Overage artifacts **$0.25/GB-month**.
- Hosted job execution time: **6 hours** then fail.
- `ubuntu-latest`: public **4 CPU / 16 GB / 14 GB SSD**; private **2 CPU / 8 GB / 14 GB SSD**.
- Artifacts persist after the run; default retention **90 days**. Per-artifact `retention-days` cannot exceed repo/org/enterprise max (public 1–90, private 1–400). Deleting a workflow run deletes its artifacts.

Sources: [GitHub-hosted runners reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners), [Actions limits](https://docs.github.com/en/actions/reference/limits), [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [Workflow artifacts](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts), [Store and share data](https://docs.github.com/en/actions/tutorials/store-and-share-data).

**Dual:** two `npx remotion render` steps with different IDs and paths; two `upload-artifact` steps with distinct `name`s. Sequential in one job or parallel jobs (`ubuntu-latest` twice). Matrix is possible under GHA’s 256-jobs-per-run cap; Remotion does not document a matrix.

---

## Remotion Lambda

Package `@remotion/lambda`. Docs call it the fastest/most scalable cloud option; pay only while rendering.

**When to use (docs):** videos less than ~80 minutes at Full HD (until ~15 min AWS timeout); stay within Lambda concurrency (default 1000/region, new accounts can be as low as 10); supported AWS regions. Otherwise SSR or Cloud Run.

**How it works:** deploy one Lambda (Chromium layer hosted by Remotion) + S3 bucket; deploy project as a site (serve URL); invoke; spawn parallel functions per chunk; main function concatenates; upload to S3.

Sources: [Lambda overview](https://www.remotion.dev/docs/lambda), [How Remotion Lambda works](https://www.remotion.dev/docs/lambda/how-lambda-works).

**Setup surface:** AWS account; IAM role named exactly `remotion-lambda-role` with policy `remotion-lambda-policy`; IAM user + access keys in `.env` as `REMOTION_AWS_ACCESS_KEY_ID` / `REMOTION_AWS_SECRET_ACCESS_KEY`; `npx remotion add @remotion/lambda`; `npx remotion lambda functions deploy`; `npx remotion lambda sites create <entry> --site-name=…`; `npx remotion lambda quotas`; `npx remotion lambda render <serve-url> <composition-id>`. Function is bound to Remotion version (upgrade → new function). Site is the project bundle (code change → redeploy site). Node API: `renderMediaOnLambda()` + `getRenderProgress()`.

Source: [Lambda setup](https://www.remotion.dev/docs/lambda/setup).

**Limits:** ≤10 GB function storage → output ~5 GB max (~2 h Full HD). ≤200 functions per render. AV1 not on Lambda. No GPU. Apple emoji is a Lambda-only feature vs Cloud Run (runtime preference `apple-emojis` vs `cjk`).

**Concurrency:** `framesPerLambda` or `--concurrency` (max 200). Default interpolates toward 75–150 concurrency with ≥20 frames/lambda.

Source: [Concurrency](https://www.remotion.dev/docs/lambda/concurrency).

**Time/cost examples** (2048 MB RAM, 10 GB disk from Remotion 5.0, default concurrency, `us-east-1`, Remotion 4.0.381) — [cost example](https://www.remotion.dev/docs/lambda/cost-example):

| Workload | Warm | Cold |
| --- | --- | --- |
| Hello World template | $0.001, 7.56s | $0.001, 11.02s |
| 1 min video already in same S3 bucket | $0.017, 18.91s | $0.021, 15.52s |
| 10 min remote HD | $0.103, 56.09s | $0.108, 60.98s |
| 10 s remote 4K | $0.013, 45.28s | $0.014, 53.09s |

These are **not** measurements of Cairn compositions (none exist). Extra: S3 storage, HTTP asset egress, CloudWatch (default 14-day log retention on function deploy). Each render prints an estimate. Teams of 4+ also need a Remotion company license / Cloud Rendering Units ([License](https://www.remotion.dev/docs/lambda#license)).

Function deploy: default memory 2048 MB; disk 10240 MB from Remotion 5.0 (2048 MB before); timeout default is the CLI’s documented function timeout (page embeds a default component; AWS Lambda max is the ~15 min figure on the overview). `--timeout` on **render** is `delayRender()` (default 30000 ms), not the function timeout.

Source: [lambda functions deploy](https://www.remotion.dev/docs/lambda/cli/functions/deploy).

**Artifacts:** S3; optional third argument downloads locally. `--out-name` (default `out` + extension). `--privacy=public|private|no-acl`. `--delete-after` for expiration (Lambda feature Cloud Run lacks). Custom destination: S3-compatible (e.g. R2) via `--s3-output-provider-endpoint`. Webhooks on finish/fail.

Source: [npx remotion lambda render](https://www.remotion.dev/docs/lambda/cli/render).

**Dual:**

```bash
npx remotion lambda render <serve-url> Flagship out/flagship.mp4 --props=./episode.json
npx remotion lambda render <serve-url> Shorts out/shorts.mp4 --props=./episode.json
```

Same serve URL (one site deploy). Two renders. Parallelism is two orchestrations (each may spawn up to 200 workers). Watch account concurrency (new accounts at 10 cannot run two 200-wide renders).

---

## Cloud Run (`@remotion/cloudrun`)

**Status:** Alpha; not actively developed. Plan: port Lambda runtime to Cloud Run rather than keep a separate implementation. Docker-image-per-change slows testing; essential fixes only.

Sources: [Cloud Run overview](https://www.remotion.dev/docs/cloudrun), [compare-ssr](https://www.remotion.dev/docs/compare-ssr), [SSR](https://www.remotion.dev/docs/ssr).

**How it works:** Remotion publishes a public GCP Artifact Registry image per Remotion version. You deploy a Cloud Run **service** + Cloud Storage **bucket**; deploy site; invoke **one** service that renders the whole video (no chunk parallelism); upload to GCS.

**Setup:** GCP project + billing; Cloud Shell installer tarball; copy `.env`; `npx remotion add @remotion/cloudrun`; `npx remotion cloudrun permissions`; `npx remotion cloudrun services deploy`; `npx remotion cloudrun sites create <entry> --site-name=…`; `npx remotion cloudrun render <serve-url|site-name> <composition-id> --cloud-run-url=…` (or `--service-name` + `--region`).

Source: [Cloud Run setup](https://www.remotion.dev/docs/cloudrun/setup).

**Quotas (Remotion page; values from Cloud Run):** max memory 32 GB; max 8 vCPUs; max writable in-memory FS 32 GB; max timeout 60 minutes.

**Service deploy defaults:** memory 2 GB; CPU 1.0; timeout **300 seconds**; `minInstances` 0 (no idle bill); `maxInstances` 5 from Remotion 5.0 (100 before). `--onlyAllocateCpuDuringRequestProcessing` sets `cpu_idle` to save cost.

Source: [cloudrun services deploy](https://www.remotion.dev/docs/cloudrun/cli/services/deploy).

**Time/cost:** “Most of our users render multiple minutes of video for just a few pennies.” Compare-SSR: Cloud Run cheaper than Lambda because no distributed overhead; no charge while idle. No first-party cost table like Lambda’s Hello World numbers. GPU on Cloud Run: not tested by Remotion.

**Artifacts:** GCS; optional local path. Default object name `out` + extension. `--privacy=public|private`. Path shape `gs://{bucket-name}/renders/{render-id}/{file-name}`. `--frames` comma-separated selections are **local CLI only**.

Source: [npx remotion cloudrun render](https://www.remotion.dev/docs/cloudrun/cli/render).

**Lambda features Cloud Run lacks (compare-ssr):** distributed rendering, webhooks (Cloud Run CLI does have a `--webhook` progress POST — different from Lambda’s finish/fail webhook), Apple emoji, cost estimation, renders with expiration, PHP/Go/Python SDKs.

**Dual:** two `npx remotion cloudrun render` (or `renderMediaOnCloudrun`) with two IDs. One service can run both sequentially; parallel would be two invocations against `maxInstances`.

---

## Node/Bun renderer, Docker, Vercel, other guides

### `@remotion/renderer`

Used internally by CLI and Lambda. `renderMedia()` preferred over `renderFrames()` + stitch. Config file has **no effect** on these APIs. You supply queueing, burst handling, progress, logging, machines.

Sources: [@remotion/renderer](https://www.remotion.dev/docs/renderer), [SSR](https://www.remotion.dev/docs/ssr), [compare-ssr](https://www.remotion.dev/docs/compare-ssr).

Dual: `selectComposition({ id: 'Flagship', inputProps })` then `renderMedia({ outputLocation, inputProps, codec: 'h264' })`; repeat for Shorts. Pass `inputProps` to both `selectComposition` and `renderMedia`.

### Docker

Official recipe: `FROM node:22-bookworm-slim`, apt Linux libs, copy project, `npm i`, `npx remotion browser ensure`, run `render.mjs` (`bundle` + `selectComposition` + `renderMedia`, `enableMultiProcessOnLinux: true` from v4.0.42). Do not pin Debian packages (old versions vanish). Do not use Alpine (Rust startup >10s; Chrome package unpinning). Emoji/CJK: optional `fonts-noto-color-emoji` / `fonts-noto-cjk`. Docker Desktop CPU limits apply unless `--cpus` is set.

Source: [Dockerizing a Remotion app](https://www.remotion.dev/docs/docker).

### Vercel Sandbox

Easiest SSR if already on Vercel: one account + Blob; push to deploy. `@remotion/vercel`: `createSandbox`, `addBundleToSandbox`, `renderMediaOnVercel({ compositionId, inputProps, detached, vercelBlob })`, `getRenderProgress`. Single machine; sandbox includes Chrome + FFmpeg; startup a few seconds. Hobby: 45 min / 10 concurrent sandboxes. Pro/Enterprise: 5 h / 2000. Function 800s unless detached. No GPU. Template does not include rate limiting or caching; Blob data persists until deleted.

Source: [Rendering with Vercel Sandbox](https://www.remotion.dev/docs/vercel-sandbox).

### Azure Container Apps / Cloudflare Containers

Walkthroughs that wrap the Node/Docker APIs. Azure guide is **community-contributed, untested by Remotion**. Cloudflare Containers demo is **not production-ready**.

---

## Dual-composition invocation (summary)

| Host | Two outputs |
| --- | --- |
| Local / GHA / Docker CLI | Two `npx remotion render <id> <path> [--props=…]` |
| Lambda CLI | Two `npx remotion lambda render <serve-url> <id> [path] [--props=…]` after one `sites create` |
| Cloud Run CLI | Two `npx remotion cloudrun render <serve-url> <id> --service-name=… --region=… [--props=…]` |
| Node APIs | Two `selectComposition` + `renderMedia` (or Lambda/Cloud Run/Vercel equivalents) with different `id` / `composition` |
| Dimension override | `--width` / `--height` on local and Lambda render CLIs can override metadata; still one file per invocation |

Props: JSON-serializable object; CLI `--props` file or JSON; GHA `workflow_dispatch` inputs written to a file. Same episode JSON can be passed to both IDs.

There is no first-party “render all compositions” or “emit 16:9 and 9:16 from one call.”

---

## What this note does not decide

- Which host Cairn uses for episode 1 or later.
- Whether flagship and Shorts share a component with `--width`/`--height` overrides or are two `<Composition>`s.
- CI trigger (manual `workflow_dispatch` vs push vs calling Lambda from GHA).
- Codec, bitrate, privacy, retention.
- YouTube upload.

Those belong on **Render pipeline shape**.

---

## Sources fetched

Remotion:

- https://www.remotion.dev/docs/compare-ssr
- https://www.remotion.dev/docs/ssr
- https://www.remotion.dev/docs/lambda
- https://www.remotion.dev/docs/lambda/setup
- https://www.remotion.dev/docs/lambda/cli/render
- https://www.remotion.dev/docs/lambda/cli/compositions
- https://www.remotion.dev/docs/lambda/cli/functions/deploy
- https://www.remotion.dev/docs/lambda/how-lambda-works
- https://www.remotion.dev/docs/lambda/concurrency
- https://www.remotion.dev/docs/lambda/cost-example
- https://www.remotion.dev/docs/cloudrun
- https://www.remotion.dev/docs/cloudrun/setup
- https://www.remotion.dev/docs/cloudrun/cli/render
- https://www.remotion.dev/docs/cloudrun/cli/services/deploy
- https://www.remotion.dev/docs/cli/render
- https://www.remotion.dev/docs/cli/still
- https://www.remotion.dev/docs/cli/compositions
- https://www.remotion.dev/docs/composition
- https://www.remotion.dev/docs/the-fundamentals
- https://www.remotion.dev/docs/passing-props
- https://www.remotion.dev/docs/miscellaneous/chrome-headless-shell
- https://www.remotion.dev/docs/miscellaneous/linux-dependencies
- https://www.remotion.dev/docs/miscellaneous/snippets/combine-compositions
- https://www.remotion.dev/docs/docker
- https://www.remotion.dev/docs/renderer
- https://www.remotion.dev/docs/vercel-sandbox
- https://www.remotion.dev/docs/azure-container-apps
- https://www.remotion.dev/docs/cloudflare-containers

GitHub Actions:

- https://docs.github.com/en/actions/reference/runners/github-hosted-runners
- https://docs.github.com/en/actions/reference/limits
- https://docs.github.com/en/billing/concepts/product-billing/github-actions
- https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts
- https://docs.github.com/en/actions/tutorials/store-and-share-data
- https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization
