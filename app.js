/* ═══════════════════════════════════════════════════
   EDDIE GARCIA — Narrative Scroll Controller
   ═══════════════════════════════════════════════════ */

const scrollSection = document.getElementById('narrative-scroll');
const frames = document.querySelectorAll('.narrative-frame');
const photos = document.querySelectorAll('.photo-layer');
const overlays = document.querySelectorAll('.overlay-layer');

// ─── Email Copy Logic ───
const copyEmailBtn = document.getElementById('copyEmail');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('info@eddiegarcia.org').then(() => {
      copyEmailBtn.textContent = 'Copied!';
      copyEmailBtn.style.background = '#4ade80';
      copyEmailBtn.style.borderColor = '#4ade80';
      copyEmailBtn.style.color = 'white';
      
      setTimeout(() => {
        copyEmailBtn.textContent = 'Copy Email';
        copyEmailBtn.style.background = '';
        copyEmailBtn.style.borderColor = '';
        copyEmailBtn.style.color = '';
      }, 2000);
    });
  });
}

// ─── Metric Couters Logic ───
const metrics = document.querySelectorAll('.metric-value');
let metricsAnimated = false; // flag to only animate once

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

// ─── Main Scroll Controller ───
if (scrollSection && frames.length > 0) {
  const numFrames = frames.length;
  let activeFrameIndex = -1;

  const updateScroll = () => {
    const rect = scrollSection.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    
    const windowHeight = window.innerHeight;
    const scrollDistance = sectionHeight - windowHeight;
    
    let progress = -sectionTop / scrollDistance;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    // Calculate current frame (e.g., 0 to 15)
    let currentFrame = Math.floor(progress * numFrames);
    if (currentFrame >= numFrames) currentFrame = numFrames - 1;

    if (currentFrame !== activeFrameIndex) {
      activeFrameIndex = currentFrame;

      // 1. Activate Text Frame
      frames.forEach((frame, idx) => {
        if (idx === currentFrame) {
          frame.classList.add('active');
        } else {
          frame.classList.remove('active');
        }
      });

      // trigger metric animation if frame 8 (Tiburcio) or frame 10 (Narrative Engineer) is active
      if (currentFrame === 8 || currentFrame === 10) {
        animateMetrics();
      }

      const activeFrameEl = frames[currentFrame];

      // 2. Activate Background Photo
      const bgId = activeFrameEl.getAttribute('data-bg');
      if (bgId !== null) {
        photos.forEach(photo => {
          if (photo.id === `bg-photo-${bgId}`) {
            photo.style.opacity = 1;
          } else {
            photo.style.opacity = 0;
          }
        });
      }

      // 3. Activate Overlays
      const overlayId = activeFrameEl.getAttribute('data-overlay');
      overlays.forEach(overlay => {
        if (overlayId && overlay.id === overlayId) {
          overlay.style.opacity = 0.5; // subtle opacity for overlays
        } else {
          overlay.style.opacity = 0;
        }
      });
    }
    // 4. Update Persistent Tracker
    const trackers = document.querySelectorAll('.tracker-item');
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
    const scrollPrompt = document.querySelector('.scroll-prompt');
    if (scrollPrompt) {
      if (progress > 0.02) scrollPrompt.classList.add('fade-out');
      else scrollPrompt.classList.remove('fade-out');
    }

    // 6. Progress bar
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) progressBar.style.width = (progress * 100) + '%';
  };

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateScroll);
  }, { passive: true });
  
  // Custom navigation link logic
  const jumpLinks = document.querySelectorAll('.tracker-item');
  jumpLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetFrame = parseInt(e.target.getAttribute('data-target-frame'), 10);
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
