// ===== GLOW BUTTON INIT (shared across all pages) =====
(function() {
  // Inject SVG filters if not already present
  if (!document.getElementById('glow-f1')) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    svg.innerHTML =
      '<defs>' +
      '<filter id="glow-f1" width="300%" x="-100%" height="300%" y="-100%"><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 9 0"/></filter>' +
      '<filter id="glow-f2" width="300%" x="-100%" height="300%" y="-100%"><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 0"/></filter>' +
      '<filter id="glow-f3" width="300%" x="-100%" height="300%" y="-100%"><feColorMatrix values="1 0 0 0.2 0 0 1 0 0.2 0 0 0 1 0.2 0 0 0 0 2 0"/></filter>' +
      '</defs>';
    document.body.insertBefore(svg, document.body.firstChild);
  }

  // Initialize glow buttons that haven't been initialized yet
  document.querySelectorAll('.glow-btn:not(.gb-init)').forEach(function(btn) {
    btn.classList.add('gb-init');
    var content = btn.innerHTML;
    btn.innerHTML =
      '<span class="gb-l1" aria-hidden="true"><span class="gb-s"></span></span>' +
      '<span class="gb-l2" aria-hidden="true"><span class="gb-s"></span></span>' +
      '<span class="gb-l3" aria-hidden="true"><span class="gb-s"></span></span>' +
      '<span class="gb-c">' + content + '</span>';
  });
})();
