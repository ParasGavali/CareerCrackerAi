import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport = {
  themeColor: '#7c3aed',
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} style={{ background: '#0a0a0f' }}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#12121f',
                color: '#f8fafc',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
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
