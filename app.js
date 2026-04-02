/* ═══════════════════════════════════════════════════
   EDDIE GARCIA — Narrative Scroll Controller
   ═══════════════════════════════════════════════════ */

const scrollSection = document.getElementById('narrative-scroll');
const frames = document.querySelectorAll('.narrative-frame');
const portraitLayers = Array.from(document.querySelectorAll('.portrait-layer'));
const overlays = document.querySelectorAll('.overlay-layer');
const trackers = document.querySelectorAll('.tracker-item');
const scrollPrompt = document.querySelector('.scroll-prompt');
const progressBar = document.getElementById('scroll-progress-bar');
const portraitLayerMap = new Map(portraitLayers.map((layer) => [layer.dataset.portrait, layer]));
const portraitImageMap = new Map(
  portraitLayers.map((layer) => [layer.dataset.portrait, layer.querySelector('img')]).filter(([, image]) => image)
);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersLitePortraits = window.matchMedia('(max-width: 820px)');
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const easeInOut = (value) => value * value * (3 - 2 * value);
const isLikelyIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const shouldUseLitePortraits = () => prefersLitePortraits.matches || isLikelyIOS;

const setLitePortraitMode = (enabled) => {
  document.body.classList.toggle('lite-portraits', enabled);
};

const hydratePortrait = (portraitKey) => {
  const image = portraitImageMap.get(portraitKey);
  if (!image) return;

  const pendingSrc = image.dataset.src;
  if (pendingSrc && image.getAttribute('src') !== pendingSrc) {
    image.setAttribute('src', pendingSrc);
  }
};

const hydrateAllPortraits = () => {
  portraitLayers.forEach((layer) => hydratePortrait(layer.dataset.portrait));
};

const syncLitePortraitAssets = (currentFrame, numFrames) => {
  const keepPortraits = new Set();
  const frameIndexes = [
    Math.max(currentFrame - 1, 0),
    currentFrame,
    Math.min(currentFrame + 1, numFrames - 1),
    Math.min(currentFrame + 2, numFrames - 1)
  ];

  frameIndexes.forEach((frameIndex) => {
    const portraitKey = frames[frameIndex]?.dataset.portrait;
    if (portraitKey) keepPortraits.add(portraitKey);
  });

  portraitImageMap.forEach((image, portraitKey) => {
    if (!image.dataset.src) return;

    if (keepPortraits.has(portraitKey)) {
      hydratePortrait(portraitKey);
      return;
    }

    if (image.hasAttribute('src')) {
      image.removeAttribute('src');
    }
  });
};

const syncPortraitAssets = (currentFrame, numFrames) => {
  const litePortraits = shouldUseLitePortraits();
  setLitePortraitMode(litePortraits);

  if (litePortraits) {
    syncLitePortraitAssets(currentFrame, numFrames);
  } else {
    hydrateAllPortraits();
  }

  return litePortraits;
};

const PRINCIPLES = {
  initiative: {
    title: 'Initiative',
    text: "Employees should be proactive in identifying opportunities and challenges. Taking the initiative to address issues and propose solutions demonstrates a commitment to the team's objectives and drives progress. In our section, this principle encourages employees to think creatively and take action to improve processes, technologies, and performance."
  },
  completed_staff_work: {
    title: 'Completed Staff Work',
    text: 'Employees should present fully developed solutions and recommendations to their supervisors, rather than incomplete ideas or problems. This principle ensures that staff members thoroughly analyze issues, consider all relevant factors, and propose actionable plans. In our section, completed staff work enhances decision-making efficiency and demonstrates a high level of professionalism and preparedness.'
  },
  responsibility: {
    title: 'Responsibility',
    text: 'Employees should take responsibility for their tasks and duties, ensuring they complete them to the best of their ability. This means being reliable and dependable, meeting deadlines, and delivering quality work. In the Strategy, Technology, and Performance section, this principle ensures that each team member contributes effectively to the overall success of the team by consistently performing their assigned tasks.'
  },
  accountability: {
    title: 'Accountability',
    text: 'Employees must be accountable for their actions and decisions. This involves owning up to mistakes, learning from them, and making necessary improvements. Accountability fosters a culture of trust and continuous improvement, which is crucial for maintaining high standards and achieving strategic goals in our section.'
  },
  ownership: {
    title: 'Ownership',
    text: 'Employees should take ownership of their work, treating it as if it were their own. This principle encourages a sense of pride and dedication, leading to higher quality outcomes and greater job satisfaction. It also means being invested in the success of the project and going above and beyond to ensure its success, which is vital for achieving our strategic goals.'
  },
  adaptability: {
    title: 'Adaptability',
    text: 'In a fast-paced environment, employees must be adaptable to change. This means being open to new ideas, technologies, and processes, and being able to pivot when necessary to meet evolving demands. Adaptability is crucial for staying competitive and innovative in the ever-changing landscape of strategy, technology, and performance.'
  },
  communication: {
    title: 'Communication',
    text: 'Clear and effective communication is essential. Employees should be able to convey information, ideas, and feedback efficiently, ensuring that everyone is on the same page and working towards common goals. In our section, this principle helps prevent misunderstandings, promotes transparency, and facilitates collaboration across different teams and departments.'
  },
  collaboration: {
    title: 'Collaboration',
    text: 'Working together as a team is crucial. Employees should be willing to share knowledge, support each other, and work towards collective success. This principle enhances innovation and problem-solving capabilities, as diverse perspectives and skills are brought together to tackle challenges and achieve strategic objectives.'
  },
  responsiveness: {
    title: 'Responsiveness',
    text: 'Being responsive to colleagues, clients, and stakeholders is vital. Employees should be prompt in their replies and actions, ensuring that issues are addressed quickly and efficiently. In our section, this principle helps maintain strong relationships, build trust, and ensure that projects stay on track.'
  },
  innovation: {
    title: 'Innovation',
    text: 'Encourage creativity and the exploration of new ideas. Innovation drives progress and helps the team stay competitive by continuously improving processes and solutions. In our section, fostering innovation ensures that we remain at the forefront of technological advancements and strategic initiatives.'
  },
  integrity: {
    title: 'Integrity',
    text: 'Employees should act with integrity, maintaining honesty and ethical standards in all their dealings. This principle builds a strong foundation of trust and respect within the team and with external partners. In our section, integrity ensures that we uphold our values and make decisions that are in the best interest of the organization and its stakeholders.'
  },
  continuous_learning: {
    title: 'Continuous Learning',
    text: 'Employees should be committed to continuous learning and development. This involves staying updated with the latest industry trends, technologies, and best practices, ensuring that the team remains competitive and innovative. In our section, continuous learning helps employees grow professionally and contributes to the overall success of the organization.'
  },
};

// ─── Principles Interaction ───
const principleButtons = document.querySelectorAll('.principle-pill');
const principleTitle = document.getElementById('principle-title');
const principleText = document.getElementById('principle-text');

if (principleButtons.length && principleTitle && principleText) {
  const setPrinciple = (key) => {
    const principle = PRINCIPLES[key];
    if (!principle) return;

    principleTitle.textContent = principle.title;
    principleText.textContent = principle.text;

    principleButtons.forEach((button) => {
      const isActive = button.dataset.principle === key;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  };

  principleButtons.forEach((button) => {
    button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    button.addEventListener('click', () => setPrinciple(button.dataset.principle));
  });

  const initialKey = document.querySelector('.principle-pill.active')?.dataset.principle || principleButtons[0].dataset.principle;
  setPrinciple(initialKey);
}

// ─── Technologist Gallery ───
const galleryTrack = document.querySelector('[data-gallery-track]');
const galleryNavButtons = document.querySelectorAll('[data-gallery-nav]');
const gallerySlides = document.querySelectorAll('.gallery-slide');
const galleryPreviewImages = Array.from(document.querySelectorAll('.gallery-slide img[data-src]'));
const galleryLightbox = document.getElementById('gallery-lightbox');
const galleryLightboxImage = document.getElementById('gallery-lightbox-image');
const galleryLightboxCaption = document.getElementById('gallery-lightbox-caption');
const galleryLightboxClose = document.getElementById('gallery-lightbox-close');
const lightboxDismissTargets = document.querySelectorAll('[data-lightbox-close]');
let galleryMediaHydrated = false;

const hydrateGalleryMedia = () => {
  if (galleryMediaHydrated) return;

  galleryPreviewImages.forEach((image) => {
    const pendingSrc = image.dataset.src;
    if (pendingSrc && image.getAttribute('src') !== pendingSrc) {
      image.setAttribute('src', pendingSrc);
    }
  });

  galleryMediaHydrated = true;
};

const syncGalleryMedia = (currentFrame = 0) => {
  if (galleryMediaHydrated) return;
  if (!shouldUseLitePortraits() || currentFrame >= 3) {
    hydrateGalleryMedia();
  }
};

if (galleryTrack && gallerySlides.length && galleryLightbox && galleryLightboxImage && galleryLightboxCaption) {
  const slideGalleryBy = (direction) => {
    const amount = galleryTrack.clientWidth * 0.85 * direction;
    galleryTrack.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const openLightbox = (button) => {
    hydrateGalleryMedia();

    const src = button.dataset.galleryImage;
    const alt = button.dataset.galleryAlt || '';
    const caption = button.dataset.galleryCaption || '';
    if (!src) return;

    galleryLightboxImage.src = src;
    galleryLightboxImage.alt = alt;
    galleryLightboxCaption.textContent = caption;
    galleryLightbox.hidden = false;
    document.body.classList.add('modal-open');
  };

  const closeLightbox = () => {
    galleryLightbox.hidden = true;
    galleryLightboxImage.src = '';
    galleryLightboxImage.alt = '';
    galleryLightboxCaption.textContent = '';
    document.body.classList.remove('modal-open');
  };

  galleryNavButtons.forEach((button) => {
    button.addEventListener('click', () => {
      slideGalleryBy(button.dataset.galleryNav === 'next' ? 1 : -1);
    });
  });

  gallerySlides.forEach((button) => {
    button.addEventListener('click', () => openLightbox(button));
  });

  galleryLightboxClose?.addEventListener('click', closeLightbox);
  lightboxDismissTargets.forEach((target) => {
    target.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !galleryLightbox.hidden) {
      closeLightbox();
    }
  });
}

// ─── Metric Counters Logic ───
const metrics = document.querySelectorAll('.metric-value');
let metricsAnimated = false;

const animateMetrics = () => {
  if (metricsAnimated) return;
  metricsAnimated = true;

  metrics.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    const increment = target / totalFrames;

    const updateCount = () => {
      frame++;
      const currentCount = Math.round(increment * frame);

      if (frame < totalFrames) {
        counter.innerText = currentCount.toLocaleString();
        requestAnimationFrame(updateCount);
      } else {
        if (target >= 10000) {
          counter.innerText = (target / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        } else {
          counter.innerText = target.toLocaleString();
        }
      }
    };
    updateCount();
  });
};

const setPortraitState = (layer, { opacity = 0, scale = 1, y = 0, blur = 0, zIndex = 1 }) => {
  layer.style.setProperty('--morph-opacity', opacity.toFixed(4));
  layer.style.setProperty('--morph-scale', scale.toFixed(4));
  layer.style.setProperty('--morph-y', `${y.toFixed(1)}px`);
  layer.style.setProperty('--morph-blur', `${blur.toFixed(1)}px`);
  layer.style.zIndex = String(zIndex);
};

/* ═══════════════════════════════════════════════════
   PHASED SCROLL REVEAL — per-frame scroll phases
   ═══════════════════════════════════════════════════
   Phase A (0.00–0.15): Portrait fades in, summary text fades in
   Phase B (0.15–0.40): Summary visible, portrait at full brightness
   Phase C (0.40–0.55): Summary fades out
   Phase D (0.55–0.70): Portrait dims to 20%, details start fading in
   Phase E (0.70–0.90): Details fully visible over dimmed portrait
   Phase F (0.90–1.00): Everything fades, morph to next portrait
   ═══════════════════════════════════════════════════ */

const computeFramePhases = (fp) => {
  // fp = frameProgress 0..1 within the current frame
  const summaryIn    = easeInOut(clamp(fp / 0.15, 0, 1));
  const summaryOut   = 1 - easeInOut(clamp((fp - 0.40) / 0.15, 0, 1));
  const summaryOp    = Math.min(summaryIn, summaryOut);

  const detailsIn    = easeInOut(clamp((fp - 0.55) / 0.15, 0, 1));
  const detailsOut   = 1 - easeInOut(clamp((fp - 0.90) / 0.10, 0, 1));
  const detailsOp    = Math.min(detailsIn, detailsOut);

  // Portrait brightness: full (1) until 0.50, then dims to 0.20 by 0.65
  const dimProgress  = easeInOut(clamp((fp - 0.50) / 0.15, 0, 1));
  const portraitBrightness = 1 - (dimProgress * 0.80); // 1.0 → 0.20

  // Morph to next portrait starts at 0.90
  const morphProgress = easeInOut(clamp((fp - 0.90) / 0.10, 0, 1));

  return { summaryOp, detailsOp, portraitBrightness, morphProgress };
};

const updatePortraitMorph = (currentFrame, frameProgress, numFrames) => {
  if (!portraitLayers.length) return;

  const activeFrameEl = frames[currentFrame];
  const nextFrameIndex = Math.min(currentFrame + 1, numFrames - 1);
  const nextFrameEl = frames[nextFrameIndex];
  const currentPortrait = activeFrameEl?.dataset.portrait;
  const nextPortrait = nextFrameEl?.dataset.portrait || currentPortrait;
  const litePortraits = syncPortraitAssets(currentFrame, numFrames);
  const reducedMotion = prefersReducedMotion.matches;

  const phases = computeFramePhases(frameProgress);

  // Set CSS custom properties on each frame for summary/details opacity
  frames.forEach((frame, idx) => {
    if (idx === currentFrame) {
      frame.style.setProperty('--summary-opacity', phases.summaryOp.toFixed(4));
      frame.style.setProperty('--details-opacity', phases.detailsOp.toFixed(4));
      frame.style.setProperty('--frame-active', '1');
    } else {
      frame.style.setProperty('--summary-opacity', '0');
      frame.style.setProperty('--details-opacity', '0');
      frame.style.setProperty('--frame-active', '0');
    }
  });

  // Portrait dim overlay
  const stickyEl = document.querySelector('.narrative-sticky');
  if (stickyEl) {
    stickyEl.style.setProperty('--portrait-brightness', phases.portraitBrightness.toFixed(4));
  }

  // Reset all portrait layers
  portraitLayers.forEach((layer) => {
    setPortraitState(layer, {
      opacity: 0,
      scale: 1.015,
      y: 12,
      blur: reducedMotion ? 0 : 4,
      zIndex: 1
    });
  });

  const currentLayer = portraitLayerMap.get(currentPortrait);
  const nextLayer = portraitLayerMap.get(nextPortrait);
  const morph = phases.morphProgress;

  if (litePortraits) {
    if (currentLayer) {
      setPortraitState(currentLayer, {
        opacity: 1,
        scale: 1,
        y: 0,
        blur: 0,
        zIndex: 3
      });
    }
    return;
  }

  if (currentPortrait === nextPortrait || currentFrame === numFrames - 1) {
    if (currentLayer) {
      setPortraitState(currentLayer, {
        opacity: 1,
        scale: 1,
        y: 0,
        blur: 0,
        zIndex: 3
      });
    }
    return;
  }

  if (currentLayer) {
    setPortraitState(currentLayer, {
      opacity: 1 - morph,
      scale: 1 - (morph * 0.02),
      y: -8 * morph,
      blur: reducedMotion ? 0 : 2.5 * morph,
      zIndex: 2
    });
  }

  if (nextLayer) {
    setPortraitState(nextLayer, {
      opacity: morph,
      scale: 1.02 - (morph * 0.02),
      y: 12 * (1 - morph),
      blur: reducedMotion ? 0 : 4 * (1 - morph),
      zIndex: 3
    });
  }
};

// ─── Main Scroll Controller ───
if (scrollSection && frames.length > 0) {
  const numFrames = frames.length;
  let activeFrameIndex = -1;
  let isTicking = false;
  scrollSection.style.height = `${numFrames * 150}vh`;
  syncPortraitAssets(0, numFrames);
  syncGalleryMedia(0);

  const updateScroll = () => {
    const rect = scrollSection.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    
    const windowHeight = window.innerHeight;
    const scrollDistance = sectionHeight - windowHeight;
    
    let progress = -sectionTop / scrollDistance;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    const frameProgressValue = progress * numFrames;
    let currentFrame = Math.floor(frameProgressValue);
    if (currentFrame >= numFrames) currentFrame = numFrames - 1;
    const frameProgress = currentFrame === numFrames - 1 ? 1 : frameProgressValue - currentFrame;
    const activeFrameEl = frames[currentFrame];

    syncGalleryMedia(currentFrame);

    // Scroll-driven video scrubber
    const hasVideo = typeof ScrollVideo !== 'undefined' && ScrollVideo.hasSection(currentFrame);
    const videoMode = hasVideo ? ScrollVideo.getMode(currentFrame) : null;

    if (hasVideo) {
      ScrollVideo.update(currentFrame, frameProgress);

      // Hide portrait layers — video canvas replaces them
      portraitLayers.forEach(layer => {
        layer.style.setProperty('--morph-opacity', '0');
      });

      if (videoMode === 'fullscreen') {
        // Fullscreen hero sequence:
        //   0-8%:   Title visible, nothing else
        //   8-20%:  Manifesto fades in
        //   20-35%: Chips fade in
        //   35-50%: All visible together
        //   40-55%: Everything fades out (chair pull begins)
        //   55%+:   Clean video only through end of section
        const fp = frameProgress;
        const eio = (v) => v * v * (3 - 2 * v);
        const cl = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

        // Title: visible at start (1), fades out at 40-55%
        const titleOp = 1 - eio(cl((fp - 0.40) / 0.15, 0, 1));

        // Manifesto: fades in at 8-20%, out at 40-55%
        const summaryIn = eio(cl((fp - 0.08) / 0.12, 0, 1));
        const summaryOut = 1 - eio(cl((fp - 0.40) / 0.15, 0, 1));
        const summaryOp = Math.min(summaryIn, summaryOut);

        // Chips: fade in at 20-35%, out at 42-55%
        const detailsIn = eio(cl((fp - 0.20) / 0.15, 0, 1));
        const detailsOut = 1 - eio(cl((fp - 0.42) / 0.13, 0, 1));
        const detailsOp = Math.min(detailsIn, detailsOut);

        frames.forEach((frame, idx) => {
          if (idx === currentFrame) {
            frame.style.setProperty('--hero-title-opacity', titleOp.toFixed(4));
            frame.style.setProperty('--summary-opacity', summaryOp.toFixed(4));
            frame.style.setProperty('--details-opacity', detailsOp.toFixed(4));
            frame.style.setProperty('--frame-active', '1');
          } else {
            frame.style.setProperty('--hero-title-opacity', '0');
            frame.style.setProperty('--summary-opacity', '0');
            frame.style.setProperty('--details-opacity', '0');
            frame.style.setProperty('--frame-active', '0');
          }
        });
      } else if (videoMode === 'intro' || videoMode === 'carryover') {
        const fp = frameProgress;
        const eio = (v) => v * v * (3 - 2 * v);
        const cl = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

        let phases;
        if (videoMode === 'carryover') {
          // Carryover: frame is already frozen from start.
          // Dim immediately (0–0.15), summary (0.05–0.20), details (0.20–0.35).
          const dimProgress = eio(cl(fp / 0.15, 0, 1));
          const portraitBrightness = 1 - (dimProgress * 0.80);
          const summaryIn = eio(cl((fp - 0.05) / 0.15, 0, 1));
          const summaryOut = 1 - eio(cl((fp - 0.80) / 0.10, 0, 1));
          const summaryOp = Math.min(summaryIn, summaryOut);
          const detailsIn = eio(cl((fp - 0.20) / 0.15, 0, 1));
          const detailsOut = 1 - eio(cl((fp - 0.85) / 0.10, 0, 1));
          const detailsOp = Math.min(detailsIn, detailsOut);
          phases = { summaryOp, detailsOp, portraitBrightness };
        } else {
          // Intro: video scrubs first ~45%, then freezes.
          // Dim (0.45–0.60), summary (0.50–0.65), details (0.60–0.75).
          const dimProgress = eio(cl((fp - 0.45) / 0.15, 0, 1));
          const portraitBrightness = 1 - (dimProgress * 0.80);
          const summaryIn = eio(cl((fp - 0.50) / 0.15, 0, 1));
          const summaryOut = 1 - eio(cl((fp - 0.85) / 0.10, 0, 1));
          const summaryOp = Math.min(summaryIn, summaryOut);
          const detailsIn = eio(cl((fp - 0.60) / 0.15, 0, 1));
          const detailsOut = 1 - eio(cl((fp - 0.90) / 0.10, 0, 1));
          const detailsOp = Math.min(detailsIn, detailsOut);
          phases = { summaryOp, detailsOp, portraitBrightness };
        }
        const stickyEl = document.querySelector('.narrative-sticky');
        if (stickyEl) {
          stickyEl.style.setProperty('--portrait-brightness', phases.portraitBrightness.toFixed(4));
        }
        frames.forEach((frame, idx) => {
          if (idx === currentFrame) {
            frame.style.setProperty('--summary-opacity', phases.summaryOp.toFixed(4));
            frame.style.setProperty('--details-opacity', phases.detailsOp.toFixed(4));
            frame.style.setProperty('--frame-active', '1');
          } else {
            frame.style.setProperty('--summary-opacity', '0');
            frame.style.setProperty('--details-opacity', '0');
            frame.style.setProperty('--frame-active', '0');
          }
        });
      }
    } else {
      if (typeof ScrollVideo !== 'undefined') ScrollVideo.update(currentFrame, frameProgress);
      updatePortraitMorph(currentFrame, frameProgress, numFrames);
    }

    // Continuous frame activation (no binary toggle)
    const isActive = (idx) => idx === currentFrame;

    frames.forEach((frame, idx) => {
      frame.classList.toggle('active', isActive(idx));
    });

    if (currentFrame !== activeFrameIndex) {
      activeFrameIndex = currentFrame;

      // Trigger metric counters on Creator/Entertainer frames
      if (activeFrameEl.querySelector('.metric-value')) {
        animateMetrics();
      }

      // Activate Overlays
      const overlayId = activeFrameEl.getAttribute('data-overlay');
      overlays.forEach(overlay => {
        if (overlayId && overlay.id === overlayId) {
          overlay.style.opacity = 0.5;
        } else {
          overlay.style.opacity = 0;
        }
      });
    }

    // 4. Update Persistent Tracker
    let bestTrackerTarget = 0;
    trackers.forEach(t => {
      const target = parseInt(t.getAttribute('data-target-frame'), 10);
      if (currentFrame >= target) bestTrackerTarget = target;
    });
    trackers.forEach(t => {
      if (parseInt(t.getAttribute('data-target-frame'), 10) === bestTrackerTarget) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // 5. Scroll Prompt fade-out
    if (scrollPrompt) {
      if (progress > 0.02) scrollPrompt.classList.add('fade-out');
      else scrollPrompt.classList.remove('fade-out');
    }

    // 6. Progress bar
    if (progressBar) progressBar.style.width = (progress * 100) + '%';
  };

  const requestScrollUpdate = () => {
    if (isTicking) return;
    isTicking = true;
    requestAnimationFrame(() => {
      updateScroll();
      isTicking = false;
    });
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  
  // Custom navigation link logic
  trackers.forEach(link => {
    link.addEventListener('click', (event) => {
      const targetFrame = parseInt(event.currentTarget.getAttribute('data-target-frame'), 10);
      if (!isNaN(targetFrame)) {
        const targetProgress = (targetFrame + 0.1) / numFrames; 
        
        const rect = scrollSection.getBoundingClientRect();
        const sectionTopAbsolute = rect.top + window.scrollY;
        const sectionHeight = scrollSection.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollDistance = sectionHeight - windowHeight;
        
        const targetScrollY = sectionTopAbsolute + (targetProgress * scrollDistance);
        
        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      }
    });
  });

  // Init
  updateScroll();
}
