# cairn-essays

Remotion factory for Cairn essays. Episode 1 is **You booked it like a standup**. Talking-kit stills. Spoken track. Captions support the line. They are not the show.

Takeaway: Book the passion like a job and your brain clocks in.

## Voice

Kokoro-82M, voice `am_echo`, speed 1.25, local, Apache. Dry. No music.

See `public/vo/VOICE.md`. `npm run vo` writes the takes.

## Install

```
npm i
```

## Render

```
python3 scripts/draw-ep01-stills.py
npm run vo
npm run render
node scripts/make-review-kit.mjs
```

Writes:

- `out/ep01.mp4` — 1920×1080 flagship, stills in `public/ep01-stills/`, Kokoro on every line, dry
- `out/ep01-hook.mp4` — 1080×1920 Short, book-it then delete-the-square
- `review/` — 60–150s beat chunks, seams reel, contact sheet, full VO wav, timestamped transcript

Studio: `npm run dev`.

## Picture

Named still on the named line. New picture at least every 4s. Cairn walks, sits, walks past. Thursday sit is sitting. Delete shows the yellow square gone.
