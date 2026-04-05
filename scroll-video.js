/* ═══════════════════════════════════════════════════
   SCROLL VIDEO — Chapter playback controller
   Freeze frame -> play -> hold end frame
   ═══════════════════════════════════════════════════ */

const ScrollVideo = (() => {
  const stage = document.getElementById('scroll-video-stage');
  if (!stage) {
    return {
      hasSection() { return false; },
      getMode() { return null; },
      showFreeze() {},
      playChapter() {},
      stop() {}
    };
  }

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const DEFAULT_DURATION = 6.041667;
  const FRAME_DURATION = 1 / 24;
  const SEEK_TOLERANCE = 1 / 240;
  const SEEK_SETTLE_MS = 240;
  const SECTION_CONFIG = {
    0: { mode: 'fullscreen', src: 'videos/scroll/0.mp4', poster: 'images/scroll-video/frame-0/frame_0001.jpg' },
    1: { mode: 'carryover', fromSection: 0 },
    2: { mode: 'chapter', src: 'videos/scroll/2.mp4', poster: 'images/scroll-video/frame-2/frame_0001.jpg' },
    3: { mode: 'chapter', src: 'videos/scroll/3.mp4', poster: 'images/scroll-video/frame-3/frame_0001.jpg' },
    4: { mode: 'chapter', src: 'videos/scroll/4.mp4', poster: 'images/scroll-video/frame-4/frame_0001.jpg' },
    5: { mode: 'chapter', src: 'videos/scroll/5.mp4', poster: 'images/scroll-video/frame-5/frame_0001.jpg' },
    6: { mode: 'chapter', src: 'videos/scroll/6.mp4', poster: 'images/scroll-video/frame-6/frame_0001.jpg' },
    7: { mode: 'chapter', src: 'videos/scroll/7.mp4', poster: 'images/scroll-video/frame-7/frame_0001.jpg' },
    8: { mode: 'chapter', src: 'videos/scroll/8.mp4', poster: 'images/scroll-video/frame-8/frame_0001.jpg' },
    9: { mode: 'chapter', src: 'videos/scroll/9.mp4', poster: 'images/scroll-video/frame-9/frame_0001.jpg' },
    10: { mode: 'chapter', src: 'videos/scroll/91.mp4', poster: 'images/scroll-video/frame-10/frame_0001.jpg' },
    11: { mode: 'chapter', src: 'videos/scroll/93.mp4', poster: 'images/scroll-video/contact/frame_0001.jpg' }
  };

  const videoMap = new Map();
  let activeSourceSection = -1;
  let playbackToken = 0;

  const getSourceSection = (sectionIndex) => {
    const config = SECTION_CONFIG[sectionIndex];
    if (!config) return null;
    return config.mode === 'carryover' ? config.fromSection : sectionIndex;
  };

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

    const syncVideoState = () => {
      let pendingSeek = Promise.resolve();

      if (Number.isFinite(video.duration) && video.duration > 0) {
        config.duration = video.duration;
      }

      const pendingTime = Number(video.dataset.pendingTime);
      if (Number.isFinite(pendingTime)) {
        pendingSeek = setTime(video, config, pendingTime);
        delete video.dataset.pendingTime;
      }

      if (video.dataset.pendingPlay === 'true' && video.readyState >= 2) {
        delete video.dataset.pendingPlay;
        pendingSeek.then(() => playCurrentVideo(video)).catch(() => {});
      }
    };

    video.addEventListener('loadedmetadata', syncVideoState);
    video.addEventListener('loadeddata', syncVideoState);
    video.addEventListener('canplay', syncVideoState);

    stage.appendChild(video);
    videoMap.set(sectionIndex, video);
  };

  Object.entries(SECTION_CONFIG).forEach(([sectionKey, config]) => {
    const sectionIndex = Number(sectionKey);
    if (config.mode !== 'carryover') {
      createVideoClip(sectionIndex, config);
    }
  });

  const getDuration = (config, video) => {
    if (video && Number.isFinite(video.duration) && video.duration > 0) {
      return video.duration;
    }
    if (Number.isFinite(config.duration) && config.duration > 0) {
      return config.duration;
    }
    return DEFAULT_DURATION;
  };

  const setActiveSource = (sectionIndex) => {
    if (sectionIndex == null) {
      stage.classList.remove('active');
      activeSourceSection = -1;
      return;
    }

    activeSourceSection = sectionIndex;
    stage.classList.add('active');

    videoMap.forEach((video, key) => {
      const isActive = key === sectionIndex;
      video.classList.toggle('active', isActive);
      video.preload = Math.abs(key - sectionIndex) <= 1 ? 'metadata' : 'none';
      if (isActive) {
        video.preload = 'auto';
      } else {
        video.pause();
      }
    });
  };

  function setTime(video, config, targetTime) {
    const duration = getDuration(config, video);
    const safeTime = clamp(targetTime, 0, Math.max(duration - FRAME_DURATION, 0));

    if (video.readyState < 1) {
      video.dataset.pendingTime = String(safeTime);
      return Promise.resolve();
    }

    if (Math.abs(video.currentTime - safeTime) <= SEEK_TOLERANCE) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let settled = false;
      let timeoutId = null;

      const cleanup = () => {
        if (settled) return;
        settled = true;
        video.removeEventListener('seeked', handleSeeked);
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
        }
        resolve();
      };

      const handleSeeked = () => {
        cleanup();
      };

      video.addEventListener('seeked', handleSeeked, { once: true });

      try {
        // Freeze frames must land on exact decoded frames, not nearby keyframes.
        video.currentTime = safeTime;
      } catch (error) {
        video.dataset.pendingTime = String(safeTime);
        cleanup();
        return;
      }

      timeoutId = window.setTimeout(cleanup, SEEK_SETTLE_MS);
    });
  }

  const stop = () => {
    playbackToken += 1;
    videoMap.forEach((video) => {
      video.pause();
      delete video.dataset.pendingPlay;
      video.onended = null;
    });
  };

  const showFreeze = (sectionIndex, edge = 'start') => {
    const sourceSection = getSourceSection(sectionIndex);
    const config = sourceSection == null ? null : SECTION_CONFIG[sourceSection];
    const video = sourceSection == null ? null : videoMap.get(sourceSection);
    if (!config || !video) return;

    stop();
    setActiveSource(sourceSection);

    if (edge === 'end') {
      void setTime(video, config, getDuration(config, video) - FRAME_DURATION);
      return;
    }

    void setTime(video, config, 0);
  };

  async function playCurrentVideo(video) {
    try {
      await video.play();
    } catch (error) {
      // Browser autoplay restrictions should not apply because this is user-triggered,
      // but keep the failure silent and let the UI continue functioning.
    }
  }

  const playChapter = (sectionIndex, { onEnded } = {}) => {
    const sourceSection = getSourceSection(sectionIndex);
    const config = sourceSection == null ? null : SECTION_CONFIG[sourceSection];
    const video = sourceSection == null ? null : videoMap.get(sourceSection);
    if (!config || !video) return;

    stop();
    setActiveSource(sourceSection);

    const token = ++playbackToken;
    video.onended = () => {
      if (token !== playbackToken) return;
      setTime(video, config, getDuration(config, video) - FRAME_DURATION).then(() => {
        if (token !== playbackToken) return;
        if (typeof onEnded === 'function') onEnded();
      });
    };

    if (video.readyState < 2) {
      video.dataset.pendingTime = '0';
      video.dataset.pendingPlay = 'true';
      video.load();
      return;
    }

    setTime(video, config, 0).then(() => playCurrentVideo(video));
  };

  setActiveSource(0);
  showFreeze(0, 'start');

  return {
    hasSection(sectionIndex) {
      return Boolean(SECTION_CONFIG[sectionIndex]);
    },
    getMode(sectionIndex) {
      return SECTION_CONFIG[sectionIndex]?.mode || null;
    },
    showFreeze,
    playChapter,
    stop
  };
})();
