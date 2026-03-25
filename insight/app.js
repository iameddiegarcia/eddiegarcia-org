/* ═══════════════════════════════════════════════════
   INSIGHT ENGINE — Core Application Logic
   ═══════════════════════════════════════════════════ */

const INSIGHTS = window.INSIGHTS || {};

const topicsGrid   = document.getElementById('topicsGrid');
const modalOverlay = document.getElementById('modalOverlay');
const modal        = document.getElementById('modal');
const modalCategory = document.getElementById('modalCategory');
const modalTitle   = document.getElementById('modalTitle');
const modalQuote   = document.getElementById('modalQuote');
const modalTags    = document.getElementById('modalTags');
const modalClose   = document.getElementById('modalClose');
const btnAnother   = document.getElementById('btnAnother');
const btnCopy      = document.getElementById('btnCopy');
const scrollCue    = document.getElementById('scrollCue');
const shareX       = document.getElementById('shareX');
const shareLinkedIn = document.getElementById('shareLinkedIn');
const shareFacebook = document.getElementById('shareFacebook');
const themeToggle  = document.getElementById('themeToggle');
const root         = document.documentElement;

// ─── Theme Initialization ───
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
  root.setAttribute('data-theme', 'light');
}

// ─── Theme Toggle Logic ───
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

let currentCategory = null;
let usedIndices = {};  // track shown insights per category to avoid repeats

// ─── Build Topic Cards ───
function renderTopics() {
  const categories = Object.keys(INSIGHTS);
  categories.forEach((name, i) => {
    const data = INSIGHTS[name];
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.style.animationDelay = `${i * 0.07}s`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Get insight about ${name}`);
    card.innerHTML = `
      <div class="card-icon" style="background:${data.color}">${data.icon}</div>
      <div class="card-title">${name}</div>
      <div class="card-desc">${data.desc}</div>
      <div class="card-count">${data.items.length} insight${data.items.length !== 1 ? 's' : ''}</div>
    `;
    card.addEventListener('click', () => openInsight(name));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInsight(name); } });
    topicsGrid.appendChild(card);
  });
}

// ─── Random Insight (avoids repeats until all shown) ───
function getRandomInsight(category) {
  const items = INSIGHTS[category].items;
  if (!usedIndices[category]) usedIndices[category] = [];
  if (usedIndices[category].length >= items.length) usedIndices[category] = [];

  let idx;
  do {
    idx = Math.floor(Math.random() * items.length);
  } while (usedIndices[category].includes(idx));

  usedIndices[category].push(idx);
  return items[idx];
}

// ─── Open Modal ───
function openInsight(category) {
  currentCategory = category;
  const insight = getRandomInsight(category);
  populateModal(category, insight);
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  btnAnother.focus();
}

function populateModal(category, insight) {
  modalCategory.textContent = category;
  modalTitle.textContent = insight.title;
  modalQuote.textContent = insight.quote;
  modalTags.innerHTML = insight.tags.map(t => `<span class="tag">#${t}</span>`).join('');

  // Reset copy button
  const copySpan = btnCopy.querySelector('span');
  if (copySpan) copySpan.textContent = 'Copy';
  btnCopy.classList.remove('copied');

  // Animate in
  modal.style.animation = 'none';
  modal.offsetHeight; // trigger reflow
  modal.style.animation = '';
}

// ─── Build share text ───
function getShareText() {
  const quote = modalQuote.textContent;
  const title = modalTitle.textContent;
  // Customizable attribution
  const attribution = "via @EddieGarciaLAX"; 
  return `"${quote}"\n\n— ${title}\n\n${attribution}`;
}

// ─── Close Modal ───
function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ─── Another Insight ───
btnAnother.addEventListener('click', () => {
  if (!currentCategory) return;
  const insight = getRandomInsight(currentCategory);

  // Quick exit-enter animation
  modal.style.transform = 'translateY(10px) scale(0.97)';
  modal.style.opacity = '0.6';
  setTimeout(() => {
    populateModal(currentCategory, insight);
    modal.style.transform = '';
    modal.style.opacity = '';
  }, 180);
});

// ─── Copy ───
btnCopy.addEventListener('click', () => {
  const text = getShareText();
  navigator.clipboard.writeText(text).then(() => {
    const span = btnCopy.querySelector('span');
    if (span) span.textContent = 'Copied!';
    btnCopy.classList.add('copied');
    setTimeout(() => {
      if (span) span.textContent = 'Copy';
      btnCopy.classList.remove('copied');
    }, 2000);
  });
});

// ─── Social Sharing ───
shareX.addEventListener('click', () => {
  const text = getShareText();
  // twitter.com/intent/tweet handles text better than the new x.com URLs
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
});

shareLinkedIn.addEventListener('click', () => {
  const text = getShareText();
  // LinkedIn blocks custom text on standard share URLs (it only reads meta tags from public URLs).
  // This workaround auto-copies the text to your clipboard AND opens the feed compose box.
  // You just hit "Paste" (Cmd/Ctrl+V) when LinkedIn opens!
  navigator.clipboard.writeText(text).then(() => {
    alert("Quote copied to clipboard! Just paste it into the LinkedIn post box.");
    const url = `https://www.linkedin.com/feed/?shareActive=true`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  });
});

shareFacebook.addEventListener('click', () => {
  const text = getShareText();
  // Facebook strictly rules against pre-filling text; it must be pasted by the user.
  navigator.clipboard.writeText(text).then(() => {
    alert("Quote copied to clipboard! Just paste it into the Facebook post box.");
    // Link back to the site once it's hosted publicly
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  });
});

// ─── Scroll Cue ───
scrollCue.addEventListener('click', () => {
  document.getElementById('topics').scrollIntoView({ behavior: 'smooth' });
});

// ─── Init ───
renderTopics();
