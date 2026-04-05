(() => {
  const params = new URLSearchParams(window.location.search);
  const parsedFrame = Number.parseInt(params.get('storyFrame') || '', 10);

  if (!Number.isFinite(parsedFrame)) return;

  const frameIndex = Math.max(parsedFrame, 0);
  const returnHref = `/?storyFrame=${frameIndex}`;
  const label = 'Back to Story';
  const backLinks = Array.from(document.querySelectorAll('[data-story-back]'));

  const applyBackLink = (link) => {
    link.setAttribute('href', returnHref);
    link.setAttribute('aria-label', label);
    link.setAttribute('title', label);

    const labelNode = link.querySelector('[data-story-back-label]');
    if (labelNode) {
      labelNode.textContent = label;
    }
  };

  if (backLinks.length > 0) {
    backLinks.forEach(applyBackLink);
    return;
  }

  if (!document.head.querySelector('[data-story-return-style]')) {
    const style = document.createElement('style');
    style.dataset.storyReturnStyle = 'true';
    style.textContent = `
      .story-return-fab {
        position: fixed;
        top: max(1rem, env(safe-area-inset-top));
        left: max(1rem, env(safe-area-inset-left));
        z-index: 1200;
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.78rem 1rem;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.84);
        color: #ffffff;
        text-decoration: none;
        font-family: Inter, system-ui, -apple-system, sans-serif;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        box-shadow: 0 16px 36px rgba(15, 23, 42, 0.22);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .story-return-fab:hover {
        background: rgba(15, 23, 42, 0.92);
      }

      .story-return-fab svg {
        width: 0.95rem;
        height: 0.95rem;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);
  }

  const button = document.createElement('a');
  button.className = 'story-return-fab';
  button.href = returnHref;
  button.setAttribute('aria-label', label);
  button.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
    <span>${label}</span>
  `;
  document.body.appendChild(button);
})();
