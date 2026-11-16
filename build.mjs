// Builds the static site (HTML at repo root + /en) from src/.
// Usage: npm install && npm run build
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { marked } from 'marked';
import vi from './src/content.vi.mjs';
import en from './src/content.en.mjs';

const BASE = 'https://an.kabala.vn/';
const FILES = {
  vi: { home: 'index.html', practice: 'thien-an-peaceful-meditation.html', wp: 'sach-trang.html', dir: '' },
  en: { home: 'index.html', practice: 'peaceful-meditation.html', wp: 'whitepaper.html', dir: 'en/' },
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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
      ${link('home')}${link('practice')}${link('wp')}
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
    <p class="foot-links">${link('home')} · ${link('practice')} · ${link('wp')} · <a href="${otherHref}" lang="${other}">${esc(t.nav.other)}</a> · <a href="https://kabala.vn/" rel="noopener">${esc(t.footer.eco)}</a></p>
  </div>
</footer>
<script src="${root}assets/js/app.js" defer></script>
</body>
</html>
`;
}

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
  const anchors = ['#timer', '#journal', '#balance'];
  return `<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow">${esc(h.hero.eyebrow)}</p>
      <h1>${esc(h.hero.title)}</h1>
      <p class="lead">${esc(h.hero.lead)}</p>
      <p class="actions"><a class="btn primary" href="${f.practice}#timer">${esc(h.hero.cta1)}</a><a class="btn" href="${f.wp}">${esc(h.hero.cta2)}</a></p>
    </div>
    <div class="hero-art" aria-hidden="true"><span></span><span></span><span></span><b>An</b></div>
  </div>
</section>

<section class="wrap section">
  <h2>${esc(h.essence.h)}</h2>
  <ol class="essence">${h.essence.items.map(([k, v]) => `<li><strong>${esc(k)}</strong><span>${esc(v)}</span></li>`).join('')}</ol>
</section>

<section class="band">
  <div class="wrap section">
    <h2>${esc(h.roots.h)}</h2>
    <p class="intro">${esc(h.roots.intro)}</p>
    <div class="grid two">${h.roots.items.map((r) => `<article class="card root">
      <h3>${esc(r.name)}</h3><p class="voice">${esc(r.voice)}</p><p>${esc(r.text)}</p>
      <ul>${r.signs.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><p class="cure">${esc(r.cure)}</p>
    </article>`).join('')}</div>
    <p class="note">${esc(h.roots.note)}</p>
  </div>
</section>

<section class="wrap section">
  <h2>${esc(h.path.h)}</h2>
  <p class="intro">${esc(h.path.intro)}</p>
  <ol class="steps">${h.path.steps.map((s, i) => `<li><span class="num">${i + 1}</span><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p><p class="ask">${esc(s.q)}</p></li>`).join('')}</ol>
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
  <div class="grid three">${h.practices.items.map((p, i) => `<article class="card"><h3>${esc(p.name)}</h3><p>${esc(p.text)}</p><p><a class="more" href="${f.practice}${anchors[i]}">${esc(p.link)} →</a></p></article>`).join('')}</div>
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
  return `<section class="wrap section page-head">
  <p class="eyebrow">${esc(t.site)} · ${esc(t.tagline)}</p>
  <h1>${esc(p.h)}</h1>
  <p class="lead">${esc(p.lead)}</p>
</section>

<section class="wrap section">
  <h2>${esc(p.seq.h)}</h2>
  <ol class="steps four">${p.seq.steps.map(([n, x], i) => `<li><span class="num">${i + 1}</span><h3>${esc(n)}</h3><p>${esc(x)}</p></li>`).join('')}</ol>
  <p class="note">${esc(p.seq.note)}</p>
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

<section class="wrap section">
  <h2>${esc(p.daily.h)}</h2>
  <dl class="apply">${p.daily.items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
</section>

<section class="band" id="journal">
  <div class="wrap section narrow">
    <h2>${esc(p.journal.h)}</h2>
    <p class="intro">${esc(p.journal.intro)}</p>
    <form id="journal-form" class="journal">
      ${p.journal.ph.map((ph, i) => `<label><span class="num">${i + 1}</span><input type="text" name="e${i}" maxlength="200" placeholder="${esc(ph)}" aria-label="${esc(p.journal.label)} ${i + 1}"></label>`).join('\n      ')}
      <p class="actions"><button class="btn primary" type="submit">${esc(p.journal.save)}</button><span id="journal-status" role="status" data-saved="${esc(p.journal.saved)}"></span></p>
      <p class="muted">${esc(p.journal.days)}: <span id="journal-days">0</span></p>
    </form>
  </div>
</section>

<section class="wrap section narrow" id="balance">
  <h2>${esc(p.balance.h)}</h2>
  <p class="intro">${esc(p.balance.intro)}</p>
  <form id="balance-form" class="balance">
    ${p.balance.areas.map((a, i) => `<label><span>${esc(a)}</span><input type="range" min="1" max="5" value="3" name="b${i}" data-area="${esc(a)}"><output>3</output></label>`).join('\n    ')}
  </form>
  <p class="note" id="balance-result" data-result="${esc(p.balance.result)}" data-even="${esc(p.balance.even)}">${esc(p.balance.even)}</p>
</section>

<section class="band">
  <div class="wrap section">
    <h2>${esc(p.plan.h)}</h2>
    <p class="intro">${esc(p.plan.intro)}</p>
    <div class="grid three">${p.plan.weeks.map(([n, x]) => `<article class="card"><h3>${esc(n)}</h3><p>${esc(x)}</p></article>`).join('')}</div>
    <p class="note">${esc(p.caution)}</p>
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

mkdirSync('en', { recursive: true });
for (const t of [vi, en]) {
  const f = FILES[t.lang];
  writeFileSync(f.dir + f.home, layout(t, 'home', home(t)));
  writeFileSync(f.dir + f.practice, layout(t, 'practice', practice(t)));
  writeFileSync(f.dir + f.wp, layout(t, 'wp', whitepaper(t)));
}
// Keep the old site's addresses working.
writeFileSync('gioi-thieu.html', redirect('index.html', 'vi'));
writeFileSync('en/peaceful-way.html', redirect('index.html', 'en'));
console.log('Built 6 pages + 2 redirects.');
