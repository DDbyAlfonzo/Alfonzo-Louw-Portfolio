import Script from 'next/script';
import { BASE, headerHTML, footerHTML, homeHTML } from '../lib/site';
import { rowsHTML, gridHTML } from '../lib/render';

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div dangerouslySetInnerHTML={{ __html: headerHTML() }} />
      <main id="main">
        <div className="view" id="home" dangerouslySetInnerHTML={{ __html: homeHTML(rowsHTML(), gridHTML()) }} />
      </main>
      <div dangerouslySetInnerHTML={{ __html: footerHTML() }} />
      <Script src={`${BASE}/js/hero.js`} strategy="afterInteractive" />
      <Script src={`${BASE}/js/site.js`} strategy="afterInteractive" />
    </>
  );
}
