import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const nunito = Nunito({ 
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800', '900'],
  style: ['normal', 'italic']
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'
const siteName = 'Travel Tots'
const defaultDescription = 'Quality child essentials rental in Spain. Car seats, travel cots, prams, strollers, and baby gear for families traveling to Los Alcázares, Murcia. Safe, affordable, and convenient rental service.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Child Essentials Rental in Spain`,
    template: `%s | ${siteName}`
  },
  description: defaultDescription,
  keywords: [
    'baby equipment rental spain',
    'car seat rental murcia',
    'travel cot rental los alcázares',
    'pram rental spain',
    'stroller rental murcia',
    'baby gear rental',
    'child safety equipment spain',
    'family travel essentials',
    'baby equipment hire spain',
    'travel with baby spain'
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - Child Essentials Rental in Spain`,
    description: defaultDescription,
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Quality baby equipment rental in Spain`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Child Essentials Rental in Spain`,
    description: defaultDescription,
    images: [`${siteUrl}/logo.png`],
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
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': `${siteUrl}/rss.xml`,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <Navigation />
        <main className="min-h-screen" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

