import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '30done - 30-Day Fitness Challenges',
  description: 'Complete 30-day fitness challenges and build lasting habits with our streak-based tracking system.',
  generator: 'v0.dev',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
