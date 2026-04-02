/* ═══════════════════════════════════════════════════
   SCROLL VIDEO — Frame-by-frame video scrubber
   Tied to the narrative scroll system.

   Two modes per section:
   - "fullscreen" (e.g. hero): video fills entire scroll range, no text overlay
   - "intro" (e.g. section 1+): video plays in first ~45% of scroll,
     then freezes on last frame while text/content fades in over dimmed frame
   ═══════════════════════════════════════════════════ */

const ScrollVideo = (() => {
  const canvas = document.getElementById('scroll-video-canvas');
  if (!canvas) return { update() {}, isReady() { return false; }, hasSection() { return false; }, getMode() { return null; } };

  const ctx = canvas.getContext('2d');

  // Frame configuration per section
  // mode: "fullscreen" = video fills entire scroll range (hero)
  //       "intro" = video plays first portion, then freezes for content overlay
  //       "carryover" = no video of its own; shows frozen last frame from another section
  // scrubEnd: for "intro" mode, the frameProgress value at which video reaches last frame
  // fromSection: for "carryover" mode, which section's last frame to use
  const SECTION_CONFIG = {
    0: { path: 'frame-0', count: 121, ext: 'jpg', mode: 'fullscreen' },
    1: { mode: 'carryover', fromSection: 0 },
    2: { path: 'frame-2', count: 121, ext: 'jpg', mode: 'intro', scrubEnd: 0.45 },
    3: { path: 'frame-3', count: 121, ext: 'jpg', mode: 'intro', scrubEnd: 0.45 },
    4: { path: 'frame-4', count: 121, ext: 'jpg', mode: 'intro', scrubEnd: 0.45 },
    5: { path: 'frame-5', count: 121, ext: 'jpg', mode: 'intro', scrubEnd: 0.45 },
    6: { path: 'frame-6', count: 121, ext: 'jpg', mode: 'intro', scrubEnd: 0.45 },
    7: { path: 'frame-7', count: 121, ext: 'jpg', mode: 'intro', scrubEnd: 0.45 },
    8: { path: 'frame-8', count: 121, ext: 'jpg', mode: 'intro', scrubEnd: 0.45 },
    9: { path: 'frame-9', count: 121, ext: 'jpg', mode: 'intro', scrubEnd: 0.45 },
    10: { path: 'frame-10', count: 121, ext: 'jpg', mode: 'intro', scrubEnd: 0.45 },
  };

  // Cache: sectionIndex → Image[]
  const frameCache = new Map();
  const loadingStatus = new Map();
  let currentSection = -1;
  let lastDrawnFrame = -1;
  let canvasResized = false;

  const framePath = (section, index) => {
    const cfg = SECTION_CONFIG[section];
    if (!cfg) return null;
    const num = String(index + 1).padStart(4, '0');
    return `images/scroll-video/${cfg.path}/frame_${num}.${cfg.ext}`;
  };

  // Store native image dimensions for contain-fit calculation
  let nativeW = 0;
  let nativeH = 0;

  const resizeCanvas = (img) => {
    nativeW = img.naturalWidth;
    nativeH = img.naturalHeight;

    // Canvas matches viewport exactly — we draw contain-fit inside it
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (canvas.width !== vw || canvas.height !== vh) {
      canvas.width = vw;
      canvas.height = vh;
    }
    canvasResized = true;
  };

  // Compute contain-fit rectangle: full image visible, centered, with bg fill
  const getContainRect = () => {
    const vw = canvas.width;
    const vh = canvas.height;
    if (!nativeW || !nativeH) return { x: 0, y: 0, w: vw, h: vh };

    const imgAspect = nativeW / nativeH;
    const vpAspect = vw / vh;

    let dw, dh;
    if (imgAspect > vpAspect) {
      // Image wider than viewport — fit to width
      dw = vw;
      dh = vw / imgAspect;
    } else {
      // Image taller than viewport — fit to height
      dh = vh;
      dw = vh * imgAspect;
    }
    return { x: (vw - dw) / 2, y: (vh - dh) / 2, w: dw, h: dh };
  };

  // Re-calculate on window resize
  window.addEventListener('resize', () => {
    canvasResized = false;
    lastDrawnFrame = -1;
  });

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
          sampleBgColor(sectionIndex, img);
          if (currentSection === sectionIndex && lastDrawnFrame <= 0) {
            const bg = bgColors.get(sectionIndex) || '#f5f5f5';
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const r = getContainRect();
            ctx.drawImage(img, r.x, r.y, r.w, r.h);
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

  // Sample the background color from the top-left corner of the first frame
  const bgColors = new Map(); // sectionIndex → color string
  const sampleBgColor = (sectionIndex, img) => {
    if (bgColors.has(sectionIndex)) return;
    try {
      const tmp = document.createElement('canvas');
      tmp.width = img.naturalWidth;
      tmp.height = img.naturalHeight;
      const tCtx = tmp.getContext('2d');
      tCtx.drawImage(img, 0, 0);
      // Sample a 4x4 block at top-left corner
      const d = tCtx.getImageData(2, 2, 4, 4).data;
      const r = d[0], g = d[1], b = d[2];
      bgColors.set(sectionIndex, `rgb(${r},${g},${b})`);
    } catch (e) {
      bgColors.set(sectionIndex, '#f5f5f5');
    }
  };

  const drawFrame = (sectionIndex, frameIndex) => {
    const frames = frameCache.get(sectionIndex);
    if (!frames) return;

    const idx = Math.max(0, Math.min(frameIndex, frames.length - 1));
    if (idx === lastDrawnFrame && sectionIndex === currentSection) return;

    const img = frames[idx];
    if (img && img.complete && img.naturalWidth > 0) {
      resizeCanvas(img);

      // Sample background color from first frame
      if (!bgColors.has(sectionIndex) && frames[0]?.complete) {
        sampleBgColor(sectionIndex, frames[0]);
      }

      // Fill background with sampled color (covers letterbox areas)
      const bg = bgColors.get(sectionIndex) || '#f5f5f5';
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image with contain-fit (full figure visible, centered)
      const r = getContainRect();
      ctx.drawImage(img, r.x, r.y, r.w, r.h);
      lastDrawnFrame = idx;
    }
  };

  const hasSection = (sectionIndex) => !!SECTION_CONFIG[sectionIndex];
  const getMode = (sectionIndex) => SECTION_CONFIG[sectionIndex]?.mode || null;

  const update = (sectionIndex, frameProgress) => {
    const cfg = SECTION_CONFIG[sectionIndex];

    if (!cfg) {
      canvas.classList.remove('active');
      currentSection = sectionIndex;
      lastDrawnFrame = -1;
      return;
    }

    // Carryover mode: show frozen last frame from another section
    if (cfg.mode === 'carryover') {
      const srcSection = cfg.fromSection;
      const srcCfg = SECTION_CONFIG[srcSection];
      if (!srcCfg) return;
      preloadSection(srcSection);
      // Also preload next section's video
      const nextCfg = SECTION_CONFIG[sectionIndex + 1];
      if (nextCfg && nextCfg.path) preloadSection(sectionIndex + 1);

      canvas.classList.add('active');
      if (currentSection !== sectionIndex) {
        lastDrawnFrame = -1;
      }
      currentSection = sectionIndex;
      // Always draw the last frame of the source section
      drawFrame(srcSection, srcCfg.count - 1);
      return;
    }

    preloadSection(sectionIndex);
    const nextCfg = SECTION_CONFIG[sectionIndex + 1];
    if (nextCfg && nextCfg.path) preloadSection(sectionIndex + 1);

    // Calculate frame index based on mode
    let frameIndex;
    if (cfg.mode === 'intro') {
      const scrubEnd = cfg.scrubEnd || 0.45;
      const videoProgress = Math.min(frameProgress / scrubEnd, 1);
      frameIndex = Math.floor(videoProgress * (cfg.count - 1));
    } else {
      frameIndex = Math.floor(frameProgress * (cfg.count - 1));
    }

    canvas.classList.add('active');
    if (currentSection !== sectionIndex) {
      lastDrawnFrame = -1;
    }
    currentSection = sectionIndex;
    drawFrame(sectionIndex, frameIndex);
  };

  const isReady = (sectionIndex) => loadingStatus.get(sectionIndex) === 'ready';

  // Preload section 0 immediately
  if (SECTION_CONFIG[0]) preloadSection(0);

  return { update, isReady, hasSection, getMode };
})();
