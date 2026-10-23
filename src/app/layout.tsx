import type { Metadata } from 'next';
import { Cormorant_Garamond, Cinzel } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Atelier Éclat | Haute Couture, Swiss Horology & Rare Perfumery',
  description:
    'Experience bespoke luxury fashion, Swiss-engineered automatic timepieces, and rare artisanal fragrances handcrafted for modern connoisseurs.',
  keywords: [
    'luxury fashion',
    'haute couture',
    'swiss watches',
    'cashmere sweater',
    'silk gown',
    'niche perfume',
    'atelier éclat',
  ],
  openGraph: {
    title: 'Atelier Éclat | Haute Couture & Swiss Horology',
    description: 'Bespoke silhouettes, rare materials, and timeless design.',
    url: 'https://atelier-eclat.com',
    siteName: 'Atelier Éclat',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${cinzel.variable} h-full antialiased selection:bg-[#641C32] selection:text-[#FFF9F3]`}
    >
      <body className="min-h-full flex flex-col bg-[#FFF9F3] text-[#17151A] font-sans">
        <Providers>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
