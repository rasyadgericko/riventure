// ===== REDUCED MOTION CHECK =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== LOADER =====
const loaderEl = document.getElementById('loader');
const countEl = document.getElementById('loaderCount');
let count = 0;

if (prefersReducedMotion) {
  loaderEl.style.display = 'none';
} else {
  const ci = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 2;
    if (count >= 100) { count = 100; clearInterval(ci); }
    countEl.textContent = count;
    if (count === 100) {
      setTimeout(() => loaderEl.classList.add('done'), 400);
      setTimeout(() => { loaderEl.style.display = 'none'; }, 1600);
    }
  }, 50);
}

// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (!isTouchDevice && window.innerWidth > 768) {
  let cx = 0, cy = 0, tx = 0, ty = 0;
  let isOnGrid = false;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

  (function animateCursor() {
    if (isOnGrid) {
      // Snap to exact mouse position — no lag so cursor matches grid highlight speed
      cx = tx; cy = ty;
    } else {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
    }
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .service-row, .work-card, .test-card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
  });

  // Eye cursor on the animated grid
  const aboutWrap = document.querySelector('.about-visual-wrap');
  if (aboutWrap) {
    aboutWrap.addEventListener('mouseenter', () => {
      isOnGrid = true;
      cursor.classList.remove('expand');
      cursor.classList.add('on-grid');
    });
    aboutWrap.addEventListener('mouseleave', () => {
      isOnGrid = false;
      cursor.classList.remove('on-grid');
    });
  }
} else {
  cursor.style.display = 'none';
  document.body.style.cursor = 'auto';
}

// ===== THEME =====
const themeToggles = [document.getElementById('themeToggle'), document.getElementById('themeToggleMobile')].filter(Boolean);
const htmlEl = document.documentElement;

function updateThemeUI(theme) {
  const icon = theme === 'dark' ? '&#9681;' : '&#9680;';
  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  themeToggles.forEach(t => { t.innerHTML = icon; t.setAttribute('aria-label', label); });
}

// Restore saved theme
const savedTheme = localStorage.getItem('riventure-theme');
if (savedTheme) {
  htmlEl.setAttribute('data-theme', savedTheme);
  updateThemeUI(savedTheme);
}

themeToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    const isLight = htmlEl.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', newTheme);
    updateThemeUI(newTheme);
    localStorage.setItem('riventure-theme', newTheme);
  });
});

// ===== MOBILE NAV =====
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

navToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  navToggle.classList.toggle('active', menuOpen);
  navToggle.setAttribute('aria-expanded', String(menuOpen));
  navToggle.setAttribute('aria-label', menuOpen ? 'Close navigation menu' : 'Open navigation menu');
  mobileMenu.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});

// Close menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on Escape key
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

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const t = document.querySelector(href);
    if (t) {
      t.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      t.setAttribute('tabindex', '-1');
      t.focus({ preventScroll: true });
    }
  });
});

// ===== REVEALS =====
if (!prefersReducedMotion) {
  const ro = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal-text, .fade-up').forEach(el => ro.observe(el));
} else {
  document.querySelectorAll('.reveal-text, .fade-up').forEach(el => el.classList.add('visible'));
}


// ===== LOGOS STRIP REVEAL =====
const logosStrip = document.querySelector('.logos-strip');
if (logosStrip) {
  const logosObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        logosObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  logosObs.observe(logosStrip);
}

// ===== SPHERE PARALLAX (throttled with rAF) =====
const sp = document.querySelector('.hero-sphere');
if (sp && !prefersReducedMotion) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        sp.style.transform = 'translateY(calc(-50% + ' + (window.scrollY * 0.15) + 'px))';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ===== MAGNETIC BUTTONS =====
if (!isTouchDevice && !prefersReducedMotion) {
  document.querySelectorAll('.mag-btn').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = 'translate(' + ((e.clientX - r.left - r.width/2) * 0.2) + 'px, ' + ((e.clientY - r.top - r.height/2) * 0.2) + 'px)';
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });
}

// ===== TILT CARDS =====
if (!isTouchDevice && !prefersReducedMotion) {
  document.querySelectorAll('.work-card').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const xPct = (e.clientX - r.left) / r.width - 0.5;
      const yPct = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = 'perspective(800px) rotateY(' + (xPct * 6) + 'deg) rotateX(' + (-yPct * 6) + 'deg)';
    });
    c.addEventListener('mouseleave', () => { c.style.transform = ''; c.style.transition = 'transform 0.5s ease'; });
    c.addEventListener('mouseenter', () => { c.style.transition = 'none'; });
  });
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('contact-name');
  const email = document.getElementById('contact-email');

  if (!name.value.trim()) { name.focus(); return; }
  if (!email.value.trim() || !email.validity.valid) { email.focus(); return; }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  setTimeout(() => {
    submitBtn.textContent = 'Sent \u2713';
    formStatus.textContent = 'Thank you! We\'ll be in touch within 24 hours.';
    setTimeout(() => {
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message &#8594;';
      formStatus.textContent = '';
    }, 3000);
  }, 1000);
});

// ===== ABOUT VISUAL =====
(function initAboutVisual() {
  const canvas = document.getElementById('aboutVisual');
  const wrap = canvas && canvas.closest('.about-visual-wrap');
  if (!canvas || !wrap) return;

  let width = 0, height = 0, ctx = null;
  const CELL = 50;
  let mouseX = -9999, mouseY = -9999;
  let isHovering = false;
  let animId = null;

  // Animated squares — same concept as AnimatedGridPattern (random fade-in/out)
  const NUM_SQUARES = 15;
  const MAX_OPACITY = 0.13;
  const FADE_DURATION = 2800; // ms per full fade-in → fade-out cycle
  let squares = [];

  function resize() {
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    initSquares(performance.now());
  }

  function randomPos() {
    const maxCol = Math.max(1, Math.floor(width / CELL));
    const maxRow = Math.max(1, Math.floor(height / CELL));
    return [Math.floor(Math.random() * maxCol), Math.floor(Math.random() * maxRow)];
  }

  function initSquares(now) {
    squares = Array.from({ length: NUM_SQUARES }, (_, i) => {
      const [col, row] = randomPos();
      return { id: i, col, row, startTime: now + Math.random() * FADE_DURATION };
    });
  }

  function getColor() {
    return document.documentElement.getAttribute('data-theme') === 'dark'
      ? [241, 241, 241] : [22, 22, 22];
  }

  // Use canvas.getBoundingClientRect() for pixel-precise coords (avoids border offset)
  wrap.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    isHovering = true;
  });
  wrap.addEventListener('mouseleave', () => {
    isHovering = false;
    mouseX = -9999;
    mouseY = -9999;
  });

  function draw(now) {
    if (!ctx) { animId = requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, width, height);
    const [ri, gi, bi] = getColor();
    const rgb = `${ri},${gi},${bi}`;

    const cols = Math.floor(width / CELL);
    const rows = Math.floor(height / CELL);
    const hCol = Math.floor(mouseX / CELL);
    const hRow = Math.floor(mouseY / CELL);
    const R = 2; // bounded cell-check radius around cursor

    // --- Auto-animated squares (fade in → fade out → reposition, like AnimatedGridPattern) ---
    for (const sq of squares) {
      const elapsed = now - sq.startTime;
      const half = FADE_DURATION / 2;
      let opacity = 0;
      if (elapsed >= 0 && elapsed < half) {
        opacity = (elapsed / half) * MAX_OPACITY;
      } else if (elapsed >= half && elapsed < FADE_DURATION) {
        opacity = ((FADE_DURATION - elapsed) / half) * MAX_OPACITY;
      } else if (elapsed >= FADE_DURATION) {
        const [c, r] = randomPos();
        sq.col = c; sq.row = r;
        sq.startTime = now + Math.random() * 400;
        opacity = 0;
      }
      if (opacity > 0.004) {
        ctx.fillStyle = `rgba(${rgb},${opacity})`;
        ctx.fillRect(sq.col * CELL + 1, sq.row * CELL + 1, CELL - 1, CELL - 1);
      }
    }

    // --- Cursor proximity fills — only ±R cells around cursor, not entire grid ---
    if (isHovering) {
      for (let dc = -R; dc <= R; dc++) {
        for (let dr = -R; dr <= R; dr++) {
          const col = hCol + dc;
          const row = hRow + dr;
          if (col < 0 || row < 0 || col >= cols || row >= rows) continue;
          const cx = col * CELL + CELL / 2;
          const cy = row * CELL + CELL / 2;
          const dist = Math.sqrt((cx - mouseX) ** 2 + (cy - mouseY) ** 2);
          const influence = Math.max(0, 1 - dist / (CELL * 2.2));
          if (influence > 0.01) {
            ctx.fillStyle = `rgba(${rgb},${influence * 0.22})`;
            ctx.fillRect(col * CELL + 1, row * CELL + 1, CELL - 1, CELL - 1);
          }
        }
      }
    }

    // --- Grid lines with cursor column/row brightness ---
    ctx.lineWidth = 1;
    for (let col = 0; col <= cols; col++) {
      const x = col * CELL;
      let extra = 0;
      if (isHovering) {
        const t = Math.max(0, 1 - Math.abs(x - mouseX) / (CELL * 2));
        extra = t * t * 0.45;
      }
      ctx.strokeStyle = `rgba(${rgb},${0.09 + extra})`;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let row = 0; row <= rows; row++) {
      const y = row * CELL;
      let extra = 0;
      if (isHovering) {
        const t = Math.max(0, 1 - Math.abs(y - mouseY) / (CELL * 2));
        extra = t * t * 0.45;
      }
      ctx.strokeStyle = `rgba(${rgb},${0.09 + extra})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // --- Intersection dots near cursor — bounded to ±R intersections ---
    if (isHovering) {
      for (let dc = -R; dc <= R + 1; dc++) {
        for (let dr = -R; dr <= R + 1; dr++) {
          const x = (hCol + dc) * CELL;
          const y = (hRow + dr) * CELL;
          const dist = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
          const influence = Math.max(0, 1 - dist / (CELL * 2));
          if (influence > 0.01) {
            ctx.beginPath();
            ctx.arc(x, y, 2.5 * influence, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb},${influence * 0.9})`;
            ctx.fill();
          }
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
  }
  resize();

  if (!prefersReducedMotion) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animId) animId = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    }, { threshold: 0.05 });
    obs.observe(wrap);
  }
})();

// ===== CTA GLOBE =====
(function initGlobe() {
  const canvas = document.getElementById('ctaGlobe');
  if (!canvas) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const size = 520;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.42;
  let angle = 0;
  let tiltY = 0;
  let targetTiltY = 0;
  let cursorSpeedX = 0;
  let isHovering = false;
  let animId;

  function getColor() {
    return document.documentElement.getAttribute('data-theme') === 'dark'
      ? '241,241,241' : '22,22,22';
  }

  // Cursor tracking on the CTA section
  var ctaSect = document.querySelector('.cta');
  if (ctaSect) {
    ctaSect.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      var mx = (e.clientX - rect.left) / rect.width;
      var my = (e.clientY - rect.top) / rect.height;
      // Horizontal: mouse position drives extra rotation speed
      cursorSpeedX = (mx - 0.5) * 1.6;
      // Vertical: mouse position tilts the globe
      targetTiltY = (my - 0.5) * -25;
      isHovering = true;
    });
    ctaSect.addEventListener('mouseleave', function() {
      isHovering = false;
      cursorSpeedX = 0;
      targetTiltY = 0;
    });
  }

  const cities = [
    { lat: 40.7, lon: -74 },
    { lat: 51.5, lon: -0.1 },
    { lat: 35.7, lon: 139.7 },
    { lat: -33.9, lon: 151.2 },
    { lat: 1.3, lon: 103.8 },
    { lat: 48.9, lon: 2.35 },
    { lat: 37.6, lon: -122.4 },
    { lat: 25.2, lon: 55.3 },
    { lat: -23.5, lon: -46.6 },
    { lat: 55.75, lon: 37.6 }
  ];

  function project(lat, lon) {
    var latR = lat * Math.PI / 180;
    var lonR = (lon + angle) * Math.PI / 180;
    var x = r * Math.cos(latR) * Math.sin(lonR);
    var y = -r * Math.sin(latR);
    var z = r * Math.cos(latR) * Math.cos(lonR);
    // Apply vertical tilt (rotation around X axis)
    var tR = tiltY * Math.PI / 180;
    var cosT = Math.cos(tR), sinT = Math.sin(tR);
    var y2 = y * cosT - z * sinT;
    var z2 = y * sinT + z * cosT;
    return { x: cx + x, y: cy + y2, z: z2, depth: z2 / r };
  }

  function drawLine(pts, color, op, w) {
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var k = 1; k < pts.length; k++) ctx.lineTo(pts[k].x, pts[k].y);
    ctx.strokeStyle = 'rgba(' + color + ', ' + op + ')';
    ctx.lineWidth = w;
    ctx.stroke();
  }

  function drawGridLines(color, lats, lons) {
    // Latitude lines
    lats.forEach(function(lat) {
      var pts = [];
      for (var lon = -180; lon <= 180; lon += 3) {
        var p = project(lat, lon);
        if (p.z > 0) { pts.push(p); }
        else { drawLine(pts, color, 0.05, 0.6); pts = []; }
      }
      drawLine(pts, color, 0.05, 0.6);
    });
    // Longitude lines
    lons.forEach(function(lonOff) {
      var pts = [];
      for (var lat = -90; lat <= 90; lat += 3) {
        var p = project(lat, lonOff);
        if (p.z > 0) { pts.push(p); }
        else { drawLine(pts, color, 0.05, 0.6); pts = []; }
      }
      drawLine(pts, color, 0.05, 0.6);
    });
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    var color = getColor();

    // Smooth tilt easing
    tiltY += (targetTiltY - tiltY) * 0.07;

    // Sphere outline
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(' + color + ', 0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Grid lines
    drawGridLines(color, [-40, 0, 40], [-60, 0, 60]);

    // Grid dots
    for (var lat = -80; lat <= 80; lat += 14) {
      for (var lon = -180; lon <= 180; lon += 14) {
        var p = project(lat, lon);
        if (p.z > 0) {
          var op = p.depth * 0.2;
          var dr = 1 + p.depth * 1.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, dr, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + color + ', ' + op + ')';
          ctx.fill();
        }
      }
    }

    // City markers
    var vis = [];
    cities.forEach(function(c) {
      var p = project(c.lat, c.lon);
      if (p.z > 0) {
        vis.push(p);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5 + p.depth * 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(' + color + ', ' + (p.depth * 0.15) + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 + p.depth * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + color + ', ' + (p.depth * 0.55) + ')';
        ctx.fill();
      }
    });

    // Connection arcs
    for (var i = 0; i < vis.length; i++) {
      for (var j = i + 1; j < vis.length; j++) {
        var a = vis[i], b = vis[j];
        var dist = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        if (dist < r * 1.3 && dist > r * 0.25) {
          var mx = (a.x + b.x) / 2;
          var my = (a.y + b.y) / 2 - dist * 0.18;
          var avgD = (a.depth + b.depth) / 2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo(mx, my, b.x, b.y);
          ctx.strokeStyle = 'rgba(' + color + ', ' + (avgD * 0.08) + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // Rotation: base auto-rotation + cursor influence
    var baseSpeed = 0.12;
    if (isHovering) {
      angle += baseSpeed + cursorSpeedX;
    } else {
      angle += baseSpeed;
    }

    animId = requestAnimationFrame(draw);
  }

  // Only animate when visible
  var globeObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        draw();
      } else {
        cancelAnimationFrame(animId);
      }
    });
  }, { threshold: 0.05 });

  if (!prefersReducedMotion) {
    globeObs.observe(canvas);
  } else {
    draw();
    cancelAnimationFrame(animId);
  }
})();

// ===== KEYBOARD SUPPORT FOR SERVICE ROWS =====
document.querySelectorAll('.service-row[tabindex="0"]').forEach(row => {
  row.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      row.click();
    }
  });
});