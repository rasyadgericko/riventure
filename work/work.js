/* ===== WORK PAGE — RYC ===== */
(function() {
  'use strict';

  /* ── Theme ──────────────────────────────────────────────────── */
  const saved = localStorage.getItem('ryc-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  /* ── Scroll reveal (fade-up + cards) ────────────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => revealObs.observe(el));

    // Card reveal with stagger — observe after load
    window._workRevealObs = revealObs;
  }

  /* ── SVG fallbacks (same as homepage) ───────────────────────── */
  function toSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  const MOCK = {};

  MOCK['terra-tide'] = `<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="300" fill="#f7f5f2"/>
    <rect width="480" height="44" fill="#f7f5f2"/>
    <rect x="0" y="43" width="480" height="1" fill="#e2dcd5"/>
    <rect x="24" y="16" width="82" height="13" rx="2" fill="#1c1a18"/>
    <rect x="178" y="20" width="34" height="7" rx="2" fill="#c4bdb5"/>
    <rect x="224" y="20" width="34" height="7" rx="2" fill="#c4bdb5"/>
    <rect x="270" y="20" width="34" height="7" rx="2" fill="#c4bdb5"/>
    <circle cx="434" cy="22" r="7" fill="#e2dcd5"/>
    <circle cx="454" cy="22" r="7" fill="#e2dcd5"/>
    <rect x="0" y="44" width="480" height="152" fill="#b5a895"/>
    <rect x="0" y="44" width="480" height="152" fill="#1c1a18" opacity="0.26"/>
    <rect x="32" y="80" width="202" height="24" rx="3" fill="#fff" opacity="0.92"/>
    <rect x="32" y="114" width="148" height="9" rx="2" fill="#fff" opacity="0.48"/>
    <rect x="32" y="132" width="108" height="9" rx="2" fill="#fff" opacity="0.34"/>
    <rect x="32" y="154" width="98" height="26" rx="13" fill="#1c1a18"/>
    <rect x="4" y="204" width="113" height="88" rx="5" fill="#ede7df"/>
    <rect x="123" y="204" width="113" height="88" rx="5" fill="#e2dcd5"/>
    <rect x="242" y="204" width="113" height="88" rx="5" fill="#ede7df"/>
    <rect x="361" y="204" width="115" height="88" rx="5" fill="#ddd5c9"/>
  </svg>`;

  MOCK['nexus-analytics'] = `<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="300" fill="#0d1117"/>
    <rect width="480" height="40" fill="#161b22"/>
    <circle cx="20" cy="20" r="6" fill="#5b7fff"/>
    <rect x="36" y="14" width="78" height="12" rx="3" fill="#21262d"/>
    <rect width="52" height="260" y="40" fill="#161b22"/>
    <rect x="13" y="56" width="26" height="26" rx="5" fill="#5b7fff" opacity="0.85"/>
    <rect x="64" y="52" width="116" height="56" rx="7" fill="#1c2128"/>
    <rect x="76" y="64" width="52" height="7" rx="2" fill="#30363d"/>
    <rect x="76" y="78" width="72" height="18" rx="3" fill="#e6edf3" opacity="0.88"/>
    <rect x="190" y="52" width="116" height="56" rx="7" fill="#1c2128"/>
    <rect x="202" y="64" width="52" height="7" rx="2" fill="#30363d"/>
    <rect x="202" y="78" width="72" height="18" rx="3" fill="#e6edf3" opacity="0.88"/>
    <rect x="64" y="120" width="266" height="164" rx="7" fill="#1c2128"/>
    <polygon points="82,248 116,234 152,242 188,214 224,220 260,195 296,180 312,174 312,255 82,255" fill="#5b7fff" opacity="0.17"/>
    <polyline points="82,248 116,234 152,242 188,214 224,220 260,195 296,180 312,174" fill="none" stroke="#5b7fff" stroke-width="2.5" stroke-linejoin="round"/>
  </svg>`;

  MOCK['vertex-capital'] = `<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="300" fill="#090909"/>
    <rect width="480" height="54" fill="#090909"/>
    <rect x="0" y="53" width="480" height="1" fill="#1e1e1e"/>
    <rect x="28" y="20" width="50" height="16" rx="2" fill="#f1f1f1"/>
    <rect x="28" y="74" width="296" height="40" rx="4" fill="#f1f1f1" opacity="0.92"/>
    <rect x="28" y="122" width="220" height="22" rx="4" fill="#f1f1f1" opacity="0.36"/>
    <rect x="28" y="152" width="248" height="14" rx="3" fill="#f1f1f1" opacity="0.18"/>
    <rect x="0" y="196" width="480" height="1" fill="#1e1e1e"/>
    <rect x="28" y="216" width="136" height="10" rx="2" fill="#444"/>
    <rect x="28" y="241" width="168" height="10" rx="2" fill="#444"/>
    <rect x="28" y="264" width="148" height="10" rx="2" fill="#444"/>
  </svg>`;

  MOCK['medsync-pro'] = `<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="300" fill="#f4f6f9"/>
    <rect width="54" height="300" fill="#fff"/>
    <rect x="14" y="12" width="26" height="26" rx="6" fill="#dcfce7"/>
    <circle cx="27" cy="25" r="8" fill="#16a34a"/>
    <rect x="66" y="58" width="94" height="52" rx="7" fill="#fff"/>
    <rect x="78" y="70" width="48" height="7" rx="2" fill="#9ca3af"/>
    <rect x="78" y="83" width="66" height="17" rx="3" fill="#111827" opacity="0.8"/>
    <rect x="170" y="58" width="94" height="52" rx="7" fill="#fff"/>
    <rect x="66" y="122" width="248" height="162" rx="8" fill="#fff"/>
  </svg>`;

  MOCK['soulflow-yoga'] = `<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="300" fill="#faf7f2"/>
    <rect x="0" y="43" width="480" height="1" fill="#e8dfd4"/>
    <rect x="24" y="14" width="90" height="14" rx="2" fill="#8b6f4e"/>
    <rect x="0" y="44" width="480" height="156" fill="#e8dfd4"/>
    <circle cx="360" cy="130" r="60" fill="#d4c4a8" opacity="0.4"/>
    <rect x="36" y="78" width="200" height="18" rx="2" fill="#5c4a32" opacity="0.85"/>
    <rect x="36" y="104" width="260" height="10" rx="2" fill="#5c4a32" opacity="0.5"/>
    <rect x="36" y="148" width="100" height="28" rx="14" fill="#8b6f4e"/>
    <rect x="16" y="210" width="140" height="78" rx="8" fill="#fff"/>
    <rect x="168" y="210" width="140" height="78" rx="8" fill="#fff"/>
    <rect x="320" y="210" width="140" height="78" rx="8" fill="#fff"/>
  </svg>`;

  MOCK['atelier-studio'] = `<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="300" fill="#0a0a0a"/>
    <rect width="480" height="40" fill="#0a0a0a"/>
    <rect x="0" y="39" width="480" height="1" fill="#222"/>
    <rect x="24" y="14" width="72" height="12" rx="2" fill="#fff"/>
    <rect x="24" y="64" width="432" height="36" rx="2" fill="#fff" opacity="0.95"/>
    <rect x="24" y="108" width="380" height="28" rx="2" fill="#fff" opacity="0.85"/>
    <rect x="24" y="188" width="90" height="26" rx="13" fill="#ff4d2d"/>
    <rect x="0" y="230" width="240" height="70" rx="0" fill="#161616"/>
    <rect x="240" y="230" width="240" height="70" rx="0" fill="#1a1a1a"/>
  </svg>`;

  /* ── Fetch from Supabase & build grid ───────────────────────── */
  async function loadProjects() {
    const grid = document.getElementById('workGrid');
    if (!grid || !window.supabase) return;

    const sb = window.supabase.createClient(
      'https://nymxhmekhiwifkaccafc.supabase.co',
      'sb_publishable_jCxzAlUEg0AFFqU9nxJ3hQ_nJOy_hwB'
    );

    const { data: works, error } = await sb
      .from('works')
      .select('num, cat, title, description, metrics, color, display_url, link, image_url')
      .eq('active', true)
      .order('sort_order');

    if (error || !works?.length) return;

    const arrowSVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';

    works.forEach((w, i) => {
      const slug = toSlug(w.title);
      const isExternal = w.link.startsWith('http');
      const overlayLabel = isExternal ? 'Visit live site' : 'View project';

      const screen = w.image_url
        ? `<img src="${w.image_url}" alt="${w.title} screenshot" width="480" height="300" loading="${i === 0 ? 'eager' : 'lazy'}">`
        : (MOCK[slug] || '');

      const card = document.createElement('a');
      card.className = 'work-card' + (i === 0 ? ' featured' : '');
      card.setAttribute('role', 'listitem');
      card.href = w.link;
      if (isExternal) {
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
      }

      card.innerHTML = `
        <div class="work-card-browser">
          <div class="work-card-bar">
            <div class="work-card-dots"><i></i><i></i><i></i></div>
            <div class="work-card-url">${w.display_url}</div>
          </div>
          <div class="work-card-screen">
            ${screen}
            <div class="work-card-overlay" aria-hidden="true">
              <span class="work-card-overlay-pill">${overlayLabel} ${arrowSVG}</span>
            </div>
          </div>
        </div>
        <div class="work-card-body">
          <div class="work-card-cat">${w.cat}</div>
          <div class="work-card-title">${w.title}</div>
          <div class="work-card-desc">${w.description}</div>
          <div class="work-card-metrics">
            ${w.metrics.map(m => `<span class="work-card-metric">${m}</span>`).join('')}
          </div>
        </div>`;
      grid.appendChild(card);
    });

    // "Your Project" placeholder
    const ph = document.createElement('div');
    ph.className = 'work-card-placeholder';
    ph.setAttribute('role', 'listitem');
    ph.setAttribute('tabindex', '0');
    ph.addEventListener('click', () => { window.location.href = '/contact.html'; });
    ph.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = '/contact.html'; }
    });
    ph.innerHTML = `
      <div class="work-card-placeholder-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="6" y="6" width="36" height="36" rx="8"/>
          <line x1="24" y1="16" x2="24" y2="32"/>
          <line x1="16" y1="24" x2="32" y2="24"/>
        </svg>
      </div>
      <div class="work-card-placeholder-title">Your project here</div>
      <div class="work-card-placeholder-sub">This spot is reserved for you.</div>`;
    grid.appendChild(ph);

    // Observe cards for staggered reveal
    if (window._workRevealObs) {
      grid.querySelectorAll('.work-card, .work-card-placeholder').forEach((card, idx) => {
        card.style.transitionDelay = `${idx * 0.08}s`;
        window._workRevealObs.observe(card);
      });
    } else {
      // Reduced motion — show immediately
      grid.querySelectorAll('.work-card, .work-card-placeholder').forEach(c => c.classList.add('visible'));
    }
  }

  // Wait for Supabase SDK to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProjects);
  } else {
    loadProjects();
  }
})();
