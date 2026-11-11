/* St. George Greek School — interactive calendar (no dependencies)
 *
 * One source of truth: the same data as the academic calendar list, from _data/
 *   class_schedule.yml  regular classes (weekdays between a start and an end date)
 *   closures.yml        no-class days (override regular classes) and extra classes
 *   deadlines.yml       deadlines
 *   events.yml          programs, feasts, celebrations and other events
 *
 * Dates are calendar dates ("YYYY-MM-DD") for Schererville, Indiana (America/Chicago).
 * They are turned into whole day numbers with Date.UTC and never into local times, so a
 * date can't move to another day because of the visitor's time zone or daylight saving.
 * Times ("6:00 pm") are shown exactly as written.
 */
(function () {
  'use strict';
  var root = document.getElementById('panel-interactive');
  var dataEl = document.getElementById('calendar-data');
  if (!root || !dataEl) return;
  var data = {};
  try { data = JSON.parse(dataEl.textContent) || {}; } catch (e) { return; }

  /* ---------- Dates as day numbers ---------- */
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function dayNum(y, m, d) { return Math.floor(Date.UTC(y, m - 1, d) / 864e5); }
  function parse(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s == null ? '' : s));
    return m ? dayNum(+m[1], +m[2], +m[3]) : null;
  }
  function parts(n) { var t = new Date(n * 864e5); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), w: t.getUTCDay() }; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(n) { var p = parts(n); return p.y + '-' + pad(p.m) + '-' + pad(p.d); }
  function longDate(n) { var p = parts(n); return DAYS[p.w] + ', ' + MONTHS[p.m - 1] + ' ' + p.d + ', ' + p.y; }
  function shortDate(n) { var p = parts(n); return MONTHS[p.m - 1].slice(0, 3) + ' ' + p.d; }
  function daysInMonth(y, m) { return dayNum(m === 12 ? y + 1 : y, m === 12 ? 1 : m + 1, 1) - dayNum(y, m, 1); }
  var TODAY = parse(window.GS && window.GS.today) || parse(new Date().toISOString());

  /* ---------- Categories: colour + shape + words, never colour alone ---------- */
  var CATS = {
    'class':      { label: 'Class', rank: 13 },
    extra:        { label: 'Extra class', rank: 9 },
    closure:      { label: 'No class', rank: 0 },
    holiday:      { label: 'Holiday', rank: 1 },
    deadline:     { label: 'Deadline', rank: 2 },
    registration: { label: 'Registration', rank: 2 },
    national:     { label: 'Greek national day', rank: 3 },
    feast:        { label: 'Church feast', rank: 4 },
    program:      { label: 'Special program', rank: 5 },
    classes:      { label: 'Start / end of classes', rank: 6 },
    meeting:      { label: 'Parent meeting', rank: 7 },
    event:        { label: 'Event', rank: 8 },
    fundraiser:   { label: 'Fundraiser', rank: 10 },
    trip:         { label: 'Field trip', rank: 11 }
  };
  var SHAPES = {
    'class': '<circle cx="6" cy="6" r="4.5"/>',
    classes: '<circle cx="6" cy="6" r="4.5"/>',
    extra: '<circle cx="6" cy="6" r="3.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 3.8v4.4M3.8 6h4.4" stroke="currentColor" stroke-width="1.4"/>',
    closure: '<circle cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 9L9 3" stroke="currentColor" stroke-width="1.6"/>',
    holiday: '<rect x="1.8" y="1.8" width="8.4" height="8.4" rx="1"/>',
    deadline: '<path d="M6 1.2L11 10.5H1z"/>',
    registration: '<path d="M6 1.2L11 10.5H1z"/>',
    national: '<rect x="1" y="2" width="10" height="8" rx=".8" fill="#0d5eaf"/><path d="M1 4.4h10M1 7.4h10" stroke="#fff" stroke-width="1.1"/>',
    feast: '<path d="M4.6 1h2.8v3.6H11v2.8H7.4V11H4.6V7.4H1V4.6h3.6z"/>',
    program: '<path d="M6 .8l1.6 3.4 3.7.4-2.8 2.5.8 3.6L6 8.9 2.7 10.7l.8-3.6L.7 4.6l3.7-.4z"/>',
    meeting: '<path d="M6 1l5 5-5 5-5-5z"/>',
    event: '<path d="M6 1l5 5-5 5-5-5z"/>',
    fundraiser: '<path d="M3 1.5h6l2.5 4.5L9 10.5H3L.5 6z"/>',
    trip: '<path d="M1.5 2l4.5 4-4.5 4h3l4.5-4-4.5-4z"/>'
  };
  function glyph(cat) { return '<svg class="g" viewBox="0 0 12 12" aria-hidden="true" focusable="false" fill="currentColor">' + (SHAPES[cat] || SHAPES.event) + '</svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function val(s) { return s == null ? '' : String(s).trim(); }
  function timeText(a, b) { a = val(a); b = val(b); return a && b ? a + ' – ' + b : a; }

  /* ---------- Build one index: day number → items ---------- */
  var byDay = {};
  var upcomingPool = [];
  function add(n, item) { (byDay[n] = byDay[n] || []).push(item); }
  var WD = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
  var schedules = (data.schedules || []).map(function (s) {
    var days = (Array.isArray(s.weekdays) ? s.weekdays : [s.weekdays]).map(function (w) { return WD[String(w || '').toLowerCase()]; }).filter(function (w) { return w != null; });
    return { name: val(s.name) || 'Greek School', days: days, start: parse(s.start), end: parse(s.end), time: timeText(s.start_time, s.end_time), location: val(s.location), note: val(s.note) };
  }).filter(function (s) { return s.start != null && s.end != null && s.end >= s.start && s.days.length; });
  function isClassDay(n) { var w = parts(n).w; return schedules.some(function (s) { return n >= s.start && n <= s.end && s.days.indexOf(w) > -1; }); }

  // Closures and extra classes
  var cancelled = {};
  (data.closures || []).forEach(function (c) {
    var a = parse(c.date); if (a == null || !val(c.title) && !val(c.type)) return;
    var b = parse(c.end_date); if (b == null || b < a) b = a;
    var type = val(c.type) || 'no_class';
    var base = { title: val(c.title) || 'No class', desc: val(c.note), dateLabel: val(c.date_label), start: a, end: b, upcoming: !c.hide_from_upcoming };
    if (type === 'extra_class') {
      var sch = schedules[0] || {};
      for (var n = a; n <= b; n++) add(n, assign({ cat: 'extra', time: timeText(c.start_time, c.end_time) || sch.time || '', location: val(c.location) || sch.location || '' }, base));
      upcomingPool.push(assign({ cat: 'extra' }, base));
      return;
    }
    var cat = type === 'holiday' ? 'holiday' : 'closure';
    var label = type === 'holiday' ? 'Holiday · no class' : type === 'weather' ? 'School closed' : type === 'break' ? 'Break · no class' : 'No class';
    var days = [];
    for (var d = a; d <= b; d++) if (isClassDay(d)) days.push(d);
    if (!days.length) for (var e = a; e <= b; e++) days.push(e);
    days.forEach(function (d) { cancelled[d] = true; add(d, assign({ cat: cat, label: label }, base)); });
    upcomingPool.push(assign({ cat: cat, label: label }, base));
  });

  // Regular classes (skipped on cancelled days)
  schedules.forEach(function (s) {
    for (var n = s.start; n <= s.end; n++) {
      if (s.days.indexOf(parts(n).w) < 0 || cancelled[n]) continue;
      add(n, { cat: 'class', title: s.name, time: s.time, location: s.location, desc: s.note, start: n, end: n });
    }
  });

  // Deadlines
  (data.deadlines || []).forEach(function (d) {
    var n = parse(d.date); if (n == null || !val(d.title)) return;
    var cat = d.kind === 'registration' ? 'registration' : 'deadline';
    var item = { cat: cat, title: val(d.title), time: val(d.time) ? 'Due by ' + val(d.time) : '', desc: val(d.description), link: val(d.link), attachment: val(d.attachment), start: n, end: n, upcoming: !d.hide_from_upcoming };
    add(n, item); upcomingPool.push(item);
  });

  // Events
  (data.events || []).forEach(function (ev) {
    var a = parse(ev.date); if (a == null || !val(ev.title)) return;
    var b = parse(ev.end_date); if (b == null || b < a) b = a;
    var cat = CATS[ev.category] ? ev.category : 'event';
    if (cat === 'closure') cat = 'holiday';
    var item = { cat: cat, title: val(ev.title), time: timeText(ev.start_time, ev.end_time), location: val(ev.location), desc: val(ev.description), link: val(ev.link), attachment: val(ev.attachment), dateLabel: val(ev.date_label), start: a, end: b, upcoming: !ev.hide_from_upcoming };
    for (var n = a; n <= b; n++) add(n, item);
    upcomingPool.push(item);
  });

  function assign(t, s) { for (var k in s) t[k] = s[k]; return t; }
  function rank(i) { return (CATS[i.cat] || CATS.event).rank; }
  Object.keys(byDay).forEach(function (k) { byDay[k].sort(function (a, b) { return rank(a) - rank(b); }); });
  function itemsOn(n) { return byDay[n] || []; }
  function catLabel(i) { return i.label || (CATS[i.cat] || CATS.event).label; }
  function dayLabel(n) {
    var its = itemsOn(n);
    return longDate(n) + (n === TODAY ? ', today' : '') + (its.length ? ': ' + its.map(function (i) { return catLabel(i) + ', ' + i.title + (i.time ? ', ' + i.time : ''); }).join('; ') : ': nothing scheduled');
  }

  /* ---------- State ---------- */
  var allDays = Object.keys(byDay).map(Number).sort(function (a, b) { return a - b; });
  var state = { view: 'month', cursor: TODAY, yearMode: schedules.length ? 'school' : 'calendar' };
  var dv = data.settings && data.settings.default_view;
  if (dv === 'week' || dv === 'year') state.view = dv;
  // If today is outside everything we know, open where the calendar actually has dates
  if (allDays.length && (TODAY < allDays[0] - 31 || TODAY > allDays[allDays.length - 1] + 31)) state.cursor = TODAY < allDays[0] ? allDays[0] : TODAY;

  /* ---------- Shell ---------- */
  root.innerHTML =
    '<div class="cal-toolbar">' +
      '<h3 class="cal-title" id="cal-title" aria-live="polite"></h3>' +
      '<div class="cal-controls">' +
        '<div class="seg" role="group" aria-label="Calendar view">' +
          '<button type="button" data-view="month">Month</button><button type="button" data-view="week">Week</button><button type="button" data-view="year">Year</button>' +
        '</div>' +
        '<div class="cal-nav">' +
          '<button type="button" class="nav-btn" data-step="-1"><span aria-hidden="true">‹</span><span class="sr-only nav-prev-label">Previous</span></button>' +
          '<button type="button" class="today-btn" data-today>Today</button>' +
          '<button type="button" class="nav-btn" data-step="1"><span aria-hidden="true">›</span><span class="sr-only nav-next-label">Next</span></button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="seg seg-small cal-yearmode" role="group" aria-label="Year to show" hidden>' +
      '<button type="button" data-ym="school">School year</button><button type="button" data-ym="calendar">Calendar year</button>' +
    '</div>' +
    '<div class="cal-body"></div>' +
    '<ul class="cal-legend" aria-label="Legend"></ul>';
  var titleEl = root.querySelector('.cal-title');
  var body = root.querySelector('.cal-body');

  // Legend: only categories that occur
  var present = {};
  allDays.forEach(function (n) { itemsOn(n).forEach(function (i) { present[i.cat] = true; }); });
  root.querySelector('.cal-legend').innerHTML = Object.keys(CATS).filter(function (c) { return present[c]; })
    .sort(function (a, b) { return CATS[a].rank === CATS[b].rank ? 0 : (a === 'class' ? -1 : b === 'class' ? 1 : CATS[a].rank - CATS[b].rank); })
    .map(function (c) { return '<li class="k-' + c + '">' + glyph(c) + CATS[c].label + '</li>'; }).join('');

  /* ---------- Shared pieces ---------- */
  function itemHtml(i, compact) {
    var meta = [i.time, i.location].filter(Boolean).join(' · ');
    var range = i.end > i.start ? (i.dateLabel || shortDate(i.start) + ' – ' + shortDate(i.end)) : '';
    var links = (i.attachment ? '<a href="' + esc(i.attachment) + '" target="_blank" rel="noopener">Details (PDF)</a>' : '') +
                (i.link ? '<a href="' + esc(i.link) + '" target="_blank" rel="noopener">More information</a>' : '');
    return '<li class="ev k-' + i.cat + '">' +
      '<span class="ev-cat">' + glyph(i.cat) + esc(catLabel(i)) + '</span>' +
      '<span class="ev-title">' + esc(i.title) + '</span>' +
      (meta ? '<span class="ev-meta">' + esc(meta) + '</span>' : '') +
      (range ? '<span class="ev-meta">' + esc(range) + '</span>' : '') +
      (!compact && i.desc ? '<span class="ev-desc">' + esc(i.desc) + '</span>' : '') +
      (!compact && links ? '<span class="ev-links">' + links + '</span>' : '') +
      '</li>';
  }

  /* ---------- Month ---------- */
  function renderMonth(focus) {
    var p = parts(state.cursor), first = dayNum(p.y, p.m, 1), len = daysInMonth(p.y, p.m);
    var lead = parts(first).w;
    titleEl.textContent = MONTHS[p.m - 1] + ' ' + p.y;
    var html = '<div class="cal-month"><table class="cal-grid" role="grid" aria-labelledby="cal-title"><thead><tr>' +
      DAYS.map(function (d) { return '<th scope="col" abbr="' + d + '"><span aria-hidden="true">' + d.slice(0, 3) + '</span><span class="sr-only">' + d + '</span></th>'; }).join('') +
      '</tr></thead><tbody>';
    var cells = Math.ceil((lead + len) / 7) * 7;
    for (var c = 0; c < cells; c++) {
      if (c % 7 === 0) html += '<tr>';
      var n = first - lead + c;
      if (n < first || n >= first + len) {
        html += '<td class="out" aria-hidden="true"><span class="dn">' + parts(n).d + '</span></td>';
      } else {
        var its = itemsOn(n), shown = its.slice(0, 4), more = its.length - Math.min(2, its.length);
        html += '<td role="gridcell" aria-selected="' + (n === state.cursor) + '"><button type="button" class="day' +
          (n === TODAY ? ' is-today' : '') + (n === state.cursor ? ' is-sel' : '') + (n < TODAY ? ' is-past' : '') +
          (its.length ? ' has k-' + its[0].cat : '') + '" data-n="' + n + '" tabindex="' + (n === state.cursor ? 0 : -1) +
          '" aria-label="' + esc(dayLabel(n)) + '"><span class="dn">' + parts(n).d + '</span><span class="marks">' +
          shown.map(function (i, x) { return '<span class="mk k-' + i.cat + (x > 1 ? ' mk-x' : '') + '">' + glyph(i.cat) + '<span class="mt">' + esc(i.cat === 'class' ? 'Class' : i.cat === 'closure' ? 'No class' : i.title) + '</span></span>'; }).join('') +
          (more > 0 ? '<span class="more-n">+' + more + ' more</span>' : '') +
          '</span></button></td>';
      }
      if (c % 7 === 6) html += '</tr>';
    }
    html += '</tbody></table><div class="cal-detail" aria-live="polite"></div></div>';
    body.innerHTML = html;
    renderDetail();
    if (focus) { var b = body.querySelector('.day[data-n="' + state.cursor + '"]'); if (b) b.focus(); }
  }
  function renderDetail() {
    var el = body.querySelector('.cal-detail'); if (!el) return;
    var its = itemsOn(state.cursor);
    el.innerHTML = '<h4>' + esc(longDate(state.cursor)) + (state.cursor === TODAY ? ' <span class="today-chip">Today</span>' : '') + '</h4>' +
      (its.length ? '<ul class="ev-list">' + its.map(function (i) { return itemHtml(i); }).join('') + '</ul>'
                  : '<p class="empty">Nothing scheduled' + (schedules.length ? ' — no Greek School class this day.' : '.') + '</p>');
  }
  function select(n, focus) {
    var p = parts(state.cursor), q = parts(n);
    state.cursor = n;
    if (state.view !== 'month' || p.y !== q.y || p.m !== q.m) return render(focus);
    body.querySelectorAll('.day').forEach(function (b) {
      var on = +b.getAttribute('data-n') === n;
      b.classList.toggle('is-sel', on); b.tabIndex = on ? 0 : -1; b.parentNode.setAttribute('aria-selected', on);
      if (on && focus) b.focus();
    });
    renderDetail();
  }

  /* ---------- Week ---------- */
  function renderWeek() {
    var start = state.cursor - parts(state.cursor).w, end = start + 6;
    var a = parts(start), b = parts(end);
    titleEl.textContent = MONTHS[a.m - 1].slice(0, 3) + ' ' + a.d + ' – ' + (a.m === b.m ? '' : MONTHS[b.m - 1].slice(0, 3) + ' ') + b.d + ', ' + b.y;
    var html = '<ol class="cal-week">';
    for (var n = start; n <= end; n++) {
      var its = itemsOn(n), p = parts(n);
      html += '<li class="wk-day' + (n === TODAY ? ' is-today' : '') + (n < TODAY ? ' is-past' : '') + (its.length ? '' : ' is-empty') + '">' +
        '<h4><span class="wd">' + DAYS[p.w] + '</span><span class="wn">' + MONTHS[p.m - 1].slice(0, 3) + ' ' + p.d + '</span>' + (n === TODAY ? '<span class="today-chip">Today</span>' : '') + '</h4>' +
        (its.length ? '<ul class="ev-list">' + its.map(function (i) { return itemHtml(i, false); }).join('') + '</ul>' : '<p class="empty">Nothing scheduled</p>') +
        '</li>';
    }
    body.innerHTML = html + '</ol>';
  }

  /* ---------- Year ---------- */
  function yearRange() {
    var p = parts(state.cursor);
    if (state.yearMode === 'school' && schedules.length) {
      var s0 = Math.min.apply(null, schedules.map(function (s) { return s.start; }));
      var s1 = Math.max.apply(null, schedules.map(function (s) { return s.end; }));
      var a = parts(s0), b = parts(s1);
      var span = (b.y - a.y) * 12 + b.m - a.m + 1;
      if (span > 12) span = 12;
      // shift the school year so it contains the cursor
      var startIdx = a.y * 12 + a.m - 1, cur = p.y * 12 + p.m - 1;
      var shift = Math.floor((cur - startIdx) / 12); // in the summer gap this stays on the school year that just ended
      var sIdx = startIdx + shift * 12;
      return { months: range(sIdx, span), label: 'School year ' + Math.floor(sIdx / 12) + '–' + Math.floor((sIdx + span - 1) / 12) };
    }
    return { months: range(p.y * 12, 12), label: String(p.y) };
  }
  function range(idx, n) { var r = []; for (var i = 0; i < n; i++) r.push({ y: Math.floor((idx + i) / 12), m: (idx + i) % 12 + 1 }); return r; }
  function renderYear() {
    var yr = yearRange();
    titleEl.textContent = yr.label;
    var html = '<div class="cal-year">';
    yr.months.forEach(function (mo) {
      var first = dayNum(mo.y, mo.m, 1), len = daysInMonth(mo.y, mo.m), lead = parts(first).w;
      var counts = {};
      var cells = '';
      for (var c = 0; c < lead; c++) cells += '<span class="yd out"></span>';
      for (var n = first; n < first + len; n++) {
        var its = itemsOn(n);
        its.forEach(function (i) { counts[i.cat] = (counts[i.cat] || 0) + 1; });
        var top = its[0];
        cells += '<span class="yd' + (top ? ' k-' + top.cat : '') + (its.length > 1 && top.cat !== 'class' ? ' multi' : '') + (n === TODAY ? ' is-today' : '') + '" data-n="' + n + '" title="' + esc(dayLabel(n)) + '">' + parts(n).d + '</span>';
      }
      var summary = Object.keys(counts).sort(function (a, b) { return CATS[a].rank - CATS[b].rank; })
        .map(function (k) { return counts[k] + ' ' + CATS[k].label.toLowerCase() + (counts[k] > 1 && !/s$/.test(CATS[k].label) ? (k === 'class' ? 'es' : 's') : ''); }).join(', ');
      html += '<div class="mini" role="group" aria-label="' + MONTHS[mo.m - 1] + ' ' + mo.y + '"><h4><button type="button" class="mini-title" data-n="' + first + '" aria-label="' + esc(MONTHS[mo.m - 1] + ' ' + mo.y + (summary ? ': ' + summary : ': nothing scheduled') + '. Open month') + '">' + MONTHS[mo.m - 1] + ' <span>' + mo.y + '</span></button></h4>' +
        '<div class="mini-grid" aria-hidden="true">' + DAYS.map(function (d) { return '<span class="yh">' + d[0] + '</span>'; }).join('') + cells + '</div></div>';
    });
    body.innerHTML = html + '</div>';
  }

  /* ---------- Render + controls ---------- */
  var prevLabel = root.querySelector('.nav-prev-label'), nextLabel = root.querySelector('.nav-next-label');
  function render(focus) {
    root.setAttribute('data-view', state.view);
    root.querySelectorAll('[data-view]').forEach(function (b) { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', b.getAttribute('data-view') === state.view); });
    var ym = root.querySelector('.cal-yearmode');
    ym.hidden = state.view !== 'year' || !schedules.length;
    ym.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-ym') === state.yearMode); });
    var unit = state.view === 'month' ? 'month' : state.view === 'week' ? 'week' : (state.yearMode === 'school' && schedules.length ? 'school year' : 'year');
    prevLabel.textContent = 'Previous ' + unit; nextLabel.textContent = 'Next ' + unit;
    if (state.view === 'week') renderWeek(); else if (state.view === 'year') renderYear(); else renderMonth(focus);
  }
  function step(dir) {
    var p = parts(state.cursor);
    if (state.view === 'week') state.cursor += 7 * dir;
    else if (state.view === 'year') state.cursor = dayNum(p.y + dir, p.m, Math.min(p.d, daysInMonth(p.y + dir, p.m)));
    else { var m = p.m + dir, y = p.y; if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; } state.cursor = dayNum(y, m, Math.min(p.d, daysInMonth(y, m))); }
    render();
  }
  root.addEventListener('click', function (e) {
    var t = e.target.closest('button, .yd[data-n]');
    if (!t || !root.contains(t)) return;
    if (t.hasAttribute('data-view')) { state.view = t.getAttribute('data-view'); render(); }
    else if (t.hasAttribute('data-step')) step(+t.getAttribute('data-step'));
    else if (t.hasAttribute('data-today')) { state.cursor = TODAY; render(state.view === 'month'); }
    else if (t.hasAttribute('data-ym')) { state.yearMode = t.getAttribute('data-ym'); render(); }
    else if (t.classList.contains('day')) select(+t.getAttribute('data-n'), false);
    else if (t.classList.contains('mini-title') || t.classList.contains('yd')) { state.view = 'month'; state.cursor = +t.getAttribute('data-n'); render(true); }
  });
  // Keyboard: arrows move between days, PageUp/PageDown change month, Home/End go to the start/end of the week
  root.addEventListener('keydown', function (e) {
    if (!e.target.classList || !e.target.classList.contains('day')) return;
    var n = state.cursor, w = parts(n).w, to = null, p = parts(n);
    switch (e.key) {
      case 'ArrowLeft': to = n - 1; break;
      case 'ArrowRight': to = n + 1; break;
      case 'ArrowUp': to = n - 7; break;
      case 'ArrowDown': to = n + 7; break;
      case 'Home': to = n - w; break;
      case 'End': to = n + 6 - w; break;
      case 'PageUp': case 'PageDown':
        var dir = e.key === 'PageUp' ? -1 : 1, m = p.m + dir, y = p.y;
        if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
        to = dayNum(y, m, Math.min(p.d, daysInMonth(y, m))); break;
      default: return;
    }
    e.preventDefault();
    select(to, true);
  });

  /* ---------- Tabs: interactive calendar / academic calendar ---------- */
  var tablist = document.querySelector('.cal-tabs');
  var tabs = tablist ? Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]')) : [];
  function showTab(id, focus) {
    tabs.forEach(function (t) {
      var on = t.id === id;
      t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      if (on && focus) t.focus();
    });
    try { localStorage.setItem('gs-cal-tab', id); } catch (e) {}
  }
  if (tabs.length) {
    tablist.hidden = false;
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { showTab(t.id); });
      t.addEventListener('keydown', function (e) {
        var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (j == null) return;
        e.preventDefault(); showTab(tabs[(j + tabs.length) % tabs.length].id, true);
      });
    });
    var saved = null;
    try { saved = localStorage.getItem('gs-cal-tab'); } catch (e) {}
    showTab(saved && document.getElementById(saved) ? saved : 'tab-interactive');
  } else {
    root.hidden = false;
  }

  /* ---------- Coming up: next class + the next important dates ---------- */
  var up = document.getElementById('upcoming');
  if (up) {
    var max = +(data.settings && data.settings.upcoming_count) || 3;
    var cards = [];
    for (var n = TODAY; n <= TODAY + 400; n++) {
      var cls = itemsOn(n).filter(function (i) { return i.cat === 'class' || i.cat === 'extra'; })[0];
      if (cls) { cards.push({ n: n, html: '<span class="up-kind">' + glyph('class') + 'Next class</span><span class="up-title">' + esc(longDate(n).replace(/, \d{4}$/, '')) + '</span><span class="up-meta">' + esc([cls.time, cls.location].filter(Boolean).join(' · ')) + '</span>', cat: 'class' }); break; }
    }
    upcomingPool.filter(function (i) { return i.upcoming !== false && i.end >= TODAY; })
      .sort(function (a, b) { return Math.max(a.start, TODAY) - Math.max(b.start, TODAY) || rank(a) - rank(b); })
      .slice(0, max)
      .forEach(function (i) {
        var when = i.start <= TODAY && i.end >= TODAY ? (i.end > i.start ? 'Now until ' + shortDate(i.end) : 'Today') : (i.dateLabel || longDate(i.start).replace(/, \d{4}$/, ''));
        cards.push({ n: Math.max(i.start, TODAY), cat: i.cat, html: '<span class="up-kind">' + glyph(i.cat) + esc(catLabel(i)) + '</span><span class="up-title">' + esc(i.title) + '</span><span class="up-meta">' + esc(when + (i.time ? ' · ' + i.time : '')) + '</span>' });
      });
    if (cards.length) {
      up.querySelector('ul').innerHTML = cards.map(function (c) {
        return '<li class="k-' + c.cat + '"><button type="button" data-n="' + c.n + '">' + c.html + '<span class="sr-only">, show in calendar</span></button></li>';
      }).join('');
      up.hidden = false;
      up.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-n]'); if (!b) return;
        if (tabs.length) showTab('tab-interactive');
        state.view = 'month'; state.cursor = +b.getAttribute('data-n'); render(false);
        root.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        var d = body.querySelector('.day.is-sel'); if (d) d.focus({ preventScroll: true });
      });
    }
  }

  render();
  // Expose for tests and debugging
  window.GS = window.GS || {};
  window.GS.calendar = { itemsOn: function (s) { return itemsOn(parse(s)); }, state: state, render: render };
})();
