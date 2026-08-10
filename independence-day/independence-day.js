/**
 * Independence Day Module — DigiDr Microsites
 * ============================================
 * Hero tricolor bg + Ashoka Chakra: 10 Aug – 15 Aug (IST) only.
 * Off from 16 Aug 00:00 IST. Banner uses the same window when enabled.
 *
 * URL params for testing:
 *   ?id_preview=1  → force-activate (ignores date)
 *   ?id_day15=1    → simulate 15 Aug (fireworks on load)
 */
(function () {
  'use strict';

  const CONFIG = {
    enabled:          false, /* banner removed from top — set true to re-enable */
    /* Inclusive IST calendar days for hero tricolor + chakra (and banner when enabled) */
    activateFrom:     { month: 8, day: 10 }, /* today window start */
    activateTo:       { month: 8, day: 15 }, /* Independence Day — last active day */
    confettiCount:    80,
    confettiDuration: 9000,
    /* Marketing site uses fixed .navbar-root; microsites may use .site-header */
    navbarSelector:   '.navbar-root',
  };

  /* ── URL overrides ── */
  const _p        = new URLSearchParams(window.location.search);
  const _force    = _p.get('id_preview') === '1';
  const _day15    = _p.get('id_day15')   === '1';

  /* ── Date check (IST) — active only 10 Aug through 15 Aug inclusive ── */
  function isInSeason() {
    if (_force || _day15) return true;
    const now = new Date();
    const ist = new Date(now.getTime() + (5.5 * 60 + now.getTimezoneOffset()) * 60000);
    const m = ist.getMonth() + 1;
    const d = ist.getDate();
    const from = CONFIG.activateFrom;
    const to = CONFIG.activateTo;
    if (m < from.month || m > to.month) return false;
    if (m === from.month && d < from.day) return false;
    if (m === to.month && d > to.day) return false;
    return true;
  }

  /* Banner + effects — also requires CONFIG.enabled */
  function isActive() {
    if (!CONFIG.enabled && !_force && !_day15) return false;
    return isInSeason();
  }

  function isDay15() {
    if (_day15) return true;
    const now = new Date();
    const ist = new Date(now.getTime() + (5.5 * 60 + now.getTimezoneOffset()) * 60000);
    return ist.getMonth() + 1 === 8 && ist.getDate() === 15;
  }

  /* ── Booking Modal Detection ── */
  function isModalOpen() {
    if (document.body.style.overflow === 'hidden' || document.body.classList.contains('modal-open') || document.body.classList.contains('is-modal-open')) {
      return true;
    }
    const modals = document.querySelectorAll('#bookingModal, .modal, .booking-modal, [role="dialog"]');
    for (let i = 0; i < modals.length; i++) {
      const m = modals[i];
      if (
        m.classList.contains('is-open') ||
        m.classList.contains('active') ||
        m.classList.contains('open') ||
        m.classList.contains('show') ||
        m.getAttribute('aria-hidden') === 'false'
      ) {
        return true;
      }
    }
    return false;
  }

  /* ── Vector Ashoka Chakra SVG ── */
  function chakraSVG(size, color, className, bgFill) {
    const c = color || '#06038D';
    const bg = bgFill === undefined ? '#ffffff' : bgFill;
    const r = size / 2, sw = Math.max(0.8, size * 0.04);
    const or = r * 0.88, ir = r * 0.14, sr = r * 0.80;
    const cls = className ? ` class="${className}"` : '';
    const spokes = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * 2 * Math.PI;
      return `<line x1="${r}" y1="${r}" x2="${(r + sr * Math.sin(a)).toFixed(2)}" y2="${(r - sr * Math.cos(a)).toFixed(2)}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`;
    }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg"${cls} width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <circle cx="${r}" cy="${r}" r="${(r * 0.92).toFixed(2)}" fill="${bg}" />
      <circle cx="${r}" cy="${r}" r="${or.toFixed(2)}" fill="none" stroke="${c}" stroke-width="${sw}"/>
      ${spokes}
      <circle cx="${r}" cy="${r}" r="${ir.toFixed(2)}" fill="${c}"/>
    </svg>`;
  }

  /* Blue-gradient Ashoka Chakra — real flag geometry (24 spokes, BIS proportions) */
  function heroGradientChakraSVG(size) {
    /* Construction sheet: outer radius = 46 units */
    const UNIT = size / (2 * 46);
    const cx = size / 2;
    const cy = size / 2;
    const R = 46 * UNIT;
    const rimW = 6 * UNIT;
    const rimInner = R - rimW;
    const rimMid = R - rimW / 2;
    const hubR = 8 * UNIT;
    const spokeRoot = 2 * UNIT;
    const spokeWide = 16 * UNIT;
    const halfWide = (5 * Math.PI) / 180; /* 10° span at thickest */
    const SPOKES = 24;
    const STEP = (2 * Math.PI) / SPOKES; /* exactly 15° */
    const gid = 'idHeroChakraBlueGrad';
    const mid = 'idHeroChakraMask';

    function pt(dist, ang) {
      return [
        +(cx + dist * Math.sin(ang)).toFixed(3),
        +(cy - dist * Math.cos(ang)).toFixed(3),
      ];
    }

    /* Mask shapes in white so a static blue gradient shows through */
    const spokes = [];
    const dots = [];
    for (let i = 0; i < SPOKES; i++) {
      const a = i * STEP;
      const [ix, iy] = pt(spokeRoot, a);
      const [ox, oy] = pt(rimInner, a);
      const [lx, ly] = pt(spokeWide, a - halfWide);
      const [rx, ry] = pt(spokeWide, a + halfWide);
      spokes.push(
        `<path d="M${ix} ${iy} L${lx} ${ly} L${ox} ${oy} L${rx} ${ry} Z" fill="#fff"/>`
      );

      const [dx, dy] = pt(rimInner, a + STEP / 2);
      dots.push(
        `<circle cx="${dx}" cy="${dy}" r="${(2.2 * UNIT).toFixed(3)}" fill="#fff"/>`
      );
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spinAnim = reduceMotion
      ? ''
      : `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="42s" repeatCount="indefinite"/>`;

    return `<svg class="id-hero-chakra" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <defs>
        <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="${cy}" x2="${size}" y2="${cy}">
          <stop offset="0%" stop-color="#7EC4FF"/>
          <stop offset="45%" stop-color="#0E65D7"/>
          <stop offset="100%" stop-color="#042B6B"/>
        </linearGradient>
        <mask id="${mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="${size}" height="${size}">
          <g class="id-hero-chakra-spin">
            ${spinAnim}
            <circle cx="${cx}" cy="${cy}" r="${rimMid.toFixed(3)}" fill="none" stroke="#fff" stroke-width="${rimW.toFixed(3)}"/>
            ${spokes.join('')}
            ${dots.join('')}
            <circle cx="${cx}" cy="${cy}" r="${hubR.toFixed(3)}" fill="#fff"/>
          </g>
        </mask>
      </defs>
      <!-- Gradient stays put; only the mask (wheel) spins -->
      <rect width="${size}" height="${size}" fill="url(#${gid})" mask="url(#${mid})"/>
    </svg>`;
  }



  /* ══════════════════════════════════════════
     1. EXECUTIVE TOP BANNER (Injected inside .site-header)
     ══════════════════════════════════════════ */
  function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'id-banner';
    banner.setAttribute('role', 'banner');
    banner.setAttribute('aria-label', 'Independence Day greeting');

    const chakra = chakraSVG(80, '#0E65D7', 'id-banner-chakra');

    banner.innerHTML = `
      <div class="id-banner-flag" aria-hidden="true">
        <div class="id-banner-stripe id-banner-stripe--saffron"></div>
        <div class="id-banner-stripe id-banner-stripe--white">
          <div class="id-banner-pattern left">${chakra}</div>
          <div class="id-banner-pattern right">${chakra}</div>
        </div>
        <div class="id-banner-stripe id-banner-stripe--green"></div>
      </div>
      <div class="id-banner-content">
        <div class="id-banner-text-wrap">
          <h2 class="id-banner-title"><span class="id-banner-accent">Happy 79th Independence Day</span></h2>
        </div>
      </div>
    `;

    // Insert at top of body in normal document flow (not sticky / not fixed)
    document.body.insertBefore(banner, document.body.firstChild);
    document.body.classList.add('id-banner-active', 'id-banner-revealing');

    /* Next frame: expand height so the page smoothly slides down */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('id-banner--open');

        const revealMs = 850;
        const start = performance.now();
        (function tick(now) {
          syncNavbarWithBanner();
          if (now - start < revealMs) {
            requestAnimationFrame(tick);
          } else {
            document.body.classList.remove('id-banner-revealing');
            syncNavbarWithBanner();
          }
        })(performance.now());
      });
    });
  }

  function isHomePage() {
    if (document.body.classList.contains('page-home')) return true;
    const path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    return path === '/' || path.endsWith('/index.html') || /\/index\.html$/i.test(path);
  }

  /* Keep fixed navbar docked under the scrolling banner, then pin to top */
  function syncNavbarWithBanner() {
    const banner = document.getElementById('id-banner');
    const navbar = document.querySelector(CONFIG.navbarSelector);
    if (!banner) return;

    const bannerHeight = banner.offsetHeight;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const offset = Math.max(0, bannerHeight - scrollY);

    document.documentElement.style.setProperty('--id-banner-offset', offset + 'px');
    document.documentElement.style.setProperty('--id-banner-height', bannerHeight + 'px');

    if (navbar) {
      navbar.style.top = offset + 'px';
    }
  }

  function setupBannerNavbarSync() {
    syncNavbarWithBanner();
    window.addEventListener('scroll', syncNavbarWithBanner, { passive: true });
    window.addEventListener('resize', syncNavbarWithBanner);
  }

  /* ══════════════════════════════════════════
     3. BOOKING MODAL CONTROL
     - Booking modal OPEN -> Hide Ashoka Chakra button
     ══════════════════════════════════════════ */
  function updateVisibility() {
    const badge = document.getElementById('id-chakra-badge');
    const modalActive = isModalOpen();

    if (modalActive) {
      if (badge) badge.classList.add('id-modal-hidden');
    } else {
      if (badge) badge.classList.remove('id-modal-hidden');
    }
  }

  function setupScrollAndModalListeners() {
    // MutationObserver to instantly detect modal open/close
    const observer = new MutationObserver(updateVisibility);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'], subtree: false });

    const modals = document.querySelectorAll('#bookingModal, .modal, .booking-modal, [role="dialog"]');
    modals.forEach(m => {
      observer.observe(m, { attributes: true, attributeFilter: ['class', 'style', 'aria-hidden'] });
    });
  }

  /* ══════════════════════════════════════════
     4. CONFETTI
     ══════════════════════════════════════════ */
  function launchConfetti(duration) {
    const canvas = document.createElement('canvas');
    canvas.id = 'id-confetti-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const COLORS = ['#FF671F', '#046A38', '#ffffff', '#06038D', '#FFD700'];

    const particles = Array.from({ length: CONFIG.confettiCount }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * canvas.height * 0.4,
      w: 5 + Math.random() * 7,
      h: 3 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vy: 1.0 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 1.2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.08,
      alpha: 0.6 + Math.random() * 0.4,
    }));

    const start = performance.now();
    let raf;

    (function draw(now) {
      const t = now - start;
      const fade = t > duration * 0.7 ? 1 - (t - duration * 0.7) / (duration * 0.3) : 1;
      if (fade <= 0) { canvas.remove(); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.vy; p.x += p.vx; p.rot += p.rotV;
        if (p.y > canvas.height + 10) { p.y = -10; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.globalAlpha = p.alpha * fade;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    })(performance.now());

    setTimeout(() => { cancelAnimationFrame(raf); canvas.remove(); }, duration + 400);
  }

  /* ══════════════════════════════════════════
     5. FIREWORKS
     ══════════════════════════════════════════ */
  function fireworkBurst(x, y) {
    const colors = ['#FF671F', '#046A38', '#06038D', '#FFD700', '#ffffff'];
    const wrap = document.createElement('div');
    wrap.className = 'id-firework';
    wrap.style.cssText = `left:${x}px;top:${y}px;`;
    document.body.appendChild(wrap);
    for (let i = 0; i < 20; i++) {
      const spark = document.createElement('div');
      spark.className = 'id-spark';
      const a = (i / 20) * 2 * Math.PI;
      const d = 50 + Math.random() * 80;
      const s = 2.5 + Math.random() * 3.5;
      spark.style.cssText = `--tx:${(Math.cos(a)*d).toFixed(1)}px;--ty:${(Math.sin(a)*d).toFixed(1)}px;width:${s}px;height:${s}px;background:${colors[i%colors.length]};animation-delay:${(Math.random()*0.15).toFixed(2)}s;`;
      wrap.appendChild(spark);
    }
    setTimeout(() => wrap.remove(), 1600);
  }

  function launchFireworks() {
    const W = window.innerWidth, H = window.innerHeight;
    [[W*.22, H*.28], [W*.72, H*.22], [W*.5, H*.38]].forEach(([x,y], i) => {
      setTimeout(() => fireworkBurst(x, y), i * 420);
    });
  }

  /* ══════════════════════════════════════════
     6. ASHOKA CHAKRA BADGE
     ══════════════════════════════════════════ */
  function createChakraBadge() {
    const SIZE = 48, r = 24;
    const spokes = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * 2 * Math.PI;
      return `<line x1="${r}" y1="${r}" x2="${(r+r*.80*Math.sin(a)).toFixed(2)}" y2="${(r-r*.80*Math.cos(a)).toFixed(2)}" stroke="#06038D" stroke-width="1.3" stroke-linecap="round"/>`;
    }).join('');

    const badge = document.createElement('div');
    badge.id = 'id-chakra-badge';
    badge.setAttribute('role', 'button');
    badge.setAttribute('tabindex', '0');
    badge.title = '🇮🇳 Click to celebrate!';
    badge.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
        <circle cx="${r}" cy="${r}" r="${r-1}" fill="none" stroke="#FF671F" stroke-width="2.5"/>
        <circle cx="${r}" cy="${r}" r="${r-3.5}" fill="none" stroke="#fff" stroke-width="2.5"/>
        <circle cx="${r}" cy="${r}" r="${r-6}" fill="none" stroke="#046A38" stroke-width="2.5"/>
        <g class="id-chakra-spin-el">
          <circle cx="${r}" cy="${r}" r="${(r*.70).toFixed(1)}" fill="#fff"/>
          <circle cx="${r}" cy="${r}" r="${(r*.70).toFixed(1)}" fill="none" stroke="#06038D" stroke-width="1.3"/>
          ${spokes}
          <circle cx="${r}" cy="${r}" r="${(r*.13).toFixed(1)}" fill="#06038D"/>
        </g>
      </svg>`;

    document.body.appendChild(badge);
    const celebrate = () => { launchFireworks(); launchConfetti(5000); };
    badge.addEventListener('click', celebrate);
    badge.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') celebrate(); });
  }

  /* Hero aurora → Indian tricolor (keeps default DigiDr gradient in CSS; override via class) */
  function applyHeroTricolor() {
    document.body.classList.add('id-hero-tricolor');
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    hero.classList.add('id-tricolor');

    if (hero.querySelector('.id-hero-chakra-wrap')) return;

    const wrap = document.createElement('div');
    wrap.className = 'id-hero-chakra-wrap';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = heroGradientChakraSVG(380);
    hero.appendChild(wrap);

    /* Trigger enter-from-left after paint */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wrap.classList.add('id-hero-chakra-wrap--in');
      });
    });
  }

  /* ══════════════════════════════════════════
     INIT
     ══════════════════════════════════════════ */
  function init() {
    if (!isHomePage()) return;

    /* Hero tricolor + chakra: 10–15 Aug IST only (independent of banner enabled flag) */
    if (isInSeason()) {
      applyHeroTricolor();
    }

    if (!isActive()) return;

    /* Banner appear 1s after load — index page only */
    setTimeout(function () {
      createBanner();
      setupBannerNavbarSync();
      // createChakraBadge();
      setupScrollAndModalListeners();
      // setTimeout(() => launchConfetti(CONFIG.confettiDuration), 500);
      if (isDay15()) setTimeout(() => launchFireworks(), 700);
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
