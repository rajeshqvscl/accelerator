from pathlib import Path
import math
import random

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend" / "assets" / "qvscl-hero-blueprint.png"
WIDTH, HEIGHT = 1800, 900


def font(size, bold=False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Helvetica.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
    ]
    for path in candidates:
        if path and Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def rotated_rect(layer, center, size, angle, fill, outline=None, radius=16, width=2):
    item = Image.new("RGBA", size, (0, 0, 0, 0))
    item_draw = ImageDraw.Draw(item)
    rounded(item_draw, (0, 0, size[0] - 1, size[1] - 1), radius, fill, outline, width)
    rotated = item.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    layer.alpha_composite(rotated, (int(center[0] - rotated.width / 2), int(center[1] - rotated.height / 2)))


def draw_text_rotated(layer, text, center, size, angle, fill, bold=False):
    temp = Image.new("RGBA", (360, 120), (0, 0, 0, 0))
    temp_draw = ImageDraw.Draw(temp)
    text_font = font(size, bold)
    left, top, right, bottom = temp_draw.textbbox((0, 0), text, font=text_font)
    x = (temp.width - (right - left)) / 2
    y = (temp.height - (bottom - top)) / 2 - 4
    temp_draw.text((x, y), text, font=text_font, fill=fill)
    temp = temp.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    layer.alpha_composite(temp, (int(center[0] - temp.width / 2), int(center[1] - temp.height / 2)))


def main():
    random.seed(17)
    image = Image.new("RGBA", (WIDTH, HEIGHT), "#020403")
    draw = ImageDraw.Draw(image)

    for y in range(HEIGHT):
        tone = int(7 + y / HEIGHT * 15)
        draw.line((0, y, WIDTH, y), fill=(tone, tone + 4, tone + 2, 255))

    for x in range(-80, WIDTH + 80, 58):
        draw.line((x, 0, x + 280, HEIGHT), fill=(25, 58, 43, 36), width=1)
    for y in range(40, HEIGHT, 60):
        draw.line((0, y, WIDTH, y + 90), fill=(21, 52, 39, 28), width=1)

    noise = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    noise_draw = ImageDraw.Draw(noise)
    for _ in range(4500):
        x = random.randrange(WIDTH)
        y = random.randrange(HEIGHT)
        alpha = random.randrange(8, 26)
        color = random.choice([(255, 255, 255, alpha), (6, 191, 79, alpha), (0, 0, 0, alpha)])
        noise_draw.point((x, y), fill=color)
    image = Image.alpha_composite(image, noise)
    draw = ImageDraw.Draw(image)

    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((760, 120, 1530, 760), fill=(6, 191, 79, 24))
    glow_draw.ellipse((1020, -90, 1800, 430), fill=(100, 60, 190, 18))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    image = Image.alpha_composite(image, glow)
    draw = ImageDraw.Draw(image)

    # Laptop
    rotated_rect(image, (1330, 210), (520, 330), -8, (22, 25, 24, 236), (82, 88, 84, 160), 22, 3)
    draw_text_rotated(image, "QVSCL / BUILD ROOM", (1218, 100), 20, -8, (180, 196, 188, 150), True)
    for row in range(5):
        for col in range(12):
            x = 1120 + col * 29 + row * 1
            y = 170 + row * 25
            rotated_rect(image, (x, y), (20, 12), -8, (55, 61, 58, 170), None, 3)
    rotated_rect(image, (1370, 320), (210, 106), -8, (38, 42, 40, 230), (85, 90, 88, 150), 14, 2)

    # Coffee cup
    draw.ellipse((855, 130, 1010, 285), fill=(13, 16, 15, 250), outline=(98, 103, 100, 160), width=4)
    draw.ellipse((885, 160, 980, 255), fill=(3, 5, 4, 255))
    draw.arc((825, 165, 890, 245), 78, 278, fill=(104, 108, 104, 150), width=9)
    draw.ellipse((900, 172, 964, 238), fill=(46, 30, 22, 255))

    # Sticky notes
    notes = [
        ((1060, 440), (118, 118), -9, "#b8ec62", "IDEA"),
        ((1222, 466), (118, 118), 9, "#f1bf4a", "BUILD"),
        ((1382, 501), (126, 118), 8, "#ff6aa0", "LAUNCH"),
    ]
    for center, size, angle, fill, label in notes:
        rotated_rect(image, center, size, angle, fill, (255, 255, 255, 85), 4, 1)
        draw_text_rotated(image, label, center, 28, angle, (18, 24, 20, 235), True)

    # Business model sheet
    rotated_rect(image, (880, 585), (260, 260), -13, (214, 222, 214, 72), (232, 238, 232, 84), 8, 2)
    draw_text_rotated(image, "Business Model", (833, 480), 22, -13, (14, 20, 16, 180), True)
    for offset in range(3):
        draw.line((785 + offset * 45, 540, 835 + offset * 45, 585), fill=(18, 28, 22, 140), width=3)
        draw.rectangle((765 + offset * 45, 585, 815 + offset * 45, 625), outline=(18, 28, 22, 130), width=2)
    draw.line((810, 650, 955, 690), fill=(18, 28, 22, 110), width=3)

    # User map sheet
    rotated_rect(image, (1175, 655), (340, 260), 5, (236, 240, 233, 82), (255, 255, 255, 100), 10, 2)
    draw.ellipse((1120, 610, 1210, 700), outline=(20, 28, 24, 180), width=3)
    draw_text_rotated(image, "USER", (1165, 646), 18, 5, (20, 28, 24, 190), True)
    for point in [(1040, 565), (1295, 590), (1055, 730), (1290, 745)]:
        draw.line((1165, 655, point[0], point[1]), fill=(20, 28, 24, 120), width=2)
        draw.ellipse((point[0] - 20, point[1] - 20, point[0] + 20, point[1] + 20), outline=(20, 28, 24, 135), width=2)

    # QVSCL notebook
    rotated_rect(image, (1480, 705), (250, 300), -2, (9, 14, 12, 245), (73, 82, 78, 170), 16, 2)
    draw_text_rotated(image, "QVSCL", (1480, 650), 34, -2, (230, 238, 233, 210), True)
    draw_text_rotated(image, "ACCELERATOR", (1480, 694), 16, -2, (6, 191, 79, 230), True)
    draw.line((1380, 725, 1575, 720), fill=(6, 191, 79, 140), width=2)

    # Roadmap notebook
    rotated_rect(image, (1660, 535), (245, 420), 8, (232, 229, 214, 230), (255, 255, 255, 145), 8, 2)
    draw_text_rotated(image, "Product Roadmap", (1638, 380), 25, 8, (20, 24, 22, 230), True)
    for idx, item in enumerate(["Research", "Prototype", "MVP", "Launch"]):
        y = 445 + idx * 52
        draw.rectangle((1570, y, 1593, y + 23), outline=(20, 28, 24, 190), width=2)
        draw.line((1599, y + 12, 1715, y + 28), fill=(20, 28, 24, 150), width=2)
        draw.text((1612, y - 2), item, font=font(19, False), fill=(20, 28, 24, 210))
        if idx < 3:
            draw.line((1574, y + 12, 1582, y + 20), fill=(6, 191, 79, 230), width=3)
            draw.line((1582, y + 20, 1594, y + 3), fill=(6, 191, 79, 230), width=3)

    # Pen
    rotated_rect(image, (1585, 700), (20, 260), 78, (18, 19, 18, 245), (140, 145, 140, 180), 8, 2)
    rotated_rect(image, (1485, 724), (12, 45), 78, (6, 191, 79, 255), None, 4, 1)

    # Foreground blueprint path
    for i in range(28):
        x = 745 + i * 31
        y = 820 + int(math.sin(i / 2) * 20)
        draw.ellipse((x, y, x + 5, y + 5), fill=(6, 191, 79, 80))
        if i > 0:
            prev_x = 745 + (i - 1) * 31 + 2
            prev_y = 820 + int(math.sin((i - 1) / 2) * 20) + 2
            draw.line((prev_x, prev_y, x + 2, y + 2), fill=(6, 191, 79, 35), width=2)

    vignette = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    vignette_draw = ImageDraw.Draw(vignette)
    vignette_draw.rectangle((0, 0, 520, HEIGHT), fill=(0, 0, 0, 118))
    vignette_draw.rectangle((0, HEIGHT - 220, WIDTH, HEIGHT), fill=(0, 0, 0, 115))
    image = Image.alpha_composite(image, vignette)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(OUT, quality=92, optimize=True)
    print(OUT)


if __name__ == "__main__":
    main()
