// ===== REDUCED MOTION CHECK =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// ===== PAGE TRANSITIONS =====
const ptEl = document.getElementById('pageTransition');

function navigateWithTransition(url) {
  if (!ptEl || prefersReducedMotion) { window.location.href = url; return; }
  ptEl.classList.remove('enter');
  ptEl.classList.add('exit');
  ptEl.style.pointerEvents = 'all';
  setTimeout(() => { window.location.href = url; }, 350);
}

// On page load: play entrance animation
if (ptEl && !prefersReducedMotion && performance.getEntriesByType('navigation')[0]?.type !== 'reload') {
  // Check if we came from an internal page (sessionStorage flag)
  if (sessionStorage.getItem('ryc-transitioning')) {
    sessionStorage.removeItem('ryc-transitioning');
    ptEl.classList.add('enter');
    setTimeout(() => { ptEl.classList.remove('enter'); }, 800);
  }
}

// Intercept internal link clicks
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');
  // Skip external, anchor-only, and special links
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;

  // Only intercept internal navigation links (starts with /)
  if (href.startsWith('/')) {
    // Don't transition to the current page
    const currentPath = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    const targetPath = href.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    if (currentPath === targetPath) return;

    e.preventDefault();
    sessionStorage.setItem('ryc-transitioning', '1');
    navigateWithTransition(href);
  }
});

// ===== THEME =====
// Theme toggle handled by utility/theme.js (loaded via boot.js).
// Canvas scripts listen for 'rycthemechange' event on <html> instead.
const htmlEl = document.documentElement;

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
// Reveal animations handled by utility/reveal.js (loaded via boot.js).

// ===== HOW-IT-WORKS ILLUSTRATION ANIMATIONS =====
if (!prefersReducedMotion) {
  const hwwObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); hwwObs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.hwwu-illus').forEach(el => hwwObs.observe(el));
} else {
  document.querySelectorAll('.hwwu-illus').forEach(el => el.classList.add('in-view'));
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

// ===== HERO DOTTED SURFACE (Three.js) — DISABLED, replaced by Spline robot =====
(function initHeroDottedSurface() {
  const container = document.getElementById('heroWaves');
  if (!container || typeof THREE === 'undefined') return;

  const hero = container.closest('.hero');
  const SEPARATION = 150;
  const AMOUNTX = 40;
  const AMOUNTY = 60;

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

  const camera = new THREE.PerspectiveCamera(
    60,
    hero.offsetWidth / hero.offsetHeight,
    1,
    10000
  );
  camera.position.set(0, 355, 1220);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(hero.offsetWidth, hero.offsetHeight);
  renderer.setClearColor(scene.fog.color, 0);
  container.appendChild(renderer.domElement);

  // Determine dot color from theme
  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  // Build particle geometry
  const positions = [];
  const colors = [];
  function setColors() {
    const c = isDark() ? 200 : 0;
    for (let i = 0; i < AMOUNTX * AMOUNTY; i++) {
      colors[i * 3] = c;
      colors[i * 3 + 1] = c;
      colors[i * 3 + 2] = c;
    }
  }

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      positions.push(
        ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
        0,
        iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
      );
    }
  }
  setColors();

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 8,
    vertexColors: true,
    transparent: true,
    opacity: 0.20,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let count = 0;
  let animId = null;

  // Mouse interaction — raycaster projects screen coords into 3D
  let mouseNDC = new THREE.Vector2(-9999, -9999);
  let mouseWorld = new THREE.Vector3();
  let mouseActive = false;
  const MOUSE_RADIUS = 600;
  const MOUSE_STRENGTH = 120;
  const raycaster = new THREE.Raycaster();
  const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  if (!isTouchDevice) {
    container.style.pointerEvents = 'auto';

    hero.addEventListener('mousemove', function (e) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(interactionPlane, mouseWorld);
      mouseActive = true;
    });

    hero.addEventListener('mouseleave', function () {
      mouseActive = false;
    });
  }

  function animate() {
    animId = requestAnimationFrame(animate);

    const posArr = geometry.attributes.position.array;
    let idx = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const i3 = idx * 3;
        const baseX = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const baseZ = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

        // Base sine wave
        let y = Math.sin((ix + count) * 0.3) * 50 +
                Math.sin((iy + count) * 0.5) * 50;

        // Mouse repulsion — push dots away from cursor on the XZ plane
        if (mouseActive) {
          const dx = baseX - mouseWorld.x;
          const dz = baseZ - mouseWorld.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < MOUSE_RADIUS) {
            const influence = 1 - dist / MOUSE_RADIUS;
            y += influence * influence * MOUSE_STRENGTH;
          }
        }

        posArr[i3 + 1] = y;
        idx++;
      }
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    count += 0.1;
  }

  // Resize handler
  function handleResize() {
    const w = hero.offsetWidth;
    const h = hero.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(handleResize).observe(hero);
  } else {
    window.addEventListener('resize', handleResize);
  }

  // Theme change — update particle colors
  htmlEl.addEventListener('rycthemechange', () => {
    setColors();
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.attributes.color.needsUpdate = true;
  });

  // Start animation with IntersectionObserver pause/resume
  if (!prefersReducedMotion) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animId) animId = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    }, { threshold: 0.05 });
    obs.observe(hero);
  }
})();

// ===== HERO ANIMATED GRADIENT =====
(function initHeroGradient() {
  const el = document.getElementById('heroGradient');
  if (!el) return;

  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

  function getColors() {
    if (isDark()) {
      // Dark mode: center is dark bg, outer rings glow with grays/whites
      return {
        colors: ['#0f0f0f', '#1c1c1c', '#333333', '#555555', '#777777', '#999999', '#bbbbbb'],
        stops: [30, 45, 58, 68, 78, 88, 100]
      };
    }
    // Light mode: center is light bg, outer rings darken subtly
    return {
      colors: ['#f1f1f1', '#e8e8e8', '#d8d8d8', '#c8c8c8', '#b8b8b8', '#aaaaaa', '#999999'],
      stops: [30, 45, 58, 68, 78, 88, 100]
    };
  }

  var startingGap = 125;
  var breathingRange = 5;
  var speed = 0.02;
  var width = startingGap;
  var dir = 1;
  var animId = null;

  function animate() {
    if (width >= startingGap + breathingRange) dir = -1;
    if (width <= startingGap - breathingRange) dir = 1;
    width += dir * speed;

    var cfg = getColors();
    var stopsStr = cfg.stops.map(function(s, i) { return cfg.colors[i] + ' ' + s + '%'; }).join(', ');
    el.style.background = 'radial-gradient(' + width + '% ' + width + '% at 50% 20%, ' + stopsStr + ')';

    animId = requestAnimationFrame(animate);
  }

  if (!prefersReducedMotion) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          if (!animId) animId = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    }, { threshold: 0.05 });
    obs.observe(el.closest('.hero'));
  } else {
    // Static fallback
    var cfg = getColors();
    var stopsStr = cfg.stops.map(function(s, i) { return cfg.colors[i] + ' ' + s + '%'; }).join(', ');
    el.style.background = 'radial-gradient(' + startingGap + '% ' + startingGap + '% at 50% 20%, ' + stopsStr + ')';
  }

})();

// ===== HERO MORPH CARDS =====
(async function initHeroMorph() {
  const container = document.getElementById('heroMorph');
  if (!container) return;
  if (prefersReducedMotion) return;

  /* ── Fetch works from Supabase ──────────────────────────────── */
  let PROJECTS = [];
  try {
    const sb = window.RYC.sb;
    if (!sb) throw new Error('no sb');
    const { data, error } = await sb
      .from('works')
      .select('title, cat, image_url')
      .eq('active', true)
      .order('sort_order');
    if (!error && data?.length) {
      PROJECTS = data.map(w => ({
        title: w.title,
        cat: w.cat,
        imageUrl: w.image_url || null,
      }));
    }
  } catch (_) { /* fall through to local fallback */ }

  // Fallback if Supabase fails
  if (!PROJECTS.length) {
    PROJECTS = [
      { title: 'Yoga Hub', cat: 'Wellness Directory', imageUrl: 'assets/works/yogahub-screenshot.webp' },
      { title: 'Talky', cat: 'Desktop App', imageUrl: 'assets/works/talky-screenshot.webp' },
      { title: 'Terra & Tide', cat: 'E-Commerce', imageUrl: 'assets/works/terra-tide-screenshot.webp' },
      { title: 'Nexus System', cat: 'SaaS Platform', imageUrl: 'assets/works/nexus-system-screenshot.webp' },
    ];
  }

  // Add placeholder as the last project
  PROJECTS.push({ title: 'Your Project', cat: 'Coming Soon', imageUrl: null, placeholder: true });

  // Duplicate to fill floating positions
  const CARDS_DATA = [...PROJECTS, ...PROJECTS];
  const TOTAL = CARDS_DATA.length;

  // Create morph card elements
  function heroSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  const cards = CARDS_DATA.map((proj, i) => {
    const el = document.createElement('div');
    const slug = heroSlug(proj.title);
    const isDupe = i >= PROJECTS.length;
    el.id = 'hmc-' + slug + (isDupe ? '-' + (i - PROJECTS.length) : '');
    el.className = 'hero-morph-card' + (proj.placeholder ? ' hero-morph-card--placeholder' : '');
    if (proj.placeholder) {
      el.style.cursor = 'pointer';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', 'Your Project — View in Selected Work');
      el.addEventListener('click', () => {
        const workSection = document.getElementById('work');
        const phRow = document.querySelector('.work-va-row--placeholder');
        if (workSection) {
          workSection.scrollIntoView({ behavior: 'smooth' });
          // After scroll completes, activate the placeholder row with highlight
          setTimeout(() => {
            if (phRow) {
              phRow.click();
              phRow.classList.add('work-va-row--highlight');
              setTimeout(() => phRow.classList.remove('work-va-row--highlight'), 1500);
            }
          }, 700);
        }
      });
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
      el.innerHTML = `
        <div class="hero-ph-inner">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="6" y="6" width="36" height="36" rx="8"/>
            <line x1="24" y1="16" x2="24" y2="32"/>
            <line x1="16" y1="24" x2="32" y2="24"/>
          </svg>
          <span class="hero-ph-label">Your Project</span>
        </div>`;
    } else if (proj.imageUrl) {
      el.innerHTML = `<img src="${proj.imageUrl}" alt="${proj.title}" width="340" height="215" loading="eager">`;
    } else {
      el.innerHTML = `<div class="hero-morph-fallback">${proj.title}</div>`;
    }
    el.style.opacity = '0';
    container.appendChild(el);
    return el;
  });

  // Card indices hidden in float state (visible only in row)
  const hiddenInFloatIds = new Set(['hmc-your-project-3', 'hmc-your-project-4', 'hmc-nexus-system-3']);
  const dupePlaceholderIdx = new Set();
  CARDS_DATA.forEach((_, i) => {
    if (hiddenInFloatIds.has(cards[i].id)) dupePlaceholderIdx.add(i);
  });

  // Stable random scatter positions
  const scatterPos = CARDS_DATA.map((_, i) => ({
    x: (Math.sin(i * 7.3 + 1.1) * 0.5) * 2000,
    y: (Math.cos(i * 4.7 + 2.3) * 0.5) * 1200,
    rot: Math.sin(i * 3.1) * 80,
    scale: 0.5 + (Math.sin(i * 5.9) * 0.5 + 0.5) * 0.3,
    opacity: 0
  }));

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function getSize() { return { w: container.offsetWidth, h: container.offsetHeight }; }

  // FLOAT — curated editorial positions with depth layers
  // Positions use pixel offsets from edges (not center fractions)
  // so cards stay visible and clear of the center text zone on all screens
  function getFloatPos(i, size) {
    const isSmall = size.w < 480;
    const isMobile = size.w < 768;
    const hw = size.w / 2;
    const hh = size.h / 2;

    // Desktop: 12 slots placed around edges with intentional composition
    // [x from center, y from center, rotation, scale, opacity]
    const desktopSlots = [
      // --- Top row ---
      { x: -hw + 200,  y: -hh + 120,  rot: -5,  s: 0.82, o: 0.70 }, // top-left corner
      { x:  60,        y: -hh + 80,   rot:  3,  s: 0.90, o: 0.80 }, // top-center
      { x:  hw - 180,  y: -hh + 160,  rot:  7,  s: 0.78, o: 0.65 }, // top-right
      // --- Sides ---
      { x:  hw - 140,  y:  20,        rot: -4,  s: 0.88, o: 0.80 }, // right edge
      { x: -hw + 140,  y: -40,        rot:  5,  s: 0.75, o: 0.55 }, // left edge, recessed
      // --- Bottom row ---
      { x:  hw - 220,  y:  hh - 160,  rot:  5,  s: 0.95, o: 0.90 }, // bottom-right, hero card
      { x: -40,        y:  hh - 100,  rot: -2,  s: 0.85, o: 0.78 }, // bottom-center
      { x: -hw + 220,  y:  hh - 180,  rot: -6,  s: 0.90, o: 0.85 }, // bottom-left
      // --- Extra slots for duplicates ---
      { x: -hw + 320,  y: -hh + 200,  rot:  4,  s: 0.72, o: 0.50 }, // inner top-left
      { x:  hw - 300,  y: -hh + 100,  rot: -3,  s: 0.76, o: 0.55 }, // inner top-right
      { x:  hw - 100,  y:  hh - 260,  rot:  6,  s: 0.70, o: 0.48 }, // mid-right
      { x: -hw + 100,  y:  hh - 120,  rot: -4,  s: 0.74, o: 0.52 }, // lower-left
    ];

    // Mobile: 5 visible cards for 480-768px, 4 for <480px — rest hidden (o: 0)
    const mobileSlots = [
      { x: -hw + 60,   y: -hh + 90,   rot: -4,  s: 0.68, o: 0.60 }, // top-left
      { x:  hw - 80,   y: -hh + 120,  rot:  5,  s: 0.72, o: 0.65 }, // top-right
      { x:  hw - 60,   y:  hh - 200,  rot: -3,  s: 0.75, o: 0.70 }, // bottom-right
      { x: -hw + 55,   y:  hh - 180,  rot: -5,  s: 0.68, o: 0.60 }, // bottom-left
      { x:  20,        y:  hh - 100,  rot:  4,  s: 0.78, o: 0.72 }, // bottom-center
      // Hidden extras
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
    ];

    const smallSlots = [
      { x: -hw + 50,   y: -hh + 90,   rot: -4,  s: 0.72, o: 0.62 }, // top-left
      { x:  hw - 60,   y: -hh + 110,  rot:  5,  s: 0.74, o: 0.67 }, // top-right
      { x:  hw - 55,   y:  hh - 190,  rot: -3,  s: 0.76, o: 0.72 }, // bottom-right
      { x: -hw + 55,   y:  hh - 170,  rot:  3,  s: 0.72, o: 0.65 }, // bottom-left
      // Hidden extras
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
      { x:  0, y:  0, rot: 0, s: 0.5, o: 0 },
    ];

    const slots = isSmall ? smallSlots : isMobile ? mobileSlots : desktopSlots;
    const slot = slots[i % slots.length];
    return {
      x: slot.x,
      y: slot.y,
      rot: slot.rot,
      scale: isSmall ? slot.s * 0.85 : slot.s,
      opacity: slot.o
    };
  }

  // ROW — marquee with infinite wrapping
  // Build a visual order map: spread placeholder cards at 1/3 and 2/3 of the strip
  const rowSlotMap = new Array(TOTAL);
  const phSlotA = Math.round(TOTAL / 3);       // ~1/3 from left
  const phSlotB = Math.round(TOTAL * 2 / 3);   // ~2/3 from left
  const reservedSlots = new Set([phSlotA, phSlotB]);
  // Assign placeholders
  let phCount = 0;
  for (let i = 0; i < TOTAL; i++) {
    if (CARDS_DATA[i]?.placeholder) {
      rowSlotMap[i] = phCount === 0 ? phSlotA : phSlotB;
      phCount++;
    }
  }
  // Fill remaining cards into non-reserved slots
  let nextSlot = 0;
  for (let i = 0; i < TOTAL; i++) {
    if (CARDS_DATA[i]?.placeholder) continue;
    while (reservedSlots.has(nextSlot)) nextSlot++;
    rowSlotMap[i] = nextSlot++;
  }

  function getRowPos(i, size, mOffset) {
    const isMobile = size.w < 768;
    const isSmall = size.w < 480;
    const cardW = isSmall ? 240 : isMobile ? 300 : 420;
    const gap = isSmall ? 12 : isMobile ? 14 : 24;
    const stride = cardW + gap;
    const totalW = TOTAL * stride;
    const vi = rowSlotMap[i] ?? i;
    // Wrap position for infinite loop
    let x = ((vi * stride - mOffset) % totalW + totalW) % totalW;
    // Center the strip in the viewport
    x = x - totalW / 2;
    return {
      x: x,
      y: size.h * 0.28,
      rot: 0,
      scale: isSmall ? 0.85 : isMobile ? 0.9 : 1,
      opacity: 1
    };
  }

  // State
  let phase = 'scatter';
  let phaseT = 0;
  let morphTarget = 0;  // scroll target (0=circle, 1=row)
  let morphCurrent = 0; // smoothed current value
  let mouseX = 0;
  let currentMouseX = 0;
  let rafId = null;
  let time = 0;
  let marqueeOffset = 0; // continuous row scroll

  function applyTransform(el, x, y, rot, scale, opacity) {
    el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg) scale(${scale})`;
    el.style.opacity = Math.max(0, Math.min(1, opacity));
  }

  function render() {
    const size = getSize();
    time += 0.008;

    // Smooth morph toward target
    morphCurrent += (morphTarget - morphCurrent) * 0.06;
    if (Math.abs(morphCurrent - morphTarget) < 0.001) morphCurrent = morphTarget;

    // Smooth mouse
    currentMouseX += (mouseX - currentMouseX) * 0.05;

    const mt = easeInOutCubic(morphCurrent);

    // Marquee picks up speed as morph increases
    marqueeOffset += 0.7 * mt;

    cards.forEach((el, i) => {
      const scatter = scatterPos[i];
      const circle = getFloatPos(i, size);
      const row = getRowPos(i, size, marqueeOffset);

      // Floating animation (dampens as morph progresses)
      const floatDampen = 1 - mt * 0.85;
      const floatX = Math.sin(time * 1.2 + i * 0.7) * 6 * floatDampen;
      const floatY = Math.cos(time * 0.9 + i * 1.1) * 8 * floatDampen;

      let x, y, rot, scale, opacity;

      const isDupePh = dupePlaceholderIdx.has(i);

      if (phase === 'scatter') {
        x = circle.x; y = circle.y; rot = circle.rot;
        scale = circle.scale; opacity = 0;
      } else if (phase === 'toCircle') {
        const t = easeOutCubic(phaseT);
        x = circle.x + floatX * t;
        y = circle.y + floatY * t;
        rot = circle.rot;
        scale = circle.scale;
        opacity = lerp(0, isDupePh ? 0 : circle.opacity, t);
      } else {
        // Circle ↔ Row morph
        x = lerp(circle.x, row.x, mt) + currentMouseX * (1 - mt * 0.8) + floatX;
        y = lerp(circle.y, row.y, mt) + floatY;
        rot = lerp(circle.rot, row.rot, mt);
        scale = lerp(circle.scale, row.scale, mt);
        opacity = lerp(isDupePh ? 0 : circle.opacity, row.opacity, mt);
      }

      applyTransform(el, x, y, rot, scale, opacity);

      // Enable pointer-events on placeholder cards when in row mode
      if (CARDS_DATA[i]?.placeholder) {
        el.style.pointerEvents = mt > 0.85 ? 'auto' : 'none';
      }
    });

    // Enable container pointer-events when in row mode so clicks pass through
    container.style.pointerEvents = mt > 0.85 ? 'auto' : 'none';

    rafId = requestAnimationFrame(render);
  }

  // Intro: scatter → circle
  setTimeout(() => {
    phase = 'toCircle';
    const startTime = performance.now();
    const duration = 1800;
    function animateToCircle(now) {
      phaseT = Math.min((now - startTime) / duration, 1);
      if (phaseT >= 1) { phase = 'circle'; phaseT = 1; return; }
      requestAnimationFrame(animateToCircle);
    }
    requestAnimationFrame(animateToCircle);
  }, 800);

  // Scroll drives circle→row morph
  const hero = container.closest('.hero');
  function onScroll() {
    if (!hero || phase !== 'circle') return;
    const rect = hero.getBoundingClientRect();
    const heroH = hero.offsetHeight;
    const scrolled = -rect.top;
    morphTarget = Math.max(0, Math.min(scrolled / (heroH * 0.55), 1));
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mouse parallax
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width * 2 - 1) * 50;
  });
  container.addEventListener('mouseleave', () => { mouseX = 0; });

  // Pause when fully off-screen
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!rafId) rafId = requestAnimationFrame(render);
      } else {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    });
  }, { threshold: 0.01 });
  obs.observe(hero);

  rafId = requestAnimationFrame(render);
})();

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

// ===== BUDGET SLIDER =====
const budgetSlider = document.getElementById('contact-budget');
const budgetDisplay = document.getElementById('budget-display');
if (budgetSlider && budgetDisplay) {
  const formatBudget = v => +v >= 50000 ? '$50,000+' : '$' + Number(v).toLocaleString();
  const updateSlider = () => {
    const min = +budgetSlider.min, max = +budgetSlider.max, val = +budgetSlider.value;
    const t = (val - min) / (max - min);
    const size = Math.round(14 + t * 14); // 14px → 28px
    budgetSlider.style.setProperty('--thumb-size', size + 'px');
    budgetDisplay.textContent = formatBudget(val);
  };
  budgetSlider.addEventListener('input', updateSlider);
  updateSlider();
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

    // Collapse optional details if open
    const formDetails = document.getElementById('formDetails');
    const toggle = document.getElementById('formDetailsToggle');
    if (formDetails && formDetails.classList.contains('is-open')) {
      formDetails.classList.remove('is-open');
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
          ? data.errors.map(e => e.message).join(', ')
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

  // ===== Evervault spotlight overlay =====
  const evOverlay  = document.getElementById('evOverlay');
  const evGradient = document.getElementById('evGradient');

  if (evOverlay && evGradient && !prefersReducedMotion && !isTouchDevice) {
    wrap.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const mask = `radial-gradient(250px at ${x}px ${y}px, white, transparent)`;
      evGradient.style.maskImage       = mask;
      evGradient.style.webkitMaskImage = mask;
      evOverlay.classList.add('active');
    });

    wrap.addEventListener('mouseleave', () => {
      evOverlay.classList.remove('active');
    });
  }
})();

// ===== CTA GLOBE (D3 Dotted Wireframe) =====
(function initGlobe() {
  const canvas = document.getElementById('ctaGlobe');
  if (!canvas) return;

  // Lazy-load D3 only when globe scrolls into view — avoids blocking ~550 KB parse on startup
  let booted = false;
  const triggerObs = new IntersectionObserver(entries => {
    if (!booted && entries[0].isIntersecting) {
      booted = true;
      triggerObs.disconnect();
      if (typeof d3 !== 'undefined') {
        boot();
      } else {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js';
        s.onload = boot;
        document.head.appendChild(s);
      }
    }
  }, { threshold: 0.05 });
  triggerObs.observe(canvas);

  function boot() {
    const wrap = canvas.closest('.cta-globe');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = wrap ? Math.min(wrap.offsetWidth, 520) : 520;
    const baseRadius = size * 0.44;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;

    const projection = d3.geoOrthographic()
      .scale(baseRadius)
      .translate([cx, cy])
      .clipAngle(90);

    const pathGen = d3.geoPath().projection(projection).context(ctx);
    const graticule = d3.geoGraticule()();

    const rotation = [0, -20];
    let autoRotate = true;
    let animId = null;
    let landFeatures = null;
    const allDots = []; // each entry is a pre-allocated [lng, lat] array

    // Cache colors per theme — recomputed only when theme toggles
    let cachedColors = null;
    function getColors() {
      return cachedColors || (cachedColors = computeColors());
    }
    function computeColors() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      return {
        outline:    isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',
        graticule:  isDark ? 'rgba(255,255,255,0.1)'  : 'rgba(0,0,0,0.08)',
        landFill:   isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        landStroke: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)',
        dots:       isDark ? 'rgba(180,180,180,0.8)'  : 'rgba(60,60,60,0.65)',
      };
    }
    htmlEl.addEventListener('rycthemechange', () => { cachedColors = null; });

    // --- Point-in-polygon helpers ---
    function pointInRing(point, ring) {
      let inside = false;
      const [px, py] = point;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i], [xj, yj] = ring[j];
        if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    }

    function pointInFeature(pt, feature) {
      const geo = feature.geometry;
      if (geo.type === 'Polygon') {
        if (!pointInRing(pt, geo.coordinates[0])) return false;
        for (let i = 1; i < geo.coordinates.length; i++) {
          if (pointInRing(pt, geo.coordinates[i])) return false;
        }
        return true;
      }
      if (geo.type === 'MultiPolygon') {
        for (const poly of geo.coordinates) {
          if (pointInRing(pt, poly[0])) {
            let inHole = false;
            for (let i = 1; i < poly.length; i++) {
              if (pointInRing(pt, poly[i])) { inHole = true; break; }
            }
            if (!inHole) return true;
          }
        }
      }
      return false;
    }

    function generateDots(feature) {
      const dots = [];
      const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature);
      const step = 16 * 0.08;
      for (let lng = minLng; lng <= maxLng; lng += step) {
        for (let lat = minLat; lat <= maxLat; lat += step) {
          // Store as pre-allocated array to avoid per-frame heap allocations
          if (pointInFeature([lng, lat], feature)) dots.push([lng, lat]);
        }
      }
      return dots;
    }

    // --- Render ---
    function render() {
      ctx.clearRect(0, 0, size, size);
      const c = getColors();
      const sc = projection.scale();
      const sf = sc / baseRadius;

      // Globe outline
      ctx.beginPath();
      ctx.arc(cx, cy, sc, 0, Math.PI * 2);
      ctx.strokeStyle = c.outline;
      ctx.lineWidth = 1.5 * sf;
      ctx.stroke();

      if (!landFeatures) return;

      // Graticule
      ctx.beginPath();
      pathGen(graticule);
      ctx.strokeStyle = c.graticule;
      ctx.lineWidth = 0.7 * sf;
      ctx.stroke();

      // Land — single path pass for both fill and stroke (avoids double pathGen traversal)
      ctx.beginPath();
      landFeatures.features.forEach(f => pathGen(f));
      ctx.fillStyle = c.landFill;
      ctx.fill();
      ctx.strokeStyle = c.landStroke;
      ctx.lineWidth = 0.8 * sf;
      ctx.stroke();

      // Halftone dots — only front hemisphere, using pre-allocated coord arrays
      const rot = projection.rotate();
      const center = [-rot[0], -rot[1]];
      allDots.forEach(coord => {
        if (d3.geoDistance(coord, center) > Math.PI / 2) return;
        const proj = projection(coord);
        if (!proj) return;
        ctx.beginPath();
        ctx.arc(proj[0], proj[1], 1.1 * sf, 0, Math.PI * 2);
        ctx.fillStyle = c.dots;
        ctx.fill();
      });
    }

    // --- Interaction: drag to rotate ---
    let isDragging = false;
    let dragStart = null;
    let rotStart = null;

    canvas.addEventListener('mousedown', e => {
      isDragging = true;
      autoRotate = false;
      dragStart = [e.clientX, e.clientY];
      rotStart = [...rotation];
      canvas.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart[0];
      const dy = e.clientY - dragStart[1];
      rotation[0] = rotStart[0] + dx * 0.5;
      rotation[1] = Math.max(-90, Math.min(90, rotStart[1] - dy * 0.5));
      projection.rotate(rotation);
      render();
    });
    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      canvas.style.cursor = 'grab';
      setTimeout(() => { autoRotate = true; }, 200);
    });

    // --- Interaction: scroll to zoom ---
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const newR = Math.max(baseRadius * 0.5, Math.min(baseRadius * 3, projection.scale() * factor));
      projection.scale(newR);
      render();
    }, { passive: false });

    // --- Touch support ---
    let touchStart = null, touchRotStart = null;
    canvas.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        touchStart = [e.touches[0].clientX, e.touches[0].clientY];
        touchRotStart = [...rotation];
        autoRotate = false;
      }
    }, { passive: true });
    canvas.addEventListener('touchmove', e => {
      if (e.touches.length === 1 && touchStart) {
        const dx = e.touches[0].clientX - touchStart[0];
        const dy = e.touches[0].clientY - touchStart[1];
        rotation[0] = touchRotStart[0] + dx * 0.5;
        rotation[1] = Math.max(-90, Math.min(90, touchRotStart[1] - dy * 0.5));
        projection.rotate(rotation);
        render();
      }
    }, { passive: true });
    canvas.addEventListener('touchend', () => {
      setTimeout(() => { autoRotate = true; }, 500);
    }, { passive: true });

    // --- Load GeoJSON — generate dots in idle chunks to avoid long tasks ---
    fetch('https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json')
      .then(r => r.json())
      .then(data => {
        landFeatures = data;
        const features = data.features;
        if (typeof requestIdleCallback === 'function') {
          let fi = 0;
          function processChunk(deadline) {
            while (fi < features.length && deadline.timeRemaining() > 2) {
              generateDots(features[fi++]).forEach(d => allDots.push(d));
            }
            if (fi < features.length) requestIdleCallback(processChunk);
            else render();
          }
          requestIdleCallback(processChunk);
        } else {
          features.forEach(f => generateDots(f).forEach(d => allDots.push(d)));
          render();
        }
      });

    // --- Animation loop ---
    function animate() {
      if (autoRotate && !prefersReducedMotion) {
        rotation[0] += 0.25;
        projection.rotate(rotation);
        render();
      }
      animId = requestAnimationFrame(animate);
    }

    // Only animate when visible
    if (!prefersReducedMotion) {
      const animObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!animId) animId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(animId);
            animId = null;
          }
        });
      }, { threshold: 0.05 });
      animObs.observe(canvas);
    } else {
      render();
    }
  }
})();

// ===== SERVICE CARDS: STICKY SCROLL =====
(function initServiceCards() {
  // Sticky horizontal scroll — section pins while cards slide through
  const runway = document.querySelector('.svc-runway');
  const strip = document.querySelector('.svc-scroll-strip');
  if (runway && strip) {
    // Set runway height = viewport + scroll distance for all cards
    const setRunwayHeight = () => {
      const maxShift = Math.max(0, strip.scrollWidth - window.innerWidth);
      runway.style.height = (window.innerHeight + maxShift + 200) + 'px';
    };
    setRunwayHeight();
    window.addEventListener('resize', setRunwayHeight);

    const updateScroll = () => {
      const rect = runway.getBoundingClientRect();
      const maxShift = Math.max(0, strip.scrollWidth - window.innerWidth);
      const scrollDistance = runway.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = scrollDistance > 0 ? Math.min(1, scrolled / scrollDistance) : 0;
      strip.style.transform = 'translateX(' + (-progress * maxShift) + 'px)';
    };

    let visible = false;
    const io = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
    }, { threshold: 0 });
    io.observe(runway);

    window.addEventListener('scroll', () => {
      if (visible) requestAnimationFrame(updateScroll);
    }, { passive: true });
    updateScroll();
  }

  // Keyboard support
  document.querySelectorAll('.svc-card[tabindex="0"]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
})();

// ===== STAT COUNTER ANIMATION =====
function animateCounter(el, target, duration) {
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

// ===== TESTIMONIAL MARQUEE COLUMNS =====
document.querySelectorAll('.tmc-col').forEach(col => {
  const speed = col.dataset.speed || '15';
  const track = col.querySelector('.tmc-track');
  if (!track) return;
  // Set animation speed
  track.style.setProperty('--tmc-speed', speed + 's');
  // Duplicate content for seamless loop
  const clone = track.innerHTML;
  track.innerHTML += clone;
});

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) {
  const statNums = statsStrip.querySelectorAll('.stat-number[data-target]');
  if (!prefersReducedMotion) {
    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNums.forEach(el => animateCounter(el, parseInt(el.dataset.target), 1800));
          statsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    statsObs.observe(statsStrip);
  } else {
    statNums.forEach(el => { el.textContent = el.dataset.target; });
  }
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const answer = btn.nextElementSibling;

    // Close all other items
    document.querySelectorAll('.faq-q').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.classList.remove('open');
      }
    });

    btn.setAttribute('aria-expanded', String(!isExpanded));
    answer.classList.toggle('open', !isExpanded);
  });
});

// ===== SELECTED WORKS — PERSPECTIVE REVEAL =====
(async function initWorkVA() {
  const vaList  = document.getElementById('workVAList');
  const vaTilt  = document.getElementById('workVATilt');
  const vaStage = document.getElementById('workVAStage');
  if (!vaList || !vaTilt || !vaStage) return;

  /* ── Supabase ─────────────────────────────────────────────────── */
  const sb = window.RYC.sb;
  if (!sb) return;

  const { data: WORKS, error } = await sb
    .from('works')
    .select('num, cat, title, description, metrics, color, display_url, link, image_url')
    .eq('active', true)
    .order('sort_order');

  if (error || !WORKS?.length) return;

  /* ── Helpers ──────────────────────────────────────────────────── */
  function mkWorkBrowser(work) {
    const slug   = window.RYC.toSlug(work.title);
    const screen = work.image_url
      ? `<img src="${work.image_url}" alt="${work.title}" style="width:100%;height:100%;object-fit:cover;display:block;">`
      : (window.RYC.MOCK[slug] || '');
    const isExternal = work.link.startsWith('http');
    const overlayLabel = isExternal ? 'Visit live site ↗' : 'Start a project →';

    const wrap = document.createElement('div');
    wrap.className = 'work-browser';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', `${work.title} — ${overlayLabel}`);

    wrap.addEventListener('click', () => {
      if (isExternal) {
        window.open(work.link, '_blank', 'noopener noreferrer');
      } else {
        const target = document.querySelector(work.link);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
    wrap.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wrap.click(); }
    });

    wrap.innerHTML = `
      <div class="work-b-bar">
        <div class="work-b-dots"><i></i><i></i><i></i></div>
        <div class="work-b-url">${work.display_url}</div>
      </div>
      <div class="work-b-screen">
        ${screen}
        <div class="work-b-overlay" aria-hidden="true">
          <span class="work-b-overlay-pill">${overlayLabel}</span>
        </div>
      </div>`;
    return wrap;
  }

  const arrowSVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`;

  // Inject dynamic accent bar colours via <style>
  const accStyle = document.createElement('style');
  const accRules = [];
  for (let i = 0; i <= WORKS.length; i++) {
    accRules.push(`#workVAList .work-va-row:nth-child(${i + 1})::before { background: rgba(255,255,255,0.8); }`);
  }
  accStyle.textContent = accRules.join('\n');
  document.head.appendChild(accStyle);

  /* ── Build rows + slides ──────────────────────────────────────── */
  const totalItems = WORKS.length + 1; // +1 for placeholder

  WORKS.forEach((w, i) => {
    // Left row
    const row = document.createElement('div');
    row.className = 'work-va-row' + (i === 0 ? ' on' : '');
    row.dataset.i = i;
    row.setAttribute('role', 'listitem');
    row.innerHTML = `
      <span class="work-vr-num">${w.num}</span>
      <div>
        <span class="work-vr-title">${w.title}</span>
        <span class="work-vr-cat">${w.cat}</span>
      </div>
      <div class="work-vr-arrow" aria-hidden="true">${arrowSVG}</div>`;
    vaList.appendChild(row);

    // Right slide
    const slide = document.createElement('div');
    slide.className = 'work-va-slide' + (i === 0 ? ' on' : '');
    slide.dataset.i = i;
    slide.appendChild(mkWorkBrowser(w));

    const below = document.createElement('div');
    below.className = 'work-va-below';
    const isExternal = w.link.startsWith('http');
    below.innerHTML = `
      <div>
        <p class="work-va-desc">${w.description}</p>
        <div class="work-metrics">${w.metrics.map(m => `<span class="work-metric">${m}</span>`).join('')}</div>
      </div>
      <a href="${w.link}" class="work-cta-link"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}>
        ${isExternal ? 'View live site' : 'Start a similar project'} ${arrowSVG}
      </a>`;
    slide.appendChild(below);
    vaTilt.appendChild(slide);
  });

  /* ── "Your Project" placeholder card ────────────────────────── */
  const placeholderIdx = WORKS.length;

  const phRow = document.createElement('div');
  phRow.className = 'work-va-row work-va-row--placeholder';
  phRow.dataset.i = placeholderIdx;
  phRow.setAttribute('role', 'listitem');
  phRow.innerHTML = `
    <span class="work-vr-num">??</span>
    <div>
      <span class="work-vr-title">Your Project</span>
      <span class="work-vr-cat">Coming Soon</span>
    </div>
    <div class="work-vr-arrow" aria-hidden="true">${arrowSVG}</div>`;
  vaList.appendChild(phRow);

  const phSlide = document.createElement('div');
  phSlide.className = 'work-va-slide';
  phSlide.dataset.i = placeholderIdx;

  const phBrowser = document.createElement('div');
  phBrowser.className = 'work-browser work-browser--placeholder';
  phBrowser.setAttribute('role', 'button');
  phBrowser.setAttribute('tabindex', '0');
  phBrowser.setAttribute('aria-label', 'Your project — Start a project');
  phBrowser.addEventListener('click', () => {
    const target = document.querySelector('#contact');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
  phBrowser.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); phBrowser.click(); }
  });
  phBrowser.innerHTML = `
    <div class="work-b-bar">
      <div class="work-b-dots"><i></i><i></i><i></i></div>
      <div class="work-b-url">yourproject.com</div>
    </div>
    <div class="work-b-screen work-ph-screen">
      <div class="work-ph-content">
        <div class="work-ph-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="6" y="6" width="36" height="36" rx="8"/>
            <line x1="24" y1="16" x2="24" y2="32"/>
            <line x1="16" y1="24" x2="32" y2="24"/>
          </svg>
        </div>
        <p class="work-ph-title">Your project here</p>
        <p class="work-ph-sub">This spot is reserved for you.</p>
      </div>
    </div>`;
  phSlide.appendChild(phBrowser);

  const phBelow = document.createElement('div');
  phBelow.className = 'work-va-below';
  phBelow.innerHTML = `
    <div>
      <p class="work-va-desc">Ready to see your brand on this stage? Let's build something worth showing off.</p>
      <div class="work-metrics">
        <span class="work-metric">Your timeline</span>
        <span class="work-metric">Your stack</span>
        <span class="work-metric">Your vision</span>
      </div>
    </div>
    <a href="#contact" class="work-cta-link">
      Start your project ${arrowSVG}
    </a>`;
  phSlide.appendChild(phBelow);
  vaTilt.appendChild(phSlide);

  /* ── Hover — switch active project ───────────────────────────── */
  function setActive(i) {
    vaList.querySelectorAll('.work-va-row').forEach((r, j)  => r.classList.toggle('on', j === i));
    vaTilt.querySelectorAll('.work-va-slide').forEach((s, j) => s.classList.toggle('on', j === i));
  }

  vaList.addEventListener('mouseover', e => {
    const row = e.target.closest('.work-va-row');
    if (row) setActive(+row.dataset.i);
  });

  // Click also works (touch + keyboard users)
  vaList.addEventListener('click', e => {
    const row = e.target.closest('.work-va-row');
    if (row) setActive(+row.dataset.i);
  });

  /* ── 3-D tilt on mouse move ───────────────────────────────────── */
  vaStage.addEventListener('mousemove', e => {
    const r = vaStage.getBoundingClientRect();
    const x = (e.clientX - r.left)  / r.width  - 0.5;
    const y = (e.clientY - r.top)   / r.height - 0.5;
    vaTilt.style.transition = 'transform 0.08s linear';
    vaTilt.style.transform  = `rotateY(${x * 8}deg) rotateX(${-y * 5}deg)`;
  });
  vaStage.addEventListener('mouseleave', () => {
    vaTilt.style.transition = 'transform 0.9s cubic-bezier(0.16,1,0.3,1)';
    vaTilt.style.transform  = 'rotateY(0deg) rotateX(0deg)';
  });

})();