import type { Metadata } from 'next';
import { Inter, Pacifico } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartSidebar from '@/components/cart/CartSidebar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import WelcomePopup from '@/components/WelcomePopup';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
});

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script'
});

export const metadata: Metadata = {
  title: 'Peptive - Precision Crafted Research Peptides',
  description: 'High-purity compounds. Independent lab verification. Trusted by researchers seeking uncompromised quality.',
  keywords: 'research peptides, high purity peptides, lab verified compounds, scientific research',
  icons: {
    icon: '/logo.avif',
    shortcut: '/logo.avif',
    apple: '/logo.avif',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} ${pacifico.variable}`}>
        <LanguageProvider>
        <div className="flex flex-col min-h-screen">
          <AnnouncementBar />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartSidebar />
          <WhatsAppButton />
        </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
