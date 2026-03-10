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
    document.querySelectorAll('.reveal-text').forEach(el => {
      if (el.dataset.processed) return;
      el.dataset.processed = 'true';
      const text = el.textContent.trim();
      el.innerHTML = text.split(' ').map(w => `<span class="word">${w}</span>`).join(' ');
    });

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

  // ===== CATEGORY FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const featuredArticle = document.querySelector('.featured-article');
  const articleCards = document.querySelectorAll('.article-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (featuredArticle) {
        const cat = featuredArticle.dataset.category;
        const show = filter === 'all' || cat === filter;
        featuredArticle.hidden = !show;
        featuredArticle.setAttribute('aria-hidden', String(!show));
      }

      let visibleCount = 0;
      articleCards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;
        card.hidden = !show;
        card.setAttribute('aria-hidden', String(!show));
        if (show) visibleCount++;
      });

      const countEl = document.querySelector('.blog-count');
      if (countEl) {
        const total = (featuredArticle && !featuredArticle.hidden ? 1 : 0) + visibleCount;
        countEl.textContent = total + (total === 1 ? ' Article' : ' Articles');
      }
    });
  });

  // ===== NEWSLETTER FORM =====
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterBtn = document.getElementById('newsletterBtn');
  const newsletterSuccess = document.getElementById('newsletterSuccess');
  const newsletterStatus = document.getElementById('newsletterStatus');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();

      const emailInput = document.getElementById('newsletter-email');
      if (!emailInput.value.trim() || !emailInput.validity.valid) {
        emailInput.focus();
        return;
      }

      newsletterBtn.disabled = true;
      newsletterBtn.querySelector('span').textContent = 'Sending...';
      newsletterStatus.textContent = '';

      fetch('https://formspree.io/f/xpqypjzj', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(newsletterForm)
      })
      .then(res => {
        if (res.ok) {
          newsletterForm.style.opacity = '0';
          newsletterForm.style.pointerEvents = 'none';
          newsletterSuccess.classList.add('is-visible');

          setTimeout(() => {
            newsletterSuccess.classList.remove('is-visible');
            newsletterForm.reset();
            newsletterForm.style.opacity = '';
            newsletterForm.style.pointerEvents = '';
            newsletterBtn.disabled = false;
            newsletterBtn.querySelector('span').textContent = 'Subscribe';
          }, 4000);
        } else {
          return res.json().then(data => {
            newsletterStatus.textContent = data.errors
              ? data.errors.map(err => err.message).join(', ')
              : 'Something went wrong. Please try again.';
            newsletterBtn.disabled = false;
            newsletterBtn.querySelector('span').textContent = 'Subscribe';
          });
        }
      })
      .catch(() => {
        newsletterStatus.textContent = 'Network error. Please try again.';
        newsletterBtn.disabled = false;
        newsletterBtn.querySelector('span').textContent = 'Subscribe';
      });
    });
  }

})();
