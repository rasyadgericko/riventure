// ===== ABOUT PAGE JS =====

(function () {

  // ===== THEME TOGGLE =====
  var root = document.documentElement;
  var stored = localStorage.getItem('ryc-theme');
  if (stored) { root.setAttribute('data-theme', stored); }
  // default from HTML attr is 'dark'

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('ryc-theme', next);
    });
  }

  // ===== INTERSECTION OBSERVER — REVEAL =====
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // Trigger <em> underline
          var em = e.target.querySelector('em');
          if (em) em.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-up, .reveal-text').forEach(function (el) {
      io.observe(el);
    });

    // Also watch h1/h2 em elements directly
    document.querySelectorAll('h1 em, h2 em').forEach(function (em) {
      var parent = em.closest('.fade-up, .reveal-text');
      if (!parent) {
        var emIo = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add('visible'); emIo.unobserve(e.target); }
          });
        }, { threshold: 0.5 });
        emIo.observe(em);
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

})();
