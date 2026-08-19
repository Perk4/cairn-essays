#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Literal

BANNED = ("say", "samantha", "xtts", "eleven", "openai", "azure", "google")
MODEL_URL = (
    "https://github.com/thewh1teagle/kokoro-onnx/releases/download/"
    "model-files-v1.1/kokoro-v1.0.onnx"
)
VOICES_URL = (
    "https://github.com/thewh1teagle/kokoro-onnx/releases/download/"
    "model-files-v1.1/voices-v1.0.bin"
)
DEFAULT_MODEL_PATH = Path("/tmp/kokoro-models/kokoro-v1.0.onnx")
DEFAULT_VOICES_PATH = Path("/tmp/kokoro-models/voices-v1.0.bin")


@dataclass(frozen=True)
class VoiceConfig:
    engine: Literal["kokoro"]
    model: Literal["hexgrad/Kokoro-82M"]
    voice: str
    speed: float
    gap_sec: float


def banned(name: str) -> None:
    lower = name.lower()
    for token in BANNED:
        if token in lower:
            raise SystemExit(f"refusing banned voice path: {name}")


def load_voice_config(path: Path) -> VoiceConfig:
    try:
        raw = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        raise SystemExit(f"cannot read voice config {path}: {exc}") from exc
    if not isinstance(raw, dict):
        raise SystemExit(f"voice config {path} must be an object")
    expected = {"engine", "model", "voice", "speed", "gapSec"}
    if set(raw) != expected:
        raise SystemExit(
            f"voice config {path} needs exactly {', '.join(sorted(expected))}"
        )
    if raw["engine"] != "kokoro":
        raise SystemExit("voice config engine must be kokoro")
    if raw["model"] != "hexgrad/Kokoro-82M":
        raise SystemExit("voice config model must be hexgrad/Kokoro-82M")
    voice = raw["voice"]
    speed = raw["speed"]
    gap_sec = raw["gapSec"]
    if not isinstance(voice, str) or not voice:
        raise SystemExit("voice config voice must be a non-empty string")
    if not isinstance(speed, (int, float)) or isinstance(speed, bool) or speed <= 0:
        raise SystemExit("voice config speed must be positive")
    if (
        not isinstance(gap_sec, (int, float))
        or isinstance(gap_sec, bool)
        or gap_sec < 0
    ):
        raise SystemExit("voice config gapSec must be non-negative")
    banned(raw["engine"])
    banned(raw["model"])
    banned(voice)
    return VoiceConfig(
        engine="kokoro",
        model="hexgrad/Kokoro-82M",
        voice=voice,
        speed=float(speed),
        gap_sec=float(gap_sec),
    )


def ensure_file(path: Path, url: str) -> None:
    if path.is_file():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    download = path.with_name(f"{path.name}.download")
    try:
        urllib.request.urlretrieve(url, download)
        download.replace(path)
    except Exception as exc:
        download.unlink(missing_ok=True)
        raise RuntimeError(f"failed to download {url} to {path}: {exc}") from exc


def sentence_chunks(text: str) -> list[str]:
    chunks = [
        chunk.strip()
        for chunk in re.findall(r".+?(?:[.!?](?=\s|$)|$)", text, flags=re.DOTALL)
        if chunk.strip()
    ]
    if not chunks:
        raise ValueError("text has no speakable sentences")
    return chunks


def synth_kokoro(
    config: VoiceConfig,
    text: str,
    path: Path,
    model_path: Path,
    voices_path: Path,
) -> int:
    import numpy as np
    import soundfile as sf
    from kokoro_onnx import Kokoro

    ensure_file(model_path, MODEL_URL)
    ensure_file(voices_path, VOICES_URL)
    kokoro = Kokoro(str(model_path), str(voices_path))
    sentence_audio: list[np.ndarray] = []
    sample_rate: int | None = None
    for sentence in sentence_chunks(text):
        audio, rate = kokoro.create(
            sentence,
            voice=config.voice,
            speed=config.speed,
            sentence_pause=0,
        )
        if sample_rate is None:
            sample_rate = int(rate)
        elif sample_rate != int(rate):
            raise RuntimeError(
                f"Kokoro sample rate changed from {sample_rate} to {rate}"
            )
        samples = np.asarray(audio, dtype=np.float32).reshape(-1)
        if samples.size == 0:
            raise RuntimeError(f"Kokoro returned no audio for {sentence!r}")
        sentence_audio.append(samples)
    if sample_rate is None:
        raise RuntimeError("Kokoro returned no sample rate")
    gap = np.zeros(round(sample_rate * config.gap_sec), dtype=np.float32)
    joined: list[np.ndarray] = []
    for index, audio in enumerate(sentence_audio):
        if index:
            joined.append(gap)
        joined.append(audio)
    sf.write(str(path), np.concatenate(joined), sample_rate)
    return sample_rate


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--meta", required=True)
    parser.add_argument(
        "--config",
        default=os.environ.get("CAIRN_VOICE_CONFIG", "public/vo/voice.json"),
    )
    args = parser.parse_args()

    out = Path(args.out)
    meta = Path(args.meta)
    out.parent.mkdir(parents=True, exist_ok=True)
    meta.parent.mkdir(parents=True, exist_ok=True)
    config = load_voice_config(Path(args.config))
    model_path = Path(
        os.environ.get("KOKORO_MODEL_PATH", str(DEFAULT_MODEL_PATH))
    )
    voices_path = Path(
        os.environ.get("KOKORO_VOICES_PATH", str(DEFAULT_VOICES_PATH))
    )
    try:
        sample_rate = synth_kokoro(
            config,
            args.text,
            out,
            model_path,
            voices_path,
        )
    except Exception as exc:
        raise SystemExit(f"Kokoro synthesis failed: {exc}") from exc
    meta.write_text(
        json.dumps(
            {
                "engine": config.engine,
                "model": config.model,
                "voice": config.voice,
                "speed": config.speed,
                "gapSec": config.gap_sec,
                "sampleRate": sample_rate,
            }
        )
        + "\n"
    )
    print(
        f"synth ok kokoro {config.voice} {config.model} sr={sample_rate}",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
