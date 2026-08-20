#!/usr/bin/env python3
"""Talking-kit stills for ep01. Flat cream room. Dark outline. No smile."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "ep01-stills"
W, H = 1920, 1080
FLOOR = 760
OUTLINE = (40, 29, 14)
WALL_DAY = (252, 242, 198)
WALL_DUSK = (232, 196, 140)
WALL_NIGHT = (92, 78, 52)
WALL_COLD = (214, 206, 176)
FLOOR_DAY = (121, 102, 53)
FLOOR_NIGHT = (54, 44, 28)
FLOOR_COLD = (90, 78, 58)
TERRACOTTA = (165, 83, 45)
OLIVE = (121, 102, 53)
DESK = (87, 53, 28)
YELLOW = (245, 208, 18)
WHITE = (252, 250, 244)
CREAM = WALL_DAY
KNOB = (252, 250, 244)
SPEC = (87, 53, 28)

SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def oval(
    draw: ImageDraw.ImageDraw,
    cx: float,
    cy: float,
    rx: float,
    ry: float,
    fill: tuple[int, int, int],
    width: int = 7,
) -> None:
    draw.ellipse(
        [cx - rx, cy - ry, cx + rx, cy + ry],
        fill=fill,
        outline=OUTLINE,
        width=width,
    )


def line(
    draw: ImageDraw.ImageDraw,
    a: tuple[float, float],
    b: tuple[float, float],
    width: int = 8,
) -> None:
    draw.line([a, b], fill=OUTLINE, width=width)


def room(
    light: str,
) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    wall = {
        "day": WALL_DAY,
        "dusk": WALL_DUSK,
        "night": WALL_NIGHT,
        "cold": WALL_COLD,
    }[light]
    floor = {
        "day": FLOOR_DAY,
        "dusk": (96, 72, 36),
        "night": FLOOR_NIGHT,
        "cold": FLOOR_COLD,
    }[light]
    img = Image.new("RGB", (W, H), wall)
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, FLOOR, W, H], fill=floor)
    draw.line([(0, FLOOR), (W, FLOOR)], fill=OUTLINE, width=10)
    return img, draw


def window(draw: ImageDraw.ImageDraw, cx: int = 960, cy: int = 250, size: int = 220) -> None:
    x0, y0 = cx - size // 2, cy - size // 2
    x1, y1 = cx + size // 2, cy + size // 2
    draw.rectangle([x0, y0, x1, y1], outline=OUTLINE, width=8)
    mx, my = (x0 + x1) // 2, (y0 + y1) // 2
    draw.line([(mx, y0), (mx, y1)], fill=OUTLINE, width=7)
    draw.line([(x0, my), (x1, my)], fill=OUTLINE, width=7)


def door(draw: ImageDraw.ImageDraw, open_door: bool = True) -> None:
    draw.rectangle([40, 220, 220, FLOOR], fill=DESK, outline=OUTLINE, width=8)
    if open_door:
        draw.polygon(
            [(220, 230), (430, 270), (430, FLOOR - 20), (220, FLOOR)],
            fill=TERRACOTTA,
            outline=OUTLINE,
        )
        oval(draw, 390, 560, 10, 10, KNOB, 4)
    else:
        oval(draw, 190, 560, 10, 10, KNOB, 4)


def desk(draw: ImageDraw.ImageDraw, x: int = 1280, w: int = 520, lid: str = "open") -> None:
    top = FLOOR - 210
    draw.rectangle([x, top, x + w, top + 36], fill=DESK, outline=OUTLINE, width=7)
    draw.rectangle([x + 40, top + 36, x + 70, FLOOR], fill=DESK, outline=OUTLINE, width=6)
    draw.rectangle([x + w - 70, top + 36, x + w - 40, FLOOR], fill=DESK, outline=OUTLINE, width=6)
    if lid == "closed":
        draw.rectangle(
            [x + 40, top - 18, x + w - 40, top + 8],
            fill=DESK,
            outline=OUTLINE,
            width=6,
        )


def stool(draw: ImageDraw.ImageDraw, x: int = 1180, pulled: bool = True) -> None:
    seat_y = FLOOR - 150 if pulled else FLOOR - 120
    sx = x if pulled else x + 80
    draw.rectangle([sx, seat_y, sx + 140, seat_y + 24], fill=DESK, outline=OUTLINE, width=6)
    draw.rectangle([sx + 18, seat_y + 24, sx + 40, FLOOR], fill=DESK, outline=OUTLINE, width=5)
    draw.rectangle([sx + 100, seat_y + 24, sx + 122, FLOOR], fill=DESK, outline=OUTLINE, width=5)


def keyboard(draw: ImageDraw.ImageDraw, x: int = 1340, y: int | None = None) -> None:
    if y is None:
        y = FLOOR - 250
    cols, rows = 10, 3
    cell = 28
    pad = 10
    bw = pad * 2 + cols * cell
    bh = pad * 2 + rows * cell
    draw.rectangle([x, y, x + bw, y + bh], fill=WHITE, outline=OUTLINE, width=6)
    for r in range(rows):
        for c in range(cols):
            kx = x + pad + c * cell
            ky = y + pad + r * cell
            draw.rectangle(
                [kx, ky, kx + cell - 4, ky + cell - 4],
                fill=WHITE,
                outline=OUTLINE,
                width=3,
            )


def clock(draw: ImageDraw.ImageDraw, hour: int = 7, cx: int = 960, cy: int = 210) -> None:
    r = 90
    oval(draw, cx, cy, r, r, WHITE, 8)
    import math

    for i in range(12):
        ang = math.radians(i * 30 - 90)
        x0 = cx + math.cos(ang) * (r - 18)
        y0 = cy + math.sin(ang) * (r - 18)
        x1 = cx + math.cos(ang) * (r - 8)
        y1 = cy + math.sin(ang) * (r - 8)
        draw.line([(x0, y0), (x1, y1)], fill=OUTLINE, width=4)
    minute_ang = math.radians(-90)
    hour_ang = math.radians(hour * 30 - 90)
    line(
        draw,
        (cx, cy),
        (cx + math.cos(minute_ang) * 58, cy + math.sin(minute_ang) * 58),
        6,
    )
    line(
        draw,
        (cx, cy),
        (cx + math.cos(hour_ang) * 42, cy + math.sin(hour_ang) * 42),
        8,
    )
    oval(draw, cx, cy, 6, 6, OUTLINE, 1)
    label = f"{hour}:00"
    f = font(SERIF, 36)
    bbox = draw.textbbox((0, 0), label, font=f)
    tw = bbox[2] - bbox[0]
    draw.text((cx - tw / 2, cy + r + 12), label, fill=OUTLINE, font=f)


def cairn(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    pose: str = "stand",
    scale: float = 1.0,
) -> None:
    s = scale
    bot_rx, bot_ry = 78 * s, 48 * s
    mid_rx, mid_ry = 62 * s, 40 * s
    top_rx, top_ry = 42 * s, 28 * s
    bot_cy = y
    mid_cy = y - bot_ry - mid_ry + 10 * s
    top_cy = mid_cy - mid_ry - top_ry + 8 * s
    lean = {"walk": 8, "leave": -10, "point": 4, "sit": 0, "stand": 0}.get(pose, 0)
    oval(draw, x + lean, bot_cy, bot_rx, bot_ry, TERRACOTTA)
    oval(draw, x + lean * 0.6, mid_cy, mid_rx, mid_ry, TERRACOTTA)
    oval(draw, x, top_cy, top_rx, top_ry, OLIVE)
    for spec in ((-18, 8), (22, 12), (8, -6)):
        oval(
            draw,
            x + lean + spec[0] * s,
            bot_cy + spec[1] * s,
            5 * s,
            4 * s,
            SPEC,
            2,
        )
    for spec in ((-10, -4), (12, 6)):
        oval(draw, x + spec[0] * s, top_cy + spec[1] * s, 4 * s, 3 * s, SPEC, 2)
    face_y = mid_cy - 4 * s
    oval(draw, x - 14 * s + lean * 0.4, face_y, 5 * s, 5 * s, OUTLINE, 1)
    oval(draw, x + 16 * s + lean * 0.4, face_y, 5 * s, 5 * s, OUTLINE, 1)
    mw = 16 * s
    line(
        draw,
        (x - mw + lean * 0.4, face_y + 16 * s),
        (x + mw + lean * 0.4, face_y + 16 * s),
        max(4, int(5 * s)),
    )
    arm_y = mid_cy
    if pose == "point":
        line(draw, (x - mid_rx, arm_y), (x - mid_rx - 70 * s, arm_y + 30 * s), 7)
        line(draw, (x + mid_rx, arm_y), (x + mid_rx + 110 * s, arm_y - 20 * s), 7)
    elif pose == "sit":
        line(draw, (x - mid_rx, arm_y), (x - mid_rx - 40 * s, arm_y + 55 * s), 7)
        line(draw, (x + mid_rx, arm_y), (x + mid_rx + 55 * s, arm_y + 20 * s), 7)
    elif pose in ("walk", "leave"):
        dx = 55 * s if pose == "walk" else -55 * s
        line(draw, (x - mid_rx, arm_y), (x - mid_rx + dx, arm_y + 40 * s), 7)
        line(draw, (x + mid_rx, arm_y), (x + mid_rx + dx * 0.4, arm_y + 10 * s), 7)
    else:
        line(draw, (x - mid_rx, arm_y), (x - mid_rx - 50 * s, arm_y + 35 * s), 7)
        line(draw, (x + mid_rx, arm_y), (x + mid_rx + 50 * s, arm_y + 35 * s), 7)


def calendar(
    draw: ImageDraw.ImageDraw,
    keys: bool,
    gone: bool = False,
    crossed: bool = False,
    cx: int = 980,
    cy: int = 430,
) -> None:
    x0, y0 = cx - 280, cy - 250
    x1, y1 = cx + 280, cy + 250
    draw.rounded_rectangle([x0, y0, x1, y1], radius=28, fill=WHITE, outline=OUTLINE, width=8)
    draw.rectangle([cx - 40, y0 - 18, cx + 40, y0 + 8], fill=WHITE, outline=OUTLINE, width=6)
    title = font(SERIF, 48)
    bbox = draw.textbbox((0, 0), "Tuesday", font=title)
    tw = bbox[2] - bbox[0]
    draw.text((cx - tw / 2, y0 + 28), "Tuesday", fill=OUTLINE, font=title)
    days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    small = font(SANS, 26)
    col_w = 90
    start_x = cx - 220
    for i, day in enumerate(days):
        dx = start_x + i * col_w
        db = draw.textbbox((0, 0), day, font=small)
        dw = db[2] - db[0]
        draw.text((dx + 20 - dw / 2, y0 + 100), day, fill=OUTLINE, font=small)
        cell = [dx - 10, y0 + 140, dx + 70, y0 + 220]
        draw.rounded_rectangle(cell, radius=10, fill=CREAM, outline=OUTLINE, width=4)
        if i == 1 and keys and not gone:
            draw.rounded_rectangle(
                [dx - 16, y0 + 134, dx + 76, y1 - 40],
                radius=12,
                fill=YELLOW,
                outline=OUTLINE,
                width=6,
            )
            kfont = font(SANS_BOLD, 36)
            kb = draw.textbbox((0, 0), "KEYS", font=kfont)
            kw = kb[2] - kb[0]
            draw.text((dx + 30 - kw / 2, y0 + 170), "KEYS", fill=OUTLINE, font=kfont)
            tfont = font(SANS, 28)
            for j, t in enumerate(("7:00", "8:00")):
                tb = draw.textbbox((0, 0), t, font=tfont)
                tw2 = tb[2] - tb[0]
                draw.text(
                    (dx + 30 - tw2 / 2, y0 + 220 + j * 36),
                    t,
                    fill=OUTLINE,
                    font=tfont,
                )
            if crossed:
                draw.line(
                    [(dx - 16, y0 + 134), (dx + 76, y1 - 40)],
                    fill=OUTLINE,
                    width=10,
                )
                draw.line(
                    [(dx + 76, y0 + 134), (dx - 16, y1 - 40)],
                    fill=OUTLINE,
                    width=10,
                )


def mug(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    draw.rectangle([x, y, x + 46, y + 58], fill=TERRACOTTA, outline=OUTLINE, width=5)
    draw.arc([x + 38, y + 8, x + 72, y + 48], 270, 90, fill=OUTLINE, width=6)


def stone_pile(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    oval(draw, x - 30, y + 18, 28, 16, TERRACOTTA)
    oval(draw, x + 26, y + 20, 24, 14, OLIVE)
    oval(draw, x, y - 8, 22, 14, TERRACOTTA)


def phone(draw: ImageDraw.ImageDraw, text: str = "fire") -> None:
    x0, y0 = 720, 280
    draw.rounded_rectangle([x0, y0, x0 + 420, y0 + 280], radius=28, fill=WHITE, outline=OUTLINE, width=8)
    f = font(SANS, 28)
    draw.text((x0 + 28, y0 + 36), "I blocked time for it.", fill=OUTLINE, font=f)
    draw.rounded_rectangle(
        [x0 + 40, y0 + 100, x0 + 380, y0 + 170],
        radius=16,
        fill=YELLOW,
        outline=OUTLINE,
        width=5,
    )
    bf = font(SANS_BOLD, 36)
    bbox = draw.textbbox((0, 0), text, font=bf)
    tw = bbox[2] - bbox[0]
    draw.text((x0 + 210 - tw / 2, y0 + 118), text, fill=OUTLINE, font=bf)


def board_card(draw: ImageDraw.ImageDraw) -> None:
    x0, y0 = 560, 220
    draw.rounded_rectangle([x0, y0, x0 + 800, y0 + 360], radius=24, fill=WHITE, outline=OUTLINE, width=8)
    f = font(SERIF, 36)
    lines = [
        "What's a passion will turn",
        "into a chore.",
    ]
    for i, line_text in enumerate(lines):
        bbox = draw.textbbox((0, 0), line_text, font=f)
        tw = bbox[2] - bbox[0]
        draw.text((960 - tw / 2, y0 + 80 + i * 54), line_text, fill=OUTLINE, font=f)
    small = font(SANS, 24)
    attr = "someone on a writing board"
    ab = draw.textbbox((0, 0), attr, font=small)
    draw.text((960 - (ab[2] - ab[0]) / 2, y0 + 250), attr, fill=OUTLINE, font=small)


def cta_text(draw: ImageDraw.ImageDraw) -> None:
    f = font(SERIF, 42)
    lines = [
        "If this week's takeaway stuck, subscribe.",
        "Next one lands same time.",
    ]
    y = 48
    for line_text in lines:
        bbox = draw.textbbox((0, 0), line_text, font=f)
        tw = bbox[2] - bbox[0]
        draw.text((W / 2 - tw / 2, y), line_text, fill=OUTLINE, font=f)
        y += 58


def save(img: Image.Image, name: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / name
    img.save(path, "PNG")
    print(path.name)


def base(
    light: str = "day",
    show_door: bool = True,
    open_door: bool = True,
    show_window: bool = True,
    show_desk: bool = True,
    show_keyboard: bool = True,
    show_stool: bool = False,
    stool_pulled: bool = True,
    lid: str = "open",
    desk_x: int = 1280,
) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img, draw = room(light)
    if show_door:
        door(draw, open_door)
    if show_window:
        window(draw)
    if show_stool:
        stool(draw, pulled=stool_pulled)
    if show_desk:
        desk(draw, x=desk_x, lid=lid)
    if show_keyboard and lid != "closed":
        keyboard(draw, x=desk_x + 60)
    return img, draw


def draw_all() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    img, d = base()
    cairn(d, 960, FLOOR - 70, "stand", 1.15)
    save(img, "01-intro-this-is-cairn.png")

    img, d = room("day")
    d.rectangle([0, 820, W, H], fill=FLOOR_DAY)
    d.line([(0, 820), (W, 820)], fill=OUTLINE, width=10)
    cairn(d, 960, 820 - 40, "stand", 1.7)
    save(img, "01-intro-little-stack-of-rocks.png")

    img, d = base(show_stool=True, stool_pulled=False)
    cairn(d, 720, FLOOR - 70, "stand")
    save(img, "01-intro-lives-in-a-room.png")

    img, d = base()
    cairn(d, 1100, FLOOR - 70, "point")
    save(img, "01-intro-not-your-teacher.png")

    img, d = base(show_stool=True, stool_pulled=True)
    save(img, "02-tuesday-the-keyboard-was-just-a-keyboard.png")

    img, d = room("day")
    d.rectangle([0, 700, W, H], fill=FLOOR_DAY)
    d.line([(0, 700), (W, 700)], fill=OUTLINE, width=10)
    desk(d, x=520, w=880)
    keyboard(d, x=760, y=410)
    save(img, "02-tuesday-it-was-on-the-desk.png")

    img, d = base()
    cairn(d, 380, FLOOR - 70, "walk")
    save(img, "02-tuesday-cairn-walked-in.png")

    img, d = base()
    cairn(d, 640, FLOOR - 70, "stand")
    save(img, "02-tuesday-nobody-texted-him.png")

    img, d = base("dusk", show_stool=True)
    cairn(d, 1240, FLOOR - 200, "sit", 0.95)
    save(img, "02-tuesday-he-played-until-it-got-dark.png")

    img, d = base("dusk")
    clock(d, 7, 640, 220)
    cairn(d, 1240, FLOOR - 70, "stand")
    save(img, "02-tuesday-didnt-check-the-time.png")

    img, d = base("dusk", show_stool=True, stool_pulled=True)
    cairn(d, 520, FLOOR - 70, "stand")
    save(img, "02-tuesday-didnt-owe-the-chair.png")

    img, d = base("dusk")
    cairn(d, 1480, FLOOR - 70, "leave")
    save(img, "02-tuesday-left-when-the-song-was-done.png")

    img, d = base()
    cairn(d, 360, FLOOR - 70, "walk")
    save(img, "03-he-books-it-thats-the-fun-part.png")

    img, d = base(show_desk=True, show_keyboard=False)
    calendar(d, keys=False)
    cairn(d, 430, FLOOR - 70, "stand")
    save(img, "03-he-books-it-then-he-got-serious.png")

    img, d = base(show_keyboard=False)
    calendar(d, keys=False)
    cairn(d, 430, FLOOR - 70, "point")
    save(img, "03-he-books-it-opened-his-calendar.png")

    img, d = base(show_keyboard=False)
    calendar(d, keys=True)
    cairn(d, 430, FLOOR - 70, "point")
    save(img, "03-he-books-it-wrote-keys.png")

    img, d = room("day")
    d.rectangle([0, FLOOR, W, H], fill=FLOOR_DAY)
    d.line([(0, FLOOR), (W, FLOOR)], fill=OUTLINE, width=10)
    calendar(d, keys=True, cx=960, cy=500)
    save(img, "03-he-books-it-yellow-square.png")

    img, d = base(show_keyboard=False)
    calendar(d, keys=True)
    loc = font(SANS, 28)
    d.text((760, 720), "Where: the room", fill=OUTLINE, font=loc)
    cairn(d, 430, FLOOR - 70, "stand")
    save(img, "03-he-books-it-put-the-room-in-the-invite.png")

    img, d = base(show_keyboard=False)
    calendar(d, keys=True)
    cairn(d, 860, FLOOR - 70, "stand")
    save(img, "03-he-books-it-he-was-proud.png")

    img, d = base(show_keyboard=False)
    calendar(d, keys=True)
    cairn(d, 430, FLOOR - 70, "point")
    save(img, "04-wednesday-checked-the-square-twice.png")

    img, d = base()
    phone(d)
    cairn(d, 430, FLOOR - 70, "stand")
    save(img, "04-wednesday-told-a-friend.png")

    img, d = base("night")
    cairn(d, 980, FLOOR - 70, "walk")
    save(img, "04-wednesday-walked-past-the-keyboard.png")

    img, d = base("night", show_keyboard=False)
    calendar(d, keys=True)
    cairn(d, 430, FLOOR - 70, "stand")
    save(img, "04-wednesday-he-had-a-block-tomorrow.png")

    img, d = base("cold", show_keyboard=False)
    calendar(d, keys=True)
    save(img, "05-thursday-the-square-actually-hit.png")

    img, d = room("cold")
    d.rectangle([0, FLOOR, W, H], fill=FLOOR_COLD)
    d.line([(0, FLOOR), (W, FLOOR)], fill=OUTLINE, width=10)
    clock(d, 7, 960, 380)
    save(img, "05-thursday-clock-hits-seven.png")

    img, d = base("cold", show_stool=True, stool_pulled=True)
    clock(d, 7, 640, 210)
    save(img, "05-thursday-chairs-already-out.png")

    img, d = base("cold", show_stool=True, stool_pulled=True)
    clock(d, 7, 640, 210)
    cairn(d, 1240, FLOOR - 200, "sit", 0.95)
    save(img, "05-thursday-cairn-sits-down.png")

    img, d = base("cold", show_stool=True, stool_pulled=True)
    cairn(d, 1280, FLOOR - 200, "sit", 0.95)
    save(img, "05-thursday-hands-on-the-keys.png")

    img, d = base("cold", show_stool=True)
    cairn(d, 1240, FLOOR - 200, "sit", 0.95)
    save(img, "05-thursday-he-does-not-want-it.png")

    img, d = base("cold", show_stool=True)
    cairn(d, 1240, FLOOR - 200, "sit", 0.95)
    save(img, "05-thursday-same-keyboard-same-room.png")

    img, d = base("cold", show_stool=True)
    cairn(d, 1240, FLOOR - 200, "sit", 0.95)
    save(img, "05-thursday-hands-know-what-to-do.png")

    img, d = base("cold", show_stool=True)
    clock(d, 7, 640, 210)
    cairn(d, 1240, FLOOR - 200, "sit", 0.95)
    save(img, "05-thursday-hes-watching-the-clock.png")

    img, d = base("cold", show_stool=True, show_keyboard=False)
    calendar(d, keys=True, cx=620, cy=420)
    cairn(d, 1320, FLOOR - 200, "sit", 0.9)
    desk(d, x=1180, w=480)
    keyboard(d, x=1240)
    save(img, "05-thursday-plays-the-whole-hour.png")

    img, d = base("cold", show_stool=True, stool_pulled=True)
    clock(d, 8, 640, 210)
    cairn(d, 1100, FLOOR - 70, "stand")
    save(img, "05-thursday-block-ends.png")

    img, d = base("cold", lid="closed", show_stool=True)
    clock(d, 8, 640, 210)
    cairn(d, 1500, FLOOR - 70, "leave")
    save(img, "05-thursday-closes-the-lid.png")

    img, d = base("day")
    cairn(d, 980, FLOOR - 70, "walk")
    mug(d, 560, FLOOR - 90)
    save(img, "06-friday-walks-past-the-desk.png")

    img, d = base()
    cairn(d, 420, FLOOR - 70, "stand")
    save(img, "06-friday-keyboard-looking-at-him.png")

    img, d = base()
    cairn(d, 860, FLOOR - 70, "walk")
    mug(d, 790, FLOOR - 160)
    save(img, "06-friday-he-makes-coffee.png")

    img, d = base()
    cairn(d, 1100, FLOOR - 70, "stand")
    save(img, "06-saturday-just-looks.png")

    img, d = base()
    cairn(d, 720, FLOOR - 70, "walk")
    cairn(d, 1280, FLOOR - 70, "stand", 0.9)
    mug(d, 1180, FLOOR - 90)
    line(d, (960, 200), (960, FLOOR), 6)
    save(img, "06-saturday-used-to-want-it.png")

    img, d = base()
    mug(d, 1380, FLOOR - 250)
    cairn(d, 1500, FLOOR - 70, "leave")
    save(img, "06-saturday-puts-his-mug-down.png")

    img, d = base(show_keyboard=False)
    board_card(d)
    cairn(d, 360, FLOOR - 70, "stand")
    save(img, "07-the-name-writing-board.png")

    img, d = base()
    cairn(d, 420, FLOOR - 70, "walk")
    save(img, "07-the-name-thats-the-walk.png")

    img, d = base("cold", show_stool=True)
    calendar(d, keys=True, cx=620, cy=400)
    cairn(d, 1320, FLOOR - 200, "sit", 0.9)
    save(img, "07-the-name-work-brain.png")

    img, d = base(show_keyboard=False)
    calendar(d, keys=True)
    icons = font(SANS, 28)
    d.text((240, 200), "dinner", fill=OUTLINE, font=icons)
    d.text((240, 250), "a walk", fill=OUTLINE, font=icons)
    d.text((240, 300), "hobby", fill=OUTLINE, font=icons)
    cairn(d, 430, FLOOR - 70, "stand")
    save(img, "07-the-name-calendar-mindset.png")

    img, d = base(show_keyboard=False)
    calendar(d, keys=True)
    cairn(d, 430, FLOOR - 70, "point")
    save(img, "07-the-name-he-has-the-yellow-square.png")

    img, d = base(show_keyboard=False)
    calendar(d, keys=True)
    cairn(d, 430, FLOOR - 70, "stand")
    save(img, "08-the-move-booked-it-like-a-standup.png")

    img, d = base(show_keyboard=False)
    calendar(d, keys=True, crossed=True)
    cairn(d, 430, FLOOR - 70, "point")
    save(img, "08-the-move-deletes-tuesday-at-seven.png")

    img, d = room("day")
    d.rectangle([0, FLOOR, W, H], fill=FLOOR_DAY)
    d.line([(0, FLOOR), (W, FLOOR)], fill=OUTLINE, width=10)
    calendar(d, keys=False, gone=True, cx=960, cy=500)
    save(img, "08-the-move-square-is-gone.png")

    img, d = base()
    cairn(d, 1180, FLOOR - 70, "walk")
    save(img, "08-the-move-walks-over.png")

    img, d = base()
    cairn(d, 860, FLOOR - 70, "walk")
    save(img, "08-the-move-walks-past.png")

    img, d = base("night")
    cairn(d, 1180, FLOOR - 70, "stand")
    save(img, "08-the-move-night-test.png")

    img, d = base()
    clock(d, 4, 640, 210)
    cairn(d, 1180, FLOOR - 70, "walk")
    save(img, "08-the-move-walks-over-at-four.png")

    img, d = base(show_stool=True)
    cairn(d, 1240, FLOOR - 200, "sit", 0.95)
    save(img, "08-the-move-plays-one-song.png")

    img, d = room("day")
    d.rectangle([0, FLOOR, W, H], fill=FLOOR_DAY)
    d.line([(0, FLOOR), (W, FLOOR)], fill=OUTLINE, width=10)
    stone_pile(d, 960, 620)
    cairn(d, 1240, FLOOR - 70, "stand", 0.85)
    save(img, "08-the-move-one-stone.png")

    img, d = base(show_stool=True, stool_pulled=True)
    save(img, "08-the-move-keyboard-just-a-keyboard.png")

    img, d = base()
    cairn(d, 960, FLOOR - 70, "stand")
    cta_text(d)
    save(img, "09-cta.png")


if __name__ == "__main__":
    draw_all()
    print(f"wrote {len(list(OUT.glob('*.png')))} stills to {OUT}")
