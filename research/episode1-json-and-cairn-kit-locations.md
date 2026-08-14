# Where Episode 1 JSON and the Cairn puppet kit live

Location report for [Where Episode 1 JSON and the Cairn puppet kit live](https://github.com/Perk4/cairn-essays/issues/6). Map: [Wayfinder: Cairn faceless YouTube factory (JSON in, Remotion out, ep 1 this week)](https://github.com/Perk4/cairn-essays/issues/1).

Searched 2026-08-14. No assets copied into this repo. No Perk4/lizzie product code imported. Factory not implemented.

## Answer

Neither artifact exists in the form the factory lock names.

1. **Episode JSON** using `cairnCaption`, `citeCard`, `namedFrame`, `quoteCard`, `numberCard`, `limitsCard`, `endCard` is **not found** in Perk4/cairn-essays, sibling public surfaces, Perk4 GitHub code search, or Google Drive.
2. **Puppet kit** files `still.png`, `listen.png`, `point.png`, and `idle.gif` are **not found** on those same surfaces.

What does exist is a **VO-era Episode 1 lock** (shot list + one essay still) on Google Drive, plus **landing-page Cairn art** on Perk4/lizzie-show. Those are not the Remotion JSON scene types and not the reusable still/listen/point/idle puppet.

## Location table

| Artifact | Status | Path / URL |
| --- | --- | --- |
| Episode JSON with `cairnCaption` / `citeCard` / `namedFrame` / `quoteCard` / `numberCard` / `limitsCard` / `endCard` | **Not found** | Absent from this working tree, Perk4/cairn-essays `main` (README only), Perk4 GitHub code search (`cairnCaption`, card type names, `"Find it or develop it"`, `Dweck`), and Drive `fullText contains 'cairnCaption'`. |
| Puppet kit `still.png` | **Not found** | No GitHub hit for `filename:still.png` under Perk4. Drive image search for titles containing `still` / `still.png` returned empty. No such file in lizzie-show `assets/`. Perk4/lizzie has no `assets/` or `public/` directory. |
| Puppet kit `listen.png` | **Not found** | No GitHub hit. Drive title search for `listen.png` / `listen` returned empty (no matching images). |
| Puppet kit `point.png` | **Not found** | No GitHub hit. Drive title search for `point.png` returned empty. |
| Puppet kit `idle.gif` | **Not found** | No GitHub hit for `filename:idle.gif`. Drive title search found only unrelated `car idle.m4a` and a 2022 “meme GIF” folder. |
| Locked paper / title (O’Keefe, Dweck & Walton 2018, “Find it or develop it.”) | **Found (prose lock, not JSON)** | Google Drive: [ep1-shot-list.txt](https://drive.google.com/file/d/1AQT6kT-YKtnHN4ni5UwSAZXtYLxMuDZ0/view) in folder [Episode 1](https://drive.google.com/drive/folders/18K46_5q6Q2Nvu7vEqoLYbQz6n62BMI3I). Also named as a lock on cairn-essays issues 1 and 6, and on the lizzie-ops-board. |
| Reusable Cairn puppet (still / listen / point / idle) | **Not found** | Ops board says Design is on “Cairn kit only”; the four named files are not in git or Drive under those names. |

## Near-misses (do not treat as the asked artifacts)

These are real files. They are **not** the locked Remotion JSON and **not** the puppet acting kit.

| What | Why it is a miss | Path / URL |
| --- | --- | --- |
| Episode 1 shot list (VO + four *essay* stills + overlay cards) | Locked 2026-08-13 for a spoken-VO cut. Names cards as prose overlays, not `cairnCaption` JSON types. Points at `episode-1-vo.md` “in this folder” (file not present) and `/workspace/lizzie-concepts/episode-1-script.md` (no Perk4 repo named `lizzie-concepts`). | [Drive Episode 1](https://drive.google.com/drive/folders/18K46_5q6Q2Nvu7vEqoLYbQz6n62BMI3I) / [ep1-shot-list.txt](https://drive.google.com/file/d/1AQT6kT-YKtnHN4ni5UwSAZXtYLxMuDZ0/view) |
| Essay still 1 (find vs develop) | One illustrated beat (`ep1-01-find-vs-develop-v2.png`), not a puppet pose. Shot list also names stills 2–4; those PNGs were not in Drive. Ops board: “Stills 2–4 on Drive can wait.” | [Drive Cairn folder](https://drive.google.com/drive/folders/1a9HA8vc_91lfCBz3czlZ9xcY1m73nG7b) / [ep1-01-find-vs-develop-v2.png](https://drive.google.com/file/d/1cJgaW6I1S1tdjP57dET-gFMg-AQCA5BB/view) |
| `cairn.svg` | Vector drawing, not still/listen/point/idle. | [Drive Cairn / cairn.svg](https://drive.google.com/file/d/1szCMtPElGreu1js-2PIMnszW-w0fOelr/view) |
| lizzie-show landing art | Marketing stills and OG GIFs (front, three-quarter, cutout, wave, whatsgood). Named `01-hero-front.png`, `02-cairn-transparent.png`, `03-three-quarter.png`, `cairn-wave-*.gif`, `cairn-whatsgood-og-v3-1200x630.gif` — not the puppet grammar. README: “Not a YouTube show.” | https://github.com/Perk4/lizzie-show/tree/main/assets · live https://lizzie-show.pages.dev/assets/ |
| satin-shield `episode.json` | Different show. Affiliate SKU concat (`intro` / `skus` / `outro` / VO wavs). No cairn card types. Map already puts this pipeline analog in fog, not as episode 1 JSON. | https://github.com/Perk4/satin-shield/blob/main/episodes/001/episode.json · schema https://github.com/Perk4/satin-shield/blob/main/schema/episode.schema.json |
| video-content-hub | Generic upload/tag hub. Root `theme.json` is UI theme. `uploads/frames/45/` is extracted video frames, not Cairn. | https://github.com/Perk4/video-content-hub |
| Perk4/lizzie character | App island UI. Character is a CSS/emoji placeholder in `index.html`, not PNG/GIF kit. No `assets/` or `public/`. Do not import. | https://github.com/Perk4/lizzie (private) |
| lizzie-island-spike | Inline SVG cairn in `index.html`. Archived. Not a puppet kit. | https://github.com/Perk4/lizzie-island-spike/blob/main/index.html |

## Surfaces opened

### This working tree (Perk4/cairn-essays)

- `/workspace/README.md` — scaffold only: “Scaffold incoming.”
- Recursive glob / grep for `cairnCaption`, card type names, `still.png`, `listen.png`, `point.png`, `idle.gif` — no matches (untracked `.agents/` and `skills-lock.json` ignored for this report).
- GitHub `main` listing: `README.md` only (`d493eb7`).

### Sibling public git

Opened via GitHub `get_file_contents` / recursive tree:

- **Perk4/lizzie-show** — `README.md`, `index.html`, `assets/` (full file list above). Live: https://lizzie-show.pages.dev
- **Perk4/video-content-hub** — `README.md`, repo root, `uploads/`, `uploads/frames/`, `client/`
- **Perk4/lizzie-ops-board** — `index.html` (ops snapshot: factory week 1, Design on Cairn kit, Episode 1 package described as VO + four stills + shot list)
- **Perk4/lizzie-island-spike** — `README.md`, `index.html`

### Other Perk4 git (filename hunt only; no product code copied)

- **Perk4/lizzie** (private) — root, `src/`, `src/client/`, `src/first-playable/`, `docs/`, `.scratch/`, `README.md`, `CONTEXT.md`, `index.html`. Confirmed missing `assets/` and `public/`. GitHub `git/trees` recursive via `gh` returned 404 for this private repo; directory listings via MCP succeeded.
- **Perk4/satin-shield** (private) — root, `episodes/`, `episodes/001/episode.json`, `schema/episode.schema.json`

GitHub `search_code` (Perk4 / user:Perk4): `cairnCaption`, `citeCard`, `namedFrame`, `quoteCard`, `numberCard`, `limitsCard`, `endCard`, `Dweck`, `"Find it or develop it"`, `filename:still.png`, `filename:listen.png`, `filename:point.png`, `filename:idle.gif` — all `total_count: 0`. Repo search for Remotion: only **Perk4/cairn-essays**. No repo named `lizzie-concepts`.

### Google Drive (authenticated)

MCP `search_files` / `list_recent_files` / `get_file_metadata` succeeded.

- Parent: [Lizzie](https://drive.google.com/drive/folders/1Re_HfzQpDw3VOmMZi_sH2sDpyXUfekuJ)
  - [Cairn](https://drive.google.com/drive/folders/1a9HA8vc_91lfCBz3czlZ9xcY1m73nG7b) — `cairn.svg`, `ep1-01-find-vs-develop-v2.png`
  - [Episode 1](https://drive.google.com/drive/folders/18K46_5q6Q2Nvu7vEqoLYbQz6n62BMI3I) — `ep1-shot-list.txt` only
  - Island spike folder (not opened beyond listing the parent)
- Title searches: `still.png`, `listen.png`, `point.png`, `idle.gif`, `episode-1`, `lizzie-concepts`, `find-vs-develop` / `eggs-hard` / `finish-the-session` (only the v2 still 1 PNG).
- `mimeType = 'application/json'` — Stable Diffusion UI configs, NewsOS OpenAPI, notebooks; **no episode JSON**.
- `fullText contains 'Dweck'` — the shot list (plus an unrelated 2015 PDF).

## Implication for blocked tickets

- [Episode JSON home and authorship](https://github.com/Perk4/cairn-essays/issues/16) starts from **absence**: the factory JSON has not been authored into git or Drive yet. Closest source text is the Drive shot list (VO-era, different grammar than the caption-led lock on this map).
- [Puppet acting grammar (still / listen / point / idle)](https://github.com/Perk4/cairn-essays/issues/15) starts from **absence** of those four files. Closest drawings are lizzie-show front/three-quarter/cutout plus Drive `cairn.svg`. Ops still assigns Design the kit; it is not checked in.
