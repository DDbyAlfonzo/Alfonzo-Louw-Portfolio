import parts from './parts.json';
import { CONTACT } from './cases';

/** Base path for GitHub Pages project sites, e.g. "/Alfonzo-Louw-Portfolio". Empty for a custom domain. */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ddbyalfonzo.github.io';
export const img = (key: string) => `${BASE}/img/${key}.webp`;

const LI_ICON_HREF = 'href="" target="_blank"';

export function headerHTML() {
  return parts.header
    .replace('href="#top"', `href="${BASE}/"`)
    .replace('href="#work"', `href="${BASE}/#work"`)
    .replace('href="#about"', `href="${BASE}/#about"`)
    .replace('href="#contact"', `href="${BASE}/#contact"`)
    .replace('<li hidden id="navLI">', '<li id="navLI">')
    .replace(LI_ICON_HREF, `href="${CONTACT.linkedin}" target="_blank"`);
}

export function footerHTML() { return parts.footer; }
export function dialogHTML() { return parts.dialog; }

export function homeHTML(rows: string, grid: string) {
  return parts.home
    .replace('src="{{CUT}}"', `src="${BASE}/img/portrait.webp"`)
    .replace('href="#/case/momo-p2p"', `href="${BASE}/work/momo-p2p/"`)
    .replace('<ul class="rows" id="rows"></ul>', `<ul class="rows" id="rows">${rows}</ul>`)
    .replace('<ul class="grid" id="grid"></ul>', `<ul class="grid" id="grid">${grid}</ul>`)
    .replace('<a href="" id="lnkLinkedIn" hidden>LinkedIn</a>', `<a href="${CONTACT.linkedin}" target="_blank" rel="noopener">LinkedIn<span class="sr"> (opens in a new tab)</span></a>`)
    .replace(/\s*<a href="" id="lnkCV" hidden>Download CV<\/a>/, CONTACT.cv ? `<a href="${CONTACT.cv}">Download CV</a>` : '');
}
