/* ═══════════════════════════════════════════════════
   BENTO PORTFOLIO — Interactive Logic
   ═══════════════════════════════════════════════════ */

// ─── Theme Toggle Logic ───
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
  root.setAttribute('data-theme', 'light');
}

themeToggle.addEventListener('click', () => {
  const currentTheme = root.getAttribute('data-theme');
  if (currentTheme === 'light') {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

// ─── Live Clock Logic ───
const clockEl = document.getElementById('clock');
function updateTime() {
  const now = new Date();
  // Formatting to Los Angeles Time
  const timeString = now.toLocaleTimeString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  if (clockEl) clockEl.textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();

// ─── Copy Email Widget ───
const copyEmailBtn = document.getElementById('copyEmail');
const emailBadge = document.getElementById('emailBadge');
const EmailAddress = "info@eddiegarcia.org";

copyEmailBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(EmailAddress).then(() => {
    emailBadge.textContent = "Copied!";
    emailBadge.style.color = "#4ade80";
    emailBadge.style.background = "rgba(74, 222, 128, 0.1)";
    
    setTimeout(() => {
      emailBadge.textContent = "Copy Email";
      emailBadge.style.color = "";
      emailBadge.style.background = "";
    }, 2000);
  });
});

// ─── Animated Metric Counters ───
const metrics = document.querySelectorAll('.metric-value');

const animateCounters = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // total ms
      const frameDuration = 1000 / 60; // 60fps
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
          // Final value format: 42.7K or exact depending on preference.
          // Let's format it beautifully with a "K" for thousands.
          if (target >= 10000) {
            counter.innerText = (target / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
          } else {
            counter.innerText = target.toLocaleString();
          }
        }
      };

      updateCount();
      observer.unobserve(counter); // Only run once
    }
  });
};

const metricsObserver = new IntersectionObserver(animateCounters, {
  root: null,
  threshold: 0.5
});

metrics.forEach(metric => {
  metricsObserver.observe(metric);
});
