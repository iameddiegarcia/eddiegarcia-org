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

  // Performance: Alpha false for faster context, and pre-calculate isMobile
  const ctx = canvas.getContext('2d', { alpha: false });
  const isMobile = /iPad|iPhone|iPod|Android/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const mobileFrameStep = 2; // load every 2nd frame on mobile for 50% memory saving

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
    11: { path: 'tools', count: 121, ext: 'jpg', mode: 'intro', scrubEnd: 0.45 },
    12: { path: 'contact', count: 121, ext: 'jpg', mode: 'intro', scrubEnd: 0.45 },
  };

  const frameCache = new Map();
  const loadingStatus = new Map();
  let currentSection = -1;
  let lastDrawnFrame = -1;
  let canvasResized = false;
  let cachedContainRect = null;

  const framePath = (section, index) => {
    const cfg = SECTION_CONFIG[section];
    if (!cfg) return null;
    const num = String(index + 1).padStart(4, '0');
    return `images/scroll-video/${cfg.path}/frame_${num}.${cfg.ext}`;
  };

  let nativeW = 0;
  let nativeH = 0;

  const resizeCanvas = (img) => {
    if (img) {
      nativeW = img.naturalWidth;
      nativeH = img.naturalHeight;
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (canvas.width !== vw || canvas.height !== vh) {
      canvas.width = vw;
      canvas.height = vh;
    }
    canvasResized = true;
    cachedContainRect = null; // Invalidate
  };

  const getContainRect = () => {
    if (cachedContainRect) return cachedContainRect;
    const vw = canvas.width;
    const vh = canvas.height;
    if (!nativeW || !nativeH) return { x: 0, y: 0, w: vw, h: vh };

    const imgAspect = nativeW / nativeH;
    const vpAspect = vw / vh;
    let dw, dh;
    if (imgAspect > vpAspect) {
      dw = vw;
      dh = vw / imgAspect;
    } else {
      dh = vh;
      dw = vh * imgAspect;
    }
    cachedContainRect = { x: (vw - dw) / 2, y: (vh - dh) / 2, w: dw, h: dh };
    return cachedContainRect;
  };

  window.addEventListener('resize', () => {
    canvasResized = false;
    lastDrawnFrame = -1;
  });

  const unloadSection = (idx) => {
    if (frameCache.has(idx)) {
      const frames = frameCache.get(idx);
      if (frames) {
        frames.forEach(img => { if (img) img.src = ''; });
      }
      frameCache.delete(idx);
      loadingStatus.delete(idx);
    }
  };

  const manageMemory = (activeIdx) => {
    // Sliding Window: allow active, active-1, active+1
    const keep = new Set([activeIdx, activeIdx - 1, activeIdx + 1]);
    
    // Also keep dependencies for carryover mode
    const cfg = SECTION_CONFIG[activeIdx];
    if (cfg && cfg.mode === 'carryover') keep.add(cfg.fromSection);

    loadingStatus.forEach((status, idx) => {
      if (!keep.has(idx)) unloadSection(idx);
    });
  };

  const preloadSection = (sectionIndex) => {
    const cfg = SECTION_CONFIG[sectionIndex];
    if (!cfg || cfg.mode === 'carryover') return;
    if (loadingStatus.get(sectionIndex) === 'loading' || loadingStatus.get(sectionIndex) === 'ready') return;

    loadingStatus.set(sectionIndex, 'loading');
    const images = new Array(cfg.count);
    let loaded = 0;
    
    // Performance: Use a step logic (even on desktop) if the section has many frames
    // This reduces the per-section memory and paint overhead by 25-50%
    let step = 1;
    if (isMobile) step = mobileFrameStep;
    else if (cfg.count > 100) step = 1.25; // Slight skip on desktop for high-count sequences

    for (let i = 0; i < cfg.count; i++) {
      if (Math.floor(i % step) !== 0 && i !== cfg.count - 1) {
        images[i] = null;
        loaded++;
        continue;
      }
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        loaded++;
        if (i === 0) {
          resizeCanvas(img);
          sampleBgColor(sectionIndex, img);
        }
        if (loaded === cfg.count) loadingStatus.set(sectionIndex, 'ready');
      };
      img.onerror = () => {
        loaded++;
        if (loaded === cfg.count) loadingStatus.set(sectionIndex, 'ready');
      };
      img.src = framePath(sectionIndex, i);
      images[i] = img;
    }
    frameCache.set(sectionIndex, images);
  };

  const bgColors = new Map();
  const sampleBgColor = (sectionIndex, img) => {
    if (bgColors.has(sectionIndex)) return;
    try {
      const tmp = document.createElement('canvas');
      tmp.width = 4; tmp.height = 4;
      const tCtx = tmp.getContext('2d', { alpha: false });
      tCtx.drawImage(img, 0, 0, 4, 4);
      const d = tCtx.getImageData(0, 0, 1, 1).data;
      bgColors.set(sectionIndex, `rgb(${d[0]},${d[1]},${d[2]})`);
    } catch (e) {
      bgColors.set(sectionIndex, '#f5f5f5');
    }
  };

  const drawFrame = (sectionIndex, frameIndex) => {
    const frames = frameCache.get(sectionIndex);
    if (!frames) return;

    const cfg = SECTION_CONFIG[sectionIndex];
    let step = 1;
    if (isMobile) step = mobileFrameStep;
    else if (cfg && cfg.count > 100) step = 1.25;

    // Map frameIndex to the nearest loaded frame
    let idx = Math.max(0, Math.min(frameIndex, frames.length - 1));
    if (step > 1 && idx % step !== 0 && idx < frames.length - 1) {
      idx = Math.min(Math.floor(idx / step) * step, frames.length - 1);
    }

    if (idx === lastDrawnFrame && sectionIndex === currentSection) return;

    const img = frames[idx];
    if (img && img.complete && img.naturalWidth > 0) {
      if (!canvasResized) resizeCanvas(img);

      const bg = bgColors.get(sectionIndex) || '#f5f5f5';
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
      return;
    }

    manageMemory(sectionIndex);
    preloadSection(sectionIndex);
    
    // Predictive preload next
    if (SECTION_CONFIG[sectionIndex + 1]) preloadSection(sectionIndex + 1);

    if (cfg.mode === 'carryover') {
      const srcSection = cfg.fromSection;
      const srcCfg = SECTION_CONFIG[srcSection];
      canvas.classList.add('active');
      currentSection = sectionIndex;
      drawFrame(srcSection, srcCfg.count - 1);
      return;
    }

    let frameIndex;
    if (cfg.mode === 'intro') {
      const scrubEnd = cfg.scrubEnd || 0.45;
      const videoProgress = Math.min(frameProgress / scrubEnd, 1);
      frameIndex = Math.floor(videoProgress * (cfg.count - 1));
    } else {
      frameIndex = Math.floor(frameProgress * (cfg.count - 1));
    }

    canvas.classList.add('active');
    currentSection = sectionIndex;
    drawFrame(sectionIndex, frameIndex);
  };

  const isReady = (sectionIndex) => loadingStatus.get(sectionIndex) === 'ready';
  if (SECTION_CONFIG[0]) preloadSection(0);

  return { update, isReady, hasSection, getMode };
})();
