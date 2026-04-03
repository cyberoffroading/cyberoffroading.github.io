/* ============================================================
   CYBEROFFROADING.COM — Main JS
   - Scroll-triggered card reveals
   - Sticky nav active section tracking
   - Smooth scroll on nav click
   - Back to top button
   ============================================================ */

(function () {
  'use strict';

  // --- Reduced motion check ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Scroll-triggered card reveals ---
  const cards = document.querySelectorAll('.product-card');

  if (prefersReducedMotion) {
    cards.forEach((card) => card.classList.add('revealed'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const siblings = Array.from(card.parentElement.children);
            const index = siblings.indexOf(card);
            card.style.transitionDelay = `${index * 50}ms`;
            card.classList.add('revealed');
            // Clean up delay after animation
            card.addEventListener('transitionend', () => {
              card.style.transitionDelay = '0ms';
            }, { once: true });
            revealObserver.unobserve(card);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    );
    cards.forEach((card) => revealObserver.observe(card));
  }

  // --- Active nav pill tracking ---
  const navPills = document.querySelectorAll('.nav-pill');
  const sections = document.querySelectorAll('.section');

  // Use scroll listener instead of IntersectionObserver for reliable
  // mobile behaviour (IO percentage rootMargin is buggy on mobile Safari
  // with dynamic viewport and small screens).
  const navEl = document.querySelector('.category-nav');
  const navInner = navEl.querySelector('.category-nav__inner');
  let scrollTick = false;
  let navClickTarget = null; // when set, locks highlight to this href during smooth scroll
  let scrollIdleTimer = null;

  function ensurePillVisible(pill) {
    var pillRect = pill.getBoundingClientRect();
    var navRect = navInner.getBoundingClientRect();
    // Only scroll if the pill is partially or fully outside the visible nav area
    if (pillRect.left < navRect.left || pillRect.right > navRect.right) {
      var pillLeft = pill.offsetLeft - navInner.offsetLeft - (navInner.clientWidth / 2) + (pill.offsetWidth / 2);
      navInner.scrollTo({ left: pillLeft, behavior: 'smooth' });
    }
  }

  function updateActiveNav() {
    // While a tap-initiated scroll is in progress, keep the tapped pill highlighted
    if (navClickTarget) {
      navPills.forEach((pill) => {
        pill.classList.toggle('active', pill.getAttribute('href') === navClickTarget);
      });
      // Reset lock once scrolling stops (no scroll events for 150ms)
      clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(() => { navClickTarget = null; }, 150);
      return;
    }
    var navHeight = navEl.offsetHeight;
    var trigger = navHeight + 40; // point just below sticky nav
    var currentId = '';
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= trigger) {
        currentId = section.id;
      }
    });
    navPills.forEach((pill) => {
      var isActive = pill.getAttribute('href') === '#' + currentId;
      pill.classList.toggle('active', isActive);
      if (isActive) ensurePillVisible(pill);
    });
  }
  window.addEventListener('scroll', () => {
    if (!scrollTick) {
      requestAnimationFrame(() => {
        updateActiveNav();
        scrollTick = false;
      });
      scrollTick = true;
    }
  }, { passive: true });
  // Run once on load
  updateActiveNav();

  // --- Smooth scroll on nav click + guide modals ---
  navPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      const href = pill.getAttribute('href');
      const modalId = pill.dataset.modal;

      // If it's a modal trigger, open the modal
      if (modalId) {
        e.preventDefault();
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add('active');
          modal.scrollTop = 0;
          document.body.style.overflow = 'hidden';
        }
        return;
      }

      // Only intercept anchor links (#section)
      if (!href.startsWith('#')) return;
      e.preventDefault();
      // Lock highlight to this pill until smooth scroll settles
      navClickTarget = href;
      navPills.forEach((p) => p.classList.toggle('active', p === pill));
      const target = document.querySelector(href);
      if (target) {
        const navHeight = navEl.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
      ensurePillVisible(pill);
    });
  });

  // --- Guide modal close handlers ---
  const guideModals = document.querySelectorAll('.guide-modal');

  function closeGuideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  guideModals.forEach((modal) => {
    modal.querySelector('.guide-modal__close').addEventListener('click', () => closeGuideModal(modal));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeGuideModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      guideModals.forEach((modal) => {
        if (modal.classList.contains('active')) closeGuideModal(modal);
      });
    }
  });

  // Handle inline [data-open-modal] links (e.g. in callouts)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-modal]');
    if (!trigger) return;
    e.preventDefault();
    const modal = document.getElementById(trigger.dataset.openModal);
    if (modal) {
      modal.classList.add('active');
      modal.scrollTop = 0;
      document.body.style.overflow = 'hidden';
    }
  });

  // --- Back to top button ---
  const backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    const hero = document.querySelector('.hero');
    const topObserver = new IntersectionObserver(
      ([entry]) => backBtn.classList.toggle('visible', !entry.isIntersecting),
      { threshold: 0 }
    );
    topObserver.observe(hero);
  }

  // --- Gallery scroll reveal ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length && !prefersReducedMotion) {
    const galleryObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            galleryObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    galleryItems.forEach((item, i) => {
      item.style.transitionDelay = `${(i % 4) * 80}ms`;
      galleryObs.observe(item);
    });
  } else {
    galleryItems.forEach((item) => item.classList.add('revealed'));
  }

  // --- Gallery lightbox ---
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox && galleryItems.length) {
    const lbImg = lightbox.querySelector('img');
    const lbCounter = lightbox.querySelector('.gallery-lightbox__counter');
    const lbClose = lightbox.querySelector('.gallery-lightbox__close');
    const lbPrev = lightbox.querySelector('.gallery-lightbox__nav--prev');
    const lbNext = lightbox.querySelector('.gallery-lightbox__nav--next');
    let currentIndex = 0;
    const images = Array.from(galleryItems).map((item) => {
      const img = item.querySelector('img');
      return { src: img.src, alt: img.alt };
    });

    function openLightbox(index) {
      currentIndex = index;
      lbImg.src = images[currentIndex].src;
      lbImg.alt = images[currentIndex].alt;
      lbCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigate(dir) {
      currentIndex = (currentIndex + dir + images.length) % images.length;
      lbImg.src = images[currentIndex].src;
      lbImg.alt = images[currentIndex].alt;
      lbCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    lbClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
    lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
    lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }
})();
