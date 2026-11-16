/* Đạo An — interactions. No dependencies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  // Theme
  var themeBtn = $('.theme-btn');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var root = document.documentElement;
    var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('an-theme', root.dataset.theme); } catch (e) { /* ignore */ }
  });

  // Mobile menu
  var menuBtn = $('.menu-btn'), nav = $('#nav');
  if (menuBtn && nav) menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  // Circle of Hiếu Đạo
  var nodes = $$('.node');
  function showNode(key) {
    nodes.forEach(function (n) { n.setAttribute('aria-pressed', String(n.dataset.node === key)); });
    $$('.panel').forEach(function (p) { p.classList.toggle('active', p.dataset.panel === key); });
  }
  if (nodes.length) {
    nodes.forEach(function (n) { n.addEventListener('click', function () { showNode(n.dataset.node); }); });
    showNode('an');
  }

  // Meditation timer: counts 1..6, one count every 1.5 s
  var toggle = $('#timer-toggle'), breath = $('#breath');
  if (toggle && breath) {
    var count = $('#breath-count'), left = $('#timer-left'), msg = $('#breath-msg'), sessions = $('#timer-sessions');
    var tick = null, n = 0, remaining = 0;
    var fmt = function (s) { return Math.floor(s / 60) + ':' + ('0' + Math.floor(s % 60)).slice(-2); };
    var minutes = function () { var c = $('input[name="dur"]:checked'); return c ? Number(c.value) : 5; };
    sessions.textContent = store.get('an-sessions', 0);
    left.textContent = fmt(minutes() * 60);
    $$('input[name="dur"]').forEach(function (r) { r.addEventListener('change', function () { if (!tick) left.textContent = fmt(minutes() * 60); }); });

    var stop = function (finished) {
      clearInterval(tick); tick = null;
      breath.classList.remove('in', 'out');
      toggle.textContent = toggle.dataset.start;
      count.textContent = breath.dataset.ready;
      msg.textContent = finished ? breath.dataset.done : '';
      left.textContent = fmt(minutes() * 60);
      if (finished) { var s = store.get('an-sessions', 0) + 1; store.set('an-sessions', s); sessions.textContent = s; }
    };
    var step = function () {
      if (remaining <= 0) { stop(true); return; }
      n = n % 6 + 1;
      count.textContent = n;
      breath.classList.toggle('in', n <= 3);
      breath.classList.toggle('out', n > 3);
      left.textContent = fmt(remaining);
      remaining -= 1.5;
    };
    toggle.addEventListener('click', function () {
      if (tick) { stop(false); return; }
      n = 0; remaining = minutes() * 60; msg.textContent = '';
      toggle.textContent = toggle.dataset.stop;
      step(); tick = setInterval(step, 1500);
    });
  }

  // Contentment journal (stored on this device only)
  var form = $('#journal-form');
  if (form) {
    var today = new Date(); today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var entries = store.get('an-journal', {});
    var inputs = $$('input[type="text"]', form), status = $('#journal-status'), days = $('#journal-days');
    (entries[today] || []).forEach(function (v, i) { if (inputs[i]) inputs[i].value = v; });
    days.textContent = Object.keys(entries).length;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var vals = inputs.map(function (i) { return i.value.trim(); });
      if (vals.some(Boolean)) entries[today] = vals; else delete entries[today];
      store.set('an-journal', entries);
      days.textContent = Object.keys(entries).length;
      status.textContent = status.dataset.saved;
    });
  }

  // Balance check
  var bal = $('#balance-form');
  if (bal) {
    var out = $('#balance-result'), ranges = $$('input[type="range"]', bal);
    var saved = store.get('an-balance', null);
    var update = function () {
      var min = 6, max = 0, low = [];
      ranges.forEach(function (r) { var v = Number(r.value); r.nextElementSibling.textContent = v; if (v < min) min = v; if (v > max) max = v; });
      ranges.forEach(function (r) { if (Number(r.value) === min) low.push(r.dataset.area); });
      out.textContent = min === max ? out.dataset.even : out.dataset.result + ' ' + low.join(', ') + '.';
      store.set('an-balance', ranges.map(function (r) { return r.value; }));
    };
    if (saved) ranges.forEach(function (r, i) { if (saved[i]) r.value = saved[i]; });
    ranges.forEach(function (r) { r.addEventListener('input', update); });
    update();
  }

  // White paper: print + active table-of-contents entry
  var printBtn = $('#print-btn');
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
  var tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (it) {
        if (!it.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + it.target.id); });
      });
    }, { rootMargin: '-15% 0px -75% 0px' });
    $$('.doc h2[id]').forEach(function (h) { io.observe(h); });
  }
})();
