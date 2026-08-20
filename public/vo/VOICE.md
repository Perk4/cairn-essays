# Voice

Flagship lines are **Kokoro-82M**, voice `am_echo`, speed **1.25**, local, Apache-2.0.

- Not espeak
- Not ElevenLabs
- Not Qwen / Ryan
- Not macOS `say`

Config is `public/vo/voice.json`. Swap the voice field there. Do not hardcode the speaker in the cut.

```
npm run vo
```

Needs `/tmp/cairn-vo-venv` (or `CAIRN_VO_PYTHON`) plus `ffmpeg`.
