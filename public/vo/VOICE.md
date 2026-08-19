# Voice

This acting cut uses **placeholder espeak-ng** when the local Ryan venv is missing. Labeled not Perk. Not a clone. Not macOS `say`.

When the venv is present, flagship lines are **Qwen3-TTS CustomVoice / Ryan** through mlx-audio, near 165 wpm.

The mouth on speech-led lines opens on vowels. Holds follow the RMS envelope in `src/voEnvelopes.json`.

Regenerate speech-led lines:

```
npm run vo
```

Needs `espeak-ng` plus `ffmpeg`, or the local venv at `/tmp/cairn-vo-venv` (or `CAIRN_VO_PYTHON`).
