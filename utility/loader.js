// ===== GLOBAL CUBE LOADER =====
(function () {
  var loader = document.getElementById('pageLoader');
  if (!loader) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { loader.style.display = 'none'; return; }

  // Skip loader on internal page navigation — only show on fresh load or refresh
  if (sessionStorage.getItem('ryc-transitioning')) {
    loader.style.display = 'none';
    return;
  }

  window.addEventListener('load', function () {
    setTimeout(function () { loader.classList.add('done'); }, 800);
  });
})();
