# Eddie Garcia Portfolio - Project Plan

## Overview
A centralized personal hub built using an advanced CSS Grid "Bento box" layout, featuring a cinematic scroll-driven intro section that reveals the five different identities of Eddie Garcia before showing the bento grid.

## Scroll-Driven Intro Section

A cinematic, editorial scroll experience that opens the portfolio with a "Who is Eddie Garcia?" question. The bento grid appears below after all chapters play through.

### Design Vision
- **Full viewport**, white background to blend seamlessly with the studio portrait backgrounds.
- **Sticky container** — the section sticks to the top of the viewport while a tall scroll spacer drives the animation below it.
- **Giant editorial text** — "Who is Eddie Garcia?" in a very large, bold, modern font (like Syne), positioned so Eddie appears to look up at it.
- **5 Chapters**, crossfading based on scroll position:

| # | Photo | Title | Subtitle |
|---|-------|-------|----------|
| 1 | Pondering / hand on chin | *Who is Eddie Garcia?* | — |
| 2 | Seated at chess board | The Strategist | Systems thinker. Thought leader. Philosopher. |
| 3 | Standing at chess board | The Architect | Designing organizations, teams & technology. |
| 4 | Playing guitar | The Artist | Musician. Creator. Storyteller. |
| 5 | Camera / mic / ring light | The Entertainer | Comedian. Host. 1M+ reach across platforms. |

- **Transition:** Previous photo fades out, new photo fades in, text slides up from below.
- **Progress indicators:** Vertical dots on the right side highlight the active chapter.

### Implementation Details
- **index.html**: Add a new `<section id="polymath-scroll">` before the main `.bento-grid`. Contains the sticky container and individual `.polymath-slide` elements.
- **styles.css**: Create a `500vh` scroll height. `.polymath-sticky` gets `position: sticky; top: 0; h-screen`. Slides are stacked absolutely with opacity transitions. Add the `Syne` Google Font.
- **app.js**: Add a scroll listener to calculate the active chapter based on standard scroll percentage through the `500vh` element, updating opacities and progress dots accordingly.

## Core Architecture
- **HTML**: Semantic grid structure defining the column layout and nested widget cards.
- **CSS**: Pure CSS variables, CSS Grid, and responsive stacking, featuring glassmorphism elements, drop shadows, and deep dark/light mode toggles.
- **JS**: Vanilla JavaScript handling the live location clock, theme persistence (localStorage), email copy interactions, and the complex scroll progression calculations.

## Included Components
- **Insight Engine (App):** Secondary application for browsing strategic insights.
- **Music Widget:** Embedded Spotify iFrame.
- **Animated Metrics:** IntersectionObserver-triggered animated count-ups for social media profiles.
- **Clock Widget:** Real-time JavaScript clock checking local timezone.
