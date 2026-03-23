# Eddie Garcia Portfolio — Master Project File
> **Last updated:** 2026-03-22
> **Domain:** eddiegarcia.org
> **Repo:** github.com/iameddiegarcia/eddiegarcia-org
> **Branch:** main
> **Hosting:** Vercel (project: `eddiegarcia.org`, org: `team_zfC53ZwK26NtnwanvhqKt5b7`)
> **Contact:** info@eddiegarcia.org / info@omgitseddieg.com

---

## 1. Architecture Overview

The site is a **scroll-driven "Operating System" narrative** — a single-page portfolio that reveals Eddie's 11 identity dimensions across 16 narrative frames as the user scrolls. No frameworks, no build tools — pure HTML/CSS/JS deployed as static files to Vercel.

**Core concept:** "Not one thing. An operating system."

### Sub-pages
| Route | Purpose |
|-------|---------|
| `/` | Main scroll narrative (index.html) |
| `/insight/` | Insight Engine — interactive strategic insight tool |

---

## 2. File Map

```
eddiegarcia.org/
├── index.html          # Main scroll narrative (16 frames, 234 lines)
├── styles.css          # Full design system + mobile responsive (623 lines)
├── app.js              # Scroll controller, tracker nav, metric counters (181 lines)
├── project.md          # This file
├── .gitignore
├── .vercel/
│   └── project.json    # Vercel deployment config
├── images/
│   ├── intro-pondering.jpg          # Hero + Father + Christ Follower + Legacy + Unifier + CTA
│   ├── strategist-chess-seated.jpg  # Thought Leader transition
│   ├── architect-chess-standing.jpg # Strategic Architect + Systems Builder + Builder of People
│   ├── entertainer-creator.jpg      # Social Media Creator + Entertainer
│   └── artist-guitar.jpg           # Sound Designer of Emotion
└── insight/
    ├── index.html      # Insight Engine page (93 lines)
    ├── styles.css      # Dark/light theme design system (587 lines)
    └── app.js          # Topic cards, modal, sharing, theme toggle (364 lines)
```

---

## 3. Identity Framework (11 Sections, 16 Frames)

Frames flow through these identity groups:

### Foundation (Frames 0–2, bg: intro-pondering)
| Frame | Identity | Type |
|-------|----------|------|
| 0 | WHO IS EDDIE GARCIA? | Hero |
| 1 | Father | Section 01 |
| 2 | Christ Follower | Section 02 |

### Thinking / Strategy Layer (Frames 3–7)
| Frame | Identity | Type | Background | Overlay |
|-------|----------|------|------------|---------|
| 3 | "From that foundation..." | Transition quote | strategist-chess-seated | — |
| 4 | Thought Leader | Section 03 | strategist-chess-seated | grid |
| 5 | Strategic Architect | Section 04 | architect-chess-standing | nodes |
| 6 | Systems Builder | Section 05 | architect-chess-standing | charts |
| 7 | Builder of People | Section 06 | architect-chess-standing | nodes |

### Culture / Expression Layer (Frames 8–11)
| Frame | Identity | Type | Background | Overlay |
|-------|----------|------|------------|---------|
| 8 | Social Media Creator (2013–17) | Section 07 | entertainer-creator | grid |
| 9 | "Then there's Eddie G." | Transition quote | entertainer-creator | — |
| 10 | Entertainer (2017–20) | Section 08 | entertainer-creator | grid |
| 11 | Sound Designer of Emotion | Section 09 | artist-guitar | waveforms |

### Closing (Frames 12–15)
| Frame | Identity | Type | Background | Overlay |
|-------|----------|------|------------|---------|
| 12 | Legacy Builder | Section 10 | intro-pondering | blueprints |
| 13 | The Unifier | Final | intro-pondering | — |
| 14 | NOT ONE THING. AN OPERATING SYSTEM. | Closing statement | intro-pondering | — |
| 15 | Let's build something meaningful. | CTA (glass panel) | intro-pondering | — |

---

## 4. Design System

### Typography
| Token | Font | Usage |
|-------|------|-------|
| `--font-sans` | Inter | Body, labels, buttons |
| `--font-serif` | Playfair Display | Quotes, accents |
| `--font-display` | Syne | Section titles, hero text |

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | #ffffff | Page background |
| `--text-primary` | #111827 | Headings, body |
| `--text-secondary` | #4b5563 | Blurbs, descriptions |
| `--text-muted` | #9ca3af | Labels, tracker items |
| `--accent-1` | #7c6aef | Purple — primary accent, tracker glow |
| `--accent-2` | #c06aef | Magenta — gradients |
| `--accent-3` | #ef6a9a | Pink — gradients |

### Key CSS Mechanics
- **Scroll container:** `1600vh` tall section with `position: sticky; height: 100vh` inner container
- **Photo layers:** `background-size: contain` on desktop (≥1024px) to prevent head cropping; `cover` on mobile
- **Text readability:** 80vh white gradient from bottom + heavy `text-shadow` on all text
- **Overlays:** Grid, nodes, charts, waveforms, blueprints — toggled via `data-overlay` attribute
- **Mobile breakpoint:** `≤1024px` — hides persistent tracker, reduces padding from 14rem to 1.5rem, scales down type

---

## 5. Scroll Controller Logic (app.js)

The scroll engine calculates `progress` (0→1) through the 1600vh scroll distance, then:

1. **Frame activation:** `currentFrame = floor(progress × 16)` → toggles `.active` class
2. **Photo crossfade:** Reads `data-bg` from active frame → sets matching `.photo-layer` opacity to 1
3. **Overlay toggle:** Reads `data-overlay` → sets matching `.overlay-layer` opacity to 0.5
4. **Tracker sync:** Finds highest `data-target-frame` ≤ currentFrame → glows that tracker item
5. **Scroll prompt:** Fades out after 2% scroll progress
6. **Metric counters:** Triggers count-up animation at frames 8 and 10 (OMGitsEddieG + ShowDeTiburcio)
7. **Tracker click nav:** Calculates exact `targetScrollY` pixel offset for smooth-scroll to any frame

---

## 6. Insight Engine (/insight/)

A standalone interactive tool linked from the Thought Leader section (Frame 4).

### How it works
- **10 topic categories** with 5–13 insights each (87 total insights)
- User clicks a category card → modal shows a random insight (no repeats until all shown)
- Each insight has: title, quote, tags
- Share to X/LinkedIn/Facebook (copies to clipboard + opens compose)
- Dark/light theme toggle (respects system preference, saves to localStorage)

### Insight Categories
1. Organizational Systems (13 insights)
2. Workforce Strategy (11 insights)
3. Bureaucracy & Institutional Dynamics (10 insights)
4. Leadership & Influence (13 insights)
5. Technology & Transformation (9 insights)
6. HR Transformation (11 insights)
7. Organizational Culture (7 insights)
8. Process & Operational Design (5 insights)
9. Strategy & Institutional Change (5 insights)
10. Personal Strategic Philosophy (10 insights)

### Attribution
All shares include: `via @EddieGarciaLAX`

---

## 7. Embedded Social Platforms

### OMGitsEddieG (Frame 8)
| Platform | Followers | Link |
|----------|-----------|------|
| Facebook | 294K | facebook.com/OMGItsEddieG |
| YouTube | 42.7K | youtube.com/EddieG |
| Instagram | 35.4K | instagram.com/OMGitsEddieG |
| TikTok | — | tiktok.com/@omgitseddieg |

### ShowDeTiburcio (Frame 10)
| Platform | Followers | Link |
|----------|-----------|------|
| YouTube | 74.9K | youtube.com/@Tiburcio |
| Facebook | 781K | facebook.com/ShowDeTiburcio |
| Instagram | 35.4K | instagram.com/showdetiburcio |
| TikTok | 67K | tiktok.com/@showdetiburcio |

### DIGITO Music (Frame 11)
- Spotify artist embed: `6DzJumNLmIubmwnBeuoxhC`

---

## 8. Deployment

- **Platform:** Vercel (auto-deploys from `main` branch)
- **Repo:** github.com/iameddiegarcia/eddiegarcia-org
- **Analytics:** Vercel Web Analytics (`/_vercel/insights/script.js`)
- **No build step** — static HTML/CSS/JS served directly
- **Git workflow:** Feature commits on `main`, push triggers deploy

### Commit History (latest first)
```
289e0c2 feat: swap creator/entertainer order, rename with era tags
5e63097 copy: rename Philosopher in Practice to Thought Leader
633ad72 fix: scroll prompt overlap and add insight engine card to Philosopher frame
8d1250c fix: extend breakpoint to 1024px, hide scroll prompt, fix chips overflow
1830316 fix: mobile layout and add insight link to Philosopher in Practice
451964b fix: mobile layout - correct padding and font sizes for small screens
b519421 fix: remove YouTube from nav, keep LinkedIn and Contact only
6309185 fix: strengthen gradient and lower text position for legibility
2aedfcd fix: add safe padding to center-aligned frames to prevent tracker overlap
3da08a7 fix: resolve tracker/text overlap and add Tiburcio metrics
8fdd75e fix: correct LinkedIn URL and add missing CSS utility classes
0593804 docs: update project.md with new OS architecture
85db7c9 feat: complete scroll narrative architecture with persistent tracker
cf1b7f3 Initial commit - eddiegarcia.org portfolio site
```

---

## 9. Editing Guide — For Future Sessions

### To edit section text:
Look inside `.narrative-frame` divs in `index.html`. Each has `data-frame="N"`, `data-bg="N"`, and optionally `data-overlay="overlay-name"`. Don't break these attributes.

### To add/change background photos:
1. Add image to `images/`
2. Add a new `.photo-layer` div in `index.html` with a new `id="bg-photo-N"`
3. Reference it via `data-bg="N"` on the relevant narrative frames

### To add a new identity section:
1. Add a `.narrative-frame` div with the next `data-frame` number
2. Update `height: 1600vh` in `.narrative-scroll` (add 100vh per frame)
3. Add a `.tracker-item` button with matching `data-target-frame`
4. The scroll controller auto-detects frame count — no JS changes needed

### To swap to scroll-video:
Replace `.photo-layer` divs with a single `<video>` element. Update `app.js` to set `video.currentTime = progress * video.duration` instead of toggling photo opacity.

### To update Insight Engine content:
Edit the `INSIGHTS` object in `/insight/app.js`. Each category has `icon`, `color`, `desc`, and an `items` array of `{title, quote, tags}`.

---

## 10. Known Considerations

- **Mobile:** Persistent tracker is hidden below 900px. Scroll prompt is hidden below 1024px.
- **Desktop photos:** `background-size: contain` prevents head-cropping but may show white space on ultra-wide monitors.
- **Insight Engine localStorage:** Uses `localStorage` for theme persistence — works in browser but not in sandboxed artifact environments.
- **Follower counts:** Hardcoded in HTML `data-target` attributes. Update manually as needed.
- **No service worker or PWA** — purely static site.
