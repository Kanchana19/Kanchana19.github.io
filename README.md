# Kanchana Jayendran — portfolio

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lenis. No GSAP, no three.js, no external runtime requests.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

All text lives in `src/lib/data.ts` and comes from the résumé (`public/resume.pdf`). Components only read from it.

## Sections

| # | Section | Component | Motion |
|---|---------|-----------|--------|
| – | Hero | `hero/Hero.tsx` | looping intro video, voice pauses when hero < 35 % visible |
| 01 | About | `sections/About.tsx`, `ui/IdCard.tsx` | pendulum lanyard ID card, 3D flip |
| 02 | Skills | `sections/Skills.tsx` | periodic table, diagonal wave, inspector |
| 03 | Work | `sections/Work.tsx` | expanding accordion gallery |
| 04 | Certifications | `sections/Certifications.tsx` | ink-flood rows |
| 05 | Experience | `sections/Experience.tsx` | scroll-drawn timeline (education + work) |
| 06 | Contact | `sections/Contact.tsx` | hopping letters, copy chip |

**Achievements is not rendered**: the résumé contains no achievements, ranks or honours, so the section and its nav link were removed rather than invented.

## Layout and typography

Arrangement and type scale follow a reference portfolio the owner supplied (layout only; none of its content, photos or name were used). Section headings are a bold sans run plus an italic serif accent (`.h2` = `clamp(34px, 4.6vw, 66px)`); the hero is a three-column grid (title left, video centre, calls to action right) with a ghost name behind; skills are compact tiles with a filled family highlight; experience years are large and right-aligned. Everything sits on one left edge (`--gutter`, `--wrap: 1700px`), including the header.

## Rebuild the hero video

```bash
python3 scripts/build-hero-assets.py \
  --src intro.mp4 --photo portrait.jpg \
  --crop 576:720:322:0 --out public
```

Needs `ffmpeg`, `numpy`, `Pillow`. Writes `hero.mp4`, `hero.webm`, `hero-poster.webp`, `portrait-bust.webp`, `og.jpg`.

- Crop is `w:h:x:y`; adjust `x` to centre the person.
- The backdrop is whitened with a per-pixel matte (the supplied video has a mid-grey backdrop, which `colorlevels` cannot fix). Tune with `--luma-lo/--luma-hi/--chroma-lo/--chroma-hi`.
- Loop: `--loop auto` (default) searches for the window whose tail and head match best, then cross-fades picture and audio in numpy (no retiming, lip-sync preserved). `--loop full` loops the whole clip; `--loop-start/--loop-end` pick a window.
- To get a full-body hero like the reference, supply a clip with a locked camera, the person centred and a plain white backdrop, then pass a new `--crop`.
- The supplied video has a camera dolly (full body → waist-up), so the full clip cannot loop cleanly; auto mode produces a 5 s loop. A locked-camera clip would allow a longer one.

`scripts/build-logos.mjs` regenerates `public/logos/*.svg` from the `simple-icons` package.

## Credits and licences

- Brand logos: [simple-icons](https://simpleicons.org) (artwork CC0; see `public/logos/LICENSE-simple-icons.md`). Trademarks belong to their owners (`DISCLAIMER-simple-icons.md`). simple-icons no longer ships Microsoft, Azure or AWS marks, so SQL Server, Azure DevOps and AWS use thin line icons.
- Fonts (SIL OFL 1.1, latin subset, self-hosted in `src/fonts`): Inter Tight, Instrument Serif, JetBrains Mono.

## Deviations from the brief

- `--mute` is `#6b6963` (brief: `#77756f`) to pass WCAG AA contrast.
- Hero video is 576×720 (native crop of a 720p source) rather than upscaled to 768.
- ID card "ID No." shows the GitHub handle and "Valid till" the MSc end year; "Dept." is "Software Engineering".
- Certifications show titles only; the résumé gives no issuers.
- The three work panels are Bubltown, the MoodForCode POS system and the MSc NL-to-SQL research; no repository links exist in the résumé, so there are no GitHub buttons.

## Known gaps

- No transcript of the intro voice was provided; add one near the hero video for accessibility.
- ESLint is not configured; `next build` type-checks.
- Lighthouse (local, headless): Performance 90, Accessibility 100, Best Practices 100, SEO 100. One `label-content-name-mismatch` warning remains.
