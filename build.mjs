// Builds the whole static site (HTML at repo root + /en, service worker, sitemap) from src/.
// Usage: npm install && npm run build
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { marked } from 'marked';
import viBase from './src/content.vi.mjs';
import enBase from './src/content.en.mjs';
import viMore from './src/more.vi.mjs';
import enMore from './src/more.en.mjs';

const merge = (a, b) => {
  for (const k of Object.keys(b)) {
    if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) merge(a[k], b[k]);
    else a[k] = b[k];
  }
  return a;
};
const vi = merge(viBase, viMore);
const en = merge(enBase, enMore);

const BASE = 'https://an.kabala.vn/';
const NAV = ['home', 'lessons', 'practice', 'self', 'life', 'circle', 'wp'];
const FOOT = [...NAV, 'faq', 'road'];
const SLUGS = {
  vi: ['toi-muon-hanh-phuc', 'cai-toi', 'long-tham', 'biet-du', 'an-la-goc', 'hieu', 'dao', 'duc', 'phuc', 'tai', 'thau-hieu-ban-than', 'tinh-lang-va-thien-an'],
  en: ['i-want-happiness', 'the-ego', 'greed', 'contentment', 'an-is-the-root', 'hieu', 'dao', 'duc', 'phuc', 'tai', 'know-yourself', 'stillness-and-meditation'],
};
const LESSON_ICONS = ['sentence', 'toi', 'muon', 'du', 'an', 'hieu', 'dao', 'duc', 'phuc', 'tai', 'self', 'still'];
const pad = (n) => String(n).padStart(2, '0');
const lessonFile = (lang, i) => (lang === 'vi' ? `bai-giang-${pad(i + 1)}-${SLUGS.vi[i]}.html` : `lesson-${pad(i + 1)}-${SLUGS.en[i]}.html`);
const FILES = {
  vi: { home: 'index.html', lessons: 'bai-giang.html', practice: 'thien-an-peaceful-meditation.html', self: 'thau-hieu-ban-than.html', life: 'doi-song.html', circle: 'vong-an.html', wp: 'sach-trang.html', faq: 'hoi-dap.html', road: 'lo-trinh.html', lesson1: lessonFile('vi', 0), dir: '' },
  en: { home: 'index.html', lessons: 'teachings.html', practice: 'peaceful-meditation.html', self: 'know-yourself.html', life: 'daily-life.html', circle: 'circles.html', wp: 'whitepaper.html', faq: 'questions.html', road: 'roadmap.html', lesson1: lessonFile('en', 0), dir: 'en/' },
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = (o) => esc(JSON.stringify(o));
const li = (a) => a.map((x) => `<li>${esc(x)}</li>`).join('');

/* ---------- Pictures ---------- */
const ICONS = {
  sentence: '<path d="M8 12h12M28 12h12"/><path d="M6 16l16-8M26 16l16-8"/><path d="M8 34h32" stroke-width="5"/>',
  toi: '<circle cx="24" cy="11" r="5"/><ellipse cx="24" cy="31" rx="15" ry="12"/>',
  muon: '<circle cx="9" cy="32" r="3.5" class="f"/><path d="M15 29Q24 13 33 17" stroke-dasharray="3 4"/><path d="M29 12l5 5-6 3"/><circle cx="41" cy="12" r="3.5"/>',
  du: '<path d="M12 12h24v10a12 12 0 0 1-24 0z"/><path d="M12 19h24"/><path d="M24 34v8M17 42h14"/>',
  an: '<circle cx="24" cy="24" r="19"/><circle cx="24" cy="24" r="11"/><circle cx="24" cy="24" r="3.5" class="f"/>',
  hieu: '<path d="M8 34a16 16 0 0 1 32 0"/><circle cx="24" cy="30" r="5" class="f"/><path d="M5 41h38"/>',
  dao: '<path d="M12 43c0-11 24-8 24-18S15 18 20 9"/><circle cx="20" cy="7" r="3" class="f"/>',
  duc: '<circle cx="24" cy="16" r="10"/><path d="M24 26v16M24 42l-8 3M24 42l8 3M24 34l-5-4M24 31l5-4"/>',
  phuc: '<circle cx="24" cy="24" r="7" class="f"/><path d="M24 4v7M24 37v7M4 24h7M37 24h7M10 10l5 5M33 33l5 5M38 10l-5 5M15 33l-5 5"/>',
  tai: '<circle cx="24" cy="26" r="7"/><circle cx="24" cy="7" r="3" class="f"/><circle cx="8" cy="38" r="3" class="f"/><circle cx="40" cy="38" r="3" class="f"/><path d="M24 19v-8M18 30l-7 5M30 30l7 5"/>',
  self: '<path d="M4 24s8-12 20-12 20 12 20 12-8 12-20 12S4 24 4 24z"/><circle cx="24" cy="24" r="5" class="f"/>',
  still: '<circle cx="24" cy="14" r="7"/><path d="M6 31h36M11 37h26M17 43h14"/>',
};
const icon = (k, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 48 48" aria-hidden="true">${ICONS[k]}</svg>`;

// The journey: I want happiness → drop I, drop Want → An → know yourself → happiness + meaning.
const flow = (o) => `<div class="journey">
  <ol class="flow"><li class="q">${esc(o.flow[0])}</li><li class="drop">${esc(o.flow[1])}<small>${esc(o.via)}</small></li><li class="gold">${esc(o.flow[2])}</li><li class="key">${esc(o.flow[3])}</li><li class="split"><span>${esc(o.flow[4])}</span><span>${esc(o.flow[5])}</span></li></ol>
  <p class="support">${icon('still')}<span>${esc(o.support)}</span></p>
</div>`;

// A static picture of the Circle of Hiếu Đạo, for the white paper and print.
function circleFigure(names) {
  const ring = names.slice(1).map((n, i) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    const x = (200 + 140 * Math.cos(a)).toFixed(1), y = (200 + 140 * Math.sin(a)).toFixed(1);
    return `<circle class="fn" cx="${x}" cy="${y}" r="38"/><text x="${x}" y="${y}">${esc(n)}</text><path class="fa" d="M-6,-6 L4,0 L-6,6" transform="rotate(${-54 + i * 72} 200 200) translate(200 60)"/>`;
  }).join('');
  return `<figure class="fig"><svg viewBox="0 0 400 400" role="img" aria-label="${esc(names.join(' → '))} → ${esc(names[0])}"><circle class="fr" cx="200" cy="200" r="140"/><circle class="fc" cx="200" cy="200" r="52"/><text class="ft" x="200" y="200">${esc(names[0])}</text>${ring}</svg></figure>`;
}

/* ---------- Page shell ---------- */
const written = [];
const out = (path, text) => { writeFileSync(path, text); written.push(path); };

function layout(t, page, body, o) {
  // o: pages outside FILES (lessons) pass { title, desc, files: {vi, en}, nav }
  const lang = t.lang;
  const other = lang === 'vi' ? 'en' : 'vi';
  const root = lang === 'vi' ? '' : '../';
  const f = FILES[lang];
  const file = (l) => (o ? o.files[l] : FILES[l][page]);
  const otherHref = root + FILES[other].dir + file(other);
  const meta = o || t[page];
  const cur = o ? o.nav : page;
  const url = (l) => BASE + FILES[l].dir + (file(l) === 'index.html' ? '' : file(l));
  const link = (p) => `<a href="${f[p]}"${p === cur ? ' aria-current="page"' : ''}>${esc(t.nav[p])}</a>`;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.desc)}">
<meta name="author" content="Mr.33">
<link rel="canonical" href="${url(lang)}">
<link rel="alternate" hreflang="vi" href="${url('vi')}">
<link rel="alternate" hreflang="en" href="${url('en')}">
<link rel="alternate" hreflang="x-default" href="${url('vi')}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Đạo An · Peaceful Way">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.desc)}">
<meta property="og:url" content="${url(lang)}">
<meta property="og:image" content="${BASE}assets/img/icon-512.png">
<meta name="theme-color" content="#2f6b57">
<link rel="icon" href="${root}assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${root}assets/img/icon-192.png">
<link rel="manifest" href="${root}manifest.webmanifest">
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
      ${NAV.map(link).join('')}
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
    <p>${esc(t.footer.note)} ${esc(t.common.offline)}</p>
    <p class="foot-links">${FOOT.map(link).join(' · ')} · <a href="${otherHref}" lang="${other}">${esc(t.nav.other)}</a> · <a href="https://kabala.vn/" rel="noopener">${esc(t.footer.eco)}</a></p>
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
  ${extra}${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
</section>`;
const quote = (text, cite) => `<blockquote class="source"><p>${esc(text)}</p><cite>${esc(cite)}</cite></blockquote>`;
const brand = (t) => `${t.site} · ${t.tagline}`;

/* ---------- Lessons ---------- */
function loadLessons(lang) {
  return readFileSync(`src/lessons.${lang}.md`, 'utf8').split(/^# /m).slice(1).map((s, i) => {
    const nl = s.indexOf('\n');
    const md = s.slice(nl);
    const sum = (md.match(/^> (.*)$/m) || [])[1] || '';
    return { i, title: s.slice(0, nl).trim(), sum, html: marked.parse(md.replace(/^> .*$/m, '')), icon: LESSON_ICONS[i] };
  });
}
const LESSONS = { vi: loadLessons('vi'), en: loadLessons('en') };

const lessonCard = (t, l) => `<a class="card link-card lesson-card" href="${lessonFile(t.lang, l.i)}">${icon(l.icon)}<span class="tag">${esc(t.lessons.of)} ${l.i + 1}</span><h3>${esc(l.title)}</h3><p>${esc(l.sum)}</p></a>`;

function lessonsIndex(t) {
  const s = t.lessons;
  const all = LESSONS[t.lang];
  return `${pageHead(brand(t), s.h, s.lead)}
${s.groups.map(([h, sub, a, b], g) => `<section class="${g % 2 ? 'band' : ''}"><div class="wrap section">
  <p class="eyebrow">${esc(sub)}</p>
  <h2>${esc(h)}</h2>
  <div class="grid three">${all.slice(a, b).map((l) => lessonCard(t, l)).join('')}</div>
</div></section>`).join('\n')}
<section class="wrap section narrow"><p class="muted">${esc(s.credit)}</p></section>`;
}

function lessonPage(t, l) {
  const s = t.lessons;
  const all = LESSONS[t.lang];
  const prev = all[l.i - 1], next = all[l.i + 1];
  const group = s.groups.find(([, , a, b]) => l.i >= a && l.i < b);
  return `<section class="wrap section page-head lesson-head narrow">
  ${icon(l.icon, 'big')}
  <p class="eyebrow">${esc(s.of)} ${l.i + 1} / ${all.length} · ${esc(group[0])}</p>
  <h1>${esc(l.title)}</h1>
  ${quote(l.sum, t.common.credit)}
</section>
<article class="wrap narrow doc lesson">
${l.html}
</article>
<nav class="wrap narrow pager" aria-label="${esc(s.h)}">
  ${prev ? `<a class="card link-card" href="${lessonFile(t.lang, prev.i)}"><span class="tag">← ${esc(s.prev)}</span><strong>${esc(prev.title)}</strong></a>` : '<span></span>'}
  ${next ? `<a class="card link-card next" href="${lessonFile(t.lang, next.i)}"><span class="tag">${esc(s.next)} →</span><strong>${esc(next.title)}</strong></a>` : `<a class="card link-card next" href="${FILES[t.lang].self}"><span class="tag">${esc(s.next)} →</span><strong>${esc(t.self.h)}</strong></a>`}
</nav>
<section class="wrap section narrow"><p><a class="more" href="${FILES[t.lang].lessons}">← ${esc(s.all)}</a></p><p class="muted">${esc(s.credit)}</p></section>`;
}

/* ---------- Home ---------- */
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
      <h3>${icon(n.key)}${esc(n.name)} <small>${esc(n.gloss)}</small></h3>
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
  const rootIcons = ['toi', 'muon'], pracIcons = ['still', 'du', 'dao'];
  return `<section class="hero">
  <div class="wrap narrow hero-center">
    <p class="eyebrow">${esc(h.hero.eyebrow)}</p>
    <h1 class="sentence"><button type="button" data-drop="toi" aria-pressed="false">${esc(w[0])}</button> <button type="button" data-drop="muon" aria-pressed="false">${esc(w[1])}</button> <span class="keep">${esc(w[2])}</span></h1>
    <p class="sentence-msg" id="sentence-msg" aria-live="polite" data-start="${esc(h.hero.start)}" data-toi="${esc(h.hero.toi)}" data-muon="${esc(h.hero.muon)}" data-both="${esc(h.hero.both)}">${esc(h.hero.start)}</p>
    <ul class="sentence-key"><li>${esc(h.hero.toi)}</li><li>${esc(h.hero.muon)}</li><li><strong>${esc(h.hero.both)}</strong></li></ul>
    <p class="lead">${esc(h.hero.lead)}</p>
    <p class="actions"><a class="btn primary" href="${f.lesson1}">${esc(h.hero.cta1)}</a><a class="btn" href="${f.self}#mirror">${esc(h.hero.cta2)}</a></p>
  </div>
</section>

<section class="band">
  <div class="wrap section">
    <h2>${esc(h.one.h)}</h2>
    <p class="intro">${esc(h.one.intro)}</p>
    ${flow(h.one)}
    <p class="note">${esc(h.one.text)}</p>
    <dl class="apply three">${h.one.items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  </div>
</section>

<section class="wrap section">
  <h2>${esc(h.roots.h)}</h2>
  <p class="intro">${esc(h.roots.intro)}</p>
  <div class="grid two">${h.roots.items.map((r, i) => `<article class="card root">
    ${icon(rootIcons[i], 'big')}<h3>${esc(r.name)}</h3><p class="voice">${esc(r.voice)}</p><p>${esc(r.text)}</p>
    <ul>${li(r.signs)}</ul><p class="cure">${esc(r.cure)}</p>
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
  <h2>${esc(h.learn.h)}</h2>
  <p class="intro">${esc(h.learn.intro)}</p>
  <ol class="tiles">${LESSONS[t.lang].map((l) => `<li><a href="${lessonFile(t.lang, l.i)}">${icon(l.icon)}<span>${l.i + 1}. ${esc(l.title)}</span></a></li>`).join('')}</ol>
  <p class="actions"><a class="btn" href="${f.lessons}">${esc(h.learn.cta)}</a></p>
</section>

<section class="band">
  <div class="wrap section">
    <h2>${esc(h.practices.h)}</h2>
    <p class="intro">${esc(h.practices.intro)}</p>
    <div class="grid three">${[1, 2, 0].map((i) => h.practices.items[i]).map((p, i) => `<article class="card">${icon(['du', 'dao', 'still'][i])}<h3>${esc(p.name)}</h3><p>${esc(p.text)}</p><p><a class="more" href="${f[p.to]}${p.hash}">${esc(p.link)} →</a></p></article>`).join('')}</div>
  </div>
</section>

<section class="wrap section">
  <h2>${esc(h.apply.h)}</h2>
  <p class="intro">${esc(h.apply.intro)}</p>
  <dl class="apply">${h.apply.items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  <p class="actions"><a class="btn" href="${f.life}">${esc(t.life.h)} →</a></p>
</section>

<section class="band">
  <div class="wrap section">
    <h2>${esc(h.compare.h)}</h2>
    <p class="intro">${esc(h.compare.intro)}</p>
    <div class="table-wrap"><table><thead><tr>${h.compare.head.map((x) => `<th>${esc(x)}</th>`).join('')}</tr></thead>
    <tbody>${h.compare.rows.map((r) => `<tr>${r.map((x, i) => (i ? `<td>${esc(x)}</td>` : `<th scope="row">${esc(x)}</th>`)).join('')}</tr>`).join('')}</tbody></table></div>
    <h3 class="sub">${esc(h.isnot.h)}</h3>
    <ul class="isnot">${li(h.isnot.items)}</ul>
  </div>
</section>

<section class="wrap section narrow">
  <h2>${esc(h.community.h)}</h2>
  <p>${esc(h.community.text)}</p>
  <p class="actions"><a class="btn primary" href="${f.circle}">${esc(t.circle.h)}</a><a class="btn" href="${f.wp}#sec-10">${esc(h.community.cta)}</a></p>
</section>

<section class="band">
  <div class="wrap section narrow">
    <h2>${esc(h.faq.h)}</h2>
    <div class="faq">${h.faq.items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
    <p class="actions"><a class="btn" href="${f.faq}">${esc(h.faqMore)}</a></p>
  </div>
</section>`;
}

/* ---------- Meditation ---------- */
function practice(t) {
  const p = t.practice;
  const f = FILES[t.lang];
  return `${pageHead(brand(t), p.h, p.lead)}

<section class="wrap section narrow">
  <p class="note role">${esc(p.role)}</p>
  <h2>${esc(p.s1.h)}</h2>
  ${quote(p.s1.quote, t.common.credit)}
  <p>${esc(p.s1.text)}</p>
</section>

<section class="band">
  <div class="wrap section">
    <h2>${esc(p.s2.h)}</h2>
    <p class="intro">${esc(p.s2.text)}</p>
    <ol class="tiles six">${p.s2.values.map((v, i) => `<li><div><b>${i + 1}</b><span>${esc(v)}</span></div></li>`).join('')}</ol>
    <div class="heal">${icon('still', 'big')}<p>${esc(p.s2.heal)}</p></div>
  </div>
</section>

<section class="wrap section">
  <h2>${esc(p.s3.h)}</h2>
  <ol class="strip">${p.path.map((x, i) => `<li><b>${i + 1}</b>${esc(x)}</li>`).join('')}</ol>
  <ol class="how narrow">${p.s3.steps.map(([n, x], i) => `<li><h3>${esc(n)}</h3>${x ? `<p>${esc(x)}</p>` : ''}${i === 2 ? `<div class="grid two"><div class="card"><h4>${esc(p.s3.idleH)}</h4><ul>${li(p.s3.idle)}</ul></div><div class="card"><h4>${esc(p.s3.workH)}</h4><ul>${li(p.s3.work)}</ul></div></div>` : ''}</li>`).join('')}</ol>
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
  <p class="actions"><span>${esc(p.next)}</span><a class="btn primary" href="${f.self}">${esc(t.self.h)} →</a></p>
</section>`;
}

/* ---------- Know yourself ---------- */
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
  return `${pageHead(brand(t), s.h, s.lead, quote(s.source, c.credit))}

<section class="wrap section">
  ${flow(t.home.one)}
  <p class="muted">${esc(c.device)}</p>
</section>

<section class="band" id="mirror">
  <div class="wrap section narrow">
    <h2>${icon('self')}${esc(m.h)}</h2>
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
  <h2>${icon('muon')}${esc(s.wants.h)}</h2>
  <p class="intro">${esc(s.wants.intro)}</p>
  ${listTool('wants', s.wants, c, s.wants.kinds)}
  <p class="note">${esc(s.wants.after)}</p>
  <div id="journal">
    <h3 class="sub">${icon('du')}${esc(s.journal.h)}</h3>
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
    <h2>${icon('toi')}${esc(s.letgo.h)}</h2>
    <p class="intro">${esc(s.letgo.intro)}</p>
    ${listTool('letgo', s.letgo, c)}
    <h3 class="sub">${esc(s.letgo.purposeH)}</h3>
    <p class="purpose"><span>${esc(s.letgo.purpose[0])}</span><input type="text" maxlength="120" data-save="purpose-what" placeholder="${esc(s.letgo.ph1)}" aria-label="${esc(s.letgo.purpose[0])}"><span>${esc(s.letgo.purpose[1])}</span><input type="text" maxlength="120" data-save="purpose-whom" placeholder="${esc(s.letgo.ph2)}" aria-label="${esc(s.letgo.purpose[1])}"></p>
    <p class="note">${esc(s.letgo.after)}</p>
  </div>
</section>

<section class="wrap section" id="my-circle">
  <h2>${icon('an')}${esc(s.circle.h)}</h2>
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
    <h2>${icon('dao')}${esc(s.balance.h)}</h2>
    <p class="intro">${esc(s.balance.intro)}</p>
    <form id="balance-form" class="balance">
      ${ranges('b', s.balance.areas)}
    </form>
    <p class="note" id="balance-result" data-result="${esc(s.balance.result)}" data-even="${esc(s.balance.even)}">${esc(s.balance.even)}</p>
  </div>
</section>

<section class="wrap section narrow">
  <div class="note"><strong>${esc(s.first.h)}.</strong> ${esc(s.first.text)} <a href="${f.practice}#timer">${esc(s.first.cta)} →</a></div>
</section>`;
}

/* ---------- Daily life ---------- */
function life(t) {
  const s = t.life;
  return `${pageHead(brand(t), s.h, s.lead)}
<section class="wrap section">
  <div class="grid two">${s.items.map((x) => `<article class="card situation v-${x.voice}">
    <header>${icon(x.icon)}<div><h2>${esc(x.name)}</h2><span class="tag">${esc(s.labels.voice)}: ${esc(s.voices[x.voice])}</span></div></header>
    <dl><dt>${esc(s.labels.see)}</dt><dd>${esc(x.see)}</dd><dt>${esc(s.labels.act)}</dt><dd>${esc(x.act)}</dd><dt>${esc(s.labels.ask)}</dt><dd class="ask">${esc(x.ask)}</dd></dl>
  </article>`).join('')}</div>
  <p class="note">${esc(s.caution)}</p>
</section>`;
}

/* ---------- Circles of An ---------- */
function circlePage(t) {
  const s = t.circle;
  const verse = ([h, lines]) => `<article class="card verse"><h3>${esc(h)}</h3>${lines.map((x) => `<p>${esc(x)}</p>`).join('')}</article>`;
  return `${pageHead(brand(t), s.h, s.lead, `<p class="actions no-print"><button class="btn" type="button" id="print-btn">${esc(s.week.print)}</button></p>`)}

<section class="wrap section">
  <h2>${esc(s.day.h)}</h2>
  <ol class="dayline">${s.day.parts.map(([n, x], i) => `<li class="d-${i}"><span class="sun" aria-hidden="true"></span><h3>${esc(n)}</h3><p>${esc(x)}</p></li>`).join('')}</ol>
</section>

<section class="band">
  <div class="wrap section">
    <h2>${esc(s.words.h)}</h2>
    <p class="intro">${esc(s.words.intro)}</p>
    <div class="grid two">${verse(s.words.morning)}${verse(s.words.evening)}</div>
  </div>
</section>

<section class="wrap section">
  <h2>${esc(s.week.h)}</h2>
  <p class="intro">${esc(s.week.intro)}</p>
  <div class="agenda-bar" aria-hidden="true">${s.week.agenda.map(([m, n], i) => `<span style="flex:${m}" class="a-${i}">${esc(n)}<small>${m}′</small></span>`).join('')}</div>
  <ol class="agenda">${s.week.agenda.map(([m, n, x]) => `<li><b>${m} ${esc(s.week.min)}</b><div><h3>${esc(n)}</h3><p>${esc(x)}</p></div></li>`).join('')}</ol>
  <h3 class="sub">${esc(s.week.rulesH)}</h3>
  <ol class="rules">${li(s.week.rules)}</ol>
</section>

<section class="band">
  <div class="wrap section">
    <h2>${esc(s.marks.h)}</h2>
    <p class="intro">${esc(s.marks.intro)}</p>
    <dl class="apply">${s.marks.items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  </div>
</section>

<section class="wrap section">
  <h2>${esc(s.commit.h)}</h2>
  <p class="intro">${esc(s.commit.intro)}</p>
  <ol class="tiles nine">${s.commit.items.map((x, i) => `<li><div><b>${i + 1}</b><span>${esc(x)}</span></div></li>`).join('')}</ol>
  <p class="actions no-print"><a class="btn" href="${FILES[t.lang].wp}#sec-11">${esc(t.nav.wp)} →</a></p>
</section>`;
}

/* ---------- Q&A ---------- */
function faq(t) {
  const s = t.faq;
  return `${pageHead(brand(t), s.h, s.lead)}
<section class="wrap section narrow">
  ${s.groups.map((g) => `<h2>${esc(g.h)}</h2><div class="faq">${g.items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`).join('\n  ')}
</section>
<section class="band" id="glossary">
  <div class="wrap section">
    <h2>${esc(s.glossH)}</h2>
    <div class="table-wrap"><table><thead><tr>${s.glossHead.map((x) => `<th>${esc(x)}</th>`).join('')}</tr></thead>
    <tbody>${s.gloss.map((r) => `<tr><th scope="row">${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</tbody></table></div>
    <p class="muted">${esc(t.common.credit)}</p>
  </div>
</section>`;
}

/* ---------- Roadmap ---------- */
function road(t) {
  const r = t.road;
  const f = FILES[t.lang];
  const p = r.progress;
  return `${pageHead(brand(t), r.h, r.lead)}

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

/* ---------- White paper ---------- */
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
  html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>')
    .replace('<p>[[flow]]</p>', flow(t.home.one))
    .replace('<p>[[circle]]</p>', circleFigure(t.home.circle.nodes.map((x) => x.name)));
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

/* ---------- Write everything ---------- */
const render = { home, lessons: lessonsIndex, practice, self, life, circle: circlePage, wp: whitepaper, faq, road };
mkdirSync('en', { recursive: true });
const sitemap = [];
for (const t of [vi, en]) {
  const f = FILES[t.lang];
  for (const p of FOOT) {
    out(f.dir + f[p], layout(t, p, render[p](t)));
    sitemap.push(BASE + f.dir + (f[p] === 'index.html' ? '' : f[p]));
  }
  for (const l of LESSONS[t.lang]) {
    const files = { vi: lessonFile('vi', l.i), en: lessonFile('en', l.i) };
    out(f.dir + files[t.lang], layout(t, 'lesson', lessonPage(t, l), { title: `${l.title} — ${t.lessons.h} ${l.i + 1} · ${t.site}`, desc: l.sum, files, nav: 'lessons' }));
    sitemap.push(BASE + f.dir + files[t.lang]);
  }
}

// Old addresses keep working.
const redirect = (to, lang) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>Đạo An</title><meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${to}"></head><body><a href="${to}">Đạo An</a></body></html>\n`;
out('gioi-thieu.html', redirect('index.html', 'vi'));
out('en/peaceful-way.html', redirect('index.html', 'en'));

out('404.html', `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Đạo An</title><link rel="stylesheet" href="/assets/css/style.css"></head><body><main class="wrap section narrow hero-center"><p class="eyebrow">404</p><h1>An</h1><p class="lead">Trang này không có. Hãy trở về điểm bắt đầu.<br>This page does not exist. Return to the beginning.</p><p class="actions"><a class="btn primary" href="/">Đạo An</a><a class="btn" href="/en/">Peaceful Way</a></p></main></body></html>\n`);

writeFileSync('manifest.webmanifest', JSON.stringify({
  name: 'Đạo An · Peaceful Way', short_name: 'Đạo An', description: vi.home.desc, lang: 'vi', start_url: './', scope: './', display: 'standalone',
  background_color: '#f6f2e8', theme_color: '#2f6b57',
  icons: [{ src: 'assets/img/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'assets/img/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: 'assets/img/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
}, null, 2));

writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${BASE}sitemap.xml\n`);

// A plain-text guide for AI assistants and other machine readers.
const llms = (t) => `## ${t.lang === 'vi' ? 'Tiếng Việt' : 'English'}\n\n${t.home.desc}\n\n${FOOT.map((p) => `- [${t[p].h || t.nav[p]}](${BASE}${FILES[t.lang].dir}${FILES[t.lang][p] === 'index.html' ? '' : FILES[t.lang][p]}): ${t[p].desc}`).join('\n')}\n${LESSONS[t.lang].map((l) => `- [${t.lessons.of} ${l.i + 1}: ${l.title}](${BASE}${FILES[t.lang].dir}${lessonFile(t.lang, l.i)}): ${l.sum}`).join('\n')}\n`;
writeFileSync('llms.txt', `# Đạo An (Peaceful Way)\n\n> Đạo An is a philosophy of living by Mr.33 (Kabala, Vietnam). It begins from the sentence "I want happiness": drop "I" (the ego), drop "Want" (greed and unsuitable wishes), and only Happiness remains, here and now. Its centre is An (inner peace); its structure is the Circle of Hiếu Đạo: An → Hiếu → Đạo → Đức → Phúc → Tài → An. All content is free.\n\n${llms(en)}\n${llms(vi)}`);

// Offline: the service worker pre-caches every page and asset.
const assets = ['assets/css/style.css', 'assets/js/app.js', 'assets/img/favicon.svg', 'assets/img/icon-192.png', 'assets/img/icon-512.png', 'manifest.webmanifest',
  ...['be-vietnam-pro-vietnamese-400', 'be-vietnam-pro-vietnamese-500', 'be-vietnam-pro-vietnamese-600', 'be-vietnam-pro-latin-400', 'be-vietnam-pro-latin-500', 'be-vietnam-pro-latin-600', 'noto-serif-vietnamese-500', 'noto-serif-vietnamese-600', 'noto-serif-latin-500', 'noto-serif-latin-600'].map((x) => `assets/fonts/${x}-normal.woff2`)];
const list = [...written, ...assets];
const hash = createHash('sha1');
for (const p of list) { try { hash.update(readFileSync(p)); } catch { /* icons are generated separately */ } }
const version = 'an-' + hash.digest('hex').slice(0, 10);
writeFileSync('sw.js', `// Generated by build.mjs. Keeps the whole site available offline.
const V = '${version}';
const FILES = ${JSON.stringify(['./', 'en/', ...list])};
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => Promise.all(FILES.map((f) => c.add(f).catch(() => null)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.open(V).then((c) => c.match(r, { ignoreSearch: true }).then((hit) => {
    const net = fetch(r).then((res) => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit || c.match('404.html'));
    return hit || net;
  })));
});
`);
console.log(`Built ${written.length} pages (${version}).`);
