import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from 'react-hot-toast';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
});

export const viewport = {
  themeColor: '#004ac6',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'CareerCracker AI - Ace Your Placement',
  description:
    'The ultimate AI-powered aptitude preparation platform for engineering students. Master TCS NQT, Infosys, Wipro, Accenture and more with 10,000+ practice questions, mock tests, and personalized analytics.',
  keywords: [
    'placement preparation', 'aptitude test', 'TCS NQT', 'campus placements',
    'engineering students', 'mock tests', 'online aptitude', 'CareerCracker AI',
  ],
  authors: [{ name: 'CareerCracker AI' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'CareerCracker AI - Ace Your Placement',
    description: 'Master campus placements with AI-powered aptitude preparation.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <body className={`${plusJakarta.className} antialiased`} style={{ background: '#F8FAFC' }}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#FFFFFF',
                color: '#191c1e',
                border: '1px solid rgba(195, 198, 215, 0.4)',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'var(--font-sans), sans-serif',
                boxShadow: '0px 10px 30px rgba(15, 23, 42, 0.05)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ba1a1a',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
