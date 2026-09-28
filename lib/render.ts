import { CASES, TOOLS, ROLE, type CaseStudy } from './cases';
import { BASE, img } from './site';

export const esc = (s: unknown) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const arrow = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 9h11M10 4.5L14.5 9 10 13.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const caseHref = (slug: string) => `${BASE}/work/${slug}/`;
const livePill = (c: CaseStudy) => (c.status === 'Live' ? ' <span class="status live"><i aria-hidden="true"></i>Live</span>' : '');
export const studies = CASES.filter((c) => !c.external);

/* ---------- Home: featured rows and the More work grid ---------- */
export function rowsHTML() {
  return CASES.filter((c) => c.featured).map((c) =>
    `<li class="row" style="--hue:${c.hue}"><div class="clip"><a href="${caseHref(c.slug)}" aria-label="${esc(c.title)} case study">` +
    `<div class="shot"><img alt="" loading="lazy" src="${img(c.cover)}"></div>` +
    `<div class="meta"><i aria-hidden="true"></i>${esc(c.who)}${livePill(c)}</div>` +
    `<h3>${esc(c.title)}</h3><p class="what">${esc(c.summary)}</p>` +
    `<div class="foot"><div class="tags">${c.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` +
    `<span class="cta">View case study<span aria-hidden="true">${arrow}</span></span></div></a></div></li>`).join('');
}
export function gridHTML() {
  return CASES.filter((c) => !c.featured).map((c) =>
    `<li style="--hue:${c.hue}"><a href="${caseHref(c.slug)}" aria-label="${esc(c.title)} case study"><div class="shot"><img alt="" loading="lazy" src="${img(c.cover)}"></div>` +
    `<span class="meta"><i aria-hidden="true"></i>${esc(c.who)}${livePill(c)}</span><h4>${esc(c.title)}</h4><p>${esc(c.summary)}</p></a></li>`).join('');
}

/* ---------- Case study page ---------- */
function fig(f: string[]) {
  const src = img(f[0]);
  return `<figure class="fig"><button type="button" data-zoom="${src}" data-cap="${esc(f[1])}" aria-label="Enlarge image: ${esc(f[1])}"><img alt="${esc(f[1])}" loading="lazy" src="${src}"></button><figcaption>${esc(f[1])}</figcaption></figure>`;
}
function factsHTML(c: CaseStudy) {
  const rows = [['Team', c.team], ['Timeline', c.timeline], ['My responsibilities', c.resp]].filter((r) => r[1]);
  return rows.length ? `<dl class="facts">${rows.map((r) => `<div><dt>${r[0]}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl>` : '';
}
function findingsHTML(c: CaseStudy) {
  if (!c.findings) return '';
  return `<section class="csec" id="s-findings" aria-labelledby="h-findings"><h2 class="st" id="h-findings" tabindex="-1">What we found and what changed</h2><ol class="fc">` +
    c.findings.map((f) => `<li><div><span class="fc-l">Found</span><p>${esc(f[0])}</p></div><span class="fc-arrow" aria-hidden="true">${arrow.replace('18" height="18"', '20" height="20"')}</span><div><span class="fc-l ch">Changed</span><p>${esc(f[1])}</p></div></li>`).join('') + '</ol></section>';
}
function metricsTiles(c: CaseStudy) {
  const m = (c.metrics || []).filter((x) => x[1]);
  return m.length ? `<ul class="metrics">${m.map((x) => `<li><b>${esc(x[1])}</b><span>${esc(x[0])}</span></li>`).join('')}</ul>` : '';
}
function measureHTML(c: CaseStudy) {
  if (!c.metrics) return '';
  return `<section class="csec" id="s-measure" aria-labelledby="h-measure"><h2 class="st" id="h-measure" tabindex="-1">How success is measured</h2><ul class="measure">` +
    c.metrics.map((m) => {
      const p = String(m[2] || '').split(' Here: ');
      return `<li><div class="mh">${m[1] ? `<b class="mv">${esc(m[1])}</b>` : ''}<b>${esc(m[0])}</b></div><div><span>${esc(p[0])}</span>${p[1] ? `<em><b>In this project:</b> ${esc(p[1])}</em>` : ''}</div></li>`;
    }).join('') + '</ul></section>';
}

export function caseHTML(c: CaseStudy) {
  const idx = studies.indexOf(c), next = studies[(idx + 1) % studies.length];
  const toc: string[][] = [['overview', 'Overview'], ...c.sections.map((s) => [s.id, s.title]),
    ...(c.findings ? [['findings', 'Found and changed']] : []), ['outcome', 'Outcome'],
    ...(c.metrics ? [['measure', 'Measuring success']] : []), ...(c.learnings ? [['learnings', 'What I learned']] : [])];
  const secs = c.sections.map((s) =>
    `<section class="csec" id="s-${s.id}" aria-labelledby="h-${s.id}"><h2 class="st" id="h-${s.id}" tabindex="-1">${esc(s.title)}</h2>` +
    (s.body || []).map((p) => `<p>${esc(p)}</p>`).join('') +
    (s.cards ? `<ul class="cards">${s.cards.map((k) => `<li><b>${esc(k[0])}</b><span>${esc(k[1])}</span></li>`).join('')}</ul>` : '') +
    (s.figs ? `<div class="figs${s.two ? ' two' : ''}">${s.figs.map(fig).join('')}</div>` : '') + '</section>').join('');
  const status = `<span class="status${c.status === 'Live' ? ' live' : ''}"><i aria-hidden="true"></i>${esc(c.status)}</span>`;
  return '<div class="progress" id="progress" aria-hidden="true"></div>' +
    '<div class="chero" data-dark><div class="wrap">' +
      `<a class="crumb" href="${BASE}/#work"><span>${arrow.replace('<svg', '<svg style="transform:scaleX(-1)"')}</span>All work</a>` +
      `<h1 class="ctitle" id="ctitle">${esc(c.title)}</h1><p class="csum">${esc(c.summary)}</p>` +
      `<dl class="cmeta"><div><dt>Client</dt><dd>${esc(c.client || c.who)}</dd></div><div><dt>My role</dt><dd>${esc(c.role || ROLE)}</dd></div><div><dt>Platform</dt><dd>${esc(c.platform)}</dd></div><div><dt>Status</dt><dd>${status}</dd></div></dl>` +
    '</div></div>' +
    `<div class="wrap ccover" id="ccover"><div class="frame"><img alt="${esc(c.title)} cover" src="${img(c.cover)}" fetchpriority="high"></div></div>` +
    '<div class="wrap cbody">' +
      `<nav class="toc" aria-label="On this page"><p>On this page</p><ol>${toc.map((t) => `<li><a href="#s-${t[0]}" data-to="s-${t[0]}">${esc(t[1])}</a></li>`).join('')}</ol></nav>` +
      '<div class="ccontent">' +
        '<section class="csec" id="s-overview" aria-labelledby="h-overview"><h2 class="st" id="h-overview" tabindex="-1">Overview</h2>' +
          `<div class="split"><div><h3>The problem</h3><p>${esc(c.problem)}</p></div><div><h3>What we did</h3><p>${esc(c.approach)}</p></div></div>${factsHTML(c)}</section>` +
        secs + findingsHTML(c) +
        `<section class="csec" id="s-outcome" aria-labelledby="h-outcome"><h2 class="st" id="h-outcome" tabindex="-1">Outcome</h2><div class="outcome">${status}<p>${esc(c.outcome)}</p>${metricsTiles(c)}</div></section>` +
        measureHTML(c) +
        (c.learnings ? `<section class="csec" id="s-learnings" aria-labelledby="h-learnings"><h2 class="st" id="h-learnings" tabindex="-1">What I learned</h2><ul class="learn">${c.learnings.map((l) => `<li><b>${esc(l[0])}</b><span>${esc(l[1])}</span></li>`).join('')}</ul></section>` : '') +
        `<section class="csec" aria-label="Tools and prototype"><p class="tools-h">Tools</p><div class="toolrow">${(c.tools || TOOLS).map((t) => `<span>${esc(t)}</span>`).join('')}</div>` +
          (c.prototype ? `<p><a class="proto" href="${esc(c.prototype)}" target="_blank" rel="noopener"><span>${arrow}</span>Open the Figma prototype<span class="sr">(opens in a new tab)</span></a></p>` : '') + '</section>' +
      '</div>' +
    '</div>' +
    `<a class="next" href="${caseHref(next.slug)}" data-dark><small>Next case study</small><b>${esc(next.title)}</b><img alt="" loading="lazy" src="${img(next.cover)}"></a>`;
}
