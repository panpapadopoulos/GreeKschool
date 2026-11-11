/* Seasonal themes and effects — configured in Pages CMS ("Seasonal Theme").
   Lightweight canvas particles: never block clicks (pointer-events: none),
   pause when the tab is hidden, and stay off for visitors who prefer reduced motion.
   Preview any theme by adding ?season=christmas (or autumn, independence, oxi,
   easter, backtoschool, default) to the page address. */
(function () {
  'use strict';
  var THEMES = ['default', 'christmas', 'autumn', 'independence', 'oxi', 'easter', 'backtoschool'];
  var EFFECT = { christmas: 'snow', autumn: 'leaves', easter: 'petals' };
  var ICONS = {
    christmas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5"/></svg>',
    autumn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19l8-8"/></svg>',
    independence: '<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" fill="#fff"/><path d="M2 5h20v1.6H2zm0 3.1h20v1.6H2zm0 3.1h20v1.6H2zm0 3.1h20v1.6H2zm0 3.1h20V19H2z" fill="#0d5eaf"/><rect x="2" y="5" width="8.6" height="7.8" fill="#0d5eaf"/><path d="M6.3 5v7.8M2 8.9h8.6" stroke="#fff" stroke-width="1.6"/></svg>',
    easter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 3c3.9 0 7 6 7 10a7 7 0 0 1-14 0c0-4 3.1-10 7-10z"/><path d="M6 12.5l2.5-1.5 2 1.5 2-1.5 2 1.5 2.5-1.5"/></svg>',
    backtoschool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H4z"/><path d="M20 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"/></svg>'
  };
  ICONS.oxi = ICONS.independence;

  var cfg = {};
  try { cfg = JSON.parse(document.getElementById('season-data').textContent) || {}; } catch (e) {}

  var d = new Date();
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var today = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  function within(start, end) {
    start = start ? String(start).slice(0, 10) : '';
    end = end ? String(end).slice(0, 10) : '';
    return (!start || start <= today) && (!end || end >= today);
  }

  // Decide which theme is active
  var theme = 'default', message = '';
  var preview = (location.search.match(/[?&]season=([a-z]+)/) || [])[1];
  if (preview && THEMES.indexOf(preview) > -1) {
    theme = preview; // preview shows the greeting from the schedule, if any
    (cfg.schedule || []).some(function (r) { if (r && r.theme === theme && r.message) { message = r.message; return true; } return false; });
  } else if (cfg.mode === 'manual' && within(cfg.manual_start, cfg.manual_end)) {
    theme = cfg.manual_theme || 'default';
    message = cfg.message || '';
  } else if (cfg.mode === 'auto' || cfg.mode === 'manual') {
    (cfg.schedule || []).some(function (r) {
      if (r && r.theme && within(r.start, r.end)) { theme = r.theme; message = r.message || cfg.message || ''; return true; }
      return false;
    });
  }
  if (THEMES.indexOf(theme) < 0 || theme === 'default') return;
  document.documentElement.setAttribute('data-season', theme);

  // Greeting bar (dismissible for the rest of the visit)
  var bar = document.querySelector('.season-bar');
  var dismissed = false;
  try { dismissed = sessionStorage.getItem('season-bar-hidden') === theme + message; } catch (e) {}
  if (bar && message && !dismissed) {
    bar.querySelector('.season-text').textContent = message;
    bar.querySelector('.season-icon').innerHTML = ICONS[theme] || '';
    bar.classList.add('show');
    bar.querySelector('button').addEventListener('click', function () {
      bar.classList.remove('show');
      try { sessionStorage.setItem('season-bar-hidden', theme + message); } catch (e) {}
    });
  }

  // Particle effect
  var kind = EFFECT[theme];
  if (!kind || cfg.effects === false) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce && reduce.matches) return;
  var canvas = document.getElementById('season-canvas');
  var toggle = document.querySelector('.season-toggle');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  var level = { light: 1, medium: 1.8, strong: 2.8 }[cfg.intensity] || 1;
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  var W, H, parts = [], running = false, paused = false, raf = 0, last = 0;
  try { paused = localStorage.getItem('season-paused') === '1'; } catch (e) {}

  var palettes = {
    snow: ['rgba(255,255,255,0.95)', 'rgba(240,246,252,0.85)'],
    leaves: ['#c0702b', '#a8501c', '#d49a2a', '#8f3b1b', '#b8862b'],
    petals: ['#f7d6dc', '#fbe9ec', '#ffffff', '#f3c5cf']
  }[kind];

  function count() {
    var base = kind === 'snow' ? 28 : 12;
    var area = Math.min(1, (W * H) / (1440 * 900));
    return Math.max(6, Math.round(base * level * (0.45 + 0.55 * area)));
  }
  function make(randomY) {
    var size = kind === 'snow' ? 1.2 + Math.random() * 2.6 : 7 + Math.random() * 7;
    return {
      x: Math.random() * W,
      y: randomY ? Math.random() * H : -20 - Math.random() * 60,
      r: size,
      vy: kind === 'snow' ? 18 + size * 9 + Math.random() * 12 : 26 + Math.random() * 22,
      sway: 10 + Math.random() * 22,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - .5) * 1.6,
      rot: Math.random() * Math.PI * 2,
      c: palettes[(Math.random() * palettes.length) | 0],
      a: kind === 'snow' ? .5 + Math.random() * .45 : .55 + Math.random() * .35
    };
  }
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = count();
    while (parts.length < n) parts.push(make(true));
    parts.length = n;
  }
  function leaf(p) {
    ctx.beginPath();
    ctx.moveTo(0, -p.r);
    ctx.quadraticCurveTo(p.r * .8, -p.r * .2, 0, p.r);
    ctx.quadraticCurveTo(-p.r * .8, -p.r * .2, 0, -p.r);
    ctx.fill();
  }
  function petal(p) {
    ctx.beginPath();
    ctx.ellipse(0, 0, p.r * .45, p.r * .8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  function frame(t) {
    if (!running) return;
    var dt = Math.min(0.05, (t - (last || t)) / 1000);
    last = t;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.y += p.vy * dt;
      p.phase += dt * (kind === 'snow' ? .8 : 1.2);
      p.rot += p.spin * dt;
      var x = p.x + Math.sin(p.phase) * p.sway;
      if (p.y > H + 20) { parts[i] = make(false); continue; }
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      if (kind === 'snow') {
        ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.save(); ctx.translate(x, p.y); ctx.rotate(p.rot + Math.sin(p.phase) * .6);
        kind === 'leaves' ? leaf(p) : petal(p);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running || paused || document.hidden) return;
    running = true; last = 0; canvas.hidden = false;
    raf = requestAnimationFrame(frame);
  }
  function stop(clear) {
    running = false; cancelAnimationFrame(raf);
    if (clear) { ctx.clearRect(0, 0, W, H); canvas.hidden = true; }
  }
  function syncToggle() {
    toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
    toggle.querySelector('span').textContent = paused ? 'Play animation' : 'Pause animation';
    toggle.querySelector('svg').innerHTML = paused
      ? '<path d="M7 5l12 7-12 7z"/>'
      : '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
  }

  resize();
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 150); }, { passive: true });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop(false) : start(); });
  if (reduce && reduce.addEventListener) reduce.addEventListener('change', function (e) { if (e.matches) { paused = true; stop(true); syncToggle(); } });
  if (toggle) {
    toggle.classList.add('show');
    syncToggle();
    toggle.addEventListener('click', function () {
      paused = !paused;
      try { localStorage.setItem('season-paused', paused ? '1' : '0'); } catch (e) {}
      paused ? stop(true) : start();
      syncToggle();
    });
  }
  start();
})();
