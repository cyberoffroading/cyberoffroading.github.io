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

  // Simple focus trap helper (used by modals + lightbox)
  function trapFocus(container, onEscape) {
    var selector = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    var previousFocus = document.activeElement;

    // Re-query on every Tab and skip hidden/disabled elements — the focusable
    // set changes when modal content is injected or nav buttons are hidden.
    function visibleFocusable() {
      return Array.prototype.filter.call(container.querySelectorAll(selector), function(el) {
        return !el.disabled && el.offsetParent !== null;
      });
    }

    function handleKey(e) {
      if (e.key === 'Tab') {
        var focusable = visibleFocusable();
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        var active = document.activeElement;
        var outside = !container.contains(active);
        if (e.shiftKey) {
          if (active === first || outside) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (active === last || outside) {
            first.focus();
            e.preventDefault();
          }
        }
      }
      if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
    }

    container.addEventListener('keydown', handleKey);
    // Focus first focusable element
    setTimeout(function() {
      var focusable = visibleFocusable();
      if (focusable.length) focusable[0].focus();
    }, 10);

    return function release() {
      container.removeEventListener('keydown', handleKey);
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    };
  }

  // --- Scroll-triggered card reveals ---
  // Article cards opt out — they sit near the top of the page where
  // any fade-in flicker is most visible. CSS keeps them always visible.
  var cards = document.querySelectorAll('.product-card:not(.article-card)');

  if (prefersReducedMotion) {
    cards.forEach(function(card) { card.classList.add('revealed'); });
  } else {
    var viewportH = window.innerHeight;
    var aboveFold = [];
    var belowFold = [];
    cards.forEach(function(card) {
      var rect = card.getBoundingClientRect();
      if (rect.top < viewportH && rect.bottom > 0) {
        aboveFold.push(card);
      } else {
        belowFold.push(card);
      }
    });

    // Reveal above-fold cards immediately so they never sit invisible
    // while waiting on the async IntersectionObserver callback.
    aboveFold.forEach(function(card) { card.classList.add('revealed'); });

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
    belowFold.forEach(function(card) { revealObserver.observe(card); });
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

  // --- Guide modal: fetch standalone page → inject content ---
  // Standalone pages in /guides/*.html are the source of truth (real URLs
  // for SEO and shareability). Clicking an article card fetches the page,
  // extracts its .guide-content, and injects it into the modal shell.
  // URL bar updates to the real path via pushState.
  var guideModal = document.getElementById('guideModal');
  var guideModalContent = document.getElementById('guideModalContent');
  var guidePageDefaultTitle = document.title;
  var guideCache = Object.create(null);
  var releaseGuideFocus = null;
  // Race protection: each open gets a token; close/another-open invalidates
  // any fetch still in flight so a slow guide can't reopen a closed modal.
  var guideReqId = 0;
  var activeGuidePath = null;
  // Number of history entries the modal has pushed this "session" (guide →
  // guide cross-links stack entries). Closing jumps back past all of them in
  // one history.go() so Back never resurfaces a dismissed guide.
  var guidePushDepth = 0;

  // Backwards compat: old hash-based deep links → new URL paths
  var legacyHashMap = {
    '#guide-vault': '/guides/vault-seal.html',
    '#guide-air-filter': '/guides/cabin-air-filter.html',
    '#guide-glass': '/guides/roof-glass.html',
    '#guide-winch': '/guides/winch-wiring.html',
    '#guide-trail-lift': '/guides/trail-lift.html'
  };

  function isGuideUrl(path) {
    return /\/guides\/[^/]+\.html$/.test(path);
  }

  function resolveGuidePath(href) {
    return new URL(href, window.location.href).pathname;
  }

  function fetchGuide(path) {
    var cached = guideCache[path];
    if (cached) return cached.html != null ? Promise.resolve(cached) : cached.promise;
    var promise = fetch(path).then(function(r) { return r.text(); }).then(function(html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var contentEl = doc.querySelector('.guide-content');
      var titleEl = doc.querySelector('title');
      var data = {
        html: contentEl ? contentEl.innerHTML : '',
        title: titleEl ? titleEl.textContent : guidePageDefaultTitle
      };
      guideCache[path] = data;
      return data;
    });
    guideCache[path] = { promise: promise, html: null };
    return promise;
  }

  function openGuide(path, push) {
    if (!guideModal) return;
    // Already showing this guide (e.g. back/forward spam) — just sync history.
    if (activeGuidePath === path && guideModal.classList.contains('active')) {
      if (push) {
        history.pushState({ guide: path }, '', path);
        guidePushDepth++;
      }
      return;
    }
    var reqId = ++guideReqId;
    fetchGuide(path).then(function(data) {
      if (reqId !== guideReqId) return; // superseded by a close or another open
      activeGuidePath = path;
      guideModalContent.innerHTML = data.html;
      guideModal.classList.add('active');
      guideModal.setAttribute('aria-hidden', 'false');
      guideModal.setAttribute('aria-label', data.title);
      guideModal.scrollTop = 0;
      document.body.style.overflow = 'hidden';
      document.title = data.title;
      if (push) {
        history.pushState({ guide: path }, '', path);
        guidePushDepth++;
      }
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load(guideModalContent);
      }
      // Trap focus inside modal
      if (releaseGuideFocus) releaseGuideFocus();
      releaseGuideFocus = trapFocus(guideModal, closeGuide);
    }).catch(function() {});
  }

  function closeGuide() {
    if (!guideModal) return;
    guideReqId++; // cancel any in-flight open
    activeGuidePath = null;
    guideModal.classList.remove('active');
    guideModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.title = guidePageDefaultTitle;
    if (releaseGuideFocus) {
      releaseGuideFocus();
      releaseGuideFocus = null;
    }
    if (isGuideUrl(window.location.pathname)) {
      if (guidePushDepth > 0) {
        // The modal pushed these entries — jump back past all of them so
        // closing mirrors the back button without growing history.
        var depth = guidePushDepth;
        guidePushDepth = 0;
        history.go(-depth);
      } else {
        // Deep link / legacy hash / history-owned entry: rewrite in place.
        history.replaceState({}, '', '/');
      }
    }
  }

  if (guideModal) {
    guideModal.querySelector('.guide-modal__close').addEventListener('click', closeGuide);
    guideModal.addEventListener('click', function(e) {
      if (e.target === guideModal) closeGuide();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && guideModal && guideModal.classList.contains('active')) closeGuide();
  });

  // Card / inline-link clicks: intercept to open modal, but allow native
  // behavior on modifier-clicks so right-click & cmd-click still work.
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[data-guide-modal]');
    if (!link) return;
    // No modal shell on this page (e.g. a standalone /guides/*.html page) —
    // let the link navigate natively instead of swallowing the click.
    if (!guideModal) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    openGuide(resolveGuidePath(link.getAttribute('href')), true);
  });

  // Hover prefetch — pulls guide HTML into cache before the click lands.
  document.addEventListener('mouseover', function(e) {
    if (!guideModal) return;
    var link = e.target.closest('a[data-guide-modal]');
    if (!link) return;
    var path = resolveGuidePath(link.getAttribute('href'));
    if (!guideCache[path]) fetchGuide(path);
  });

  window.addEventListener('popstate', function() {
    var path = window.location.pathname;
    if (isGuideUrl(path)) {
      guidePushDepth = 0; // this entry is owned by history, not the modal
      openGuide(path, false);
    } else if (guideModal && guideModal.classList.contains('active')) {
      guideReqId++;
      activeGuidePath = null;
      guidePushDepth = 0;
      guideModal.classList.remove('active');
      guideModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.title = guidePageDefaultTitle;
      if (releaseGuideFocus) {
        releaseGuideFocus();
        releaseGuideFocus = null;
      }
    }
  });

  // Page load: redirect legacy hash deep-links to their new URLs.
  (function() {
    var hash = window.location.hash;
    if (hash && legacyHashMap[hash]) {
      var path = legacyHashMap[hash];
      history.replaceState({ guide: path }, '', path);
      openGuide(path, false);
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

  // --- Nav brand wordmark reveal ---
  // Keep the nav's neon wordmark hidden until the big hero wordmark scrolls
  // out of view, then fade it in (the "sign hands off" effect).
  var navBrand = document.querySelector('.category-nav__brand');
  var heroWordmark = document.querySelector('.hero .wordmark--hero');
  if (navBrand && heroWordmark && 'IntersectionObserver' in window) {
    new IntersectionObserver(function(entries) {
      navBrand.classList.toggle('revealed', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(heroWordmark);
  } else if (navBrand) {
    navBrand.classList.add('revealed'); // no-IO fallback: always show
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
  var releaseLightboxFocus = null;
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
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (releaseLightboxFocus) releaseLightboxFocus();
      releaseLightboxFocus = trapFocus(lightbox, closeLightbox);
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (releaseLightboxFocus) {
        releaseLightboxFocus();
        releaseLightboxFocus = null;
      }
    }

    function navigate(dir) {
      currentIndex = (currentIndex + dir + images.length) % images.length;
      lbImg.src = images[currentIndex].src;
      lbImg.alt = images[currentIndex].alt;
      lbCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
    }

    galleryItems.forEach(function(item, i) {
      item.addEventListener('click', function() { openLightbox(i); });
      // Keyboard support: gallery items are role="button" tabindex="0"
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
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

  // localStorage throws in Safari Private Mode / when storage is disabled.
  // Voting degrades to session-only state instead of killing the whole IIFE.
  var votedProducts = {};
  try {
    votedProducts = JSON.parse(localStorage.getItem('voted') || '{}') || {};
  } catch (e) { votedProducts = {}; }

  function saveVoted() {
    try {
      localStorage.setItem('voted', JSON.stringify(votedProducts));
    } catch (e) { /* private mode — keep in-memory state only */ }
  }

  // Single shared live region: announces vote feedback without the
  // per-counter aria-live barrage when all counts load at once.
  var voteStatus = document.createElement('div');
  voteStatus.className = 'sr-only';
  voteStatus.setAttribute('aria-live', 'polite');
  document.body.appendChild(voteStatus);

  function announce(msg) {
    voteStatus.textContent = msg;
  }

  function updateVoteLabel(btn) {
    var countEl = btn.querySelector('.vote-btn__count');
    var n = parseInt(countEl.textContent, 10);
    var votes = isNaN(n) ? '' : n + (n === 1 ? ' vote' : ' votes') + '. ';
    var action = btn.classList.contains('voted') ? 'Voted. Press to remove your vote' : 'Vote for this product';
    btn.setAttribute('aria-label', votes + action);
  }

  // Inline SVGs (replaces external lucide@latest dependency)
  var ICONS = {
    star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
    click: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>'
  };

  // Inject vote + click stats row into product cards
  var productCards = document.querySelectorAll('.product-card[data-product-id]');
  productCards.forEach(function(card) {
    var id = card.dataset.productId;
    var info = card.querySelector('.product-card__info');

    var row = document.createElement('div');
    row.className = 'product-card__stats is-loading';

    var btn = document.createElement('button');
    btn.className = 'vote-btn' + (votedProducts[id] ? ' voted' : '');
    btn.innerHTML = ICONS.star + '<span class="vote-btn__count">\u2014</span>';
    btn.dataset.productId = id;
    btn.disabled = true; // enabled once real counts arrive (prevents NaN math on the placeholder)
    updateVoteLabel(btn);

    var badge = document.createElement('span');
    badge.className = 'click-counter';
    badge.innerHTML = ICONS.click + ' <span class="click-counter__count">\u2014</span><span class="sr-only"> people clicked through to this product</span>';

    row.appendChild(btn);
    row.appendChild(badge);
    info.appendChild(row);
  });

  // Fetch and render vote + click counts (deferred off the LCP window —
  // small payload, but no reason to contend with hero/render work).
  function loadCounts() {
    fetch(VOTE_API + '/votes').then(function(r) { return r.json(); }).then(function(data) {
      var votes = data.votes || {};
      var clicks = data.clicks || {};
      productCards.forEach(function(card) {
        var id = card.dataset.productId;
        var voteCountEl = card.querySelector('.vote-btn__count');
        if (voteCountEl) voteCountEl.textContent = votes[id] || 0;
        var clickCountEl = card.querySelector('.click-counter__count');
        if (clickCountEl) clickCountEl.textContent = clicks[id] || 0;
        var btn = card.querySelector('.vote-btn');
        if (btn) {
          btn.disabled = false;
          updateVoteLabel(btn);
        }
        var statsRow = card.querySelector('.product-card__stats');
        if (statsRow) statsRow.classList.remove('is-loading');
      });
    }).catch(function() {
      // Worker unreachable: leave buttons disabled — votes couldn't persist
      // anyway — but stop the loading shimmer so the dash isn't stuck pulsing.
      productCards.forEach(function(card) {
        var btn = card.querySelector('.vote-btn');
        if (btn) btn.setAttribute('aria-label', 'Voting unavailable');
        var statsRow = card.querySelector('.product-card__stats');
        if (statsRow) statsRow.classList.remove('is-loading');
      });
    });
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadCounts, { timeout: 3000 });
  } else {
    setTimeout(loadCounts, 1500);
  }

  // Handle vote toggle clicks — optimistic UI, then reconcile with the
  // server's authoritative count (the worker enforces 1 vote per IP, so
  // the optimistic +1 can be rejected for users behind a shared IP).
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.vote-btn');
    if (!btn || btn.disabled) return;

    var id = btn.dataset.productId;
    var countEl = btn.querySelector('.vote-btn__count');
    var current = parseInt(countEl.textContent, 10) || 0;
    var isVoted = btn.classList.contains('voted');

    function reconcile(endpoint, optimistic) {
      countEl.textContent = optimistic;
      updateVoteLabel(btn);
      fetch(VOTE_API + endpoint, { method: 'POST' })
        .then(function(r) {
          return r.json().then(function(d) { return { ok: r.ok, count: d && d.count }; });
        })
        .then(function(res) {
          if (res.ok && typeof res.count === 'number') {
            countEl.textContent = res.count;
          } else if (!res.ok) {
            // Rejected (already voted from this IP / no vote to remove):
            // keep the star state but undo the optimistic count change.
            countEl.textContent = current;
          }
          updateVoteLabel(btn);
        })
        .catch(function() {});
    }

    if (isVoted) {
      btn.classList.remove('voted');
      delete votedProducts[id];
      saveVoted();
      announce('Vote removed');
      reconcile('/unvote/' + id, Math.max(current - 1, 0));
    } else {
      btn.classList.add('voted');
      votedProducts[id] = true;
      saveVoted();
      announce('Vote recorded');
      reconcile('/vote/' + id, current + 1);
    }
  });

  // Track affiliate link clicks (public counter)
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a.cta-button');
    if (!link) return;
    var card = link.closest('.product-card[data-product-id]');
    if (!card) return;
    var countEl = card.querySelector('.click-counter__count');
    if (countEl) countEl.textContent = (parseInt(countEl.textContent) || 0) + 1;
    navigator.sendBeacon(VOTE_API + '/click/' + card.dataset.productId);
  });
})();
