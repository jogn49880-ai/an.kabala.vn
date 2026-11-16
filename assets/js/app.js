/* Đạo An — interactions. No dependencies. Everything a visitor writes stays in localStorage under "an-" keys. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  var now = new Date();
  var today = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);
  var el = function (tag, text, cls) { var n = document.createElement(tag); if (text) n.textContent = text; if (cls) n.className = cls; return n; };

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

  // Hero: "I Want Happiness" — drop "I", drop "Want"
  var drops = $$('.sentence [data-drop]'), sMsg = $('#sentence-msg');
  if (drops.length && sMsg) {
    drops.forEach(function (b) {
      b.addEventListener('click', function () {
        b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
        var gone = drops.filter(function (d) { return d.getAttribute('aria-pressed') === 'true'; });
        var key = gone.length === 2 ? 'both' : gone.length === 1 ? gone[0].dataset.drop : 'start';
        sMsg.textContent = sMsg.dataset[key];
        b.parentNode.classList.toggle('done', gone.length === 2);
      });
    });
  }

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

  // Fields that save themselves
  $$('[data-save]').forEach(function (f) {
    var key = 'an-f-' + f.dataset.save, v = store.get(key, null);
    if (v !== null) f.value = v;
    f.addEventListener('input', function () { store.set(key, f.value); });
  });

  // Contentment journal
  var form = $('#journal-form');
  if (form) {
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

  // Lists: "what I truly want", "what I let go"
  $$('[data-list]').forEach(function (f) {
    var key = 'an-list-' + f.dataset.list, items = store.get(key, []);
    var input = $('input', f), select = $('select', f), out = $('.list-out', f);
    var kinds = f.dataset.kinds ? JSON.parse(f.dataset.kinds) : null;
    var render = function () {
      out.textContent = '';
      if (!items.length) { out.appendChild(el('p', f.dataset.empty, 'muted')); return; }
      (kinds || [null]).forEach(function (kind, k) {
        var box = el('div');
        if (kind) box.appendChild(el('h4', kind));
        var ul = el('ul');
        items.forEach(function (it, i) {
          if (kinds && it.k !== k) return;
          var li = el('li'); li.appendChild(el('span', it.t));
          var rm = el('button', '×'); rm.type = 'button'; rm.setAttribute('aria-label', f.dataset.remove + ': ' + it.t);
          rm.addEventListener('click', function () { items.splice(i, 1); store.set(key, items); render(); });
          li.appendChild(rm); ul.appendChild(li);
        });
        box.appendChild(ul); out.appendChild(box);
      });
    };
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim(); if (!text) return;
      items.push({ t: text, k: select ? Number(select.value) : 0 });
      store.set(key, items); input.value = ''; render();
    });
    render();
  });

  // Mirror: which voice is louder, "I" or "Want"?
  var mirror = $('#mirror-form');
  if (mirror) {
    var res = $('#mirror-result'), mMsg = $('#mirror-msg'), wait = mMsg.textContent;
    var levels = JSON.parse(res.dataset.levels), msgs = JSON.parse(res.dataset.msg);
    var rows = $$('li', mirror), answers = store.get('an-mirror-a', []);
    var score = function () {
      var sum = { m: 0, t: 0 }, done = true;
      rows.forEach(function (r, i) { if (answers[i] == null) done = false; else sum[r.dataset.g] += answers[i]; });
      ['m', 't'].forEach(function (g) {
        $('#bar-' + g).style.width = (done ? sum[g] / 24 * 100 : 0) + '%';
        $('#lvl-' + g).textContent = done ? levels[sum[g] <= 8 ? 0 : sum[g] <= 16 ? 1 : 2] : '–';
      });
      if (!done) { mMsg.textContent = wait; return; }
      var k = sum.m <= 8 && sum.t <= 8 ? 'low' : Math.abs(sum.m - sum.t) <= 2 ? 'both' : sum.m > sum.t ? 'muon' : 'toi';
      mMsg.textContent = msgs[k];
      store.set('an-mirror', { m: sum.m, t: sum.t, d: today });
    };
    rows.forEach(function (r, i) {
      $$('input', r).forEach(function (inp) {
        if (answers[i] === Number(inp.value)) inp.checked = true;
        inp.addEventListener('change', function () { answers[i] = Number(inp.value); store.set('an-mirror-a', answers); score(); });
      });
    });
    score();
  }

  // Score-from-1-to-5 tools: Balance and My circle
  function rangeTool(formSel, outSel, key, draw) {
    var f = $(formSel); if (!f) return;
    var out = $(outSel), ranges = $$('input[type="range"]', f), saved = store.get(key, null);
    var update = function () {
      var vals = ranges.map(function (r) { var v = Number(r.value); r.nextElementSibling.textContent = v; return v; });
      var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
      var low = ranges.filter(function (r) { return Number(r.value) === min; }).map(function (r) { return r.dataset.area; });
      out.textContent = min === max ? out.dataset.even : out.dataset.result + ' ' + low.join(', ') + '.';
      store.set(key, vals);
      if (draw) draw(vals, ranges.map(function (r) { return r.dataset.area; }));
    };
    if (saved) ranges.forEach(function (r, i) { if (saved[i]) r.value = saved[i]; });
    ranges.forEach(function (r) { r.addEventListener('input', update); });
    update();
  }
  rangeTool('#balance-form', '#balance-result', 'an-balance');
  rangeTool('#circle-form', '#circle-result', 'an-circle', function (vals, labels) {
    var NS = 'http://www.w3.org/2000/svg', box = $('#radar'), c = 150, R = 100, n = vals.length;
    var pt = function (i, r) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return (c + r * Math.cos(a)).toFixed(1) + ',' + (c + r * Math.sin(a)).toFixed(1); };
    var poly = function (cls, f) { var p = document.createElementNS(NS, 'polygon'); p.setAttribute('class', cls); p.setAttribute('points', vals.map(function (v, i) { return pt(i, f(v)); }).join(' ')); return p; };
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 300 300'); svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', labels.map(function (l, i) { return l + ' ' + vals[i]; }).join(', '));
    [1, 2, 3, 4, 5].forEach(function (l) { svg.appendChild(poly('rg', function () { return R * l / 5; })); });
    svg.appendChild(poly('rd', function (v) { return R * v / 5; }));
    labels.forEach(function (l, i) {
      var xy = pt(i, R + 26).split(','), tx = document.createElementNS(NS, 'text');
      tx.setAttribute('x', xy[0]); tx.setAttribute('y', xy[1]); tx.setAttribute('text-anchor', 'middle'); tx.setAttribute('dominant-baseline', 'middle');
      tx.textContent = l; svg.appendChild(tx);
    });
    box.textContent = ''; box.appendChild(svg);
  });

  // Roadmap page: progress and data tools
  var stats = $('.stats');
  if (stats) {
    var mir = store.get('an-mirror', null);
    var vals = [store.get('an-sessions', 0), Object.keys(store.get('an-journal', {})).length,
      store.get('an-list-wants', []).length + store.get('an-list-letgo', []).length, mir ? mir.d : stats.dataset.none];
    vals.forEach(function (v, i) { var s = $('#stat-' + i); if (s) s.textContent = v; });
  }
  var tools = $('#data-tools');
  if (tools) {
    var dStatus = $('#data-status');
    var keys = function () { var k = []; try { for (var i = 0; i < localStorage.length; i++) { var name = localStorage.key(i); if (name.indexOf('an-') === 0) k.push(name); } } catch (e) { /* ignore */ } return k; };
    $('#data-export').addEventListener('click', function () {
      var data = {}; keys().forEach(function (k) { data[k] = localStorage.getItem(k); });
      var a = el('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      a.download = 'dao-an-' + today + '.json'; document.body.appendChild(a); a.click(); a.remove();
    });
    $('#data-import').addEventListener('change', function (e) {
      var file = e.target.files[0]; if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(reader.result);
          Object.keys(data).forEach(function (k) { if (k.indexOf('an-') === 0 && typeof data[k] === 'string') localStorage.setItem(k, data[k]); });
          location.reload();
        } catch (err) { dStatus.textContent = tools.dataset.bad; }
      };
      reader.readAsText(file);
    });
    $('#data-delete').addEventListener('click', function () {
      if (!confirm(tools.dataset.ask)) return;
      keys().forEach(function (k) { localStorage.removeItem(k); });
      location.reload();
    });
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
