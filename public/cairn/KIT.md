# Talking kit (not in this pass)

Design is still drawing these. Drop the PNGs here on this same branch. Do not invent mouths from the current stamps.

## Expected files

| file               | job                                 |
| ------------------ | ----------------------------------- |
| `mouth-closed.png` | shut on holds                       |
| `mouth-mid.png`    | between                             |
| `mouth-open.png`   | open on vowels                      |
| `still.png`        | hands on the base                   |
| `listen.png`       | lean-in                             |
| `point.png`        | point at the number / pile          |
| `tue-open.png`     | optional Tuesday, warm, same room   |
| `thu-slits.png`    | optional Thursday, slits, same room |

`src/cairn/kit.ts` already looks for the mouth and Tue/Thu files. Mouth visemes stay off until those three exist and a follow-up drives them from the VO. Listen vs still must not be the same 4-and-8 hang.

This folder currently has `still.png`, `listen.png`, and `point.png` only. The acting cut plants those on the floor and plays the verbs that do not need new art.
