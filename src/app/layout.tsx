import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import Header from '@/components/Header';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ware — Design Your Perfect Glaze',
  description: 'Pick any color and get a custom ceramic glaze crafted for your work',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ware',
    startupImage: [
      { url: '/icons/splash-1290x2796.png', media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)' },
      { url: '/icons/splash-1179x2556.png', media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)' },
      { url: '/icons/splash-1170x2532.png', media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)' },
      { url: '/icons/splash-1284x2778.png', media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)' },
      { url: '/icons/splash-1125x2436.png', media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)' },
      { url: '/icons/splash-1242x2688.png', media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)' },
      { url: '/icons/splash-828x1792.png', media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)' },
      { url: '/icons/splash-750x1334.png', media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)' },
      { url: '/icons/splash-1536x2048.png', media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)' },
      { url: '/icons/splash-1668x2388.png', media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)' },
      { url: '/icons/splash-2048x2732.png', media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)' },
    ],
  },
  icons: [
    { rel: 'icon', url: '/favicon.png', type: 'image/png' },
    { rel: 'icon', url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
    { rel: 'icon', url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
    { rel: 'apple-touch-icon', url: '/icons/icon-180.png', sizes: '180x180' },
  ],
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
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/icon-120.png" />
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
                  <img src="/logo-white.png" alt="Ware" className="h-8 w-auto mb-4" />
                  <p className="text-sm text-clay-300">
                    Your color. Your glaze. Your craft.
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
                    <li><a href="/help/contact" className="hover:text-white">Contact</a></li>
                    <li><a href="/help/faq" className="hover:text-white">FAQ</a></li>
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
