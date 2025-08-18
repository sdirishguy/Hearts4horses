import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import PortalBanner from '@/components/PortalBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hearts4Horses Equestrian Center - Equestrian Training & Lessons',
  description: 'Professional horse riding lessons, camps, and equestrian training for all ages and skill levels. Located in a beautiful, safe environment with experienced instructors.',
  keywords: 'horse riding lessons, equestrian training, horse camps, riding instructor, horseback riding, equestrian center',
  authors: [{ name: 'Hearts4Horses Equestrian Center' }],
  openGraph: {
    title: 'Hearts4Horses Equestrian Center - Equestrian Training & Lessons',
    description: 'Professional horse riding lessons, camps, and equestrian training for all ages and skill levels.',
    url: 'https://hearts4horses.com',
    siteName: 'Hearts4Horses Equestrian Center',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hearts4Horses Equestrian Center',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hearts4Horses Equestrian Center - Equestrian Training & Lessons',
    description: 'Professional horse riding lessons, camps, and equestrian training for all ages and skill levels.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <PortalBanner />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
