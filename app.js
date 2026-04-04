/* ═══════════════════════════════════════════════════
   EDDIE GARCIA — Narrative Scroll Controller
   ═══════════════════════════════════════════════════ */

const scrollSection = document.getElementById('narrative-scroll');
const frames = document.querySelectorAll('.narrative-frame');
const portraitLayers = Array.from(document.querySelectorAll('.portrait-layer'));
const overlays = document.querySelectorAll('.overlay-layer');
const trackers = document.querySelectorAll('.tracker-item');
const progressBar = document.getElementById('scroll-progress-bar');
const chapterDockKicker = document.getElementById('chapter-dock-kicker');
const chapterDockTitle = document.getElementById('chapter-dock-title');
const chapterDockNote = document.getElementById('chapter-dock-note');
const chapterPrevButton = document.getElementById('chapter-prev');
const chapterNextButton = document.getElementById('chapter-next');
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

const applyActiveFrameVisuals = (currentFrame, {
  summaryOp = 0,
  detailsOp = 0,
  portraitBrightness = 1,
  heroTitleOp = 0
} = {}) => {
  frames.forEach((frame, idx) => {
    if (idx === currentFrame) {
      frame.style.setProperty('--summary-opacity', summaryOp.toFixed(4));
      frame.style.setProperty('--details-opacity', detailsOp.toFixed(4));
      frame.style.setProperty('--hero-title-opacity', heroTitleOp.toFixed(4));
      frame.style.setProperty('--frame-active', '1');
    } else {
      frame.style.setProperty('--summary-opacity', '0');
      frame.style.setProperty('--details-opacity', '0');
      frame.style.setProperty('--hero-title-opacity', '0');
      frame.style.setProperty('--frame-active', '0');
    }
  });

  const stickyEl = document.querySelector('.narrative-sticky');
  if (stickyEl) {
    stickyEl.style.setProperty('--portrait-brightness', clamp(portraitBrightness, 0.2, 1).toFixed(4));
  }
};

// ─── Chapter Controller ───
if (scrollSection && frames.length > 0) {
  const numFrames = frames.length;
  const REVEAL_SETTLE_MS = prefersReducedMotion.matches ? 0 : 240;
  let currentFrame = 0;
  let chapterPhase = 'preplay';
  let revealTimerId = 0;
  const revealedFrames = new Set();
  const exploredFrames = new Set([0]);
  const storyBeatNotes = {
    0: 'The story starts with principle, then expands into thought, systems, tools, people, and creative force.',
    1: 'Start with the principles. They anchor everything that follows.',
    2: 'From principle comes perspective: how leadership, systems, and institutions are interpreted.',
    3: 'Then the ideas become structure, operating design, and durable systems.',
    4: 'The structure stays alive through curiosity about technology and what it unlocks.',
    5: 'That curiosity turns into practical tools people can actually use.',
    6: 'The point of better systems is better people, stronger capability, and multiplied confidence.',
    7: 'Before the formal titles, there was the discipline of building audience and identity from scratch.',
    8: 'Then comes the ability to hold timing, energy, and trust in front of large audiences.',
    9: 'Underneath it all is artistry: writing, producing, and giving emotion its architecture.',
    10: 'This is the throughline: not a stack of roles, but one identity expressed in different rooms.',
    11: 'The story becomes tangible in the systems, engines, and products already built.',
    12: 'Everything converges here: strategy, systems, storytelling, and execution in one operator.'
  };

  const clearRevealTimer = () => {
    if (revealTimerId) {
      window.clearTimeout(revealTimerId);
      revealTimerId = 0;
    }
  };

  const getFrameSummaryTitle = (frame) => {
    return frame.querySelector('.title')?.textContent.trim()
      || Array.from(frame.querySelectorAll('.giant-text')).map((node) => node.textContent.trim()).join(' ').replace(/\s+/g, ' ');
  };

  const getFrameMeta = (frameIndex) => {
    const frame = frames[frameIndex];
    const label = frame.querySelector('.label')?.textContent.trim();
    const title = getFrameSummaryTitle(frame);
    const fallbackTitle = trackers[frameIndex]?.textContent.trim() || `Chapter ${frameIndex}`;
    return {
      kicker: frameIndex === 0 ? 'INTRO' : (label || `CHAPTER ${String(frameIndex).padStart(2, '0')}`),
      title: title || fallbackTitle
    };
  };

  const getDefaultPhaseForFrame = (frameIndex) => {
    if (frameIndex === 0) return 'preplay';
    return revealedFrames.has(frameIndex) ? 'revealed' : 'preplay';
  };

  const getDockNote = (frameIndex, phase) => {
    if (phase === 'playing') {
      return frameIndex === 0
        ? 'Intro playing. You will land on the first trait when the frame holds.'
        : `Playing the next beat. ${storyBeatNotes[frameIndex] || 'The interface returns on the held end frame.'}`;
    }
    if (phase === 'holding') {
      return 'Holding on the end frame so the still lands naturally before the interface fades in.';
    }
    if (frameIndex === 0) return 'Start the intro. Then Next keeps the story moving forward.';
    if (frameIndex === numFrames - 1) {
      return phase === 'revealed'
        ? storyBeatNotes[frameIndex]
        : 'Next will play the final section and hold on the reveal.';
    }
    if (phase === 'revealed') return storyBeatNotes[frameIndex] || 'Explore this section, then tap Next to continue.';
    return `Ready to play. ${storyBeatNotes[frameIndex] || 'Next will run this section and hold on the reveal.'}`;
  };

  const getNextLabel = (frameIndex, phase) => {
    if (phase === 'playing') return 'Playing...';
    if (phase === 'holding') return 'Settling...';
    if (frameIndex === 0) return 'Start';
    if (frameIndex === numFrames - 1) return 'Complete';
    return 'Next';
  };

  const updateDock = () => {
    const meta = getFrameMeta(currentFrame);
    if (chapterDockKicker) chapterDockKicker.textContent = meta.kicker;
    if (chapterDockTitle) chapterDockTitle.textContent = meta.title;
    if (chapterDockNote) chapterDockNote.textContent = getDockNote(currentFrame, chapterPhase);

    if (chapterPrevButton) chapterPrevButton.disabled = currentFrame === 0 || chapterPhase === 'playing' || chapterPhase === 'holding';
    if (chapterNextButton) {
      chapterNextButton.textContent = getNextLabel(currentFrame, chapterPhase);
      chapterNextButton.disabled = chapterPhase === 'playing' || chapterPhase === 'holding' || (currentFrame === numFrames - 1 && chapterPhase === 'revealed');
    }
  };

  const updateTrackerState = () => {
    trackers.forEach((tracker) => {
      const target = parseInt(tracker.getAttribute('data-target-frame'), 10);
      const isVisible = exploredFrames.has(target);
      tracker.classList.toggle('is-visible', isVisible);
      tracker.classList.toggle('active', isVisible && target === currentFrame);
      tracker.disabled = !isVisible || chapterPhase === 'playing' || chapterPhase === 'holding';
      tracker.setAttribute('aria-hidden', String(!isVisible));
      tracker.tabIndex = isVisible ? 0 : -1;
    });
  };

  const updateOverlayState = (frameIndex) => {
    const overlayId = frames[frameIndex]?.getAttribute('data-overlay');
    overlays.forEach((overlay) => {
      overlay.style.opacity = (overlayId && overlay.id === overlayId) ? 0.5 : 0;
    });
  };

  const renderFrameState = () => {
    frames.forEach((frame, idx) => {
      frame.classList.toggle('active', idx === currentFrame);
    });

    updateTrackerState();
    updateOverlayState(currentFrame);
    syncGalleryMedia(currentFrame);

    if (currentFrame !== 0 && frames[currentFrame]?.querySelector('.metric-value') && chapterPhase === 'revealed') {
      animateMetrics();
    }

    portraitLayers.forEach((layer) => layer.style.setProperty('--morph-opacity', '0'));

    if (chapterPhase === 'playing') {
      applyActiveFrameVisuals(currentFrame, {
        heroTitleOp: currentFrame === 0 ? 0 : 0,
        summaryOp: 0,
        detailsOp: 0,
        portraitBrightness: 1
      });
    } else if (chapterPhase === 'holding') {
      applyActiveFrameVisuals(currentFrame, {
        heroTitleOp: 0,
        summaryOp: 0,
        detailsOp: 0,
        portraitBrightness: 0.86
      });
      if (typeof ScrollVideo !== 'undefined') {
        ScrollVideo.showFreeze(currentFrame, 'end');
      }
    } else if (currentFrame === 0) {
      applyActiveFrameVisuals(0, {
        heroTitleOp: 1,
        summaryOp: 1,
        detailsOp: 1,
        portraitBrightness: 1
      });
      if (typeof ScrollVideo !== 'undefined') ScrollVideo.showFreeze(0, 'start');
    } else if (chapterPhase === 'revealed') {
      applyActiveFrameVisuals(currentFrame, {
        heroTitleOp: 0,
        summaryOp: 1,
        detailsOp: 1,
        portraitBrightness: 0.58
      });
      if (typeof ScrollVideo !== 'undefined') {
        ScrollVideo.showFreeze(currentFrame, 'end');
      }
    } else {
      applyActiveFrameVisuals(currentFrame, {
        heroTitleOp: 0,
        summaryOp: 0,
        detailsOp: 0,
        portraitBrightness: 1
      });
      if (typeof ScrollVideo !== 'undefined') {
        ScrollVideo.showFreeze(currentFrame, 'start');
      }
    }

    if (progressBar) {
      progressBar.style.width = `${(currentFrame / Math.max(numFrames - 1, 1)) * 100}%`;
    }

    updateDock();
  };

  const goToFrame = (frameIndex, phase = getDefaultPhaseForFrame(frameIndex)) => {
    const nextFrame = clamp(frameIndex, 0, numFrames - 1);
    clearRevealTimer();
    currentFrame = nextFrame;
    chapterPhase = phase;
    if (typeof ScrollVideo !== 'undefined') ScrollVideo.stop();
    renderFrameState();
  };

  const handlePlaybackComplete = (targetFrame) => {
    const holdFrame = targetFrame === 0 ? 1 : targetFrame;

    clearRevealTimer();
    currentFrame = holdFrame;
    chapterPhase = 'holding';
    renderFrameState();

    revealTimerId = window.setTimeout(() => {
      if (targetFrame === 0) {
        exploredFrames.add(1);
        revealedFrames.add(1);
        goToFrame(1, 'revealed');
        return;
      }

      exploredFrames.add(targetFrame);
      revealedFrames.add(targetFrame);
      goToFrame(targetFrame, 'revealed');
    }, REVEAL_SETTLE_MS);
  };

  const startPlaybackForFrame = (frameIndex) => {
    const targetFrame = clamp(frameIndex, 0, numFrames - 1);
    const playbackFrame = targetFrame === 0 || targetFrame === 1 ? 0 : targetFrame;
    clearRevealTimer();
    if (targetFrame > 0) exploredFrames.add(targetFrame);

    currentFrame = targetFrame;
    chapterPhase = 'playing';
    renderFrameState();

    if (typeof ScrollVideo !== 'undefined') {
      ScrollVideo.playChapter(playbackFrame, {
        onEnded: () => handlePlaybackComplete(targetFrame)
      });
      return;
    }

    handlePlaybackComplete(targetFrame);
  };

  const advanceJourney = () => {
    if (chapterPhase === 'playing' || chapterPhase === 'holding') return;
    if (currentFrame === 0) {
      startPlaybackForFrame(0);
      return;
    }
    if (currentFrame >= numFrames - 1) return;
    startPlaybackForFrame(currentFrame + 1);
  };

  chapterPrevButton?.addEventListener('click', () => {
    if (chapterPhase === 'playing' || chapterPhase === 'holding') return;
    goToFrame(currentFrame - 1);
  });

  chapterNextButton?.addEventListener('click', advanceJourney);

  trackers.forEach((tracker) => {
    tracker.addEventListener('click', (event) => {
      event.preventDefault();
      if (chapterPhase === 'playing' || chapterPhase === 'holding') return;
      const targetFrame = parseInt(tracker.getAttribute('data-target-frame'), 10);
      if (!Number.isNaN(targetFrame) && exploredFrames.has(targetFrame)) {
        goToFrame(targetFrame);
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (/input|textarea|select/i.test(event.target.tagName) || event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (!chapterNextButton?.disabled) advanceJourney();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (!chapterPrevButton?.disabled) goToFrame(currentFrame - 1);
    } else if ((event.key === ' ' || event.key === 'Enter') && !chapterNextButton?.disabled) {
      event.preventDefault();
      advanceJourney();
    }
  });

  renderFrameState();
}
