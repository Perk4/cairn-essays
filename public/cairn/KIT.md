# Talking kit (in this pass)

Design frames dropped into this folder. Bottom stone is planted. No hover pad. Still is hands on the base. Listen is a lean-in. They are not the same 4-and-8 hang.

| file               | job                                      |
| ------------------ | ---------------------------------------- |
| `still.png`        | planted, twigs on the base               |
| `listen.png`       | lean-in, planted                         |
| `point.png`        | on the floor, points stage-right         |
| `mouth-closed.png` | still body, shut on holds                |
| `mouth-mid.png`    | still body, consonants                   |
| `mouth-open.png`   | still body, vowels                       |
| `tue-open.png`     | Tuesday body, same room                  |
| `thu-slits.png`    | Thursday body, same room                 |

`src/cairn/kit.ts` drives visemes from the spoken line at 120 wpm: open on vowels, mid on consonants, closed on holds. No blink sine. Mouth sheets are the still body. Listen keeps lean-in (`listen.png` at rest; while the VO runs, mouth sheets plus a matching lean so the mouth still talks). Point and Tuesday/Thursday keep their own whole-body files.
