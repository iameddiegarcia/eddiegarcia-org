/* ═══════════════════════════════════════════════════
   EDDIE GARCIA — Narrative Scroll Controller
   ═══════════════════════════════════════════════════ */

const scrollSection = document.getElementById('narrative-scroll');
const frames = document.querySelectorAll('.narrative-frame');
const photos = document.querySelectorAll('.photo-layer');
const overlays = document.querySelectorAll('.overlay-layer');
const PRINCIPLES = {
  initiative: {
    title: 'Initiative',
    text: "Employees should be proactive in identifying opportunities and challenges. Taking the initiative to address issues and propose solutions demonstrates a commitment to the team's objectives and drives progress. In our section, this principle encourages employees to think creatively and take action to improve processes, technologies, and performance."
  },
  completed_staff_work: {
    title: 'Completed Staff Work',
    text: 'Employees should present fully developed solutions and recommendations to their supervisors, rather than incomplete ideas or problems. This principle ensures that staff members thoroughly analyze issues, consider all relevant factors, and propose actionable plans. In our section, completed staff work enhances decision-making efficiency and demonstrates a high level of professionalism and preparedness.'
  },
  responsibility: {
    title: 'Responsibility',
    text: 'Employees should take responsibility for their tasks and duties, ensuring they complete them to the best of their ability. This means being reliable and dependable, meeting deadlines, and delivering quality work. In the Strategy, Technology, and Performance section, this principle ensures that each team member contributes effectively to the overall success of the team by consistently performing their assigned tasks.'
  },
  accountability: {
    title: 'Accountability',
    text: 'Employees must be accountable for their actions and decisions. This involves owning up to mistakes, learning from them, and making necessary improvements. Accountability fosters a culture of trust and continuous improvement, which is crucial for maintaining high standards and achieving strategic goals in our section.'
  },
  ownership: {
    title: 'Ownership',
    text: 'Employees should take ownership of their work, treating it as if it were their own. This principle encourages a sense of pride and dedication, leading to higher quality outcomes and greater job satisfaction. It also means being invested in the success of the project and going above and beyond to ensure its success, which is vital for achieving our strategic goals.'
  },
  adaptability: {
    title: 'Adaptability',
    text: 'In a fast-paced environment, employees must be adaptable to change. This means being open to new ideas, technologies, and processes, and being able to pivot when necessary to meet evolving demands. Adaptability is crucial for staying competitive and innovative in the ever-changing landscape of strategy, technology, and performance.'
  },
  communication: {
    title: 'Communication',
    text: 'Clear and effective communication is essential. Employees should be able to convey information, ideas, and feedback efficiently, ensuring that everyone is on the same page and working towards common goals. In our section, this principle helps prevent misunderstandings, promotes transparency, and facilitates collaboration across different teams and departments.'
  },
  collaboration: {
    title: 'Collaboration',
    text: 'Working together as a team is crucial. Employees should be willing to share knowledge, support each other, and work towards collective success. This principle enhances innovation and problem-solving capabilities, as diverse perspectives and skills are brought together to tackle challenges and achieve strategic objectives.'
  },
  responsiveness: {
    title: 'Responsiveness',
    text: 'Being responsive to colleagues, clients, and stakeholders is vital. Employees should be prompt in their replies and actions, ensuring that issues are addressed quickly and efficiently. In our section, this principle helps maintain strong relationships, build trust, and ensure that projects stay on track.'
  },
  innovation: {
    title: 'Innovation',
    text: 'Encourage creativity and the exploration of new ideas. Innovation drives progress and helps the team stay competitive by continuously improving processes and solutions. In our section, fostering innovation ensures that we remain at the forefront of technological advancements and strategic initiatives.'
  },
  integrity: {
    title: 'Integrity',
    text: 'Employees should act with integrity, maintaining honesty and ethical standards in all their dealings. This principle builds a strong foundation of trust and respect within the team and with external partners. In our section, integrity ensures that we uphold our values and make decisions that are in the best interest of the organization and its stakeholders.'
  },
  continuous_learning: {
    title: 'Continuous Learning',
    text: 'Employees should be committed to continuous learning and development. This involves staying updated with the latest industry trends, technologies, and best practices, ensuring that the team remains competitive and innovative. In our section, continuous learning helps employees grow professionally and contributes to the overall success of the organization.'
  },
};

// ─── Principles Interaction ───
const principleButtons = document.querySelectorAll('.principle-pill');
const principleTitle = document.getElementById('principle-title');
const principleText = document.getElementById('principle-text');

if (principleButtons.length && principleTitle && principleText) {
  const setPrinciple = (key) => {
    const principle = PRINCIPLES[key];
    if (!principle) return;

    principleTitle.textContent = principle.title;
    principleText.textContent = principle.text;

    principleButtons.forEach((button) => {
      const isActive = button.dataset.principle === key;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  };

  principleButtons.forEach((button) => {
    button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    button.addEventListener('click', () => setPrinciple(button.dataset.principle));
  });

  const initialKey = document.querySelector('.principle-pill.active')?.dataset.principle || principleButtons[0].dataset.principle;
  setPrinciple(initialKey);
}

// ─── Technologist Gallery ───
const galleryTrack = document.querySelector('[data-gallery-track]');
const galleryNavButtons = document.querySelectorAll('[data-gallery-nav]');
const gallerySlides = document.querySelectorAll('.gallery-slide');
const galleryLightbox = document.getElementById('gallery-lightbox');
const galleryLightboxImage = document.getElementById('gallery-lightbox-image');
const galleryLightboxCaption = document.getElementById('gallery-lightbox-caption');
const galleryLightboxClose = document.getElementById('gallery-lightbox-close');
const lightboxDismissTargets = document.querySelectorAll('[data-lightbox-close]');

if (galleryTrack && gallerySlides.length && galleryLightbox && galleryLightboxImage && galleryLightboxCaption) {
  const slideGalleryBy = (direction) => {
    const amount = galleryTrack.clientWidth * 0.85 * direction;
    galleryTrack.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const openLightbox = (button) => {
    const src = button.dataset.galleryImage;
    const alt = button.dataset.galleryAlt || '';
    const caption = button.dataset.galleryCaption || '';
    if (!src) return;

    galleryLightboxImage.src = src;
    galleryLightboxImage.alt = alt;
    galleryLightboxCaption.textContent = caption;
    galleryLightbox.hidden = false;
    document.body.classList.add('modal-open');
  };

  const closeLightbox = () => {
    galleryLightbox.hidden = true;
    galleryLightboxImage.src = '';
    galleryLightboxImage.alt = '';
    galleryLightboxCaption.textContent = '';
    document.body.classList.remove('modal-open');
  };

  galleryNavButtons.forEach((button) => {
    button.addEventListener('click', () => {
      slideGalleryBy(button.dataset.galleryNav === 'next' ? 1 : -1);
    });
  });

  gallerySlides.forEach((button) => {
    button.addEventListener('click', () => openLightbox(button));
  });

  galleryLightboxClose?.addEventListener('click', closeLightbox);
  lightboxDismissTargets.forEach((target) => {
    target.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !galleryLightbox.hidden) {
      closeLightbox();
    }
  });
}

// ─── Metric Counters Logic ───
const metrics = document.querySelectorAll('.metric-value');
let metricsAnimated = false;

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
  scrollSection.style.height = `${numFrames * 100}vh`;

  const updateScroll = () => {
    const rect = scrollSection.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    
    const windowHeight = window.innerHeight;
    const scrollDistance = sectionHeight - windowHeight;
    
    let progress = -sectionTop / scrollDistance;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    // Calculate current frame
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

      // 2b. Trigger metric counters on Creator/Entertainer frames
      if (activeFrameEl.querySelector('.metric-value')) {
        animateMetrics();
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
  window.addEventListener('resize', () => {
    requestAnimationFrame(updateScroll);
  });
  
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
