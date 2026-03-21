# Eddie Garcia Portfolio - Operating System Architecture

## Overview
The website at `eddiegarcia.org` has been completely rebuilt. The previous CSS Grid "Bento Box" layout was removed in favor of a massive, 16-frame, linear scroll-driven "Operating System" narrative. The site introduces Eddie's various dimensions spanning 11 core identities, smoothly crossfading text, photographic backgrounds, and stylized data overlays based on the user's scroll depth.

## Experience Architecture

### 11-Section Identity Framework
The narrative flows through 11 specific identities, grouped logically:
1. **Foundation:** Father → Christ Follower
2. **Thinking / Strategy Layer:** Philosopher in Practice → Strategic Architect → Systems Builder → Builder of People
3. **Culture / Expression Layer:** Cultural Mirror → Narrative Engineer → Sound Designer of Emotion
4. **Closing:** Legacy Builder → The Unifier

### Core Mechanisms & Files
- **`index.html`**: A massive `1600vh` tall `<section id="narrative-scroll">`. Inside is a `position: sticky; height: 100vh` container.
  - Contains `.photo-layer` divs for background photos (`intro-pondering.jpg`, `strategist-chess-seated.jpg`, `architect-chess-standing.jpg`, `entertainer-creator.jpg`, `artist-guitar.jpg`).
  - Contains `.overlay-layer` divs (CSS-generated grids, data nodes, radial charts, and waveforms) that fade in and out independently to differentiate sections sharing the same photo.
  - Contains 16 distinct `.narrative-frame` divs that define the text, embedded modules, and transition quotes for each step.
  - Features a `.persistent-tracker` menu that stays locked to the left side holding the identity list.

- **`styles.css`**: Defines the premium minimalist aesthetic.
  - Custom variables for light mode styling with `#ffffff` base.
  - `background-size: contain` is explicitly set for desktop viewports (`min-width: 1024px`) to ensure the studio photos anchor cleanly to the bottom and never clip Eddie's head.
  - Heavy `text-shadow` implementations over a `.bottom-gradient` (a 60vh tall white-to-transparent gradient) to ensure dark text maintains elite contrast regardless of what dark background element it passes over.
  - `.glowing-quote` and `.tracker-item.active` logic utilizing high-saturation text shadows (`var(--accent-1)`) for scroll-based hover and active states.
  - A bouncing "SCROLL TO EXPLORE" prompt that fades out `opacity: 0` as soon as scrolling begins.

- **`app.js`**: Replaced standard anchor linking with dynamic mathematically-calculated scroll offsets.
  - Calculates the user's `progress` (0 to 1) through the `1600vh` scroll distance.
  - Calculates the `currentFrame` (0 to 15).
  - Toggles the `.active` class on `.narrative-frame`, crossfades the appropriate `.photo-layer` linked by `data-bg`, and crossfades the `.overlay-layer` linked by `data-overlay`.
  - Determines which item in the `.persistent-tracker` should glow blue/purple by evaluating the closest `data-target-frame` below the `currentFrame`.
  - Provides custom smooth-scroll event listeners for `.tracker-item` clicks. When clicked, it calculates the exact `targetScrollY` in pixels to guarantee the user lands perfectly inside the threshold of that specific narrative frame.
  - Fires an IntersectionObserver equivalent at Frame 10 (Narrative Engineer) to dynamically count-up the `OMGitsEddieG` social metrics from zero.

### Embedded External Features
- **ShowDeTiburcio:** Button links mapped to YouTube, FB, IG, and TikTok directly nested in Frame 8.
- **OMGitsEddieG:** Follower count-ups and outbound channel links nested in Frame 10.
- **DIGITO Music:** Spotify iframe embedded in Frame 11 (Sound Designer).

## Next Steps for Future Agents
- If you intend to swap out the background `<div class="photo-layer">` static images for a single cohesive sticky scroll-video, the structural logic in `app.js` will need to update `video.currentTime` relative to the `progress` float instead of simply alternating `opacity` on the image layers.
- If the text needs editing, look strictly inside the `.narrative-frame` divs in `index.html`. Do not break the `data-bg` or `data-overlay` attributes.
