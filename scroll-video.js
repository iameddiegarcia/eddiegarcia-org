/* ═══════════════════════════════════════════════════
   SCROLL VIDEO — Section video stage
   Uses source MP4 clips instead of extracted JPG sequences.
   ═══════════════════════════════════════════════════ */

const ScrollVideo = (() => {
  const stage = document.getElementById('scroll-video-stage');
  if (!stage) {
    return {
      update() {},
      isReady() { return false; },
      hasSection() { return false; },
      getMode() { return null; }
    };
  }

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const DEFAULT_DURATION = 6.041667;

  const SECTION_CONFIG = {
    0: {
      mode: 'fullscreen',
      src: 'videos/scroll/0.mp4',
      poster: 'images/scroll-video/frame-0/frame_0001.jpg',
      playStart: 0.04,
      playEnd: 0.92
    },
    1: { mode: 'carryover', fromSection: 0 },
    2: {
      mode: 'intro',
      src: 'videos/scroll/2.mp4',
      poster: 'images/scroll-video/frame-2/frame_0001.jpg',
      playEnd: 0.38
    },
    3: {
      mode: 'intro',
      src: 'videos/scroll/3.mp4',
      poster: 'images/scroll-video/frame-3/frame_0001.jpg',
      playEnd: 0.38
    },
    4: {
      mode: 'intro',
      src: 'videos/scroll/4.mp4',
      poster: 'images/scroll-video/frame-4/frame_0001.jpg',
      playEnd: 0.38
    },
    5: {
      mode: 'intro',
      src: 'videos/scroll/5.mp4',
      poster: 'images/scroll-video/frame-5/frame_0001.jpg',
      playEnd: 0.38
    },
    6: {
      mode: 'intro',
      src: 'videos/scroll/6.mp4',
      poster: 'images/scroll-video/frame-6/frame_0001.jpg',
      playEnd: 0.38
    },
    7: {
      mode: 'intro',
      src: 'videos/scroll/7.mp4',
      poster: 'images/scroll-video/frame-7/frame_0001.jpg',
      playEnd: 0.38
    },
    8: {
      mode: 'intro',
      src: 'videos/scroll/8.mp4',
      poster: 'images/scroll-video/frame-8/frame_0001.jpg',
      playEnd: 0.38
    },
    9: {
      mode: 'intro',
      src: 'videos/scroll/9.mp4',
      poster: 'images/scroll-video/frame-9/frame_0001.jpg',
      playEnd: 0.38
    },
    10: {
      mode: 'intro',
      src: 'videos/scroll/91.mp4',
      poster: 'images/scroll-video/frame-10/frame_0001.jpg',
      playEnd: 0.38
    },
    11: {
      mode: 'intro',
      src: 'videos/scroll/92.mp4',
      poster: 'images/scroll-video/tools/frame_0001.jpg',
      playEnd: 0.38
    },
    12: {
      mode: 'intro',
      src: 'videos/scroll/93.mp4',
      poster: 'images/scroll-video/contact/frame_0001.jpg',
      playEnd: 0.38
    }
  };

  const videoMap = new Map();
  let activeRenderableSection = -1;

  const createVideoClip = (sectionIndex, config) => {
    const video = document.createElement('video');
    video.className = 'scroll-video-clip';
    video.dataset.section = String(sectionIndex);
    video.muted = true;
    video.loop = false;
    video.preload = sectionIndex === 0 ? 'auto' : 'metadata';
    video.playsInline = true;
    video.autoplay = false;
    video.disablePictureInPicture = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');
    video.poster = config.poster;
    video.src = config.src;

    video.addEventListener('loadedmetadata', () => {
      const pendingTime = Number(video.dataset.pendingTime);
      if (Number.isFinite(video.duration) && video.duration > 0) {
        config.duration = video.duration;
      }
      if (Number.isFinite(pendingTime)) {
        seekVideo(video, config, pendingTime);
        delete video.dataset.pendingTime;
      }
    });

    stage.appendChild(video);
    videoMap.set(sectionIndex, video);
  };

  Object.entries(SECTION_CONFIG).forEach(([sectionKey, config]) => {
    const sectionIndex = Number(sectionKey);
    if (config.mode !== 'carryover') {
      createVideoClip(sectionIndex, config);
    }
  });

  const getRenderableSection = (sectionIndex) => {
    const config = SECTION_CONFIG[sectionIndex];
    if (!config) return null;
    return config.mode === 'carryover' ? config.fromSection : sectionIndex;
  };

  const getDuration = (config, video) => {
    if (video && Number.isFinite(video.duration) && video.duration > 0) {
      return video.duration;
    }
    if (Number.isFinite(config.duration) && config.duration > 0) {
      return config.duration;
    }
    return DEFAULT_DURATION;
  };

  function seekVideo(video, config, time) {
    const duration = getDuration(config, video);
    const safeTime = clamp(time, 0, Math.max(duration - (1 / 60), 0));

    if (video.readyState < 1) {
      video.dataset.pendingTime = String(safeTime);
      return;
    }

    if (Math.abs(video.currentTime - safeTime) < (1 / 30)) return;

    try {
      if (typeof video.fastSeek === 'function' && Math.abs(video.currentTime - safeTime) > 0.3) {
        video.fastSeek(safeTime);
      } else {
        video.currentTime = safeTime;
      }
    } catch (error) {
      video.dataset.pendingTime = String(safeTime);
    }
  }

  const setActiveRenderable = (renderableSection) => {
    if (renderableSection === activeRenderableSection) return;

    videoMap.forEach((video, sectionIndex) => {
      video.classList.toggle('active', sectionIndex === renderableSection);
      if (sectionIndex === renderableSection) {
        video.preload = 'auto';
      } else if (Math.abs(sectionIndex - renderableSection) <= 1) {
        video.preload = 'metadata';
      }
    });

    activeRenderableSection = renderableSection;
  };

  const update = (sectionIndex, frameProgress) => {
    const config = SECTION_CONFIG[sectionIndex];
    if (!config) {
      stage.classList.remove('active');
      return;
    }

    const renderableSection = getRenderableSection(sectionIndex);
    const renderableConfig = SECTION_CONFIG[renderableSection];
    const renderableVideo = videoMap.get(renderableSection);

    if (!renderableConfig || !renderableVideo) {
      stage.classList.remove('active');
      return;
    }

    setActiveRenderable(renderableSection);
    stage.classList.add('active');

    let progress = 1;

    if (config.mode === 'carryover') {
      progress = 1;
    } else if (config.mode === 'fullscreen') {
      const playStart = config.playStart ?? 0;
      const playEnd = config.playEnd ?? 1;
      progress = clamp((frameProgress - playStart) / Math.max(playEnd - playStart, 0.001), 0, 1);
    } else {
      const playEnd = config.playEnd ?? 0.38;
      progress = clamp(frameProgress / Math.max(playEnd, 0.001), 0, 1);
    }

    const duration = getDuration(renderableConfig, renderableVideo);
    seekVideo(renderableVideo, renderableConfig, progress * duration);
  };

  const isReady = (sectionIndex) => {
    const renderableSection = getRenderableSection(sectionIndex);
    const video = renderableSection == null ? null : videoMap.get(renderableSection);
    return Boolean(video && video.readyState >= 1);
  };

  const hasSection = (sectionIndex) => Boolean(SECTION_CONFIG[sectionIndex]);
  const getMode = (sectionIndex) => SECTION_CONFIG[sectionIndex]?.mode || null;

  setActiveRenderable(0);
  const initialVideo = videoMap.get(0);
  if (initialVideo) seekVideo(initialVideo, SECTION_CONFIG[0], 0);

  return { update, isReady, hasSection, getMode };
})();
