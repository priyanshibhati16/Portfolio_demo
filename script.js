/**
 * Priyanshi Bhati - Academic Portfolio JavaScript
 * Features:
 * - Typing animation for hero greeting
 * - Smooth section navigation (Navbar, Side dots, Arrows, Keyboard, Swipe)
 * - IntersectionObserver for active page tracking & fade/slide-in
 * - Certificate Lightbox modal with keyboard & backdrop close
 * - Email clipboard copy with toast feedback
 * - Pastel confetti & heart celebration burst
 * - Mobile responsive navigation drawer
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // 1. Core Elements & Section State
  // ========================================================================
  const sections = Array.from(document.querySelectorAll('.page-section'));
  const navPills = Array.from(document.querySelectorAll('.nav-pill'));
  const sideDots = Array.from(document.querySelectorAll('.side-dot'));
  const prevBtn = document.getElementById('prev-page-btn');
  const nextBtn = document.getElementById('next-page-btn');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');

  let currentPageIndex = 0;
  const totalPages = sections.length;

  // ========================================================================
  // 2. Typing Animation for Greeting Text (Page 1)
  // ========================================================================
  const greetingText = "Hello, lovely visitor! ✨ Welcome to my little academic corner.";
  const typingElement = document.getElementById('typing-text');
  let charIndex = 0;
  let typingSpeed = 48; // milliseconds per character

  function typeGreeting() {
    if (charIndex < greetingText.length) {
      typingElement.textContent += greetingText.charAt(charIndex);
      charIndex++;
      setTimeout(typeGreeting, typingSpeed);
    }
  }

  // Small delay before typing starts for a pleasant entrance
  setTimeout(typeGreeting, 400);

  // ========================================================================
  // 3. Section Navigation Helpers
  // ========================================================================
  function scrollToPageIndex(index, smooth = true) {
    if (index < 0 || index >= totalPages) return;

    currentPageIndex = index;
    const targetSection = sections[index];

    if (targetSection) {
      if (smooth) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        const topPos = targetSection.offsetTop;
        window.scrollTo(0, topPos);
        document.documentElement.scrollTop = topPos;
        document.body.scrollTop = topPos;
      }
    }

    updateNavState(index);
  }

  function updateNavState(index) {
    currentPageIndex = index;

    // Update Nav Pills
    navPills.forEach((pill, idx) => {
      if (idx === index) {
        pill.classList.add('active');
        pill.setAttribute('aria-current', 'page');
      } else {
        pill.classList.remove('active');
        pill.removeAttribute('aria-current');
      }
    });

    // Update Side Dots
    sideDots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'step');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });

    // Update Arrow Buttons State
    if (prevBtn) {
      prevBtn.disabled = (index === 0);
      prevBtn.style.opacity = (index === 0) ? '0.35' : '1';
    }
    if (nextBtn) {
      nextBtn.disabled = (index === totalPages - 1);
      nextBtn.style.opacity = (index === totalPages - 1) ? '0.35' : '1';
    }

    // Update Active Class on Sections
    sections.forEach((sec, idx) => {
      if (idx === index) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });
  }

  // Next / Previous Arrow Button Click Handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPageIndex > 0) {
        scrollToPageIndex(currentPageIndex - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPageIndex < totalPages - 1) {
        scrollToPageIndex(currentPageIndex + 1);
      }
    });
  }

  // Side Dot Click Listeners
  sideDots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(targetIdx)) {
        scrollToPageIndex(targetIdx);
      }
    });
  });

  // Top Nav Pill Click Listeners
  navPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const targetIdx = parseInt(pill.getAttribute('data-index'), 10);
      if (!isNaN(targetIdx)) {
        scrollToPageIndex(targetIdx);
        // Close mobile drawer if open
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Mobile Menu Drawer Toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ========================================================================
  // 4. Keyboard Arrow-Key Navigation
  // ========================================================================
  window.addEventListener('keydown', (e) => {
    // If modal is open, don't navigate pages with arrows
    const modal = document.getElementById('cert-lightbox');
    if (modal && modal.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeLightbox();
      }
      return;
    }

    // Ignore if focus is in an input or textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
      if (currentPageIndex < totalPages - 1) {
        e.preventDefault();
        scrollToPageIndex(currentPageIndex + 1);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
      if (currentPageIndex > 0) {
        e.preventDefault();
        scrollToPageIndex(currentPageIndex - 1);
      }
    }
  });

  // ========================================================================
  // 5. Mobile Touch Swipe Support
  // ========================================================================
  let touchStartY = 0;
  let touchStartX = 0;
  let touchEndY = 0;
  let touchEndX = 0;
  const swipeThreshold = 55; // minimum px for gesture

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const modal = document.getElementById('cert-lightbox');
    if (modal && modal.classList.contains('active')) return;

    touchEndY = e.changedTouches[0].screenY;
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  }, { passive: true });

  function handleSwipeGesture() {
    const deltaY = touchStartY - touchEndY;
    const deltaX = touchStartX - touchEndX;

    // Check if vertical swipe is stronger than horizontal
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (Math.abs(deltaY) > swipeThreshold) {
        if (deltaY > 0 && currentPageIndex < totalPages - 1) {
          // Swiped up -> next page
          scrollToPageIndex(currentPageIndex + 1);
        } else if (deltaY < 0 && currentPageIndex > 0) {
          // Swiped down -> prev page
          scrollToPageIndex(currentPageIndex - 1);
        }
      }
    }
  }

  // ========================================================================
  // 6. IntersectionObserver for Active Section Sync on Scroll
  // ========================================================================
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -20% 0px',
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const pageIdx = parseInt(entry.target.getAttribute('data-page'), 10);
        if (!isNaN(pageIdx)) {
          updateNavState(pageIdx);
        }
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));

  // ========================================================================
  // 7. Lightbox Popup for Certificate Cards
  // ========================================================================
  const certCards = document.querySelectorAll('.cert-card');
  const lightboxModal = document.getElementById('cert-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  function openLightbox(card) {
    const imgSrc = card.getAttribute('data-img');
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-desc');

    if (lightboxImg && imgSrc) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = title || 'Certificate Full View';
    }
    if (lightboxTitle) lightboxTitle.textContent = title || '';
    if (lightboxDesc) lightboxDesc.innerHTML = desc || '';

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent scrolling background

    if (lightboxCloseBtn) lightboxCloseBtn.focus();
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  certCards.forEach((card) => {
    card.addEventListener('click', () => openLightbox(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(card);
      }
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // ========================================================================
  // 8. Email Copy to Clipboard Feature
  // ========================================================================
  const copyBtn = document.getElementById('copy-email-btn');
  const copyToast = document.getElementById('copy-toast');
  const emailAddress = 'priyanshibhati81@gmail.com';

  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(emailAddress).then(() => {
        showCopyToast();
      }).catch(() => {
        // Fallback for older browsers or restricted sandboxes
        const tempInput = document.createElement('input');
        tempInput.value = emailAddress;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showCopyToast();
      });
    });
  }

  function showCopyToast() {
    if (!copyToast) return;
    copyToast.classList.add('show');
    const copyText = document.getElementById('copy-text');
    if (copyText) copyText.textContent = 'Copied!';

    setTimeout(() => {
      copyToast.classList.remove('show');
      if (copyText) copyText.textContent = 'Copy';
    }, 2400);
  }

  // ========================================================================
  // 9. Interactive Pastel Confetti Burst (Page 5)
  // ========================================================================
  const confettiBtn = document.getElementById('burst-confetti-btn');
  const pastelColors = [
    '#FADADD', // Blush Pink
    '#E6E0F8', // Lavender
    '#D5F2E3', // Mint
    '#D6EAF8', // Baby Blue
    '#FFF4CC', // Butter Yellow
    '#F3B6BD', // Deep Blush
    '#FFE899'  // Warm Gold
  ];
  const confettiShapes = ['circle', 'square', 'star'];

  function createConfettiBurst(originX, originY) {
    const particleCount = 42;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';

      const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      const shape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];

      const size = Math.floor(Math.random() * 10) + 8; // 8px to 18px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;

      if (shape === 'circle') {
        particle.style.borderRadius = '50%';
      } else if (shape === 'star') {
        particle.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      }

      particle.style.left = `${originX}px`;
      particle.style.top = `${originY}px`;

      // Random target offset
      const angle = Math.random() * 2 * Math.PI;
      const velocity = Math.random() * 240 + 80;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - (Math.random() * 60);
      const rot = Math.random() * 720 - 360;

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(particle);

      // Clean up after animation
      setTimeout(() => {
        particle.remove();
      }, 2800);
    }
  }

  if (confettiBtn) {
    confettiBtn.addEventListener('click', (e) => {
      const rect = confettiBtn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      createConfettiBurst(originX, originY);
    });
  }

  // ========================================================================
  // 10. Start Exploring & Back to Top Smooth Buttons
  // ========================================================================
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToPageIndex(1); // Go to About Me
    });
  }

  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToPageIndex(0); // Go to Home
    });
  }

  // Initial navigation check (URL params & hash)
  function checkInitialNavigation() {
    // Check ?page= index param
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    if (pageParam !== null) {
      const pageNum = parseInt(pageParam, 10);
      if (!isNaN(pageNum) && pageNum >= 0 && pageNum < totalPages) {
        scrollToPageIndex(pageNum, false);
        return;
      }
    }

    // Check #hash param
    const hash = window.location.hash;
    if (hash) {
      const targetIdx = sections.findIndex(sec => `#${sec.id}` === hash);
      if (targetIdx !== -1) {
        scrollToPageIndex(targetIdx, false);
        return;
      }
    }
    updateNavState(0);
  }

  // Listen to hash changes (e.g. back/forward button or external anchor links)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash) {
      const targetIdx = sections.findIndex(sec => `#${sec.id}` === hash);
      if (targetIdx !== -1) {
        scrollToPageIndex(targetIdx, true);
      }
    }
  });

  // Initial setup call
  checkInitialNavigation();
});