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

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navPills.forEach((pill) => {
            pill.classList.toggle('active', pill.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.15, rootMargin: '-80px 0px -50% 0px' }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  // --- Smooth scroll on nav click ---
  const navBar = document.querySelector('.category-nav');
  navPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const href = pill.getAttribute('href');
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
})();
