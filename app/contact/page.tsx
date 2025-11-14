import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { generateLocalBusinessSchema } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Travel Tots in Los Alcázares, Spain. Get in touch for baby equipment rental inquiries, bookings, and support. Email, phone, and location information.',
  openGraph: {
    title: 'Contact Travel Tots - Baby Equipment Rental in Los Alcázares',
    description: 'Contact Travel Tots for baby equipment rental in Los Alcázares, Spain. We\'re here to help with your rental needs.',
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'}/contact`,
  },
}

async function getContactInfo() {
  try {
    const admin = await prisma.admin.findFirst()
    return {
      email: admin?.contactEmail || 'info@traveltots.es',
      phone: admin?.contactPhone || null,
    }
  } catch (error) {
    return {
      email: 'info@traveltots.es',
      phone: null,
    }
  }
}

export default async function ContactPage() {
  const contactInfo = await getContactInfo()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'
  
  // Generate LocalBusiness structured data for contact page
  const localBusinessStructuredData = generateLocalBusinessSchema({
    name: 'Travel Tots',
    description: 'Quality child essentials rental service in Los Alcázares, Murcia, Spain',
    url: siteUrl,
    email: contactInfo.email,
    ...(contactInfo.phone && { telephone: contactInfo.phone }),
    address: {
      streetAddress: 'Los Alcázares',
      addressLocality: 'Los Alcázares',
      addressRegion: 'Murcia',
      postalCode: '30710',
      addressCountry: 'ES',
    },
    geo: {
      latitude: '37.7444',
      longitude: '-0.8500',
    },
    priceRange: '€€',
    image: `${siteUrl}/logo.png`,
    openingHours: [
      'Mo-Sa 09:00-19:00',
    ],
  })
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessStructuredData),
        }}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <p className="text-gray-700 mb-8">
            We're here to help! If you have any questions about our products, need assistance with your booking, or want to discuss special requirements, please don't hesitate to reach out.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <a href={`mailto:${contactInfo.email}`} className="text-primary-600 hover:underline">
                {contactInfo.email}
              </a>
            </div>
            
            {contactInfo.phone && (
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <a href={`tel:${contactInfo.phone}`} className="text-primary-600 hover:underline">
                  {contactInfo.phone}
                </a>
              </div>
            )}
            
            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-gray-700">Los Alcázares, Spain</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-gray-700">
                Monday - Saturday: 9:00 AM - 7:00 PM<br />
                Sunday: By appointment
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-primary-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Browse & Select</h3>
                <p className="text-gray-700 text-sm">Browse our catalog and select the items you need for your rental period.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Submit Request</h3>
                <p className="text-gray-700 text-sm">Fill out our simple booking form with your details and preferred dates.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Confirm & Pay</h3>
                <p className="text-gray-700 text-sm">We'll contact you within 24 hours to confirm availability and arrange payment.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Delivery & Collection</h3>
                <p className="text-gray-700 text-sm">We deliver directly to your accommodation and collect at the end of your rental.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

