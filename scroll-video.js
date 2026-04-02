/* ═══════════════════════════════════════════════════
   SCROLL VIDEO — Frame-by-frame video scrubber
   Tied to the narrative scroll system.
   ═══════════════════════════════════════════════════ */

const ScrollVideo = (() => {
  const canvas = document.getElementById('scroll-video-canvas');
  if (!canvas) return { update() {}, isReady() { return false; } };

  const ctx = canvas.getContext('2d');

  // Frame configuration per section
  // Each key = data-frame index, value = { path, count }
  // path: folder under images/scroll-video/, count: total frames
  const SECTION_CONFIG = {
    0: { path: 'frame-0', count: 121, ext: 'jpg' },
    // Add more sections as videos arrive:
    // 1: { path: 'frame-1', count: 120, ext: 'jpg' },
    // 2: { path: 'frame-2', count: 120, ext: 'jpg' },
  };

  // Cache: sectionIndex → Image[]
  const frameCache = new Map();
  const loadingStatus = new Map(); // 'idle' | 'loading' | 'ready'
  let currentSection = -1;
  let lastDrawnFrame = -1;
  let canvasResized = false;

  const framePath = (section, index) => {
    const cfg = SECTION_CONFIG[section];
    if (!cfg) return null;
    const num = String(index + 1).padStart(4, '0');
    return `images/scroll-video/${cfg.path}/frame_${num}.${cfg.ext}`;
  };

  const resizeCanvas = (img) => {
    if (canvasResized) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvasResized = true;
  };

  const preloadSection = (sectionIndex) => {
    const cfg = SECTION_CONFIG[sectionIndex];
    if (!cfg) return;
    if (loadingStatus.get(sectionIndex) === 'loading' || loadingStatus.get(sectionIndex) === 'ready') return;

    loadingStatus.set(sectionIndex, 'loading');
    const images = new Array(cfg.count);
    let loaded = 0;

    for (let i = 0; i < cfg.count; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        loaded++;
        if (i === 0) {
          resizeCanvas(img);
          // Force-draw frame 0 as soon as it loads to avoid stale canvas
          if (currentSection === sectionIndex && lastDrawnFrame <= 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            lastDrawnFrame = 0;
          }
        }
        if (loaded === cfg.count) {
          loadingStatus.set(sectionIndex, 'ready');
        }
      };
      img.onerror = () => {
        loaded++;
        if (loaded === cfg.count) {
          loadingStatus.set(sectionIndex, 'ready');
        }
      };
      img.src = framePath(sectionIndex, i);
      images[i] = img;
    }

    frameCache.set(sectionIndex, images);
  };

  const drawFrame = (sectionIndex, frameIndex) => {
    const frames = frameCache.get(sectionIndex);
    if (!frames) return;

    const idx = Math.max(0, Math.min(frameIndex, frames.length - 1));
    if (idx === lastDrawnFrame && sectionIndex === currentSection) return;

    const img = frames[idx];
    if (img && img.complete && img.naturalWidth > 0) {
      resizeCanvas(img);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      lastDrawnFrame = idx;
    }
  };

  const hasSection = (sectionIndex) => !!SECTION_CONFIG[sectionIndex];

  // Public API called from updateScroll in app.js
  const update = (sectionIndex, frameProgress) => {
    const cfg = SECTION_CONFIG[sectionIndex];

    if (!cfg) {
      // No video for this section — hide canvas
      canvas.classList.remove('active');
      currentSection = sectionIndex;
      lastDrawnFrame = -1;
      return;
    }

    // Start preloading if needed
    preloadSection(sectionIndex);

    // Also preload next section
    const nextCfg = SECTION_CONFIG[sectionIndex + 1];
    if (nextCfg) preloadSection(sectionIndex + 1);

    // Calculate frame index from scroll progress (0→1)
    const frameIndex = Math.floor(frameProgress * (cfg.count - 1));

    // Show canvas and draw
    canvas.classList.add('active');
    if (currentSection !== sectionIndex) {
      lastDrawnFrame = -1; // Reset so first frame draws on section change
    }
    currentSection = sectionIndex;
    drawFrame(sectionIndex, frameIndex);
  };

  const isReady = (sectionIndex) => loadingStatus.get(sectionIndex) === 'ready';

  // Preload section 0 immediately
  if (SECTION_CONFIG[0]) {
    preloadSection(0);
  }

  return { update, isReady, hasSection };
})();
