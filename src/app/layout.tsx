import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import Header from '@/components/Header';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ware — Design Your Perfect Glaze',
  description: 'Create custom ceramic glazes matched to your exact color vision',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ware',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-clay-900 text-clay-100 py-12 mt-20">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <img src="/logo.png" alt="Ware" className="h-8 w-auto mb-4 brightness-0 invert" />
                  <p className="text-sm text-clay-300">
                    Custom ceramic glazes designed for your unique vision.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold mb-4">Product</h5>
                  <ul className="space-y-2 text-sm text-clay-300">
                    <li><a href="/design" className="hover:text-white">Design Tool</a></li>
                    <li><a href="/vision-board" className="hover:text-white">Vision Board</a></li>
                    <li><a href="/waitlist" className="hover:text-white">Join Waitlist</a></li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-4">Company</h5>
                  <ul className="space-y-2 text-sm text-clay-300">
                    <li><a href="#" className="hover:text-white">About</a></li>
                    <li><a href="#" className="hover:text-white">Contact</a></li>
                    <li><a href="#" className="hover:text-white">FAQ</a></li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-4">Legal</h5>
                  <ul className="space-y-2 text-sm text-clay-300">
                    <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-clay-700 mt-8 pt-8 text-center text-sm text-clay-400">
                &copy; 2026 Ware. All rights reserved.
              </div>
            </div>
          </footer>
        </AuthProvider>

        {/* Register Service Worker for PWA installability */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
