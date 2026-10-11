#!/usr/bin/env python3
"""
Build the hero loop and its still images from the intro video.

Outputs
  public/hero/hero.mp4        H.264 (CRF 24, preset slow, yuv420p) + AAC 96 kbps, +faststart
  public/hero/hero.webm       VP9 (CRF 36) + Opus 80 kbps
  public/portrait-bust.webp   480x600 head-to-shirt still
  public/og.jpg               1200x630 social card

Pipeline
  1. Crop tightly around the person (explicit --crop "w:h:x:y", same syntax as ffmpeg).
  2. Whiten the backdrop with a per-pixel matte: pixels that are bright and
     low-chroma are pushed to pure white, skin and clothing are left alone.
     (colorlevels alone cannot do this on a mid-grey studio backdrop.)
  3. Seamless loop: pick the window [start, end) of the clip whose tail and head
     look most alike (--loop auto, the default), then cross-fade the last --xfade
     seconds of that window into its first --xfade seconds, picture AND audio,
     sample-accurately in numpy. Frames are never stretched or retimed, so lip-sync
     is preserved. Use --loop full to loop the whole clip, or --loop-start/--loop-end
     (seconds) to choose the window yourself.

Requires: ffmpeg/ffprobe on PATH, Python 3.9+, numpy, Pillow.
"""
import argparse
import json
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

SR = 48_000  # audio sample rate used for the loop


def probe(src: Path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height,r_frame_rate:format=duration",
         "-of", "json", str(src)],
        capture_output=True, text=True, check=True).stdout
    info = json.loads(out)
    s = info["streams"][0]
    num, den = s["r_frame_rate"].split("/")
    return {
        "w": int(s["width"]), "h": int(s["height"]),
        "fps": float(num) / float(den), "duration": float(info["format"]["duration"]),
    }


def auto_crop(info, aspect=0.8):
    """Centre crop at 4:5 (the hero frame aspect), full height."""
    ch = info["h"]
    cw = int(round(ch * aspect))
    return f"{cw}:{ch}:{(info['w'] - cw) // 2}:0"


def decode_video(src: Path, crop: str):
    cw, ch, _, _ = [int(v) for v in crop.split(":")]
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(src), "-an",
         "-vf", f"crop={crop}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, ch, cw, 3)


def decode_audio(src: Path) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(src), "-vn",
         "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True, check=True).stdout
    return np.frombuffer(raw, "<f4").reshape(-1, 2).astype(np.float32)


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def whiten(frame, args):
    """Matte the backdrop to pure white: bright (luma) and neutral (low chroma) pixels only."""
    f = frame.astype(np.float32)
    luma = 0.299 * f[..., 0] + 0.587 * f[..., 1] + 0.114 * f[..., 2]
    chroma = f.max(axis=2) - f.min(axis=2)
    w = smoothstep(args.luma_lo, args.luma_hi, luma) * (1.0 - smoothstep(args.chroma_lo, args.chroma_hi, chroma))
    w = w[..., None]
    return np.clip(f * (1.0 - w) + 255.0 * w, 0, 255).astype(np.uint8)


def seam_error(gray: np.ndarray, s: int, e: int, F: int) -> float:
    """Mean difference between the frames that the cross-fade will blend."""
    return float(np.abs(gray[e - F:e] - gray[s:s + F]).mean())


def find_loop_window(frames_white: np.ndarray, fps: float, xfade_s: float, min_loop_s: float):
    """Search for the [start, end) frame window with the most seamless cross-fade."""
    n = len(frames_white)
    F = int(round(xfade_s * fps))
    min_len = int(round(min_loop_s * fps))
    gray = frames_white[:, ::4, ::4, :].astype(np.float32).mean(axis=3)
    best = None
    for s in range(0, max(1, min(n // 3, int(round(3 * fps))))):
        for e in range(max(s + min_len, n - int(round(2 * fps))), n + 1):
            err = seam_error(gray, s, e, F)
            if best is None or err < best[0]:
                best = (err, s, e)
    return best


def build_loop(frames_white: np.ndarray, audio: np.ndarray, fps: float, s: int, e: int, xfade_s: float):
    """Loop the window [s, e): its last F frames cross-fade into its first F frames."""
    F = int(round(xfade_s * fps))
    fa = int(round(xfade_s * SR))
    S0 = int(round(s / fps * SR))
    E0 = int(round(e / fps * SR))
    win = frames_white[s:e]

    blended = []
    for i in range(F):
        a = i / F
        tail = win[len(win) - F + i].astype(np.float32)
        head = win[i].astype(np.float32)
        blended.append(np.clip((1 - a) * tail + a * head, 0, 255).astype(np.uint8))
    video = np.concatenate([np.stack(blended), win[F:len(win) - F]])

    A = np.zeros((E0 - S0, 2), np.float32)
    seg = audio[S0:E0]
    A[:len(seg)] = seg
    head_a = A[:fa]
    tail_a = A[len(A) - fa:]
    ramp = np.linspace(0.0, 1.0, fa, dtype=np.float32)[:, None]
    xf = (1.0 - ramp) * tail_a + ramp * head_a
    loop_audio = np.concatenate([xf, A[fa:len(A) - fa]])
    return video, loop_audio


def encode(video_raw: Path, audio_raw: Path, w: int, h: int, fps: float, out: Path, codec: str):
    base = ["ffmpeg", "-v", "error", "-y",
            "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", f"{fps}", "-i", str(video_raw),
            "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(audio_raw),
            "-map", "0:v", "-map", "1:a", "-shortest"]
    if codec == "mp4":
        cmd = base + ["-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p",
                      "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(out)]
    else:
        cmd = base + ["-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p",
                      "-c:a", "libopus", "-b:a", "80k", str(out)]
    subprocess.run(cmd, check=True)


def portrait_still(src_img: Image.Image, out: Path):
    """Head-to-shirt crop, 4:5, saved at 480x600."""
    W, H = src_img.size
    ch = int(round(W * 1.25))
    top = int(H * 0.06)
    if top + ch > H:
        ch = H - top
    cw = min(W, int(round(ch * 0.8)))
    left = (W - cw) // 2
    crop = src_img.crop((left, top, left + cw, top + ch))
    crop.resize((480, 600), Image.LANCZOS).save(out, "WEBP", quality=88, method=6)
    return crop


def og_card(portrait: Image.Image, out: Path, name: str, role: str, place: str, font_path: str | None):
    W, H = 1200, 630
    canvas = Image.new("RGB", (W, H), (244, 242, 238))  # --paper
    ph_h = 560
    ph = portrait.resize((int(ph_h * portrait.width / portrait.height), ph_h), Image.LANCZOS)
    canvas.paste(ph, (W - ph.width - 80, (H - ph_h) // 2))
    draw = ImageDraw.Draw(canvas)

    def font(size, bold=False):
        if font_path:
            try:
                return ImageFont.truetype(font_path, size)
            except OSError:
                pass
        return ImageFont.load_default(size=size)

    draw.text((80, 190), name, font=font(92, True), fill=(13, 13, 13))
    draw.text((80, 310), role, font=font(40), fill=(58, 58, 58))
    draw.text((80, 370), place, font=font(30), fill=(119, 117, 111))
    canvas.save(out, "JPEG", quality=90, optimize=True)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--src", required=True, type=Path, help="intro video")
    p.add_argument("--photo", type=Path, help="portrait photo (preferred for stills)")
    p.add_argument("--crop", help='crop "w:h:x:y"; default: centred 4:5 at full height')
    p.add_argument("--out", type=Path, default=Path("public"))
    p.add_argument("--xfade", type=float, default=0.5, help="loop cross-fade seconds")
    p.add_argument("--loop", choices=["auto", "full"], default="auto",
                   help="auto: find the most seamless window; full: loop the whole clip")
    p.add_argument("--loop-start", type=float, help="window start, seconds (overrides --loop)")
    p.add_argument("--loop-end", type=float, help="window end, seconds (overrides --loop)")
    p.add_argument("--min-loop", type=float, default=3.0, help="shortest loop the auto search may pick")
    p.add_argument("--luma-lo", type=float, default=165.0)
    p.add_argument("--luma-hi", type=float, default=190.0)
    p.add_argument("--chroma-lo", type=float, default=16.0)
    p.add_argument("--chroma-hi", type=float, default=34.0)
    p.add_argument("--name", default="Kanchana Jayendran")
    p.add_argument("--role", default="Software Engineer")
    p.add_argument("--place", default="London, UK")
    p.add_argument("--font", help="TTF file for the OG card text")
    a = p.parse_args()

    info = probe(a.src)
    crop = a.crop or auto_crop(info)
    print(f"source {info['w']}x{info['h']} @ {info['fps']:.3f}fps, {info['duration']:.2f}s; crop {crop}")

    frames = decode_video(a.src, crop)
    audio = decode_audio(a.src)
    h, w = frames.shape[1], frames.shape[2]
    print(f"decoded {len(frames)} frames at {w}x{h}")

    white = np.stack([whiten(f, a) for f in frames])
    fps = info["fps"]
    n = len(white)
    if a.loop_start is not None or a.loop_end is not None:
        s = int(round((a.loop_start or 0.0) * fps))
        e = int(round((a.loop_end if a.loop_end is not None else n / fps) * fps))
    elif a.loop == "full":
        s, e = 0, n
    else:
        err, s, e = find_loop_window(white, fps, a.xfade, a.min_loop)
        print(f"auto loop window {s / fps:.2f}s to {e / fps:.2f}s, seam error {err:.1f}")
    video, loop_audio = build_loop(white, audio, fps, s, e, a.xfade)
    print(f"loop: {len(video)} frames = {len(video) / fps:.3f}s")

    hero_dir = a.out / "hero"
    hero_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        vraw, araw = Path(tmp, "v.rgb"), Path(tmp, "a.f32")
        vraw.write_bytes(video.tobytes())
        araw.write_bytes(loop_audio.astype("<f4").tobytes())
        encode(vraw, araw, w, h, info["fps"], hero_dir / "hero.mp4", "mp4")
        encode(vraw, araw, w, h, info["fps"], hero_dir / "hero.webm", "webm")
    Image.fromarray(video[0]).save(hero_dir / "hero-poster.webp", "WEBP", quality=84, method=6)

    if a.photo:
        still_src = Image.open(a.photo).convert("RGB")
    else:
        idx = min(len(frames) - 1, int(4 * info["fps"]))
        still_src = Image.fromarray(frames[idx])
        print("no --photo given: using the frame at 4s for stills (CGI frame, consider a photo)")
    portrait = portrait_still(still_src, a.out / "portrait-bust.webp")
    og_card(portrait, a.out / "og.jpg", a.name, a.role, a.place, a.font)
    print("wrote hero.mp4, hero.webm, portrait-bust.webp, og.jpg")


if __name__ == "__main__":
    main()
