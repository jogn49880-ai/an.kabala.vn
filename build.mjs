// Builds the static site (HTML at repo root + /en) from src/.
// Usage: npm install && npm run build
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { marked } from 'marked';
import vi from './src/content.vi.mjs';
import en from './src/content.en.mjs';

const BASE = 'https://an.kabala.vn/';
const PAGES = ['home', 'practice', 'self', 'wp', 'road'];
const FILES = {
  vi: { home: 'index.html', practice: 'thien-an-peaceful-meditation.html', self: 'thau-hieu-ban-than.html', wp: 'sach-trang.html', road: 'lo-trinh.html', dir: '' },
  en: { home: 'index.html', practice: 'peaceful-meditation.html', self: 'know-yourself.html', wp: 'whitepaper.html', road: 'roadmap.html', dir: 'en/' },
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = (o) => esc(JSON.stringify(o));

function layout(t, page, body) {
  const lang = t.lang;
  const other = lang === 'vi' ? 'en' : 'vi';
  const root = lang === 'vi' ? '' : '../';
  const f = FILES[lang];
  const otherHref = root + FILES[other].dir + FILES[other][page];
  const meta = t[page];
  const url = (l, p) => BASE + FILES[l].dir + (FILES[l][p] === 'index.html' ? '' : FILES[l][p]);
  const link = (p) => `<a href="${f[p]}"${p === page ? ' aria-current="page"' : ''}>${esc(t.nav[p])}</a>`;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.desc)}">
<link rel="canonical" href="${url(lang, page)}">
<link rel="alternate" hreflang="vi" href="${url('vi', page)}">
<link rel="alternate" hreflang="en" href="${url('en', page)}">
<link rel="alternate" hreflang="x-default" href="${url('vi', page)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.desc)}">
<meta property="og:url" content="${url(lang, page)}">
<meta name="theme-color" content="#2f6b57">
<link rel="icon" href="${root}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Noto+Serif:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${root}assets/css/style.css">
<script>document.documentElement.classList.add('js');try{var m=localStorage.getItem('an-theme');if(m)document.documentElement.dataset.theme=m}catch(e){}</script>
</head>
<body class="page-${page}">
<a class="skip" href="#main">${lang === 'vi' ? 'Tới nội dung chính' : 'Skip to content'}</a>
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="${f.home}"><span class="mark" aria-hidden="true"></span><span>${esc(t.site)}</span><small>${esc(t.tagline)}</small></a>
    <button class="icon-btn menu-btn" type="button" aria-label="${esc(t.nav.menu)}" aria-expanded="false" aria-controls="nav">☰</button>
    <nav id="nav" class="nav" aria-label="${lang === 'vi' ? 'Chính' : 'Main'}">
      ${PAGES.map(link).join('')}
      <a class="lang" href="${otherHref}" lang="${other}" hreflang="${other}">${esc(t.nav.other)}</a>
      <button class="icon-btn theme-btn" type="button" aria-label="${esc(t.nav.theme)}" title="${esc(t.nav.theme)}">◐</button>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <p><strong>${esc(t.footer.line)}</strong></p>
    <p>${esc(t.footer.note)}</p>
    <p class="foot-links">${PAGES.map(link).join(' · ')} · <a href="${otherHref}" lang="${other}">${esc(t.nav.other)}</a> · <a href="https://kabala.vn/" rel="noopener">${esc(t.footer.eco)}</a></p>
  </div>
</footer>
<script src="${root}assets/js/app.js" defer></script>
</body>
</html>
`;
}

const pageHead = (eyebrow, h, lead, extra = '') => `<section class="wrap section page-head">
  <p class="eyebrow">${esc(eyebrow)}</p>
  <h1>${esc(h)}</h1>
  ${extra}<p class="lead">${esc(lead)}</p>
</section>`;
const quote = (text, cite) => `<blockquote class="source"><p>${esc(text)}</p><cite>${esc(cite)}</cite></blockquote>`;
const flow = (a) => `<ol class="flow"><li>${esc(a[0])}</li><li class="gold">${esc(a[1])}</li><li class="key">${esc(a[2])}</li><li class="split"><span>${esc(a[3])}</span><span>${esc(a[4])}</span></li></ol>`;

function circleHtml(c) {
  const ring = c.nodes.slice(1);
  const pos = ring.map((_, i) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    return [50 + 39 * Math.cos(a), 50 + 39 * Math.sin(a)];
  });
  const arrows = ring.map((_, i) => `<path d="M-5,-5 L3,0 L-5,5" transform="rotate(${-54 + i * 72} 200 200) translate(200 44)"/>`).join('');
  const btn = (n, style, cls) => `<button type="button" class="node ${cls}" data-node="${n.key}" style="${style}" aria-controls="panel-${n.key}">${esc(n.name)}</button>`;
  return `<div class="circle-layout">
  <div class="circle" role="group" aria-label="${esc(c.h)}">
    <svg viewBox="0 0 400 400" aria-hidden="true"><circle class="ring" cx="200" cy="200" r="156"/><circle class="ring-soft" cx="200" cy="200" r="92"/><g class="arrows">${arrows}</g></svg>
    ${btn(c.nodes[0], 'left:50%;top:50%', 'center')}
    ${ring.map((n, i) => btn(n, `left:${pos[i][0].toFixed(2)}%;top:${pos[i][1].toFixed(2)}%`, '')).join('\n    ')}
  </div>
  <div class="panels" aria-live="polite">
    ${c.nodes.map((n) => `<article class="panel" id="panel-${n.key}" data-panel="${n.key}">
      <h3>${esc(n.name)} <small>${esc(n.gloss)}</small></h3>
      <dl>
        <dt>${esc(c.labels.source)}</dt><dd>${esc(n.source)}</dd>
        <dt>${esc(c.labels.meaning)}</dt><dd>${esc(n.meaning)}</dd>
        <dt>${esc(c.labels.practice)}</dt><dd>${esc(n.practice)}</dd>
        <dt>${esc(c.labels.ask)}</dt><dd class="ask">${esc(n.ask)}</dd>
      </dl>
    </article>`).join('\n    ')}
  </div>
</div>`;
}

function home(t) {
  const h = t.home;
  const f = FILES[t.lang];
  const w = h.hero.words;
  return `<section class="hero">
  <div class="wrap narrow hero-center">
    <p class="eyebrow">${esc(h.hero.eyebrow)}</p>
    <h1 class="sentence"><button type="button" data-drop="toi" aria-pressed="false">${esc(w[0])}</button> <button type="button" data-drop="muon" aria-pressed="false">${esc(w[1])}</button> <span class="keep">${esc(w[2])}</span></h1>
    <p class="sentence-msg" id="sentence-msg" aria-live="polite" data-start="${esc(h.hero.start)}" data-toi="${esc(h.hero.toi)}" data-muon="${esc(h.hero.muon)}" data-both="${esc(h.hero.both)}">${esc(h.hero.start)}</p>
    <ul class="sentence-key"><li>${esc(h.hero.toi)}</li><li>${esc(h.hero.muon)}</li><li><strong>${esc(h.hero.both)}</strong></li></ul>
    <p class="lead">${esc(h.hero.lead)}</p>
    <p class="actions"><a class="btn primary" href="${f.practice}">${esc(h.hero.cta1)}</a><a class="btn" href="${f.self}">${esc(h.hero.cta2)}</a></p>
  </div>
</section>

<section class="band">
  <div class="wrap section">
    <h2>${esc(h.one.h)}</h2>
    <p class="intro">${esc(h.one.intro)}</p>
    ${flow(h.one.flow)}
    <p class="note">${esc(h.one.text)}</p>
    <dl class="apply three">${h.one.items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  </div>
</section>

<section class="wrap section">
  <h2>${esc(h.roots.h)}</h2>
  <p class="intro">${esc(h.roots.intro)}</p>
  <div class="grid two">${h.roots.items.map((r) => `<article class="card root">
    <h3>${esc(r.name)}</h3><p class="voice">${esc(r.voice)}</p><p>${esc(r.text)}</p>
    <ul>${r.signs.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><p class="cure">${esc(r.cure)}</p>
  </article>`).join('')}</div>
  <p class="note">${esc(h.roots.note)}</p>
</section>

<section class="band" id="circle">
  <div class="wrap section">
    <h2>${esc(h.circle.h)}</h2>
    <p class="intro">${esc(h.circle.intro)}</p>
    ${circleHtml(h.circle)}
  </div>
</section>

<section class="wrap section">
  <h2>${esc(h.practices.h)}</h2>
  <p class="intro">${esc(h.practices.intro)}</p>
  <div class="grid three">${h.practices.items.map((p) => `<article class="card"><h3>${esc(p.name)}</h3><p>${esc(p.text)}</p><p><a class="more" href="${f[p.to]}${p.hash}">${esc(p.link)} →</a></p></article>`).join('')}</div>
</section>

<section class="band">
  <div class="wrap section">
    <h2>${esc(h.apply.h)}</h2>
    <p class="intro">${esc(h.apply.intro)}</p>
    <dl class="apply">${h.apply.items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  </div>
</section>

<section class="wrap section">
  <h2>${esc(h.compare.h)}</h2>
  <p class="intro">${esc(h.compare.intro)}</p>
  <div class="table-wrap"><table><thead><tr>${h.compare.head.map((x) => `<th>${esc(x)}</th>`).join('')}</tr></thead>
  <tbody>${h.compare.rows.map((r) => `<tr>${r.map((x, i) => (i ? `<td>${esc(x)}</td>` : `<th scope="row">${esc(x)}</th>`)).join('')}</tr>`).join('')}</tbody></table></div>
  <h3 class="sub">${esc(h.isnot.h)}</h3>
  <ul class="isnot">${h.isnot.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
</section>

<section class="band">
  <div class="wrap section narrow">
    <h2>${esc(h.community.h)}</h2>
    <p>${esc(h.community.text)}</p>
    <p><a class="btn primary" href="${f.wp}#sec-10">${esc(h.community.cta)}</a></p>
  </div>
</section>

<section class="wrap section narrow">
  <h2>${esc(h.faq.h)}</h2>
  <div class="faq">${h.faq.items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
</section>`;
}

function practice(t) {
  const p = t.practice;
  const f = FILES[t.lang];
  const li = (a) => a.map((x) => `<li>${esc(x)}</li>`).join('');
  return `${pageHead(`${t.site} · ${t.tagline}`, p.h, p.lead)}

<section class="wrap section narrow">
  <h2>${esc(p.s1.h)}</h2>
  ${quote(p.s1.quote, t.common.source)}
  <p>${esc(p.s1.text)}</p>
</section>

<section class="band">
  <div class="wrap section narrow">
    <h2>${esc(p.s2.h)}</h2>
    <p>${esc(p.s2.text)}</p>
    <ol class="values">${li(p.s2.values)}</ol>
    <p class="note">${esc(p.s2.heal)}</p>
  </div>
</section>

<section class="wrap section narrow">
  <h2>${esc(p.s3.h)}</h2>
  <ol class="how">${p.s3.steps.map(([n, x], i) => `<li><h3>${esc(n)}</h3>${x ? `<p>${esc(x)}</p>` : ''}${i === 2 ? `<div class="grid two"><div class="card"><h4>${esc(p.s3.idleH)}</h4><ul>${li(p.s3.idle)}</ul></div><div class="card"><h4>${esc(p.s3.workH)}</h4><ul>${li(p.s3.work)}</ul></div></div>` : ''}</li>`).join('')}</ol>
  <p class="ask">${esc(p.s3.keep)}</p>
</section>

<section class="band" id="timer">
  <div class="wrap section timer-layout">
    <div>
      <h2>${esc(p.timer.h)}</h2>
      <p class="intro">${esc(p.timer.intro)}</p>
      <fieldset class="chips"><legend>${esc(p.timer.dur)}</legend>${[1, 3, 5, 10, 20].map((m) => `<label><input type="radio" name="dur" value="${m}"${m === 5 ? ' checked' : ''}><span>${m} ${esc(p.timer.min)}</span></label>`).join('')}</fieldset>
      <p class="actions"><button class="btn primary" type="button" id="timer-toggle" data-start="${esc(p.timer.start)}" data-stop="${esc(p.timer.stop)}">${esc(p.timer.start)}</button></p>
      <p class="muted">${esc(p.timer.left)}: <span id="timer-left">5:00</span> · ${esc(p.timer.sessions)}: <span id="timer-sessions">0</span></p>
    </div>
    <div class="breath" id="breath" data-ready="${esc(p.timer.ready)}" data-done="${esc(p.timer.done)}"><div class="breath-disc"></div><output id="breath-count" aria-live="off">${esc(p.timer.ready)}</output><p id="breath-msg" class="breath-msg" role="status"></p></div>
  </div>
</section>

<section class="wrap section narrow">
  <p class="muted">${esc(p.credit)}</p>
  <p class="note">${esc(p.caution)}</p>
  <p class="actions"><span>${esc(p.next)}</span><a class="btn primary" href="${f.self}">${esc(t.nav.self)} →</a></p>
</section>`;
}

function listTool(id, s, c, kinds) {
  return `<form class="list-tool" data-list="${id}" data-empty="${esc(s.empty)}" data-remove="${esc(c.remove)}"${kinds ? ` data-kinds="${json(kinds)}"` : ''}>
      <div class="list-add"><input type="text" maxlength="160" placeholder="${esc(s.ph)}" aria-label="${esc(s.ph)}" required>${kinds ? `<select aria-label="${esc(s.h)}">${kinds.map((k, i) => `<option value="${i}">${esc(k)}</option>`).join('')}</select>` : ''}<button class="btn primary" type="submit">${esc(c.add)}</button></div>
      <div class="list-out${kinds ? ' two-col' : ''}"></div>
    </form>`;
}

function self(t) {
  const s = t.self;
  const c = t.common;
  const f = FILES[t.lang];
  const m = s.mirror;
  const qs = m.muon.flatMap((q, i) => [['m', q], ['t', m.toi[i]]]);
  const ranges = (prefix, names, qs2) => names.map((a, i) => `<label><span>${esc(a)}${qs2 ? `<small>${esc(qs2[i])}</small>` : ''}</span><input type="range" min="1" max="5" value="3" name="${prefix}${i}" data-area="${esc(a)}"><output>3</output></label>`).join('\n      ');
  const names = t.home.circle.nodes.map((n) => n.name);
  return `${pageHead(`${t.site} · ${t.tagline}`, s.h, s.lead, quote(s.source, c.source))}

<section class="wrap section narrow">
  ${flow(t.home.one.flow)}
  <div class="note"><strong>${esc(s.first.h)}.</strong> ${esc(s.first.text)} <a href="${f.practice}#timer">${esc(s.first.cta)} →</a></div>
  <p class="muted">${esc(c.device)}</p>
</section>

<section class="band" id="mirror">
  <div class="wrap section narrow">
    <h2>${esc(m.h)}</h2>
    <p class="intro">${esc(m.intro)}</p>
    <form id="mirror-form" class="quiz">
      <p class="scale-legend"><span>1 = ${esc(m.scale[0])}</span><span>5 = ${esc(m.scale[1])}</span></p>
      <ol>${qs.map(([g, q], i) => `<li data-g="${g}"><p id="mq${i}">${esc(q)}</p><div class="scale" role="radiogroup" aria-labelledby="mq${i}">${[0, 1, 2, 3, 4].map((v) => `<label><input type="radio" name="mq${i}" value="${v}"><span>${v + 1}</span></label>`).join('')}</div></li>`).join('')}</ol>
    </form>
    <div id="mirror-result" class="result" data-levels="${json(m.levels)}" data-msg="${json(m.msg)}">
      <div class="meter"><span>${esc(m.labels[0])}</span><div class="track"><i id="bar-m"></i></div><b id="lvl-m">–</b></div>
      <div class="meter"><span>${esc(m.labels[1])}</span><div class="track"><i id="bar-t"></i></div><b id="lvl-t">–</b></div>
      <p id="mirror-msg" role="status">${esc(m.wait)}</p>
    </div>
    <p class="muted">${esc(m.note)}</p>
  </div>
</section>

<section class="wrap section narrow" id="wants">
  <p class="eyebrow">${esc(s.wants.to)}</p>
  <h2>${esc(s.wants.h)}</h2>
  <p class="intro">${esc(s.wants.intro)}</p>
  ${listTool('wants', s.wants, c, s.wants.kinds)}
  <p class="note">${esc(s.wants.after)}</p>
  <div id="journal">
    <h3 class="sub">${esc(s.journal.h)}</h3>
    <p class="intro">${esc(s.journal.intro)}</p>
    <form id="journal-form" class="journal">
      ${s.journal.ph.map((ph, i) => `<label><span class="num">${i + 1}</span><input type="text" name="e${i}" maxlength="200" placeholder="${esc(ph)}" aria-label="${esc(s.journal.label)} ${i + 1}"></label>`).join('\n      ')}
      <p class="actions"><button class="btn primary" type="submit">${esc(s.journal.save)}</button><span id="journal-status" role="status" data-saved="${esc(s.journal.saved)}"></span></p>
      <p class="muted">${esc(s.journal.days)}: <span id="journal-days">0</span></p>
    </form>
  </div>
</section>

<section class="band" id="letgo">
  <div class="wrap section narrow">
    <p class="eyebrow">${esc(s.letgo.to)}</p>
    <h2>${esc(s.letgo.h)}</h2>
    <p class="intro">${esc(s.letgo.intro)}</p>
    ${listTool('letgo', s.letgo, c)}
    <h3 class="sub">${esc(s.letgo.purposeH)}</h3>
    <p class="purpose"><span>${esc(s.letgo.purpose[0])}</span><input type="text" maxlength="120" data-save="purpose-what" placeholder="${esc(s.letgo.ph1)}" aria-label="${esc(s.letgo.purpose[0])}"><span>${esc(s.letgo.purpose[1])}</span><input type="text" maxlength="120" data-save="purpose-whom" placeholder="${esc(s.letgo.ph2)}" aria-label="${esc(s.letgo.purpose[1])}"></p>
    <p class="note">${esc(s.letgo.after)}</p>
  </div>
</section>

<section class="wrap section" id="my-circle">
  <h2>${esc(s.circle.h)}</h2>
  <p class="intro">${esc(s.circle.intro)}</p>
  <div class="radar-layout">
    <form id="circle-form" class="balance wide">
      ${ranges('c', names, s.circle.qs)}
    </form>
    <div><div id="radar" class="radar"></div><p class="note" id="circle-result" data-result="${esc(s.circle.result)}" data-even="${esc(s.circle.even)}">${esc(s.circle.even)}</p></div>
  </div>
</section>

<section class="band" id="balance">
  <div class="wrap section narrow">
    <h2>${esc(s.balance.h)}</h2>
    <p class="intro">${esc(s.balance.intro)}</p>
    <form id="balance-form" class="balance">
      ${ranges('b', s.balance.areas)}
    </form>
    <p class="note" id="balance-result" data-result="${esc(s.balance.result)}" data-even="${esc(s.balance.even)}">${esc(s.balance.even)}</p>
  </div>
</section>`;
}

function road(t) {
  const r = t.road;
  const f = FILES[t.lang];
  const p = r.progress;
  return `${pageHead(`${t.site} · ${t.tagline}`, r.h, r.lead)}

<section class="wrap section">
  <h2>${esc(r.today.h)}</h2>
  <div class="grid three">${r.today.items.map(([n, x, to, hash], i) => `<a class="card link-card" href="${f[to]}${hash}"><span class="num">${i + 1}</span><h3>${esc(n)}</h3><p>${esc(x)}</p></a>`).join('')}</div>
</section>

<section class="band">
  <div class="wrap section">
    <h2>${esc(r.plan.h)}</h2>
    <p class="intro">${esc(r.plan.intro)}</p>
    <div class="grid three">${r.plan.weeks.map(([n, x]) => `<article class="card"><h3>${esc(n)}</h3><p>${esc(x)}</p></article>`).join('')}</div>
  </div>
</section>

<section class="wrap section" id="progress">
  <h2>${esc(p.h)}</h2>
  <dl class="stats" data-none="${esc(p.none)}">${p.stats.map((x, i) => `<div><dd id="stat-${i}">–</dd><dt>${esc(x)}</dt></div>`).join('')}</dl>
  <h3 class="sub">${esc(p.dataH)}</h3>
  <p class="intro">${esc(p.dataText)}</p>
  <p class="actions" id="data-tools" data-ask="${esc(p.delAsk)}" data-done="${esc(p.done)}" data-bad="${esc(p.bad)}">
    <button class="btn" type="button" id="data-export">${esc(p.exp)}</button>
    <label class="btn">${esc(p.imp)}<input type="file" id="data-import" accept="application/json,.json" hidden></label>
    <button class="btn" type="button" id="data-delete">${esc(p.del)}</button>
    <span id="data-status" role="status"></span>
  </p>
</section>

<section class="band">
  <div class="wrap section narrow">
    <h2>${esc(r.site.h)}</h2>
    <p class="intro">${esc(r.site.intro)}</p>
    <ol class="phases">${r.site.phases.map(([st, n, x]) => `<li class="st-${st}"><span class="tag">${esc(r.site.status[st])}</span><h3>${esc(n)}</h3><p>${esc(x)}</p></li>`).join('')}</ol>
  </div>
</section>`;
}

function whitepaper(t) {
  const w = t.wp;
  let html = marked.parse(readFileSync(`src/whitepaper.${t.lang}.md`, 'utf8'));
  const toc = [];
  let n = 0;
  html = html.replace(/<h2>(.*?)<\/h2>/g, (_, title) => {
    const id = `sec-${n++}`;
    toc.push([id, title]);
    return `<h2 id="${id}">${title}</h2>`;
  });
  html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
  return `<section class="wrap section page-head">
  <p class="eyebrow">${esc(w.meta)}</p>
  <h1>${esc(w.h)}</h1>
  <p class="lead">${esc(w.sub)}</p>
  <p class="actions no-print"><button class="btn" type="button" id="print-btn">${esc(w.print)}</button></p>
</section>
<div class="wrap doc-layout">
  <nav class="toc no-print" aria-label="${esc(w.toc)}"><h2>${esc(w.toc)}</h2><ol>${toc.map(([id, x]) => `<li><a href="#${id}">${x}</a></li>`).join('')}</ol></nav>
  <article class="doc">
${html}
  </article>
</div>`;
}

const redirect = (to, lang) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>Đạo An</title><meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${to}"></head><body><a href="${to}">Đạo An</a></body></html>\n`;

const render = { home, practice, self, wp: whitepaper, road };
mkdirSync('en', { recursive: true });
for (const t of [vi, en]) {
  const f = FILES[t.lang];
  for (const p of PAGES) writeFileSync(f.dir + f[p], layout(t, p, render[p](t)));
}
// Keep the old site's addresses working.
writeFileSync('gioi-thieu.html', redirect('index.html', 'vi'));
writeFileSync('en/peaceful-way.html', redirect('index.html', 'en'));
console.log(`Built ${PAGES.length * 2} pages + 2 redirects.`);
