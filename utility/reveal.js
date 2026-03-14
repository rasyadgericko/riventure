// utility/reveal.js — centralised scroll reveal (loaded last by boot.js)
// Observes .fade-up, .reveal-text, and h1/h2 em elements.
// Call window.RYC.observeReveals() after dynamically inserting new elements.
(function () {
  window.RYC = window.RYC || {};

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Word-split .reveal-text elements
  function splitWords() {
    document.querySelectorAll('.reveal-text').forEach(function (el) {
      if (el.dataset.rycSplit || el.querySelector('.word')) return;
      el.dataset.rycSplit = '1';
      var text = el.textContent.trim();
      if (text) {
        el.innerHTML = text.split(' ').map(function (w) {
          return '<span class="word">' + w + '</span>';
        }).join(' ');
      }
    });
  }

  var observer;
  var emObserver;

  if (!prefersReduced) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // Also trigger child <em> for brush underline reveal
          var em = e.target.querySelector('em');
          if (em) em.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    // Standalone h1/h2 em elements not inside .fade-up
    emObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); emObserver.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
  }

  function observeReveals() {
    splitWords();

    if (!prefersReduced) {
      document.querySelectorAll('.fade-up, .reveal-text').forEach(function (el) {
        if (!el.classList.contains('visible')) observer.observe(el);
      });
      // Watch h1/h2 em elements that aren't inside a .fade-up parent
      document.querySelectorAll('h1 em, h2 em').forEach(function (em) {
        if (!em.classList.contains('visible') && !em.closest('.fade-up, .reveal-text')) {
          emObserver.observe(em);
        }
      });
    } else {
      document.querySelectorAll('.fade-up, .reveal-text').forEach(function (el) {
        el.classList.add('visible');
      });
      document.querySelectorAll('h1 em, h2 em').forEach(function (em) {
        em.classList.add('visible');
      });
    }
  }

  // Initial pass
  observeReveals();

  // Expose for dynamic content (e.g. work cards loaded from Supabase)
  window.RYC.observeReveals = observeReveals;
})();
