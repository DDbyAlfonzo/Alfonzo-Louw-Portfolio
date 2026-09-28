import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { BASE, headerHTML, footerHTML, dialogHTML, img } from '../../../lib/site';
import { caseHTML, studies } from '../../../lib/render';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return studies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = studies.find((s) => s.slug === slug);
  if (!c) return {};
  const title = `${c.title} case study · Alfonzo Louw`;
  return { title, description: c.summary, openGraph: { title, description: c.summary, images: [{ url: img(c.cover) }] } };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const c = studies.find((s) => s.slug === slug);
  if (!c) notFound();
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div dangerouslySetInnerHTML={{ __html: headerHTML() }} />
      <main id="main">
        <div className="view" id="case" dangerouslySetInnerHTML={{ __html: caseHTML(c) }} />
      </main>
      <div dangerouslySetInnerHTML={{ __html: footerHTML() + dialogHTML() }} />
      <Script src={`${BASE}/js/site.js`} strategy="afterInteractive" />
    </>
  );
}
