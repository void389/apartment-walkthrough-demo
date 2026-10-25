from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).parent
names = ["overview", "master", "spa", "baby", "bedroom", "living", "tv", "wine", "dining"]
images = []
for name in names:
    source = root / "stills" / f"{name}.png"
    assert source.exists() and source.stat().st_size > 100_000, source
    image = Image.open(source).convert("RGB")
    assert image.size == (1440, 900), (source, image.size)
    image.thumbnail((480, 300))
    card = Image.new("RGB", (480, 330), "white")
    card.paste(image, ((480 - image.width) // 2, 0))
    ImageDraw.Draw(card).text((12, 306), name.replace("-", " ").title(), fill="#3b3028")
    images.append(card)

sheet = Image.new("RGB", (1440, 990), "#e8e2d7")
for index, image in enumerate(images):
    sheet.paste(image, ((index % 3) * 480, (index // 3) * 330))
sheet.save(root / "contact-sheet.jpg", quality=90)

html = (root / "index.html").read_text(encoding="utf-8")
js = (root / "app.js").read_text(encoding="utf-8")
for name in names:
    assert f'data-view="{name}"' in html
    assert f" {name}:" in js
assert "door-toggle" in html and "doorOpen" in js
assert "toDataURL('image/png')" in js
print("PASS: 9 room views, 9 validated 1440x900 stills, door control, and PNG export")
