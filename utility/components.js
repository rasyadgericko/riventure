// ===== SHARED COMPONENTS (Nav + Footer) =====
// Injected via JS so updates propagate to all pages automatically.
(function () {

  // ===== REUSABLE BUTTON COMPONENT =====
  // glowBtn(href, label, extraClass, size)
  // size: 'sm' for nav (12px icon), default for standard (16px icon)
  function glowBtn(href, label, extraClass, size) {
    var w = size === 'sm' ? 12 : 16;
    var sw = size === 'sm' ? '2.5' : '2';
    var arrow =
      '<svg width="' + w + '" height="' + w + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + sw + '" aria-hidden="true">' +
      '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
    return '<a href="' + href + '" class="glow-btn' + (extraClass ? ' ' + extraClass : '') + '">' +
      '<span>' + label + '</span>' + arrow + '</a>';
  }

  // secondaryBtn(href, label, extraClass)
  function secondaryBtn(href, label, extraClass) {
    var arrow =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
    return '<a href="' + href + '" class="btn-secondary' + (extraClass ? ' ' + extraClass : '') + '">' +
      '<span>' + label + '</span>' + arrow + '</a>';
  }

  // Expose globally so any page script can use it
  window.RYC = window.RYC || {};
  window.RYC.glowBtn = glowBtn;
  window.RYC.secondaryBtn = secondaryBtn;

  // Detect if we're in the /blog/ subdirectory
  var path = window.location.pathname;
  var inBlog = path.indexOf('/blog/') !== -1;
  var prefix = inBlog ? '../' : '';
  var rootPrefix = active === 'home' ? '' : '/';

  // Determine active page
  var active = '';
  if (path === '/' || path === '/index.html' || path.endsWith('/RYC/') || path.endsWith('/RYC/index.html')) active = 'home';
  else if (path.indexOf('about') !== -1) active = 'about';
  else if (path.indexOf('pricing') !== -1) active = 'pricing';
  else if (path.indexOf('contact') !== -1) active = 'contact';
  else if (path.indexOf('blog') !== -1) active = 'blog';

  // Work/Services links — hash anchors on homepage, absolute on sub-pages
  var workHref = active === 'home' ? '#work' : '/#work';
  var servicesHref = active === 'home' ? '#services' : '/#services';
  var aboutHref = '/about.html';

  function cls(page) { return active === page ? ' class="active"' : ''; }

  // ===== NAV =====
  var navEl = document.getElementById('site-nav');
  if (navEl) {
    navEl.outerHTML =
      '<nav role="navigation" aria-label="Main navigation">' +
        '<a href="' + rootPrefix + '" class="nav-logo"><img src="' + prefix + 'assets/ryc-logo.svg" alt="RYC" width="414" height="177"></a>' +
        '<div class="nav-right">' +
          '<ul class="nav-links">' +
            '<li><a href="/about.html"' + cls('about') + '>About</a></li>' +
            '<li><a href="/pricing.html"' + cls('pricing') + '>Pricing</a></li>' +
            '<li><a href="/blog.html"' + cls('blog') + '>Blog</a></li>' +
            '<li><a href="/contact.html"' + cls('contact') + '>Contact</a></li>' +
          '</ul>' +
          glowBtn('/contact.html', 'Start a Project', 'nav-cta', 'sm') +
        '</div>' +
        '<div class="nav-mobile-actions">' +
          '<button class="nav-toggle" id="navToggle" aria-label="Open navigation menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '</div>' +
      '</nav>' +
      '<div class="mobile-menu" id="mobileMenu" role="dialog" aria-label="Mobile navigation">' +
        '<a href="/about.html">About</a>' +
        '<a href="/pricing.html">Pricing</a>' +
        '<a href="/blog.html">Blog</a>' +
        '<a href="/contact.html">Contact</a>' +
        glowBtn('/contact.html', 'Start a Project', 'mobile-menu-cta') +
      '</div>';
  }

  // ===== FOOTER =====
  var footerEl = document.getElementById('site-footer');
  if (footerEl) {
    footerEl.outerHTML =
      '<footer role="contentinfo">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a href="' + rootPrefix + '" class="nav-logo"><img src="' + prefix + 'assets/ryc-logo.svg" alt="RYC" width="414" height="177"></a>' +
            '<p>We help businesses turn their goals into scalable digital growth \u2014 through high-quality websites and products, built fast with AI-native workflows and human craft.</p>' +
          '</div>' +
          '<div class="footer-cols">' +
            '<div class="footer-col">' +
              '<h3>Company</h3>' +
              '<a href="' + aboutHref + '">About</a>' +
              '<a href="' + workHref + '">Work</a>' +
              '<a href="/pricing.html">Pricing</a>' +
              '<a href="/blog.html">Blog</a>' +
              '<a href="/contact.html">Contact</a>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h3>Connect</h3>' +
              '<a href="https://x.com/rycworks" target="_blank" rel="noopener noreferrer">Twitter / X</a>' +
              '<a href="https://www.linkedin.com/company/rycworks" target="_blank" rel="noopener noreferrer">LinkedIn</a>' +
              '<a href="https://instagram.com/rycworks" target="_blank" rel="noopener noreferrer">Instagram</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<p>&copy; 2026 RYC. All rights reserved.</p>' +
          '<div class="footer-socials" aria-label="Social media links">' +
            '<a href="https://x.com/rycworks" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">X</a>' +
            '<a href="https://www.linkedin.com/company/rycworks" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>' +
            '<a href="https://instagram.com/rycworks" target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  // ===== MOBILE MENU TOGGLE =====
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  var menuOpen = false;
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menuOpen = !menuOpen;
      toggle.classList.toggle('active', menuOpen);
      toggle.setAttribute('aria-expanded', String(menuOpen));
      toggle.setAttribute('aria-label', menuOpen ? 'Close navigation menu' : 'Open navigation menu');
      menu.classList.toggle('open', menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });
    // Close on link click
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menuOpen = false;
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) {
        menuOpen = false;
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }
})();
