// ===== PAGE TRANSITIONS =====
(function() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ptEl = document.getElementById('pageTransition');
  if (!ptEl || prefersReducedMotion) return;

  // On page load: play entrance animation if we came from an internal transition
  if (sessionStorage.getItem('ryc-transitioning')) {
    sessionStorage.removeItem('ryc-transitioning');
    ptEl.classList.add('enter');
    setTimeout(() => { ptEl.classList.remove('enter'); }, 800);
  }

  // Intercept internal link clicks
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;

    if (href.startsWith('/')) {
      const currentPath = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
      const targetPath = href.replace(/\.html$/, '').replace(/\/$/, '') || '/';
      if (currentPath === targetPath) return;

      e.preventDefault();
      sessionStorage.setItem('ryc-transitioning', '1');
      ptEl.classList.remove('enter');
      ptEl.classList.add('exit');
      ptEl.style.pointerEvents = 'all';
      setTimeout(function() { window.location.href = href; }, 350);
    }
  });
})();
