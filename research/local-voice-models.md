# Local voice models for Cairn essay VO (2026)

Facts only. This file does not pick a winner. It exists so [What local VO approach and quality bar should we lock?](https://github.com/Perk4/cairn-essays/issues/42) can decide.

## Question

Which local (on-device or self-hosted) speech models and approaches are actually good in 2026 for a Cairn essay VO — natural enough to replace macOS Samantha at 150 wpm, which is judged bad?

## Method

Primary sources only: official model cards, project docs, first-party demos, and first-party licenses. No secondary roundups. No model was installed into this repo. `public/vo` was not regenerated.

Working-tree / map fact (not on `origin/main`): current factory VO is `say -v Samantha -r 150` in `scripts/make-vo.mjs`. On `origin/main` the same script still calls `espeak-ng` (`en-us`, 120 wpm) and `public/vo/VOICE.md` still describes that placeholder. Mouth motion in the factory is already derived from the rendered audio (RMS envelope), not from a TTS viseme API.

## Cross-cutting facts

**Mouth envelope vs viseme stream.** None of the official TTS APIs below advertise a first-class viseme or mouth-envelope product. The factory can keep deriving an envelope from any WAV/MP3. A few stacks expose related timing: Kokoro yields phoneme strings per chunk;[10] mlx-audio ships Qwen3-ForcedAligner for word-level timestamps on already-generated audio;[15] Piper's official Python API documents rate/variation knobs but not alignments.[5]

**Commercial YouTube use.** Licenses below govern software and/or weights. Only Coqui XTTS's CPML explicitly licenses *outputs* as non-commercial.[26]

Apache 2.0 and MIT grant commercial use of the Work subject to their notices.[9][17][21]

GPL-3.0 (current Piper engine) is copyleft on distributing the program, not a statement about generated audio.[6]

Piper and StyleTTS 2 add disclosure or per-voice-card rules.[4][22]

Pocket TTS and CSM prohibit impersonation.[27][29] This file reports those texts; it is not legal advice.

**Perk clone.** Out of scope. A candidate is marked "clone required" only when first-party docs say a reference clip of a specific person is needed to speak. Stock / designed / catalog voices do not require a Perk clone.

**Apple Silicon realtime factor.** First-party numeric RTF on a Mac is rare. Where a project only says "fast" or shows CUDA examples, that gap is stated.

## Piper (OHF-Voice / rhasspy voices)

Fast local neural TTS: VITS voices exported to ONNX, with embedded espeak-ng phonemization.[1][2] The original `rhasspy/piper` repo is archived and points at `OHF-Voice/piper1-gpl`.[8]

- **License / YouTube.** Engine: GNU GPL v3.0.[6] Official voice docs say Piper is "intended for personal use and text to speech research only" and that the project "do[es] not impose any additional restrictions on voice models," but "some voices may have restrictive licenses" in each `MODEL_CARD`.[4] Example English voice `en_US-lessac-medium` is 22,050 Hz, one speaker; its card points at the Lessac Blizzard 2013 dataset license URL.[7]
- **Mac install / RTF.** `pip install piper-tts`; download `en_US-lessac-medium` then `python3 -m piper -m en_US-lessac-medium -f test.wav -- '…'`.[3] Official CLI notes one-shot runs are slow because the model reloads each time; the HTTP server is recommended for repeated use.[3] `--cuda` exists; no official Apple Silicon or Mac RTF number.[5]
- **Rate / style / mouth.** `SynthesisConfig.length_scale` — `2.0` is "twice as slow"; also `noise_scale`, `noise_w_scale`, volume.[5] Raw espeak-ng phonemes can be injected with `[[ ]]`.[3] No official viseme stream. Envelope-from-audio still works.
- **Quality vs cloud.** No first-party MOS or arena table vs ElevenLabs / OpenAI. Positioning is local/embedded (Home Assistant, NVDA, LocalAI).[2] Samples: https://rhasspy.github.io/piper-samples.[2]
- **Clone required?** No. Stock language voices (e.g. `en_US-lessac-medium`).[3][4] Training new voices is documented separately.

## Kokoro-82M (hexgrad)

Open-weight 82M StyleTTS 2 / ISTFTNet TTS. v1.0 (2025-01-27): 8 languages, 54 voices, "few hundred hrs" of training data.[9] Official demo: https://hf.co/spaces/hexgrad/Kokoro-TTS.[9]

- **License / YouTube.** Weights Apache 2.0. Card: "Apache-licensed weights, Kokoro can be deployed anywhere from production environments to personal projects" and "we welcome the deployment of the model in real use cases."[9] Inference repo is `pip install kokoro`; it uses `misaki` G2P and espeak-ng as English OOD fallback.[10]
- **Mac install / RTF.** `pip install kokoro` plus espeak-ng; official Apple Silicon note is `PYTORCH_ENABLE_MPS_FALLBACK=1` on M1–M4.[10] mlx-audio also ships `mlx-community/Kokoro-82M-{bf16,8bit,6bit,4bit}`.[15] No first-party Mac RTF number.
- **Rate / style / mouth.** `pipeline(..., voice='af_heart', speed=1)`.[10] Fixed voice packs, not a style-instruction model.[11] Generator yields `(graphemes, phonemes, audio)` per chunk — phoneme strings, not a timed viseme track.[10] Envelope-from-audio still works.
- **Quality vs cloud.** Card claims "comparable quality to larger models."[9] `EVAL.md` is screenshots (2025-02-26) of TTS Spaces Arena, TTS-AGI TTS Arena, and Artificial Analysis — images, not transcribed scores in the markdown.[12] First-party voice grades: `af_heart` overall **A**; `af_bella` **A-**; many others C–D; short utterances (<10–20 tokens) are a known weakness; long utterances (>400 tokens) "rush."[11]
- **Clone required?** No. 54 catalog voices (20 American English).[11] Voice tensors can be loaded from a `.pt` file; that is a voicepack, not a live speaker clone.[10]

## Chatterbox (Resemble AI)

Family of open-source TTS models: original English 500M, Multilingual V3 (500M, 23+ languages), Turbo (350M English), Nano (110M English).[13] First-party demos: https://resemble-ai.github.io/chatterbox_demopage/ and Turbo page.[13]

- **License / YouTube.** MIT on GitHub.[13] Resemble FAQ: commercial products, self-host, modify weights, no royalties; reference clips must be a voice "you have permission to use."[14] Every generation embeds Resemble PerTh watermark; removing it is "explicitly against the intended use."[14]
- **Mac install / RTF.** `pip install chatterbox-tts`; device may be `"cuda"`, `"cpu"`, or `"mps"`.[13] Nano: "running **3x faster than realtime on 8 CPU cores**"; Turbo decoder is one step.[13] Resemble product page: ~200 ms latency.[14]
- **Rate / style / mouth.** Original: `exaggeration` and `cfg_weight` (defaults 0.5); higher exaggeration "tends to speed up speech"; lower `cfg_weight` (~0.3) slows pacing.[13] Turbo/Nano: paralinguistic tags (`[laugh]`, `[chuckle]`, `[cough]`).[13] No official viseme stream. Envelope-from-audio still works.
- **Quality vs cloud.** Resemble: "63.75% of evaluators preferred Chatterbox over ElevenLabs" in a Podonos blind test (7–20 s refs, zero-shot).[14] Turbo has first-party Podonos reports vs ElevenLabs Turbo v2.5, Cartesia Sonic 3, and VibeVoice 7B.[13] Kyutai's first-party table (different protocol) reports Chatterbox Turbo WER 3.24 vs Pocket TTS / Kokoro ~1.8–1.9 on Librispeech test-clean, and says Turbo was not faster than realtime on the CPUs they measured.[28]
- **Clone required?** Original English `generate(text)` works without a prompt; a prompt is optional.[13] Turbo and Nano examples **require** `audio_prompt_path`.[13] Zero-shot clone is "5 seconds" / "5–20 second" reference.[14] A stock or licensed catalog clip is enough; a Perk clone is not required.

## mlx-audio (Apple Silicon stack)

MIT-licensed TTS/STT/STS library on Apple MLX for M-series Macs.[15] This is a **runtime**, not one voice. It hosts first-party ports of Kokoro, Qwen3-TTS, Chatterbox, CSM, Pocket-adjacent models, and others.[15]

- **License / YouTube.** Library: MIT.[15] Each hosted model's own card still applies (Kokoro Apache 2.0, Qwen3 Apache 2.0, Chatterbox MIT, CSM Apache 2.0, etc.).
- **Mac install / RTF.** Apple Silicon (M1–M4), Python 3.10+, MLX; `pip install mlx-audio`.[15] CLI example: `mlx_audio.tts.generate --model mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit --text '…' --voice Chelsie`. Docs say "fast inference optimized for Apple Silicon" but give **no numeric RTF**.[15]
- **Rate / style / mouth.** "Adjustable speech speed control"; Kokoro exposes `speed`/`voice`; CSM takes `--ref_audio`.[15] Qwen3-ForcedAligner can emit word timestamps from audio+transcript — usable to drive mouth or captions, not a viseme alphabet.[15]
- **Quality vs cloud.** Quality is the wrapped model's. No separate mlx-audio MOS.
- **Clone required?** Depends on the loaded model. Kokoro/Qwen3-CustomVoice presets do not need a person clone; CSM/Chatterbox-ref paths do if you pass a reference.[15]

## Qwen3-TTS (Alibaba / Qwen)

Released 2026-01-22. Family on Qwen3-TTS-Tokenizer-12Hz: 0.6B/1.7B CustomVoice, 1.7B VoiceDesign, 0.6B/1.7B Base; first audio packet "as low as 97ms."[16] Trained on "over 5 million hours" spanning 10 languages.[18]

- **License / YouTube.** Apache 2.0 (Copyright 2026 Alibaba Cloud).[17] CustomVoice ships 9 named timbres (English: Ryan, Aiden); Base is a 3-second voice clone.[16]
- **Mac install / RTF.** Official path: `pip install -U qwen-tts` in Python 3.12; examples use `device_map="cuda:0"`, bfloat16, FlashAttention 2.[16] No official Mac / MPS RTF. Practical Apple Silicon path is mlx-audio's `mlx-community/Qwen3-TTS-12Hz-*` checkpoints (including 8-bit).[15] 97 ms is end-to-end first-packet latency on the architecture they describe, not a Mac RTF.[16]
- **Rate / style / mouth.** CustomVoice and VoiceDesign take an `instruct` string for emotion/timbre/prosody; speaking rate is described as adaptively controlled from instructions and text semantics.[16] No official viseme stream. ForcedAligner (via mlx-audio) can timestamp words after the fact.[15]
- **Quality vs cloud.** First-party InstructTTSEval: 1.7B-CustomVoice EN APS 77.3 / DSD 77.1 / RP 63.7 vs Gemini-flash 92.3 / 93.8 / 80.1 and GPT-4o-mini-tts 76.4 / 74.3 / 54.8.[16] Multilingual WER table includes GPT-4o-Audio Preview (English 3.519 for that baseline vs Qwen3-12Hz-1.7B-CustomVoice 0.903 Chinese / see table for English).[16] These are Qwen's numbers, not an independent lab.
- **Clone required?** No for CustomVoice (9 speakers) or VoiceDesign (text description).[16] Base clone is optional and is a 3-second clip of *some* speaker, not Perk.[18]

## Orpheus (Canopy Labs)

Llama-3B speech-LLM. English `orpheus-tts-0.1-finetune-prod` and a pretrained 100k+ hour base; multilingual research family.[19] Apache 2.0.[21]

- **License / YouTube.** Apache 2.0 on the repo.[19][21] No extra YouTube clause in the README. Optional Silent Cipher watermarking is documented as extra, not mandatory.[19]
- **Mac install / RTF.** Official happy path: `pip install orpheus-speech` (vLLM; CUDA-oriented) with "~200ms streaming latency."[19] No-GPU / Apple Silicon path: `orpheus-cpp` plus `llama-cpp-python` from the Metal wheel index.[20] No first-party Mac RTF number.
- **Rate / style / mouth.** Finetune-prod voices: tara, leah, jess, leo, dan, mia, zac, zoe (English).[19] Emotive tags are documented (laugh/sigh-class tags; README rendering ate the exact token spelling).[19] `repetition_penalty>=1.1` required; increasing `repetition_penalty` and `temperature` "makes the model speak faster."[19] No viseme stream.
- **Quality vs cloud.** First-party claim: "Natural intonation, emotion, and rhythm that is superior to SOTA closed source models."[19] No numeric table vs ElevenLabs/OpenAI in the README. Checklist still includes "Fix glitch in realtime streaming package that occasionally skips frames" and "Fix voice cloning Colab notebook."[19]
- **Clone required?** No for the eight named English voices.[19] Zero-shot cloning is listed as an ability; pretrained conditioning uses text–speech pairs and is not a required path for everyday TTS.[19] Finetune recipe: high quality after ~50 examples, best at ~300/speaker — that would be a custom voice, not required.[19]

## StyleTTS 2 (yl4579)

2023 research model: style diffusion + SLM adversarial training. Paper: https://arxiv.org/abs/2306.07691. Samples: https://styletts2.github.io/. HF demo: https://huggingface.co/spaces/styletts2/styletts2.[22]

- **License / YouTube.** Code: MIT.[22] Pretrained weights: before use, "inform the listeners that the speech samples are synthesized … unless you have the permission to use the voice you synthesize," or only use speakers who granted clone rights.[22] Author clarification (#37): extra terms apply to **pretrained weights**, not the code; LibriTTS training voices are CC BY 4.0; the rule exists because the model can also speak unseen voices.[23] YouTube use of LJSpeech/LibriTTS pretrained output would still need that disclosure unless the speaker granted rights.
- **Mac install / RTF.** `git clone` + `pip install -r requirements.txt` + phonemizer/espeak-ng.[22] No official macOS or Apple Silicon section. Known issue: "High-pitched background noise" on older GPUs from float differences — workaround is "more modern GPUs or … inference on CPUs."[22] No RTF number. Inference lives in Jupyter demos, not a one-line CLI.[22]
- **Rate / style / mouth.** Single-speaker LJSpeech: style is sampled (no reference required).[22] Multi-speaker LibriTTS: zero-shot adaptation from reference audio (`reference_audio.zip`).[22] Internal duration modeling exists (training); no first-party viseme API. GPL phonemizer vs MIT `styletts2` (gruut) fork is called out; the MIT package is "lower quality due to mismatch between phonemizer and gruut."[22]
- **Quality vs cloud.** First-party: "surpasses human recordings on the single-speaker LJSpeech dataset and matches it on the multispeaker VCTK dataset as judged by native English speakers"; LibriTTS model "outperforms previous publicly available models for zero-shot speaker adaptation."[22] That is vs human/public models of 2023, not vs 2026 cloud TTS. Finetune on 1 hour LJSpeech is "slightly worse (similar to NaturalSpeech on LJSpeech)."[22]
- **Clone required?** No for the LJSpeech single-speaker checkpoint.[22] LibriTTS zero-shot uses a reference speaker (must be permitted / disclosed).[22][23]

## Coqui TTS / XTTS v2

🐸TTS toolkit (MPL 2.0) plus XTTS v2 as the production multilingual cloner.[24][25] Docs: https://docs.coqui.ai/en/latest/models/xtts.html. Demo space: https://huggingface.co/spaces/coqui/xtts.[24]

- **License / YouTube.** Toolkit code: MPL 2.0.[24] **XTTS model: Coqui Public Model License 1.0.0.** CPML "allows only non-commercial use of a machine learning model **and its outputs**."[26] Non-commercial excludes "any … direct or indirect payment arising from the use of the model or its output," including "revenue-generating activity."[26] A monetized YouTube essay using XTTS audio is outside that grant as written. Other 🐸TTS models (VITS, YourTTS, Glow-TTS, …) have their own cards; this ticket's production-quality Coqui option is XTTS.
- **Mac install / RTF.** `pip install TTS`; tested Ubuntu 18.04, Python >= 3.9, < 3.12; **no official macOS / Apple Silicon install or RTF**.[24] XTTS streaming "< 200ms latency."[25]
- **Rate / style / mouth.** Inference `speed` default 1.0; "can produce artifacts if far from 1.0."[25] Language + `speaker` (e.g. "Ana Florence") or `speaker_wav` clone (3 s; multi-file refs supported).[25] 16 languages on v2 (en, es, fr, de, it, pt, pl, tr, ru, nl, cs, ar, zh-cn, ja, hu, ko).[25] No viseme stream.
- **Quality vs cloud.** First-party: "same model that powers Coqui Studio and Coqui API" with tricks for speed/streaming.[25] README MOS figure compares internal unreleased voices to humans; it is not a 2026 cloud bake-off.[24]
- **Clone required?** No if using a Coqui speaker id.[25] Clone path needs a reference wav (any permitted speaker, not Perk).[25]

## Extra first-party local options (2026)

### Kyutai Pocket TTS

100M-parameter CPU TTS with catalog voices and optional clone. First-party demo and tech report (2026-01-13).[27][28]

- **License / YouTube.** MIT; per-voice licenses are listed at https://huggingface.co/kyutai/tts-voices.[27] Prohibited use includes "voice impersonation or cloning without explicit and lawful consent."[27] Trained on public English sets (88k hours in the report).[28]
- **Mac install / RTF.** `pip install pocket-tts` or `uvx pocket-tts generate` / `serve`; first-party: "**~6x real-time on a CPU of MacBook Air M4**", ~200 ms first chunk, 2 CPU cores.[27] Report: Pocket TTS and Kokoro were the only models faster than realtime on an Intel Core Ultra 7 165H and a MacBook Air M3, "by a significant margin."[28]
- **Rate / style / mouth.** Catalog voices or `--voice path.wav` clone (~5 s); `*_24l` variants are "higher quality but slower."[27] No first-party speaking-rate knob (unsupported: adding silence in text to generate pauses).[27] No viseme stream. Envelope-from-audio still works.
- **Quality vs cloud.** First-party Librispeech test-clean (Adobe-enhanced refs): Pocket TTS WER **1.84**, audio-quality ELO 2016±25, speaker-sim ELO 1898±26; Kokoro WER 1.93 (no clone); Chatterbox Turbo WER 3.24 / AQ 2055±23 / sim 2012±22; F5-TTS WER 2.21.[28] Report frames Pocket TTS as bridging "1B-class LLM TTS" and "Kokoro-class small models."[28]
- **Clone required?** No. Catalog voices are enough.[27] Clone is optional and must be consented.[27]

### Sesame CSM-1B

Conversational Speech Model (Llama backbone + Mimi codes). Apache 2.0. HF: `sesame/csm-1b`. Interactive demo that a *fine-tune* of CSM powers: https://www.sesame.com/voicedemo.[29][30]

- **License / YouTube.** Apache 2.0.[30] Misuse section **explicitly prohibits** generating speech that "mimics real individuals without their explicit consent."[29] HF access / Llama-3.2-1B access required for the official repo path.[29]
- **Mac install / RTF.** Official requirements: "A CUDA-compatible GPU"; tested CUDA 12.4/12.6.[29] Sample code selects `mps` if available, else CUDA, else CPU.[29] mlx-audio: `mlx-community/csm-1b` with `--ref_audio`.[15] No official Mac RTF.
- **Rate / style / mouth.** `max_audio_length_ms`; sounds "best when provided with context" (prior `Segment`s of text+audio).[29] No rate slider. No viseme stream.
- **Quality vs cloud.** First-party: the open 1B is a **base** model, "capable of producing a variety of voices, but it has not been fine-tuned on any specific voice."[29] The uncanny-valley blog demo is a fine-tune, not this checkpoint.[29] Non-English "likely won't do well."[29]
- **Clone required?** No named stock host. Untargeted generation uses a random speaker identity; a consistent essay voice needs context/reference audio (not Perk).[29]

## Comparison (facts only)

| Candidate | License (engine / weights) | YouTube-relevant extra | Mac path (first-party) | Official speed number | Rate / style | Native viseme | Clone required? | First-party quality vs cloud |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Piper | GPL-3.0 engine; per-voice MODEL_CARD | "Personal use and … research only" | `pip install piper-tts` | None on Mac; CLI reload is slow | `length_scale` | No | No | None vs cloud |
| Kokoro-82M | Apache 2.0 | "Deployed in … commercial APIs" | `kokoro` + MPS fallback | None on Mac | `speed`; 54 voices | Phoneme strings only | No | Arena screenshots; short/long limits |
| Chatterbox | MIT | Commercial yes; PerTh watermark | `pip`; `device="mps"` | Nano 3× RT on 8 CPU cores | `exaggeration` / `cfg_weight`; Turbo tags | No | Optional (required on Turbo/Nano examples) | 63.75% vs ElevenLabs |
| mlx-audio | MIT library | Hosted model licenses still apply | `pip install mlx-audio` on M-series | "Fast"; no RTF | Speed control; per-model | ForcedAligner words | Per model | Per model |
| Qwen3-TTS | Apache 2.0 | No extra YouTube clause | Official CUDA; MLX ports | 97 ms first packet | `instruct` / VoiceDesign | No | No (CustomVoice / Design) | Tables vs Gemini / GPT-4o-mini-tts |
| Orpheus | Apache 2.0 | None in README | vLLM CUDA; llama.cpp Metal | ~200 ms stream (CUDA path) | Emotion tags; temp/penalty change rate | No | No (8 named voices) | "Superior to SOTA closed source" (no table) |
| StyleTTS 2 | MIT code; extra pretrained terms | Must disclose synthesis or have speaker permission | CPU/GPU Python; no Mac section | None | Style diffusion; optional ref | No | No on LJSpeech ckpt | Human-level on LJSpeech/VCTK (2023) |
| Coqui XTTS v2 | MPL-2.0 toolkit; **CPML model+output** | **Outputs non-commercial** | `pip install TTS`; no Mac RTF | <200 ms stream | `speed`; speaker or clone | No | No if speaker id | Studio/API model; no 2026 cloud table |
| Pocket TTS | MIT + per-voice pages | No impersonation; voice licenses | `uvx`/`pip`; CPU | **~6× RT on MBA M4 CPU** | Catalog or 5 s clone; no rate knob | No | No | WER 1.84; ELO vs F5/Chatterbox/Kokoro |
| Sesame CSM-1B | Apache 2.0 | No impersonation | Official CUDA; code has MPS | None on Mac | Context segments | No | No named voice; ref/context for consistency | Open weights are an un-finetuned base |

## Gaps left for the lock ticket

- No first-party listening test on *Cairn essay copy* at ~150 wpm. Arena/WER/ELO numbers are not that test.
- Samantha 150 wpm is a map judgment, not a MOS. These pages do not mention Samantha.
- Mouth sync: factory envelope works for every candidate; a true viseme stream is not a first-party feature of these TTS APIs.
- Piper YouTube: engine GPL + "personal/research" intent + per-voice cards — not a clean commercial grant.
- XTTS: CPML blocks commercial outputs as written.
- Chatterbox commercial use is first-party-yes, with a mandatory watermark.
- Qwen3 and Orpheus quality claims vs cloud are first-party tables or slogans; Mac RTF is mostly via mlx-audio / llama.cpp, not the CUDA READMEs.
- Pocket TTS is the only candidate with a first-party **MacBook Air realtime factor** (~6× on M4 CPU; also realtime on M3 in the report).[27][28]
- This file does not recommend which to lock.

## Sources

[1] https://github.com/OHF-Voice/piper1-gpl
[2] https://raw.githubusercontent.com/OHF-Voice/piper1-gpl/main/README.md
[3] https://raw.githubusercontent.com/OHF-Voice/piper1-gpl/main/docs/CLI.md
[4] https://raw.githubusercontent.com/OHF-Voice/piper1-gpl/main/docs/VOICES.md
[5] https://raw.githubusercontent.com/OHF-Voice/piper1-gpl/main/docs/API_PYTHON.md
[6] https://github.com/OHF-Voice/piper1-gpl/blob/main/COPYING
[7] https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/lessac/medium/MODEL_CARD
[8] https://github.com/rhasspy/piper
[9] https://huggingface.co/hexgrad/Kokoro-82M/raw/main/README.md
[10] https://raw.githubusercontent.com/hexgrad/kokoro/main/README.md
[11] https://huggingface.co/hexgrad/Kokoro-82M/raw/main/VOICES.md
[12] https://huggingface.co/hexgrad/Kokoro-82M/raw/main/EVAL.md
[13] https://raw.githubusercontent.com/resemble-ai/chatterbox/master/README.md
[14] https://www.resemble.ai/learn/models/chatterbox
[15] https://raw.githubusercontent.com/Blaizzy/mlx-audio/main/README.md
[16] https://raw.githubusercontent.com/QwenLM/Qwen3-TTS/main/README.md
[17] https://raw.githubusercontent.com/QwenLM/Qwen3-TTS/main/LICENSE
[18] https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-Base/raw/main/README.md
[19] https://raw.githubusercontent.com/canopyai/Orpheus-TTS/main/README.md
[20] https://raw.githubusercontent.com/canopyai/Orpheus-TTS/main/additional_inference_options/no_gpu/README.md
[21] https://github.com/canopyai/Orpheus-TTS/blob/main/LICENSE
[22] https://raw.githubusercontent.com/yl4579/StyleTTS2/main/README.md
[23] https://github.com/yl4579/StyleTTS2/issues/37
[24] https://raw.githubusercontent.com/coqui-ai/TTS/dev/README.md
[25] https://docs.coqui.ai/en/latest/models/xtts.html
[26] https://huggingface.co/coqui/XTTS-v2/raw/main/LICENSE.txt
[27] https://raw.githubusercontent.com/kyutai-labs/pocket-tts/main/README.md
[28] https://kyutai.org/pocket-tts-technical-report
[29] https://raw.githubusercontent.com/SesameAILabs/csm/main/README.md
[30] https://huggingface.co/sesame/csm-1b/blob/main/README.md
