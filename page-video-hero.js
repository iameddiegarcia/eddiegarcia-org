/* ═══════════════════════════════════════════════════
   PAGE VIDEO HERO — Scroll-scrub video for subpages

   Usage: Add a <canvas id="page-video-hero" data-frames="tools" data-count="121">
   and include this script. The video scrubs as the user scrolls the hero section.
   ═══════════════════════════════════════════════════ */

const PageVideoHero = (() => {
  const canvas = document.getElementById('page-video-hero');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const framesDir = canvas.dataset.frames;  // e.g. "tools", "connect", "contact"
  const frameCount = parseInt(canvas.dataset.count, 10) || 121;
  const heroSection = canvas.closest('.video-hero');
  if (!heroSection || !framesDir) return;

  const images = new Array(frameCount);
  let loaded = 0;
  let lastDrawn = -1;
  let nativeW = 0;
  let nativeH = 0;

  // Sample background color from first frame
  let bgColor = '#f5f5f5';
  const sampleBg = (img) => {
    try {
      const tmp = document.createElement('canvas');
      tmp.width = img.naturalWidth;
      tmp.height = img.naturalHeight;
      const tCtx = tmp.getContext('2d');
      tCtx.drawImage(img, 0, 0);
      const d = tCtx.getImageData(2, 2, 4, 4).data;
      bgColor = `rgb(${d[0]},${d[1]},${d[2]})`;
    } catch (e) { /* cross-origin fallback */ }
  };

  const resizeCanvas = () => {
    const vw = window.innerWidth;
    const vh = heroSection.offsetHeight;
    if (canvas.width !== vw || canvas.height !== vh) {
      canvas.width = vw;
      canvas.height = vh;
      lastDrawn = -1;
    }
  };

  const getContainRect = () => {
    const vw = canvas.width;
    const vh = canvas.height;
    if (!nativeW || !nativeH) return { x: 0, y: 0, w: vw, h: vh };
    const imgAspect = nativeW / nativeH;
    const vpAspect = vw / vh;
    let dw, dh;
    if (imgAspect > vpAspect) {
      dw = vw; dh = vw / imgAspect;
    } else {
      dh = vh; dw = vh * imgAspect;
    }
    return { x: (vw - dw) / 2, y: (vh - dh) / 2, w: dw, h: dh };
  };

  const drawFrame = (idx) => {
    idx = Math.max(0, Math.min(idx, frameCount - 1));
    if (idx === lastDrawn) return;
    const img = images[idx];
    if (!img || !img.complete || !img.naturalWidth) return;
    resizeCanvas();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const r = getContainRect();
    ctx.drawImage(img, r.x, r.y, r.w, r.h);
    lastDrawn = idx;
  };

  // Preload all frames
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      loaded++;
      if (i === 0) {
        nativeW = img.naturalWidth;
        nativeH = img.naturalHeight;
        sampleBg(img);
        resizeCanvas();
        drawFrame(0);
      }
    };
    const num = String(i + 1).padStart(4, '0');
    img.src = `../images/scroll-video/${framesDir}/frame_${num}.jpg`;
    images[i] = img;
  }

  // Scroll handler — map hero scroll position to frame index
  const onScroll = () => {
    const rect = heroSection.getBoundingClientRect();
    const heroH = heroSection.offsetHeight;
    const vh = window.innerHeight;
    // Progress: 0 when hero top enters viewport, 1 when hero bottom exits
    const scrollRange = heroH;
    let progress = -rect.top / (scrollRange - vh);
    progress = Math.max(0, Math.min(1, progress));
    const frameIdx = Math.floor(progress * (frameCount - 1));
    drawFrame(frameIdx);
  };

  window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
  window.addEventListener('resize', () => { resizeCanvas(); lastDrawn = -1; });

  // Initial draw
  requestAnimationFrame(onScroll);
})();
