#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

BANNED = ("say", "samantha", "xtts", "eleven", "openai", "azure", "google")

CANDIDATES = (
    (
        "qwen3-1.7b-ryan",
        "mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-bf16",
        "custom",
    ),
    (
        "qwen3-0.6b-ryan",
        "mlx-community/Qwen3-TTS-12Hz-0.6B-CustomVoice-bf16",
        "custom",
    ),
    ("kokoro-af_heart", "mlx-community/Kokoro-82M-bf16", "kokoro"),
)

INSTRUCT = "Dry teacher. Room for a joke. Steady English, about 165 words a minute."


def banned(name: str) -> None:
    lower = name.lower()
    for token in BANNED:
        if token in lower:
            raise SystemExit(f"refusing banned voice path: {name}")


def write_wav(path: Path, audio, sr: int) -> None:
    import numpy as np
    import soundfile as sf

    arr = np.array(audio)
    if arr.ndim > 1:
        arr = arr.reshape(-1)
    sf.write(str(path), arr, sr)


def synth_custom(model_id: str, text: str, path: Path) -> int:
    from mlx_audio.tts.utils import load_model

    model = load_model(model_id)
    results = list(
        model.generate_custom_voice(
            text=text,
            speaker="Ryan",
            language="English",
            instruct=INSTRUCT,
        )
    )
    if not results:
        raise RuntimeError("empty custom voice result")
    last = results[-1]
    audio = last.audio
    sr = int(getattr(last, "sample_rate", 24000))
    write_wav(path, audio, sr)
    return sr


def synth_kokoro(model_id: str, text: str, path: Path) -> int:
    from mlx_audio.tts.utils import load_model

    model = load_model(model_id)
    generate = getattr(model, "generate")
    results = list(generate(text, voice="af_heart", speed=1.1))
    if not results:
        raise RuntimeError("empty kokoro result")
    last = results[-1]
    audio = last.audio
    sr = int(getattr(last, "sample_rate", 24000))
    write_wav(path, audio, sr)
    return sr


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--meta", required=True)
    args = parser.parse_args()

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    errors: list[str] = []

    for name, model_id, kind in CANDIDATES:
        banned(name)
        banned(model_id)
        try:
            if kind == "custom":
                sr = synth_custom(model_id, args.text, out)
            else:
                sr = synth_kokoro(model_id, args.text, out)
            Path(args.meta).write_text(
                json.dumps({"engine": name, "model": model_id, "sampleRate": sr})
                + "\n"
            )
            print(f"synth ok {name} {model_id} sr={sr}", file=sys.stderr)
            return
        except Exception as exc:
            errors.append(f"{name}: {exc}")
            print(f"synth fail {name}: {exc}", file=sys.stderr)

    raise SystemExit("all local voices failed\n" + "\n".join(errors))


if __name__ == "__main__":
    main()
