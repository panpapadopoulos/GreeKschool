/* Seasonal appearance — configured in Pages CMS ("Seasonal Theme", _data/season.yml).
 *
 * A preset has four independent layers; the CMS decides which are shown:
 *   colours      greeting bar colour, section-title accent, Greek key colour
 *   decorations  a detail under the menu bar + small drawings in the hero's corners (SVG, static)
 *   animation    light canvas particles (snow, leaves, petals, confetti, sparkles, hearts, sunlight, water)
 *   greeting     the optional message bar
 * Decorations stay for visitors who prefer reduced motion; animation never runs for them,
 * never blocks clicks, pauses when the tab is hidden and has a Pause button.
 *
 * Preview without publishing (only in your own browser):
 *   ?season=christmas&anim=snow&intensity=medium&show=all&deco=classic&date=2026-12-10
 */
(function () {
  'use strict';

  /* ---------- Presets ---------- */
  var GR = 'gr', GOLD = '#c9a227';
  var PRESETS = {
    'default':     { label: 'Default (no decorations)' },
    winter:        { label: 'Winter', bar: '#34557a', rule: '#8fb3d9', strip: 'frost', corners: ['snowflakes', 'snowflakes'], anim: 'snow', icon: 'snowflake' },
    spring:        { label: 'Spring', bar: '#466f40', rule: '#cf7d93', corners: ['blossom', 'blossom'], anim: 'petals', icon: 'flower' },
    summer:        { label: 'Summer', bar: '#d9a521', ink: '#142d58', rule: '#e0a82e', corners: ['sun'], anim: 'sunlight', icon: 'sun' },
    autumn:        { label: 'Autumn', bar: '#874816', rule: '#c0702b', corners: ['autumn', 'autumn'], anim: 'leaves', icon: 'leaf' },
    christmas:     { label: 'Christmas', bar: '#86232a', rule: '#b8322f', strip: 'lights', corners: ['fir', 'fir'], anim: 'snow', key: 'gold', icon: 'snowflake' },
    newyear:       { label: 'New Year', bar: '#18284a', ink: '#f3d77a', rule: GOLD, strip: 'gold', corners: ['stars', 'stars'], anim: 'sparkles', key: 'gold', icon: 'star' },
    theophany:     { label: 'Theophany (January 6)', bar: '#1b689f', rule: '#7fb6dd', strip: 'waves', band: 'waves', corners: [], anim: 'water', icon: 'wave' },
    greeklanguage: { label: 'Greek Language Day (February 9)', bar: '#1d3f7a', rule: GOLD, strip: 'gold', corners: ['letters', 'letters'], anim: 'none', icon: 'alpha' },
    valentine:     { label: "Valentine's Day", bar: '#8b2e44', rule: '#c9576e', corners: ['hearts', 'hearts'], anim: 'hearts', icon: 'heart' },
    independence:  { label: 'Greek Independence Day (March 25)', bar: '#0d5eaf', rule: GR, strip: 'gr', corners: ['flag-gr', 'laurel'], anim: 'none', icon: 'flag-gr', confetti: ['#0d5eaf', '#ffffff', '#5b9be0'] },
    annunciation:  { label: 'Annunciation (March 25)', bar: '#2b4e88', rule: GOLD, strip: 'gold', corners: ['lily', 'lily'], anim: 'none', key: 'gold', icon: 'lily' },
    march25:       { label: 'March 25 — Independence Day & Annunciation', bar: '#0d5eaf', rule: GR, strip: 'gr', corners: ['flag-gr', 'lily'], anim: 'none', icon: 'flag-gr', confetti: ['#0d5eaf', '#ffffff', '#5b9be0'] },
    palmsunday:    { label: 'Palm Sunday', bar: '#4b6a2d', rule: '#7a9a3e', corners: ['palm', 'palm'], anim: 'none', icon: 'palm' },
    easter:        { label: 'Orthodox Easter (Pascha)', bar: '#8a1c1c', rule: '#b5302c', corners: ['blossom-eggs', 'lily'], anim: 'petals', icon: 'egg' },
    stgeorge:      { label: 'Feast of St. George', bar: '#142d58', ink: '#f3d77a', rule: GOLD, strip: 'gold', corners: ['laurel-gold', 'laurel-gold'], anim: 'none', key: 'gold', icon: 'cross' },
    memorial:      { label: 'Memorial Day', bar: '#22324f', rule: '#9e2b33', strip: 'us', corners: ['flag-us'], anim: 'none', icon: 'flag-us' },
    endofyear:     { label: 'End of the School Year', bar: '#1d3f7a', ink: '#f3d77a', rule: GOLD, strip: 'gold', corners: ['cap', 'books'], anim: 'confetti', key: 'gold', icon: 'cap', confetti: [GOLD, '#ffffff', '#2a6aa0', '#e9d48a'] },
    july4:         { label: 'Independence Day (July 4)', bar: '#1f3a6e', rule: '#b22234', strip: 'us', corners: ['flag-us', 'stars'], anim: 'none', icon: 'flag-us', confetti: ['#b22234', '#ffffff', '#3c3b6e'] },
    backtoschool:  { label: 'Beginning of the School Year', bar: GOLD, ink: '#142d58', rule: GOLD, corners: ['books', 'letters'], anim: 'none', key: 'gold', icon: 'book' },
    flagday:       { label: 'Greek Flag Day (October 27)', bar: '#0d5eaf', rule: GR, strip: 'gr', corners: ['flag-gr', 'flag-gr'], anim: 'none', icon: 'flag-gr', confetti: ['#0d5eaf', '#ffffff', '#5b9be0'] },
    oxi:           { label: 'OXI Day (October 28)', bar: '#0d5eaf', rule: GR, strip: 'gr', corners: ['flag-gr', 'laurel'], anim: 'none', icon: 'flag-gr', confetti: ['#0d5eaf', '#ffffff', '#5b9be0'] },
    halloween:     { label: 'Halloween (gentle)', bar: '#5b3412', rule: '#d2691e', corners: ['pumpkins', 'autumn'], anim: 'leaves', icon: 'leaf' },
    veterans:      { label: 'Veterans Day', bar: '#22324f', rule: '#9e2b33', strip: 'us', corners: ['flag-us'], anim: 'none', icon: 'flag-us' },
    thanksgiving:  { label: 'Thanksgiving', bar: '#7a4318', rule: '#c0702b', corners: ['autumn', 'wheat'], anim: 'leaves', icon: 'leaf' },
    custom:        { label: 'Custom celebration' }
  };
  var ACCENTS = { navy: ['#1d3f7a', GOLD], blue: ['#2a6aa0', '#8fb3d9'], gold: [GOLD, GOLD], burgundy: ['#86232a', '#b8322f'], green: ['#466f40', '#7a9a3e'], purple: ['#5b3f86', '#8e6fbf'], rose: ['#8b2e44', '#c9576e'], orange: ['#874816', '#c0702b'], greek: ['#0d5eaf', GR] };
  var ANIMS = ['snow', 'leaves', 'petals', 'confetti', 'sparkles', 'hearts', 'sunlight', 'water'];

  /* ---------- Settings + preview ---------- */
  var cfg = {};
  try { cfg = JSON.parse(document.getElementById('season-data').textContent) || {}; } catch (e) {}
  var q = {};
  location.search.replace(/[?&]([a-z]+)=([^&#]*)/g, function (_, k, v) { q[k] = decodeURIComponent(v); });
  var previewing = !!(q.season || q.anim || q.intensity || q.show || q.deco);
  var today = (window.GS && window.GS.today) || new Date().toISOString().slice(0, 10);
  function within(start, end) {
    start = start ? String(start).slice(0, 10) : ''; end = end ? String(end).slice(0, 10) : '';
    return (!start || start <= today) && (!end || end >= today);
  }

  var theme = 'default', message = '', entry = null;
  if (q.season && PRESETS[q.season]) {
    theme = q.season;
    (cfg.schedule || []).some(function (r) { if (r && r.theme === theme) { entry = r; return true; } return false; });
    message = entry && entry.message || (cfg.manual_theme === theme ? cfg.message : '') || '';
  } else if (cfg.mode === 'manual' && within(cfg.manual_start, cfg.manual_end)) {
    theme = cfg.manual_theme || 'default'; message = cfg.message || '';
  } else if (cfg.mode === 'auto' || cfg.mode === 'manual') {
    (cfg.schedule || []).some(function (r) {
      if (r && r.theme && within(r.start, r.end)) { theme = r.theme; entry = r; message = r.message || ''; return true; }
      return false;
    });
  }
  var preset = PRESETS[theme] ? assign({}, PRESETS[theme]) : null;
  if (theme === 'custom') {
    var c = cfg.custom || {}, acc = ACCENTS[c.accent] || ACCENTS.navy;
    preset = { label: c.name || 'Custom', bar: acc[0], rule: acc[1], ink: c.accent === 'gold' ? '#142d58' : null, strip: c.header && c.header !== 'none' ? c.header : null,
               corners: c.decoration && c.decoration !== 'none' ? [c.decoration, c.decoration] : [], anim: c.animation || 'none', icon: c.icon || 'star', key: c.accent === 'gold' ? 'gold' : null };
  }

  var show = q.show || cfg.show || 'all';
  var layers = {
    colors: ['all', 'theme', 'theme_decorations'].indexOf(show) > -1,
    deco: ['all', 'decorations', 'theme_decorations'].indexOf(show) > -1,
    anim: ['all', 'animation'].indexOf(show) > -1
  };
  var style = q.deco || cfg.decoration_style || 'classic';
  var anim = q.anim || (entry && entry.animation && entry.animation !== 'auto' ? entry.animation : null) || (cfg.animation && cfg.animation !== 'auto' ? cfg.animation : null) || (preset && preset.anim) || 'none';
  if (cfg.effects === false && !q.anim) anim = 'none';
  var intensity = q.intensity || cfg.intensity || 'light';

  function run() {
    if (previewing) buildPreviewPanel();
    if (!preset || theme === 'default') return;

    var html = document.documentElement;
    html.setAttribute('data-season', theme);

    /* ---------- Colours + greeting ---------- */
    if (layers.colors) {
      html.setAttribute('data-season-colors', '');
      if (preset.bar) html.style.setProperty('--season-bar', preset.bar);
      html.style.setProperty('--season-ink', preset.ink || '#ffffff');
      if (preset.rule === GR) html.setAttribute('data-season-rule', 'gr');
      else if (preset.rule) html.style.setProperty('--season-rule', preset.rule);
      if (preset.key === 'gold') html.setAttribute('data-season-key', 'gold');
      var bar = document.querySelector('.season-bar'), dismissed = false;
      try { dismissed = sessionStorage.getItem('season-bar-hidden') === theme + message; } catch (e) {}
      if (bar && message && !dismissed) {
        bar.querySelector('.season-text').textContent = message;
        bar.querySelector('.season-icon').innerHTML = icon(preset.icon);
        bar.classList.add('show');
        bar.querySelector('button').addEventListener('click', function () {
          bar.classList.remove('show');
          try { sessionStorage.setItem('season-bar-hidden', theme + message); } catch (e) {}
        });
      }
    }

    /* ---------- Decorations (static SVG) ---------- */
    if (layers.deco) {
      if (preset.strip) html.setAttribute('data-season-strip', preset.strip);
      var hero = document.querySelector('.hero');
      if (hero && style !== 'minimal') {
        var box = document.createElement('div');
        box.className = 'season-deco';
        box.setAttribute('aria-hidden', 'true');
        var out = '';
        (preset.corners || []).forEach(function (kind, i) {
          if (!kind || !DECO[kind]) return;
          var top = kind === 'sun';
          out += '<div class="sd ' + (top ? 'sd-top' : i === 0 ? 'sd-l' : 'sd-r') + '">' + svg(DECO[kind](i === 0 ? 1 : 2), !top && i === 1 && MIRROR[kind]) + '</div>';
        });
        if (preset.band === 'waves') out += '<div class="sd-band">' + waveBand() + '</div>';
        box.innerHTML = out;
        hero.insertBefore(box, hero.firstChild);
      }
    }

    /* ---------- Animation ---------- */
    if (layers.anim && ANIMS.indexOf(anim) > -1) startParticles(anim);

  }

  /* =================================================================== */
  function assign(t, s) { for (var k in s) t[k] = s[k]; return t; }
  function svg(inner, mirror) {
    return '<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">' + (mirror ? '<g transform="translate(220 0) scale(-1 1)">' + inner + '</g>' : inner) + '</svg>';
  }
  // Seeded random so drawings are identical on every visit
  function rng(seed) { var s = seed * 9301 + 49297; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function curve(p0, p1, p2, n) {
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
      var x = a * p0[0] + b * p1[0] + c * p2[0], y = a * p0[1] + b * p1[1] + c * p2[1];
      var dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
      pts.push({ x: x, y: y, a: Math.atan2(dy, dx) * 180 / Math.PI, t: t });
    }
    return pts;
  }
  function stem(p0, p1, p2, col, w) { return '<path d="M' + p0 + 'Q' + p1 + ' ' + p2 + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>'; }
  function leaf(x, y, ang, len, wid, fill, op) {
    return '<path d="M0 0Q' + (len * .45) + ' ' + (-wid) + ' ' + len + ' 0Q' + (len * .45) + ' ' + wid + ' 0 0z" fill="' + fill + '"' + (op ? ' opacity="' + op + '"' : '') + ' transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')"/>';
  }
  function leafy(paths, opts) {
    var r = rng(opts.seed || 3), out = '';
    paths.forEach(function (P, pi) {
      out += stem(P[0], P[1], P[2], opts.stem, pi ? 2.2 : 3);
      curve(P[0], P[1], P[2], opts.n || 12).forEach(function (pt, i) {
        if (pt.t < .06) return;
        var size = (opts.len || 24) * (1 - pt.t * .45) * (pi ? .8 : 1);
        [-1, 1].forEach(function (side) {
          if (opts.alternate && (i + (side > 0 ? 1 : 0)) % 2) return;
          var col = opts.colors[Math.floor(r() * opts.colors.length)];
          out += leaf(pt.x, pt.y, pt.a + side * (opts.spread || 48) + (r() - .5) * 14, size, size * (opts.ratio || .28), col);
        });
      });
      if (opts.tip) out += leaf(P[2][0], P[2][1], curve(P[0], P[1], P[2], 1)[1].a, (opts.len || 24) * .6, (opts.len || 24) * .17, opts.colors[0]);
    });
    return out;
  }
  var MAIN = [[[6, 214], [30, 110], [176, 52]], [[40, 214], [96, 160], [200, 150]]];
  function flower(x, y, r, petal, center) {
    var out = '';
    for (var i = 0; i < 5; i++) { var a = i * 72 * Math.PI / 180; out += '<circle cx="' + (x + Math.cos(a) * r).toFixed(1) + '" cy="' + (y + Math.sin(a) * r).toFixed(1) + '" r="' + (r * .78).toFixed(1) + '" fill="' + petal + '"/>'; }
    return out + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * .55).toFixed(1) + '" fill="' + center + '"/>';
  }
  function egg(x, y, s, rot) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"><ellipse rx="' + (s * .72) + '" ry="' + s + '" fill="#b3211f"/><ellipse cx="' + (-s * .25) + '" cy="' + (-s * .35) + '" rx="' + (s * .16) + '" ry="' + (s * .28) + '" fill="#fff" opacity=".35"/></g>'; }
  function star4(x, y, s, col, op) { return '<path d="M' + x + ' ' + (y - s) + 'Q' + (x + s * .18) + ' ' + (y - s * .18) + ' ' + (x + s) + ' ' + y + 'Q' + (x + s * .18) + ' ' + (y + s * .18) + ' ' + x + ' ' + (y + s) + 'Q' + (x - s * .18) + ' ' + (y + s * .18) + ' ' + (x - s) + ' ' + y + 'Q' + (x - s * .18) + ' ' + (y - s * .18) + ' ' + x + ' ' + (y - s) + 'z" fill="' + col + '" opacity="' + (op || 1) + '"/>'; }
  function heart(x, y, s, col, rot) { return '<path transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + s + ')" d="M0 3C-1-3-10-2-10 4c0 5 7 8 10 11 3-3 10-6 10-11 0-6-9-7-10-1z" fill="' + col + '"/>'; }
  function snowflake(x, y, s, op) {
    var o = '<g transform="translate(' + x + ' ' + y + ')" stroke="#fff" stroke-width="' + (s > 20 ? 2 : 1.5) + '" stroke-linecap="round" opacity="' + op + '">';
    for (var i = 0; i < 6; i++) o += '<g transform="rotate(' + i * 60 + ')"><path d="M0 0V' + (-s) + 'M0 ' + (-s * .55) + 'l' + (s * .22) + ' ' + (-s * .2) + 'M0 ' + (-s * .55) + 'l' + (-s * .22) + ' ' + (-s * .2) + '"/></g>';
    return o + '</g>';
  }
  function flagGR(x, y, w) {
    var h = w * 2 / 3, sh = h / 9, o = '<g transform="translate(' + x + ' ' + y + ') skewY(-5)"><rect width="' + w + '" height="' + h + '" fill="#fff"/>';
    for (var i = 0; i < 9; i += 2) o += '<rect y="' + (i * sh).toFixed(2) + '" width="' + w + '" height="' + sh.toFixed(2) + '" fill="#0d5eaf"/>';
    var c = sh * 5;
    return o + '<rect width="' + c.toFixed(2) + '" height="' + c.toFixed(2) + '" fill="#0d5eaf"/><rect x="' + (c / 2 - sh / 2).toFixed(2) + '" width="' + sh.toFixed(2) + '" height="' + c.toFixed(2) + '" fill="#fff"/><rect y="' + (c / 2 - sh / 2).toFixed(2) + '" width="' + c.toFixed(2) + '" height="' + sh.toFixed(2) + '" fill="#fff"/></g>';
  }
  function flagUS(x, y, w) {
    var h = w * .526, sh = h / 13, o = '<g transform="translate(' + x + ' ' + y + ') skewY(-5)"><rect width="' + w + '" height="' + h + '" fill="#fff"/>';
    for (var i = 0; i < 13; i += 2) o += '<rect y="' + (i * sh).toFixed(2) + '" width="' + w + '" height="' + sh.toFixed(2) + '" fill="#b22234"/>';
    var cw = w * .4, ch = sh * 7;
    o += '<rect width="' + cw.toFixed(2) + '" height="' + ch.toFixed(2) + '" fill="#3c3b6e"/>';
    for (var r = 0; r < 4; r++) for (var c = 0; c < 5; c++) o += '<circle cx="' + ((c + .5 + (r % 2) * .25) * cw / 5.3).toFixed(2) + '" cy="' + ((r + .6) * ch / 4.4).toFixed(2) + '" r="' + (w / 110).toFixed(2) + '" fill="#fff"/>';
    return o + '</g>';
  }
  function pole(x, y1, y2) { return '<path d="M' + x + ' ' + y2 + 'V' + y1 + '" stroke="#d9dde2" stroke-width="3" stroke-linecap="round"/><circle cx="' + x + '" cy="' + (y1 - 4) + '" r="4.5" fill="' + GOLD + '"/>'; }

  var MIRROR = { fir: 1, laurel: 1, 'laurel-gold': 1, autumn: 1, blossom: 1, 'blossom-eggs': 1, palm: 1, lily: 1, wheat: 1, snowflakes: 1, stars: 1, hearts: 1, books: 1, cap: 1, pumpkins: 1 };
  var DECO = {
    laurel: function (s) { return leafy(MAIN, { seed: s, colors: ['#6b8a3a', '#5a7a2e', '#7f9a46'], stem: '#5a6e2c', len: 26, ratio: .3, spread: 42, tip: 1 }) + '<circle cx="70" cy="120" r="3.4" fill="#33402a"/><circle cx="120" cy="88" r="3" fill="#33402a"/>'; },
    'laurel-gold': function (s) { return leafy(MAIN, { seed: s, colors: [GOLD, '#b38c1c', '#ddbd52'], stem: '#a88518', len: 26, ratio: .3, spread: 42, tip: 1 }) + '<path d="M28 196h18M37 187v18" stroke="' + GOLD + '" stroke-width="5" stroke-linecap="round"/>'; },
    fir: function (s) {
      var r = rng(s), o = '';
      MAIN.forEach(function (P, pi) {
        o += stem(P[0], P[1], P[2], '#4a3a26', pi ? 2.5 : 3.5);
        curve(P[0], P[1], P[2], 30).forEach(function (pt) {
          if (pt.t < .05) return;
          [-1, 1].forEach(function (side) {
            var a = (pt.a + side * 58) * Math.PI / 180, L = (pi ? 13 : 17) * (1 - pt.t * .35);
            o += '<path d="M' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + 'l' + (Math.cos(a) * L).toFixed(1) + ' ' + (Math.sin(a) * L).toFixed(1) + '" stroke="' + (r() > .5 ? '#2f5d3a' : '#3d7048') + '" stroke-width="2.4" stroke-linecap="round"/>';
          });
        });
      });
      [[64, 128, '#a8232c', 9], [118, 96, GOLD, 8], [150, 166, '#a8232c', 8], [96, 170, '#e9eef4', 7]].forEach(function (b) {
        o += '<path d="M' + b[0] + ' ' + (b[1] - 16) + 'V' + (b[1] - b[3]) + '" stroke="#c9a227" stroke-width="1"/><circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[3] + '" fill="' + b[2] + '"/><circle cx="' + (b[0] - b[3] * .35) + '" cy="' + (b[1] - b[3] * .35) + '" r="' + (b[3] * .28) + '" fill="#fff" opacity=".45"/>';
      });
      return o;
    },
    autumn: function (s) {
      var o = leafy(MAIN, { seed: s, colors: ['#c0702b', '#a8501c', '#d49a2a', '#8f3b1b'], stem: '#6b3b1a', len: 28, ratio: .42, spread: 52, alternate: 1 });
      var r = rng(s + 7);
      for (var i = 0; i < 3; i++) o += leaf(120 + r() * 80, 120 + r() * 80, r() * 360, 18, 8, ['#c0702b', '#d49a2a'][i % 2], .9);
      return o;
    },
    blossom: function (s) {
      var o = leafy(MAIN, { seed: s, colors: ['#6f9a4a', '#5d8a3c'], stem: '#5b4632', len: 18, ratio: .32, spread: 50, alternate: 1, n: 9 });
      [[70, 118, 6], [128, 86, 7], [170, 60, 5], [110, 168, 6], [160, 150, 5]].forEach(function (f, i) { o += flower(f[0], f[1], f[2], i % 2 ? '#ffffff' : '#f6c9d3', '#e8b33a'); });
      return o;
    },
    'blossom-eggs': function (s) { return DECO.blossom(s) + egg(40, 192, 13, -14) + egg(66, 198, 12, 10) + egg(92, 196, 11, -4); },
    palm: function (s) {
      var o = '';
      [[[10, 214], [40, 120], [150, 40]], [[30, 214], [110, 170], [212, 130]]].forEach(function (P, pi) {
        o += stem(P[0], P[1], P[2], '#55712f', 2.5);
        curve(P[0], P[1], P[2], 22).forEach(function (pt) {
          if (pt.t < .08) return;
          var L = (pi ? 30 : 38) * (1 - pt.t * .55);
          [-1, 1].forEach(function (side) { o += leaf(pt.x, pt.y, pt.a + side * 62, L, 2.6, pt.t > .5 ? '#6d8f3a' : '#5e7f34'); });
        });
      });
      return o;
    },
    lily: function (s) {
      var o = stem([20, 214], [44, 150], [96, 70], '#4f7a3a', 3) + stem([56, 214], [90, 170], [160, 120], '#4f7a3a', 2.5);
      o += leaf(28, 200, -70, 54, 7, '#5d8a46') + leaf(60, 206, -40, 46, 6, '#6c9a52');
      [[96, 70, -30], [160, 120, 10], [70, 130, -60]].forEach(function (f, i) {
        o += '<g transform="translate(' + f[0] + ' ' + f[1] + ') rotate(' + f[2] + ') scale(' + (i === 2 ? .7 : 1) + ')">' +
          '<path d="M0 0C-4-14-16-22-22-30C-10-30 0-22 0-12C0-22 10-30 22-30C16-22 4-14 0 0z" fill="#fbf8f0" stroke="#e2d6b8" stroke-width="1"/>' +
          '<path d="M0 0C-2-18 0-30 0-38C3-30 4-18 0 0z" fill="#fffdf7" stroke="#e2d6b8" stroke-width="1"/>' +
          '<circle cx="-5" cy="-32" r="1.8" fill="#d9a521"/><circle cx="5" cy="-33" r="1.8" fill="#d9a521"/></g>';
      });
      return o;
    },
    wheat: function (s) {
      var o = '';
      [[[30, 214], [50, 130], [100, 50]], [[50, 214], [90, 140], [150, 80]], [[70, 214], [120, 170], [190, 130]]].forEach(function (P) {
        o += stem(P[0], P[1], P[2], '#b98a3a', 2);
        curve(P[0], P[1], P[2], 16).forEach(function (pt) {
          if (pt.t < .68) return;
          [-1, 1].forEach(function (side) { o += leaf(pt.x, pt.y, pt.a + side * 32 + 180, 10, 3.4, '#cf9f45'); });
        });
      });
      return o + leaf(40, 196, -40, 26, 10, '#c0702b') + leaf(60, 204, -10, 22, 9, '#a8501c');
    },
    snowflakes: function () { return snowflake(60, 150, 30, .9) + snowflake(130, 90, 18, .75) + snowflake(150, 175, 13, .7) + snowflake(30, 70, 10, .6); },
    stars: function () { return star4(60, 140, 26, '#f3d77a') + star4(122, 92, 14, '#ffffff', .9) + star4(150, 160, 10, '#f3d77a', .9) + star4(36, 70, 8, '#ffffff', .8) + star4(100, 190, 7, '#f3d77a', .8); },
    hearts: function () { return heart(60, 150, 2, '#c9576e', -12) + heart(120, 110, 1.3, '#e8a0ae', 10) + heart(150, 170, 1, '#c9576e', -4) + heart(40, 86, .8, '#f3c5cf', 6); },
    letters: function (s) {
      var set = s === 1 ? [['Α', 70, 170, 96, -8], ['β', 140, 110, 52, 6], ['Γ', 40, 80, 40, -4], ['ω', 170, 180, 34, 4]] : [['Ω', 70, 170, 90, 6], ['α', 150, 110, 54, -6], ['Δ', 36, 84, 40, 4], ['λ', 175, 182, 36, -4]];
      return set.map(function (l) { return '<text x="' + l[1] + '" y="' + l[2] + '" font-family="Libre Baskerville, Georgia, serif" font-size="' + l[3] + '" fill="#ffffff" opacity=".42" text-anchor="middle" transform="rotate(' + l[4] + ' ' + l[1] + ' ' + l[2] + ')">' + l[0] + '</text>'; }).join('');
    },
    books: function () {
      return '<g transform="translate(26 120)"><rect x="0" y="62" width="120" height="22" rx="3" fill="#1d3f7a"/><rect x="6" y="66" width="108" height="2" fill="' + GOLD + '"/>' +
        '<rect x="10" y="38" width="104" height="24" rx="3" fill="#86232a"/><rect x="16" y="43" width="92" height="2" fill="#f3d77a"/>' +
        '<rect x="4" y="16" width="110" height="22" rx="3" fill="' + GOLD + '"/><rect x="10" y="21" width="98" height="2" fill="#142d58"/>' +
        '<g transform="translate(132 -6) rotate(24)"><rect width="10" height="74" fill="#f3d77a"/><path d="M0 74l5 14 5-14z" fill="#e8c9a0"/><path d="M3.6 84l1.4 4 1.4-4z" fill="#333"/><rect width="10" height="8" fill="#c9576e"/></g></g>';
    },
    cap: function () {
      return '<g transform="translate(20 100)"><path d="M70 10L140 38 70 66 0 38z" fill="#142d58"/><path d="M30 52v28c0 10 80 10 80 0V52L70 66z" fill="#1d3f7a"/>' +
        '<path d="M70 38L118 50V86" fill="none" stroke="' + GOLD + '" stroke-width="2.5"/><path d="M114 86h8l-1 18h-6z" fill="' + GOLD + '"/></g>' +
        '<g transform="translate(110 168) rotate(-12)"><rect width="84" height="20" rx="10" fill="#fbf6e6"/><rect x="36" width="10" height="20" fill="#86232a"/></g>';
    },
    pumpkins: function () {
      function pk(x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cx="-14" rx="16" ry="20" fill="#d9772b"/><ellipse cx="14" rx="16" ry="20" fill="#d9772b"/><ellipse rx="16" ry="21" fill="#e88a3a"/><path d="M0-19c0-6 2-10 6-12" stroke="#5b6b2a" stroke-width="4" stroke-linecap="round" fill="none"/></g>'; }
      return pk(62, 186, 1.4) + pk(128, 196, .95) + leaf(150, 186, -30, 26, 10, '#a8501c') + leaf(30, 190, -150, 22, 9, '#d49a2a');
    },
    'flag-gr': function (s) { return pole(s === 1 ? 50 : 112, 60, 214) + flagGR(s === 1 ? 52 : 114, 62, 92); },
    'flag-us': function (s) { return pole(s === 1 ? 50 : 112, 64, 214) + flagUS(s === 1 ? 52 : 114, 66, 96); },
    sun: function () {
      var o = '<circle cx="110" cy="110" r="40" fill="#f6d36b" opacity=".55"/><circle cx="110" cy="110" r="28" fill="#fbe39a" opacity=".8"/>';
      for (var i = 0; i < 12; i++) { var a = i * 30 * Math.PI / 180; o += '<path d="M' + (110 + Math.cos(a) * 52).toFixed(1) + ' ' + (110 + Math.sin(a) * 52).toFixed(1) + 'L' + (110 + Math.cos(a) * 72).toFixed(1) + ' ' + (110 + Math.sin(a) * 72).toFixed(1) + '" stroke="#fbe39a" stroke-width="3" stroke-linecap="round" opacity=".7"/>'; }
      return o;
    }
  };
  function waveBand() {
    var p = '';
    [[0, '#ffffff', .55], [9, '#bfe0f5', .5], [18, '#ffffff', .35]].forEach(function (w) {
      var d = 'M0 ' + (20 + w[0]);
      for (var x = 0; x < 1200; x += 60) d += 'q15 -9 30 0t30 0';
      p += '<path d="' + d + '" fill="none" stroke="' + w[1] + '" stroke-width="2.5" opacity="' + w[2] + '"/>';
    });
    return '<svg viewBox="0 0 1200 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' + p + '</svg>';
  }
  function icon(k) {
    var I = {
      snowflake: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
      leaf: '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z M5 19l8-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
      flower: '<g fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="7" r="3.2"/><circle cx="16.8" cy="10.5" r="3.2"/><circle cx="15" cy="16" r="3.2"/><circle cx="9" cy="16" r="3.2"/><circle cx="7.2" cy="10.5" r="3.2"/></g>',
      sun: '<circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
      star: '<path d="M12 2l2.4 7.6H22l-6.2 4.6 2.4 7.6L12 17.2 5.8 21.8l2.4-7.6L2 9.6h7.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
      wave: '<path d="M2 9c3-3 5 3 8 0s5 3 8 0 4-1 4-1M2 15c3-3 5 3 8 0s5 3 8 0 4-1 4-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
      alpha: '<text x="12" y="17" text-anchor="middle" font-family="Libre Baskerville, Georgia, serif" font-size="15" fill="currentColor">Αα</text>',
      heart: '<path d="M12 20s-7-4.4-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5C19 15.6 12 20 12 20z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
      'flag-gr': '<rect x="2" y="5" width="20" height="14" fill="#fff"/><path d="M2 5h20v1.6H2zm0 3.1h20v1.6H2zm0 3.1h20v1.6H2zm0 3.1h20v1.6H2zm0 3.1h20V19H2z" fill="#0d5eaf"/><rect x="2" y="5" width="8.6" height="7.8" fill="#0d5eaf"/><path d="M6.3 5v7.8M2 8.9h8.6" stroke="#fff" stroke-width="1.6"/>',
      'flag-us': '<rect x="2" y="5" width="20" height="14" fill="#fff"/><path d="M2 5h20v2H2zm0 4h20v2H2zm0 4h20v2H2zm0 4h20v2H2z" fill="#b22234"/><rect x="2" y="5" width="9" height="8" fill="#3c3b6e"/>',
      lily: '<path d="M12 21V11M12 11C10 7 7 5 5 4c3 0 6 2 7 5 1-3 4-5 7-5-2 1-5 3-7 7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
      palm: '<path d="M6 21C9 14 13 8 20 4M10 14l-5-1M12 11l-5-3M15 8l-4-4M13 13l5 1M15 10l5-1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
      egg: '<path d="M12 3c3.9 0 7 6 7 10a7 7 0 0 1-14 0c0-4 3.1-10 7-10z" fill="#c62f2a" stroke="currentColor" stroke-width="1.2"/>',
      cross: '<path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
      cap: '<path d="M12 5l10 4-10 4L2 9zM6 11v4c0 2 12 2 12 0v-4M19 10v6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
      book: '<path d="M4 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H4zM20 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (I[k] || I.star) + '</svg>';
  }

  /* ---------- Preview panel (only with ?season=… in the address) ---------- */
  function buildPreviewPanel() {
    function sel(name, options, current) {
      return '<label>' + name[1] + '<select data-p="' + name[0] + '">' + options.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === current ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>';
    }
    var themeOpts = Object.keys(PRESETS).map(function (k) { return [k, PRESETS[k].label]; });
    var animOpts = [['', 'Default for this occasion'], ['none', 'No animation']].concat(ANIMS.map(function (a) { return [a, a === 'water' ? 'Water droplets' : a.charAt(0).toUpperCase() + a.slice(1)]; }));
    var panel = document.createElement('div');
    panel.className = 'season-preview';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Seasonal theme preview');
    panel.innerHTML = '<p><b>Preview</b> — only you see this. Nothing is published.</p>' +
      sel(['season', 'Occasion'], themeOpts, q.season || theme) +
      sel(['anim', 'Animation'], animOpts, q.anim || '') +
      sel(['intensity', 'Intensity'], [['light', 'Light'], ['medium', 'Medium'], ['strong', 'Strong']], intensity) +
      sel(['show', 'Show'], [['all', 'Everything'], ['theme_decorations', 'Colours + decorations'], ['theme', 'Colours only'], ['decorations', 'Decorations only'], ['animation', 'Animation only']], show) +
      sel(['deco', 'Decorations'], [['classic', 'Classic'], ['minimal', 'Minimal']], style) +
      '<a href="' + location.pathname + '">Exit preview</a>';
    panel.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-p'); if (!k) return;
      if (e.target.value) q[k] = e.target.value; else delete q[k];
      location.search = Object.keys(q).map(function (k) { return k + '=' + encodeURIComponent(q[k]); }).join('&');
    });
    document.body.appendChild(panel);
  }

  /* ---------- Particles ---------- */
  function startParticles(kind) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce && reduce.matches) return;
    var canvas = document.getElementById('season-canvas');
    var toggle = document.querySelector('.season-toggle');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var level = { light: 1, medium: 1.8, strong: 2.8 }[intensity] || 1;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W, H, parts = [], running = false, paused = false, raf = 0, last = 0;
    try { paused = localStorage.getItem('season-paused') === '1'; } catch (e) {}
    var palette = {
      snow: ['rgba(255,255,255,0.95)', 'rgba(240,246,252,0.85)'],
      leaves: ['#c0702b', '#a8501c', '#d49a2a', '#8f3b1b', '#b8862b'],
      petals: ['#f7d6dc', '#fbe9ec', '#ffffff', '#f3c5cf'],
      confetti: preset.confetti || [GOLD, '#ffffff', '#2a6aa0'],
      sparkles: ['#f3d77a', '#ffffff', '#e9c65a'],
      hearts: ['#c9576e', '#e8a0ae', '#f3c5cf'],
      sunlight: ['rgba(255,236,170,0.9)', 'rgba(255,255,255,0.85)'],
      water: ['rgba(255,255,255,0.9)', 'rgba(191,224,245,0.9)']
    }[kind];
    var base = { snow: 28, leaves: 12, petals: 14, confetti: 22, sparkles: 18, hearts: 9, sunlight: 16, water: 16 }[kind];
    var rises = kind === 'sunlight' || kind === 'water';
    function count() { return Math.max(5, Math.round(base * level * (0.45 + 0.55 * Math.min(1, (W * H) / (1440 * 900))))); }
    function make(anywhere) {
      var r = Math.random;
      var size = kind === 'snow' ? 1.2 + r() * 2.6 : kind === 'sparkles' ? 2 + r() * 4 : kind === 'sunlight' ? 2 + r() * 5 : kind === 'water' ? 2 + r() * 3.5 : kind === 'confetti' ? 3 + r() * 3 : 7 + r() * 7;
      var speed = kind === 'snow' ? 18 + size * 9 + r() * 12 : kind === 'sparkles' ? 6 + r() * 8 : rises ? 10 + r() * 14 : kind === 'confetti' ? 34 + r() * 26 : 26 + r() * 22;
      return { x: r() * W, y: anywhere ? r() * H : rises ? H + 20 + r() * 40 : -20 - r() * 60, r: size, vy: rises ? -speed : speed,
        sway: kind === 'sparkles' ? 4 : 10 + r() * 22, phase: r() * 6.28, spin: (r() - .5) * 2, rot: r() * 6.28,
        c: palette[(r() * palette.length) | 0], a: kind === 'snow' ? .5 + r() * .45 : .55 + r() * .35, tw: r() * 6.28 };
    }
    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = count();
      while (parts.length < n) parts.push(make(true));
      parts.length = n;
    }
    function draw(p, x) {
      if (kind === 'snow' || kind === 'sunlight') { ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, 6.283); ctx.fill(); return; }
      if (kind === 'water') { ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, 6.283); ctx.lineWidth = 1.2; ctx.strokeStyle = p.c; ctx.stroke(); return; }
      ctx.save(); ctx.translate(x, p.y); ctx.rotate(p.rot + Math.sin(p.phase) * .6);
      var s = p.r;
      ctx.beginPath();
      if (kind === 'leaves') { ctx.moveTo(0, -s); ctx.quadraticCurveTo(s * .8, -s * .2, 0, s); ctx.quadraticCurveTo(-s * .8, -s * .2, 0, -s); }
      else if (kind === 'petals') ctx.ellipse(0, 0, s * .45, s * .8, 0, 0, 6.283);
      else if (kind === 'confetti') { ctx.rect(-s, -s * .45, s * 2, s * .9); }
      else if (kind === 'sparkles') { ctx.moveTo(0, -s); ctx.quadraticCurveTo(s * .15, -s * .15, s, 0); ctx.quadraticCurveTo(s * .15, s * .15, 0, s); ctx.quadraticCurveTo(-s * .15, s * .15, -s, 0); ctx.quadraticCurveTo(-s * .15, -s * .15, 0, -s); }
      else if (kind === 'hearts') { var k = s / 10; ctx.moveTo(0, 3 * k); ctx.bezierCurveTo(-1 * k, -3 * k, -10 * k, -2 * k, -10 * k, 4 * k); ctx.bezierCurveTo(-10 * k, 9 * k, -3 * k, 12 * k, 0, 15 * k); ctx.bezierCurveTo(3 * k, 12 * k, 10 * k, 9 * k, 10 * k, 4 * k); ctx.bezierCurveTo(10 * k, -2 * k, 1 * k, -3 * k, 0, 3 * k); }
      ctx.fill(); ctx.restore();
    }
    function frame(t) {
      if (!running) return;
      var dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y += p.vy * dt; p.phase += dt * (kind === 'snow' ? .8 : 1.2); p.rot += p.spin * dt; p.tw += dt * 2.2;
        var x = p.x + Math.sin(p.phase) * p.sway;
        if (p.y > H + 24 || p.y < -60) { parts[i] = make(false); continue; }
        ctx.globalAlpha = kind === 'sparkles' ? p.a * (.35 + .65 * Math.abs(Math.sin(p.tw))) : p.a;
        ctx.fillStyle = p.c;
        draw(p, x);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    function start() { if (running || paused || document.hidden) return; running = true; last = 0; canvas.hidden = false; raf = requestAnimationFrame(frame); }
    function stop(clear) { running = false; cancelAnimationFrame(raf); if (clear) { ctx.clearRect(0, 0, W, H); canvas.hidden = true; } }
    function syncToggle() {
      toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
      toggle.querySelector('span').textContent = paused ? 'Play animation' : 'Pause animation';
      toggle.querySelector('svg').innerHTML = paused ? '<path d="M7 5l12 7-12 7z"/>' : '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
    }
    resize();
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 150); }, { passive: true });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop(false) : start(); });
    if (reduce && reduce.addEventListener) reduce.addEventListener('change', function (e) { if (e.matches) { paused = true; stop(true); if (toggle) syncToggle(); } });
    if (toggle) {
      toggle.classList.add('show'); syncToggle();
      toggle.addEventListener('click', function () {
        paused = !paused;
        try { localStorage.setItem('season-paused', paused ? '1' : '0'); } catch (e) {}
        paused ? stop(true) : start();
        syncToggle();
      });
    }
    start();
  }
  run();
})();
