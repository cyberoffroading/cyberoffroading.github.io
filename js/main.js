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
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Scroll-triggered card reveals ---
  var cards = document.querySelectorAll('.product-card');

  if (prefersReducedMotion) {
    cards.forEach(function(card) { card.classList.add('revealed'); });
  } else {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var card = entry.target;
          var siblings = Array.from(card.parentElement.children);
          var index = siblings.indexOf(card);
          card.style.transitionDelay = index * 50 + 'ms';
          card.classList.add('revealed');
          card.addEventListener('transitionend', function() {
            card.style.transitionDelay = '0ms';
          }, { once: true });
          revealObserver.unobserve(card);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });
    cards.forEach(function(card) { revealObserver.observe(card); });
  }

  // --- Active nav pill tracking ---
  var navPills = document.querySelectorAll('.nav-pill');
  var sections = document.querySelectorAll('.section');
  var navEl = document.querySelector('.category-nav');
  var navInner = navEl.querySelector('.category-nav__inner');
  var scrollTick = false;
  var navClickTarget = null;
  var scrollIdleTimer = null;

  function ensurePillVisible(pill) {
    var pillRect = pill.getBoundingClientRect();
    var navRect = navInner.getBoundingClientRect();
    if (pillRect.left < navRect.left || pillRect.right > navRect.right) {
      var left = pill.offsetLeft - navInner.offsetLeft - (navInner.clientWidth / 2) + (pill.offsetWidth / 2);
      navInner.scrollTo({ left: left, behavior: 'smooth' });
    }
  }

  function updateActiveNav() {
    if (navClickTarget) {
      navPills.forEach(function(pill) {
        pill.classList.toggle('active', pill.getAttribute('href') === navClickTarget);
      });
      clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(function() { navClickTarget = null; }, 150);
      return;
    }
    var navHeight = navEl.offsetHeight;
    var trigger = navHeight + 40;
    var currentId = '';
    sections.forEach(function(section) {
      if (section.getBoundingClientRect().top <= trigger) {
        currentId = section.id;
      }
    });
    navPills.forEach(function(pill) {
      var isActive = pill.getAttribute('href') === '#' + currentId;
      pill.classList.toggle('active', isActive);
      if (isActive) ensurePillVisible(pill);
    });
  }

  window.addEventListener('scroll', function() {
    if (!scrollTick) {
      requestAnimationFrame(function() {
        updateActiveNav();
        scrollTick = false;
      });
      scrollTick = true;
    }
  }, { passive: true });
  updateActiveNav();

  // --- Smooth scroll on nav click ---
  navPills.forEach(function(pill) {
    pill.addEventListener('click', function(e) {
      var href = pill.getAttribute('href');
      if (!href || href.indexOf('#') !== 0) return;
      e.preventDefault();
      navClickTarget = href;
      navPills.forEach(function(p) { p.classList.toggle('active', p === pill); });
      var target = document.querySelector(href);
      if (target) {
        var navHeight = navEl.offsetHeight;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
      ensurePillVisible(pill);
    });
  });

  // --- Guide modal open/close with hash ---
  var guideModals = document.querySelectorAll('.guide-modal');
  // Hash → modal id map for deep linking
  var guideHashMap = {
    '#guide-vault': 'guideVault',
    '#guide-glass': 'guideGlass',
    '#guide-winch': 'guideWinch'
  };

  function openGuideModal(modalId, updateHash) {
    var modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    if (updateHash) {
      var hash = Object.keys(guideHashMap).find(function(k) { return guideHashMap[k] === modalId; });
      if (hash) history.replaceState(null, '', hash);
    }
  }

  function closeGuideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    history.replaceState(null, '', window.location.pathname);
  }

  // Close button + backdrop + escape
  guideModals.forEach(function(modal) {
    modal.querySelector('.guide-modal__close').addEventListener('click', function() { closeGuideModal(modal); });
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeGuideModal(modal);
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      guideModals.forEach(function(modal) {
        if (modal.classList.contains('active')) closeGuideModal(modal);
      });
    }
  });

  // Handle inline [data-open-modal] links (e.g. in callouts)
  document.addEventListener('click', function(e) {
    var t = e.target.closest('[data-open-modal]');
    if (!t) return;
    e.preventDefault();
    openGuideModal(t.dataset.openModal, true);
  });

  // Deep link — open modal from URL hash on page load
  (function() {
    var hash = window.location.hash;
    if (hash && guideHashMap[hash]) {
      openGuideModal(guideHashMap[hash], false);
    }
  })();

  // --- Back to top button ---
  var backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    var hero = document.querySelector('.hero');
    var topObserver = new IntersectionObserver(function(entries) {
      backBtn.classList.toggle('visible', !entries[0].isIntersecting);
    }, { threshold: 0 });
    topObserver.observe(hero);
  }

  // --- Gallery scroll reveal ---
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length && !prefersReducedMotion) {
    var galleryObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          galleryObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    galleryItems.forEach(function(item, i) {
      item.style.transitionDelay = (i % 4) * 80 + 'ms';
      galleryObs.observe(item);
    });
  } else {
    galleryItems.forEach(function(item) { item.classList.add('revealed'); });
  }

  // --- Gallery lightbox ---
  var lightbox = document.getElementById('galleryLightbox');
  if (lightbox && galleryItems.length) {
    var lbImg = lightbox.querySelector('img');
    var lbCounter = lightbox.querySelector('.gallery-lightbox__counter');
    var lbClose = lightbox.querySelector('.gallery-lightbox__close');
    var lbPrev = lightbox.querySelector('.gallery-lightbox__nav--prev');
    var lbNext = lightbox.querySelector('.gallery-lightbox__nav--next');
    var currentIndex = 0;
    var images = Array.from(galleryItems).map(function(item) {
      var img = item.querySelector('img');
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

    galleryItems.forEach(function(item, i) {
      item.addEventListener('click', function() { openLightbox(i); });
    });

    lbClose.addEventListener('click', function(e) { e.stopPropagation(); closeLightbox(); });
    lbPrev.addEventListener('click', function(e) { e.stopPropagation(); navigate(-1); });
    lbNext.addEventListener('click', function(e) { e.stopPropagation(); navigate(1); });
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  // --- Product voting ---
  var VOTE_API = 'https://cyberoffroading-votes.chaukevin.workers.dev';
  var votedProducts = JSON.parse(localStorage.getItem('voted') || '{}');

  // Inject vote buttons into product cards
  var productCards = document.querySelectorAll('.product-card[data-product-id]');
  productCards.forEach(function(card) {
    var id = card.dataset.productId;
    var info = card.querySelector('.product-card__info');
    var btn = document.createElement('button');
    btn.className = 'vote-btn' + (votedProducts[id] ? ' voted' : '');
    btn.innerHTML = '<svg viewBox="0 0 16 16" fill="none"><path d="M8 2l2.1 4.2 4.7.7-3.4 3.3.8 4.6L8 12.5l-4.2 2.3.8-4.6L1.2 6.9l4.7-.7L8 2z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"' + (votedProducts[id] ? ' fill="currentColor"' : '') + '/></svg><span class="vote-btn__count">\u2014</span>';
    btn.dataset.productId = id;
    info.appendChild(btn);
  });

  // Fetch and render vote counts
  fetch(VOTE_API + '/votes').then(function(r) { return r.json(); }).then(function(counts) {
    productCards.forEach(function(card) {
      var id = card.dataset.productId;
      var countEl = card.querySelector('.vote-btn__count');
      if (countEl) countEl.textContent = counts[id] || 0;
    });
  }).catch(function() {});

  // Handle vote clicks
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.vote-btn');
    if (!btn || btn.classList.contains('voted')) return;

    var id = btn.dataset.productId;
    btn.classList.add('voted');
    var svg = btn.querySelector('svg path');
    if (svg) svg.setAttribute('fill', 'currentColor');

    // Optimistic update
    var countEl = btn.querySelector('.vote-btn__count');
    var current = parseInt(countEl.textContent) || 0;
    countEl.textContent = current + 1;

    // Persist locally
    votedProducts[id] = true;
    localStorage.setItem('voted', JSON.stringify(votedProducts));

    // Send to worker
    fetch(VOTE_API + '/vote/' + id, { method: 'POST' }).catch(function() {});
  });
})();
