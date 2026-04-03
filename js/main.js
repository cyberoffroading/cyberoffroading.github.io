/* ============================================================
   CYBEROFFROADING.COM — Main JS
   - Sticky nav active section tracking
   - Smooth scroll on nav click
   - Scroll-triggered card reveal
   ============================================================ */

(function () {
  'use strict';

  // --- Scroll-triggered card reveals ---
  const cards = document.querySelectorAll('.product-card');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger reveal within each batch
          const card = entry.target;
          const siblings = Array.from(card.parentElement.children);
          const index = siblings.indexOf(card);
          card.style.transitionDelay = `${index * 50}ms`;
          card.classList.add('revealed');
          revealObserver.unobserve(card);
        }
      });
    },
    { threshold: 0.01, rootMargin: '0px 0px 0px 0px' }
  );
  cards.forEach((card) => revealObserver.observe(card));

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
  navPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(pill.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      // Scroll nav pill into view on mobile
      pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });
})();
