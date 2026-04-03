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
  let scrollTick = false;
  let navClickLock = false; // suppress scroll updates during smooth-scroll from tap
  function updateActiveNav() {
    if (navClickLock) return;
    const navHeight = document.querySelector('.category-nav').offsetHeight;
    const trigger = navHeight + 40; // point just below sticky nav
    let currentId = '';
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= trigger) {
        currentId = section.id;
      }
    });
    navPills.forEach((pill) => {
      pill.classList.toggle('active', pill.getAttribute('href') === `#${currentId}`);
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
  const navBar = document.querySelector('.category-nav');
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
      // Immediately highlight tapped pill and lock out scroll updates
      // until smooth scroll finishes
      navPills.forEach((p) => p.classList.toggle('active', p === pill));
      navClickLock = true;
      setTimeout(() => { navClickLock = false; }, 800);
      const target = document.querySelector(href);
      if (target) {
        const navHeight = navBar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
      // Scroll the pill into view within the nav (horizontal only)
      const navInner = navBar.querySelector('.category-nav__inner');
      const pillLeft = pill.offsetLeft - navInner.offsetLeft - (navInner.clientWidth / 2) + (pill.offsetWidth / 2);
      navInner.scrollTo({ left: pillLeft, behavior: 'smooth' });
    });
  });

  // --- Guide modal close handlers ---
  document.querySelectorAll('.guide-modal').forEach((modal) => {
    const closeBtn = modal.querySelector('.guide-modal__close');

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
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
    const srcs = Array.from(galleryItems).map((item) => item.querySelector('img').src);

    function openLightbox(index) {
      currentIndex = index;
      lbImg.src = srcs[currentIndex];
      lbCounter.textContent = (currentIndex + 1) + ' / ' + srcs.length;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigate(dir) {
      currentIndex = (currentIndex + dir + srcs.length) % srcs.length;
      lbImg.src = srcs[currentIndex];
      lbCounter.textContent = (currentIndex + 1) + ' / ' + srcs.length;
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
