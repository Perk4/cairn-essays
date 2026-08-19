# Voice

Flagship lines use local Apache Kokoro-82M with `am_echo` at speed 1.25. `public/vo/voice.json` is the voice boundary. Set `CAIRN_VOICE_CONFIG` to read the same shape from another path.

The synthesizer renders one sentence at a time and inserts `gapSec` silence between sentences. It does not stretch the result after synthesis.

It is **not Perk**. It is **not a clone**. It is **not espeak**. It is **not ElevenLabs**.

The mouth on speech-led lines opens on vowels. Holds follow the RMS envelope in `src/voEnvelopes.json`.

Regenerate speech-led lines:

```
CAIRN_VO_PYTHON=/tmp/cairn-vo-venv/bin/python npm run vo
```

The command needs `ffmpeg` and the local Python environment. It downloads the Kokoro ONNX files to `/tmp/kokoro-models` if either file is missing. A synthesis error stops the run.
