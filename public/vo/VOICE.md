# Voice

The hook line is **Qwen3-TTS CustomVoice / Ryan** through mlx-audio on this machine.

Primary model is 1.7B. If that will not load, 0.6B CustomVoice / Ryan. If Qwen3 will not run, Kokoro-82M `af_heart`.

- Not Perk
- Not a Perk clone
- Not macOS `say` / Samantha
- Not cloud TTS

Other scenes still use the espeak-ng placeholder until later tickets. The mouth on the hook reads the RMS envelope in `src/voEnvelopes.json`.

Regenerate the hook:

```
npm run vo
```

Needs the local venv at `/tmp/cairn-vo-venv` (or `CAIRN_VO_PYTHON`) plus `ffmpeg`.
