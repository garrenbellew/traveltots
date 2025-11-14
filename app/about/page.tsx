import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Travel Tots - your trusted partner for child essentials rental in Los Alcázares, Spain. Quality equipment, safety standards, and personalized service.',
  openGraph: {
    title: 'About Travel Tots - Baby Equipment Rental in Los Alcázares',
    description: 'Learn about Travel Tots - your trusted partner for child essentials rental in Los Alcázares, Spain.',
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'}/about`,
  },
}

export default function AboutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'
  
  // Generate AboutPage structured data
  const aboutPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'Travel Tots',
      description: 'Quality child essentials rental service in Los Alcázares, Spain',
      url: siteUrl,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Los Alcázares',
        addressRegion: 'Murcia',
        addressCountry: 'ES',
      },
    },
  }
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageStructuredData),
        }}
      />
      
      <article className="max-w-4xl mx-auto px-4 py-12" itemScope itemType="https://schema.org/AboutPage">
        <h1 className="text-4xl font-bold mb-8" itemProp="headline">About Travel Tots</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Welcome to Travel Tots, your trusted partner for child essentials in Los Alcázares, Spain!
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
        <p className="mb-6">
          Travel Tots was born from a simple observation: families traveling to Spain often struggle with packing everything their little ones need. From car seats and travel cots to prams and baby gates, traveling families face the challenge of bringing bulky equipment or doing without essential safety items.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
        <p className="mb-6">
          We provide high-quality, safety-tested equipment for rent, making your family vacation smoother and more enjoyable. Our inventory includes:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Car seats for all ages</li>
          <li>Travel cots and Z-beds</li>
          <li>Prams and buggies</li>
          <li>Baby gates and safety equipment</li>
          <li>Convenient bundles for complete packages</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose Us</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>All equipment meets European safety standards</li>
          <li>Convenient delivery and collection service</li>
          <li>Flexible rental periods to suit your travel schedule</li>
          <li>Personalized service from a locally owned business</li>
          <li>No need to pack bulky items or pay excess luggage fees</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="mb-6">
          We're located in Los Alcázares, Spain, and we're here to help make your family trip hassle-free. Contact us with any questions or special requirements.
        </p>
      </div>
    </article>
    </>
  )
}

