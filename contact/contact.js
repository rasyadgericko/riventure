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

  // ===== FORM PROGRESSIVE DISCLOSURE =====
  const formDetailsToggle = document.getElementById('formDetailsToggle');
  const formDetailsPanel = document.getElementById('formDetails');
  if (formDetailsToggle && formDetailsPanel) {
    formDetailsToggle.addEventListener('click', () => {
      const expanded = formDetailsToggle.getAttribute('aria-expanded') === 'true';
      formDetailsToggle.setAttribute('aria-expanded', !expanded);
      formDetailsPanel.classList.toggle('open');
      formDetailsToggle.querySelector('span:first-child').textContent = expanded ? 'Add project details' : 'Hide project details';
    });
  }

  // ===== BUDGET SLIDER =====
  const budgetRange = document.getElementById('contact-budget');
  const budgetDisplay = document.getElementById('budget-display');
  if (budgetRange && budgetDisplay) {
    budgetRange.addEventListener('input', () => {
      const val = parseInt(budgetRange.value, 10);
      budgetDisplay.textContent = val >= 50000 ? '$50,000+' : '$' + val.toLocaleString();
    });
  }

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    function showFormSuccess() {
      const successEl = document.getElementById('formSuccess');
      successEl.classList.add('is-visible');
      contactForm.style.opacity = '0';
      contactForm.style.pointerEvents = 'none';

      setTimeout(() => {
        successEl.classList.remove('is-visible');
        contactForm.reset();
        contactForm.style.opacity = '';
        contactForm.style.pointerEvents = '';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message &#8594;';
        formStatus.textContent = '';

        const formDetails = document.getElementById('formDetails');
        const toggle = document.getElementById('formDetailsToggle');
        if (formDetails && formDetails.classList.contains('open')) {
          formDetails.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.querySelector('span:first-child').textContent = 'Add project details';
        }
      }, 4000);
    }

    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');

      if (!name.value.trim()) { name.focus(); return; }
      if (!email.value.trim() || !email.validity.valid) { email.focus(); return; }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      formStatus.textContent = '';

      fetch('https://formspree.io/f/xreadpyb', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      })
      .then(res => {
        if (res.ok) {
          showFormSuccess();
        } else {
          return res.json().then(data => {
            formStatus.textContent = data.errors
              ? data.errors.map(err => err.message).join(', ')
              : 'Something went wrong. Please try again.';
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message &#8594;';
          });
        }
      })
      .catch(() => {
        formStatus.textContent = 'Network error. Please try again.';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message &#8594;';
      });
    });
  }

})();
