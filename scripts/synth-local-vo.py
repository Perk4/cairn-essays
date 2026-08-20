#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import os
import re
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
    raw = json.loads(path.read_text())
    if raw["engine"] != "kokoro":
        raise SystemExit("voice config engine must be kokoro")
    if raw["model"] != "hexgrad/Kokoro-82M":
        raise SystemExit("voice config model must be hexgrad/Kokoro-82M")
    banned(raw["engine"])
    banned(raw["model"])
    banned(raw["voice"])
    return VoiceConfig(
        engine="kokoro",
        model="hexgrad/Kokoro-82M",
        voice=raw["voice"],
        speed=float(raw["speed"]),
        gap_sec=float(raw["gapSec"]),
    )


def ensure_file(path: Path, url: str) -> None:
    if path.is_file() and path.stat().st_size > 1000:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    download = path.with_name(f"{path.name}.download")
    urllib.request.urlretrieve(url, download)
    download.replace(path)


def sentence_chunks(text: str) -> list[str]:
    chunks = [
        chunk.strip()
        for chunk in re.findall(r".+?(?:[.!?](?=\s|$)|$)", text, flags=re.DOTALL)
        if chunk.strip()
    ]
    if not chunks:
        raise ValueError("text has no speakable sentences")
    return chunks


def write_meta(path: Path, config: VoiceConfig, sample_rate: int) -> None:
    path.write_text(
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


def synth_one(
    kokoro: object,
    config: VoiceConfig,
    text: str,
    wav_path: Path,
    cues_path: Path,
) -> int:
    import numpy as np
    import soundfile as sf

    sentence_audio: list[np.ndarray] = []
    cues: list[dict[str, float | str]] = []
    sample_rate: int | None = None
    clock = 0.0
    for sentence in sentence_chunks(text):
        audio, rate = kokoro.create(
            sentence,
            voice=config.voice,
            speed=config.speed,
            lang="en-us",
        )
        if sample_rate is None:
            sample_rate = int(rate)
        samples = np.asarray(audio, dtype=np.float32).reshape(-1)
        if samples.size == 0:
            raise RuntimeError(f"Kokoro returned no audio for {sentence!r}")
        duration = samples.size / sample_rate
        cues.append(
            {
                "start": round(clock, 3),
                "end": round(clock + duration, 3),
                "text": sentence,
            }
        )
        sentence_audio.append(samples)
        clock += duration + config.gap_sec
    if sample_rate is None:
        raise RuntimeError("Kokoro returned no sample rate")
    gap = np.zeros(round(sample_rate * config.gap_sec), dtype=np.float32)
    joined: list[np.ndarray] = []
    for index, audio in enumerate(sentence_audio):
        if index:
            joined.append(gap)
        joined.append(audio)
    wav_path.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(wav_path), np.concatenate(joined), sample_rate)
    cues_path.write_text(json.dumps(cues, indent=2) + "\n")
    return sample_rate


def load_kokoro(model_path: Path, voices_path: Path):
    from kokoro_onnx import Kokoro

    ensure_file(model_path, MODEL_URL)
    ensure_file(voices_path, VOICES_URL)
    return Kokoro(str(model_path), str(voices_path))


def synth_kokoro(
    config: VoiceConfig,
    text: str,
    path: Path,
    cues_path: Path,
    model_path: Path,
    voices_path: Path,
) -> int:
    kokoro = load_kokoro(model_path, voices_path)
    return synth_one(kokoro, config, text, path, cues_path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--text")
    parser.add_argument("--out")
    parser.add_argument("--meta")
    parser.add_argument("--batch")
    parser.add_argument(
        "--config",
        default=os.environ.get("CAIRN_VOICE_CONFIG", "public/vo/voice.json"),
    )
    args = parser.parse_args()
    config = load_voice_config(Path(args.config))
    model_path = Path(os.environ.get("KOKORO_MODEL_PATH", str(DEFAULT_MODEL_PATH)))
    voices_path = Path(os.environ.get("KOKORO_VOICES_PATH", str(DEFAULT_VOICES_PATH)))

    if args.batch:
        jobs = json.loads(Path(args.batch).read_text())
        if not isinstance(jobs, list) or not jobs:
            raise SystemExit("batch file must be a non-empty JSON array")
        kokoro = load_kokoro(model_path, voices_path)
        for job in jobs:
            line_id = str(job["id"])
            text = str(job["text"])
            wav = Path(str(job["out"]))
            meta = Path(str(job["meta"]))
            cues = Path(str(job.get("cues", str(meta).replace(".meta.json", ".cues.json"))))
            banned(line_id)
            sample_rate = synth_one(kokoro, config, text, wav, cues)
            write_meta(meta, config, sample_rate)
            print(
                f"synth ok {line_id} kokoro {config.voice} {config.model} sr={sample_rate}",
                file=__import__("sys").stderr,
            )
        return

    if not args.text or not args.out or not args.meta:
        raise SystemExit("single-line mode needs --text --out --meta")
    out = Path(args.out)
    meta = Path(args.meta)
    cues = Path(str(meta).replace(".meta.json", ".cues.json")) if str(meta).endswith(".meta.json") else Path(str(out)[:-4] + ".cues.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    sample_rate = synth_kokoro(
        config,
        args.text,
        out,
        cues,
        model_path,
        voices_path,
    )
    write_meta(meta, config, sample_rate)
    print(
        f"synth ok kokoro {config.voice} {config.model} sr={sample_rate}",
        file=__import__("sys").stderr,
    )


if __name__ == "__main__":
    main()
