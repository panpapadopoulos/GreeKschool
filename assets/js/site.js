/* St. George Greek School — page behavior (no dependencies) */
(function () {
  'use strict';

  // "Today" is always the date in Schererville (America/Chicago), whatever the visitor's
  // time zone, as a plain YYYY-MM-DD string. Dates in the content are compared as strings,
  // so they never shift because of UTC conversion or daylight saving time.
  // For previews and testing, ?date=YYYY-MM-DD pretends it is another day (this browser only).
  var now = new Date();
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var today = (function () {
    var q = (location.search.match(/[?&]date=(\d{4}-\d{2}-\d{2})/) || [])[1];
    if (q) return q;
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
      var get = function (t) { return parts.filter(function (p) { return p.type === t; })[0].value; };
      return get('year') + '-' + get('month') + '-' + get('day');
    } catch (e) {
      return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    }
  })();
  window.GS = window.GS || {};
  window.GS.today = today;

  /* ---------- Mobile menu ---------- */
  var header = document.querySelector('header.site');
  var nav = document.getElementById('site-nav');
  var menuBtn = document.querySelector('.menu-btn');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !header.contains(e.target)) setMenu(false);
  });

  /* ---------- Header shrink + current-section highlight ---------- */
  var hero = document.querySelector('.hero');
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  function onScroll() {
    header.classList.toggle('shrink', window.scrollY > hero.offsetHeight - header.offsetHeight);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) {
      var sec = document.querySelector(a.getAttribute('href'));
      if (sec) io.observe(sec);
    });
  }

  /* ---------- Announcements: respect publish and expiry dates ---------- */
  var newsSection = document.querySelector('[data-news]');
  if (newsSection) {
    var shown = 0;
    newsSection.querySelectorAll('.news-item').forEach(function (item) {
      var start = item.getAttribute('data-start'), end = item.getAttribute('data-end');
      var live = (!start || start <= today) && (!end || end >= today);
      item.hidden = !live;
      if (live) shown++;
    });
    newsSection.hidden = !shown;
    var nl = document.querySelector('[data-news-link]');
    if (nl) nl.hidden = !shown;
  }

  /* ---------- Calendar: dim past events, mark the next one ---------- */
  var nextMarked = false;
  document.querySelectorAll('.dates li[data-date]').forEach(function (li) {
    var end = li.getAttribute('data-end') || li.getAttribute('data-date');
    if (end < today) li.classList.add('past');
    else if (!nextMarked) { li.classList.add('next'); nextMarked = true; }
  });

  /* ---------- Registration status ---------- */
  var st = document.querySelector('[data-reg-status]');
  if (st) {
    var mode = st.getAttribute('data-reg-status');
    var opens = st.getAttribute('data-opens'), deadline = st.getAttribute('data-deadline');
    if (mode === 'auto') {
      if (opens && today < opens) mode = 'soon';
      else if (deadline && today > deadline) mode = 'late';
      else mode = 'open';
    }
    var text = {
      open: 'Registration is open' + (deadline && today <= deadline ? ' · Deadline ' + st.getAttribute('data-deadline-label') : ''),
      soon: opens ? 'Registration opens ' + st.getAttribute('data-opens-label') : 'Registration opens soon',
      late: 'Late enrollment — please contact the director',
      closed: 'Registration is closed'
    }[mode];
    if (text) {
      var span = st.querySelector('span');
      span.textContent = text;
      span.setAttribute('data-state', mode);
      st.hidden = false;
    }
  }

  /* ---------- Photo gallery + viewer ---------- */
  var gallery = document.getElementById('gallery');
  if (gallery) {
    var box = document.getElementById('lightbox');
    var img = box.querySelector('img');
    var cap = box.querySelector('.cap');
    var capEl = box.querySelector('.cap-el');
    var count = box.querySelector('.count');
    var showAll = document.getElementById('showAll');
    var current = 0, lastFocus = null, list = [];
    // The viewer always browses every published photo in CMS order, whether or not
    // "Show all" has been clicked. ("Show all" only controls how many thumbnails
    // the page shows.) An active category filter narrows it to that category.
    // Unpublished photos are never in the page, so they are never included.
    function viewerLinks() {
      return Array.prototype.filter.call(gallery.querySelectorAll('a'), function (a) {
        return !a.classList.contains('filtered');
      });
    }
    if (showAll) showAll.addEventListener('click', function () {
      gallery.classList.add('all');
      this.setAttribute('aria-expanded', 'true');
      this.parentNode.hidden = true;
    });
    // Category filter chips (only present when photos have categories)
    document.querySelectorAll('.chips button').forEach(function (b, _, all) {
      b.addEventListener('click', function () {
        var cat = b.getAttribute('data-cat');
        all.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        if (cat) { gallery.classList.add('all'); if (showAll) showAll.parentNode.hidden = true; }
        gallery.querySelectorAll('a').forEach(function (a) {
          a.classList.toggle('filtered', !!cat && a.getAttribute('data-cat') !== cat);
        });
      });
    });
    function show(i) {
      current = (i + list.length) % list.length;
      var a = list[current];
      img.classList.add('loading');
      img.onload = function () { img.classList.remove('loading'); };
      img.src = a.href;
      var c = a.getAttribute('data-caption') || '', ce = a.getAttribute('data-caption-el') || '';
      img.alt = c || ce || 'St. George Greek School photo ' + (current + 1) + ' of ' + list.length;
      cap.textContent = c;
      if (capEl) { capEl.textContent = ce; capEl.hidden = !ce; }
      count.textContent = (current + 1) + ' / ' + list.length;
      // Preload the next photo for snappy navigation
      var n = list[(current + 1) % list.length];
      if (n) { var pre = new Image(); pre.src = n.href; }
    }
    function open(a) {
      list = viewerLinks();
      lastFocus = a;
      show(list.indexOf(a));
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
      box.querySelector('.lb-close').focus();
    }
    function close() {
      box.classList.remove('open');
      document.body.style.overflow = '';
      img.removeAttribute('src');
      if (lastFocus) lastFocus.focus();
    }
    gallery.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      e.preventDefault();
      open(a);
    });
    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    box.addEventListener('click', function (e) { if (e.target === box || e.target.tagName === 'FIGURE') close(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
      else if (e.key === 'Tab') { // keep focus inside the viewer
        var f = box.querySelectorAll('button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // Swipe left/right on touch screens
    var sx = null;
    box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = today.slice(0, 4);
})();
