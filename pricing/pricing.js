(function() {
  'use strict';

  // ===== THEME =====
  const root = document.documentElement;
  const themeToggles = [
    document.getElementById('themeToggle'),
    document.getElementById('themeToggleMobile')
  ].filter(Boolean);

  function getTheme() {
    return localStorage.getItem('ryc-theme') || 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    const icon = isDark ? '&#9680;' : '&#9681;';
    const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    themeToggles.forEach(t => {
      t.innerHTML = icon;
      t.setAttribute('aria-label', label);
    });
    localStorage.setItem('ryc-theme', theme);
  }

  applyTheme(getTheme());

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  });

  // ===== MOBILE NAV =====
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      navToggle.classList.toggle('active', menuOpen);
      navToggle.setAttribute('aria-expanded', String(menuOpen));
      navToggle.setAttribute('aria-label', menuOpen ? 'Close navigation menu' : 'Open navigation menu');
      mobileMenu.classList.toggle('open', menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menuOpen) {
        menuOpen = false;
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  // ===== REVEAL ANIMATIONS =====
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-up, .reveal-text').forEach(el => {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.fade-up, .reveal-text').forEach(el => {
      el.classList.add('visible');
    });
  }

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;

      // Close all others
      document.querySelectorAll('.faq-q').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.classList.remove('open');
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      answer.classList.toggle('open');
    });
  });

})();
