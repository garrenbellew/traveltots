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

export const metadata: Metadata = {
  title: 'Travel Tots - Child Essentials Rental',
  description: 'Quality child essentials for families traveling to Spain. Car seats, travel cots, prams, and more.',
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
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

