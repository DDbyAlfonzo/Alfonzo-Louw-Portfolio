import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BASE, SITE_URL } from '../lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Alfonzo Louw · Senior Product Designer',
  description: 'Alfonzo Louw is a senior product designer turning complex problems into simple experiences. He researches, designs, animates and builds digital products.',
  icons: { icon: `${BASE}/favicon.png`, apple: `${BASE}/favicon.png` },
  openGraph: {
    type: 'website', title: 'Alfonzo Louw · Senior Product Designer',
    description: 'Senior product designer turning complex problems into simple experiences. Work for FNB, ABSA, Capitec, Discovery and MTN MoMo.',
    images: [{ url: `${BASE}/og.jpg`, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#5E0B11' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,300..900&family=Instrument+Sans:wght@400..700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `window.__BASE=${JSON.stringify(BASE)};` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
