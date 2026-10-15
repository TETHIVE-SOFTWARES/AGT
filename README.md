# Ambika Global Traders — Home Page (Sample)

A single-page, animation-led concept for [ambikagt.com](https://ambikagt.com), built as a pitch
piece. Art direction: **Architectural Daylight** — a warm paper canvas, heavy ink display type, imagery
graded to a steel-on-paper duotone, and a blueprint-blue accent pulled from the existing AGT logo.

The palette is two scales in `tailwind.config.js`, `ink` (surfaces) and `bone` (type), and every
component references them by role rather than by colour. Swapping what those two resolve to flips
the whole site, so going back to the dark build — or adding a light/dark toggle — is a config
change, not a rewrite.

## Run it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

For a client demo, run the production build instead — animations and image loading are noticeably
smoother than in dev:

```bash
npm run build && npm start
```

## Stack

| Piece | Why |
| --- | --- |
| Next.js 14 (App Router) | Room to add About / Products / Events / Careers / Contact pages later |
| Tailwind CSS | Design tokens live in `tailwind.config.js` |
| GSAP + ScrollTrigger | Pinning, scrubbed timelines, horizontal scroll, counters |
| Lenis | Smooth scroll, synced to ScrollTrigger |
| next/font | Archivo Black (display), Sora (body), IBM Plex Mono (labels) |

## Page structure

| # | Section | Animation |
| --- | --- | --- |
| 00 | Preloader | Counter to 100, material names cycling, five panels wipe up |
| 01 | Hero | **Pinned** — three frames crossfade behind headlines that rack into focus; shutter opens on load, camera drifts with the pointer and floats handheld |
| 02 | Ticker | Film strip with sprocket perforations; marquee speeds up with scroll velocity |
| 03 | Who we are | Word-by-word text illumination on scrub, parallax image, counters |
| 04 | Authorized dealers | Two counter-running logo marquees, grayscale until hover |
| 05 | Products | **Pinned horizontal scroll** — 12 cards, each with a self-drawing icon, scanline sweep and framing brackets on hover |
| 06 | Why AGT | Three sticky panels that stack, scale back and dim as the next covers them, raked by volumetric beams |
| 07 | Process | Scroll-drawn rail with four steps and drawn-on icons |
| 08 | Coverage | Pulsing location grid over a drifting ghost wordmark |
| 09 | Milestones | Real events from the current site; frames wipe open, images parallax |
| 10 | Contact | Character-by-character headline, enquiry form, full contact block |
| 11 | Footer | Contact block, quick links, embedded map |

Chapter cuts (`components/Cut.jsx`) sit between sections as numbered slates, so the long scroll
reads as a sequence of takes rather than one continuous page.

## The cinematic layer

Three pieces carry the atmosphere, all fixed and non-interactive:

- **`Atmosphere.jsx`** — a canvas of drifting dust motes (110 on desktop, 45 on mobile, capped at
  1.5× DPR) plus two slow light-leak blooms in `screen` blend.
- **`CinemaHUD.jsx`** — film-gate registration marks, a scrub rail, a running timecode that treats
  the page as a 2:30 reel, and a live section label. Tablet and up only.
- **`globals.css`** — god rays, anamorphic lens flare, letterbox shutter, light sweeps across
  display type, scanlines, corner brackets, grain and vignette.

Icons are hand-drawn inline SVG in [`lib/icons.jsx`](lib/icons.jsx). Every path carries
`pathLength="1"`, so one `strokeDashoffset` tween draws any of them on regardless of real length.

All of it is suppressed under `prefers-reduced-motion`.

## Content

All copy, product data, brand claims, contact details and event history come from the live
ambikagt.com. Everything editable sits in [`lib/data.js`](lib/data.js) — change text there, not in
components.

Two things to confirm with the client:

- **Coverage list** (`areas` in `lib/data.js`) — the site states "across Kanyakumari district" but
  does not name towns. The twenty listed are district towns chosen for the layout; they should be
  replaced with the real delivery list.
- **Four brand logos** are carried over from the current site but were unlabelled there, so they
  appear in the dealer wall without names.

## Imagery

`public/img/` holds licence-free stock (Unsplash), pre-processed into WebP at the exact sizes the
layout needs (3.8 MB for the whole page, down from 13 MB of source JPEG). `public/brands/` holds
the dealer logos and the AGT mark from the current site.

Every content image renders through [`components/Media.jsx`](components/Media.jsx), which owns the
whole image look in one place:

- **Steel duotone** — the photograph is reduced to luminance, then shadows are lifted to deep
  ink-blue and highlights pulled to cool bone. Stock from a dozen unrelated shoots reads as one roll
  of film, and unlike a plain brightness cut it stays legible instead of crushing to black. The
  grade is **baked into the WebP files**, not applied at runtime — see Performance below. Colour
  originals live in `assets-src/`, so it can be re-derived or re-tuned at any time.
- **Blur-up** — each image ships a 24px inline WebP preview (generated into
  [`lib/blur.js`](lib/blur.js)), so a frame is never empty while it loads.
- **Optional hairline frame** with corner ticks, and a choice of scrim gradient.

`images.unoptimized` is on in `next.config.mjs`. The assets are already pre-sized, so Next's
on-demand optimiser had nothing to add — and on a cold cache it was queueing ~50 resize jobs on
first paint, which is why images used to arrive late. They now serve straight from `/public`.

To regenerate after swapping images:

```bash
npm i -D ffmpeg-static   # one-off, not needed to run the site
npm run images
```

[`scripts/images.mjs`](scripts/images.mjs) encodes anything in `assets-src/` into pre-sized WebP and
rebuilds `lib/blur.js`. With no `assets-src/` it just rebuilds the blur map, which is what you want
after hand-swapping a file in `public/img/`.

## Form behaviour

There is no backend. The enquiry form opens WhatsApp with a prefilled message to the yard number,
which is a genuine working path for this business. Wiring it to email or a CRM is a later step.

## Performance

Scroll smoothness on a page like this is decided almost entirely by how much the GPU has to
re-composite each frame, not by JavaScript. An earlier revision applied the image grade live, which
measured at:

| | before | after |
| --- | --- | --- |
| `mix-blend-mode` layers | 66 (≈58 viewports of area) | 3 (≈0.5) |
| Filtered elements | 80 (≈28 viewports) | 38 (≈2) |
| `backdrop-filter` layers | 6 | 0 |

What changed:

- The duotone is **baked into the WebP** instead of `grayscale()` + two blend layers per image.
- Blend modes dropped from the light leaks, god rays, dust canvas and headline sweep — on a
  near-black page `screen` looks the same as normal compositing but costs far more.
- The `blur(90px)` light leaks animate **translate only**. Scaling a blurred layer forces the blur
  to be re-rasterised every frame; translating it does not.
- Same reasoning removed `scaleX` from the lens-flare pulse (now opacity only) and `skewX` from the
  god rays.
- The film grain overlay was `inset: -200%` — a layer 25× the viewport. Now `-15%` with an 8px drift.
- `filter: blur()` no longer animates on the scrubbed hero headlines; blur on full-screen display
  type is the most expensive tween on the page.
- The dust canvas stamps one cached sprite instead of building a radial gradient per particle per
  frame (~4,200 gradients a second).

Measured after, over a 160-step scroll of the whole page: **zero long tasks**, 0 ms total blocking,
style-and-layout at 3.8 ms median / 9.4 ms worst against a 16.7 ms frame budget.

## Notes

- Respects `prefers-reduced-motion`: smooth scroll, pinning and scrubbed timelines are all skipped.
- Custom cursor is disabled on touch devices; a WhatsApp button appears there instead.
