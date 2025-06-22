import type { Metadata, Viewport } from 'next'
import './globals.css'
import { PWAInstaller, IOSInstallPrompt } from '@/components/pwa-installer'
import { PWADebug } from '@/components/pwa-debug'
import { OfflineBanner } from '@/components/offline-banner'

export const metadata: Metadata = {
  title: '30done - 30-Day Fitness Challenges',
  description: 'Complete 30-day fitness challenges and build lasting habits with our streak-based tracking system.',
  generator: 'v0.dev',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '30done',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: '30done',
    title: '30done - 30-Day Fitness Challenges',
    description: 'Complete 30-day fitness challenges and build lasting habits with our streak-based tracking system.',
  },
  twitter: {
    card: 'summary',
    title: '30done - 30-Day Fitness Challenges',
    description: 'Complete 30-day fitness challenges and build lasting habits with our streak-based tracking system.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="30done" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="30done" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="border-box h-full flex flex-col min-h-screen ">
        <OfflineBanner />
        {children}
        <PWAInstaller />
        <IOSInstallPrompt />
        <PWADebug />
      </body>
    </html>
  )
}
