import Link from 'next/link'
import { Package, Shield, Clock, Star, User, CheckCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { 
  generateOrganizationStructuredData, 
  generateServiceStructuredData,
  generateLocalBusinessSchema,
  generateWebSiteSchema 
} from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Quality child essentials rental in Los Alcázares, Spain. Car seats, travel cots, prams, strollers, and baby gear for families. Safe, affordable, and convenient rental service with delivery.',
  openGraph: {
    title: 'Travel Tots - Child Essentials Rental in Los Alcázares, Spain',
    description: 'Quality child essentials rental in Los Alcázares, Spain. Car seats, travel cots, prams, strollers, and baby gear for families. Safe, affordable, and convenient rental service.',
    type: 'website',
  },
}

async function getPopularCategories() {
  try {
    const admin = await prisma.admin.findFirst()
    if (!admin || !admin.popularCategories) {
      return []
    }
    
    const categorySlugs = admin.popularCategories.split(',').map(s => s.trim()).filter(s => s)
    
    const categories = await prisma.category.findMany({
      where: {
        slug: {
          in: categorySlugs
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    // Sort by the order in popularCategories string
    return categorySlugs
      .map(slug => categories.find(c => c.slug === slug))
      .filter((c): c is typeof categories[0] => c !== undefined)
  } catch (error) {
    console.error('Error fetching popular categories:', error)
    return []
  }
}

const categoryEmojis: Record<string, string> = {
  'car-seats': '🚗',
  'travel-cots': '🛏️',
  'prams': '🛴',
  'high-chairs': '🪑',
  'toys': '🧸',
  'strollers': '👶',
}

export default async function Home() {
  const popularCategories = await getPopularCategories()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'
  
  // Get contact info from database
  let contactEmail = 'info@traveltots.es'
  let contactPhone: string | undefined
  try {
    const admin = await prisma.admin.findFirst()
    if (admin) {
      contactEmail = admin.contactEmail || contactEmail
      contactPhone = admin.contactPhone || undefined
    }
  } catch (error) {
    console.error('Error fetching contact info:', error)
  }
  
  // Generate structured data
  const organizationStructuredData = generateOrganizationStructuredData({
    name: 'Travel Tots',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Quality child essentials rental service in Los Alcázares, Spain',
    contactPoint: {
      contactType: 'Customer Service',
      email: contactEmail,
      ...(contactPhone && { telephone: contactPhone }),
    },
  })

  const localBusinessStructuredData = generateLocalBusinessSchema({
    name: 'Travel Tots',
    description: 'Quality child essentials rental service in Los Alcázares, Murcia, Spain. Car seats, travel cots, prams, strollers, and baby gear for families.',
    url: siteUrl,
    email: contactEmail,
    ...(contactPhone && { telephone: contactPhone }),
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
    areaServed: 'Los Alcázares, Murcia, Spain',
  })

  const serviceStructuredData = generateServiceStructuredData({
    name: 'Child Essentials Rental Service',
    description: 'Rental of car seats, travel cots, prams, strollers, and baby gear for families traveling to Los Alcázares, Spain',
    provider: {
      name: 'Travel Tots',
      url: siteUrl,
    },
    areaServed: 'Los Alcázares, Murcia, Spain',
    serviceType: 'Baby Equipment Rental',
  })

  const websiteStructuredData = generateWebSiteSchema(siteUrl, 'Travel Tots')

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />

      <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-vacation-sandLight via-white to-orange-50 py-8 px-4 overflow-hidden">
        <div className="w-full mx-auto">
          <div className="flex justify-center items-center">
            {/* Travel Tots Logo Image */}
            <img 
              src="/logo.png" 
              alt="Travel Tots - Quality baby equipment rental in Los Alcázares, Spain. Car seats, travel cots, prams, and strollers for families." 
              className="w-full max-w-6xl h-auto object-contain drop-shadow-lg"
              width={1200}
              height={630}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Why Choose Travel Tots?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-vacation-orange to-vacation-orangeLight w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-200 shadow-md">
                <Package className="text-white" size={36} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Quality Equipment</h3>
              <p className="text-gray-600 leading-relaxed">Top-rated car seats, travel cots, and baby gear</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-vacation-ocean to-vacation-oceanLight w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-200 shadow-md">
                <Shield className="text-white" size={36} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Safe & Secure</h3>
              <p className="text-gray-600 leading-relaxed">All equipment meets European safety standards</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-vacation-tropical to-emerald-400 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-200 shadow-md">
                <Clock className="text-white" size={36} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Flexible Rental</h3>
              <p className="text-gray-600 leading-relaxed">From a few days to several weeks</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-vacation-coral to-pink-400 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-200 shadow-md">
                <Star className="text-white" size={36} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Great Service</h3>
              <p className="text-gray-600 leading-relaxed">Personalized service in Los Alcázares</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {popularCategories.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-b from-vacation-sandLight to-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Popular Categories</h2>
            <div className={`grid gap-8 ${popularCategories.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : popularCategories.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' : 'md:grid-cols-3'}`}>
              {popularCategories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/products?category=${category.slug}`}
                  className="card hover:shadow-vacation transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <div className="text-5xl mb-4">{categoryEmojis[category.slug] || '📦'}</div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-vacation-orange transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {category.description || `Browse our ${category.name.toLowerCase()}`}
                  </p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/products" className="btn btn-primary text-lg">
                🌟 View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Customer Account Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-vacation-ocean to-vacation-oceanDark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/20 backdrop-blur-sm w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <User className="h-12 w-12" />
          </div>
          <h2 className="text-4xl font-bold mb-6">Create Your Account</h2>
          <p className="text-xl mb-10 text-white/90">
            Track your orders, message our team, and manage your rental bookings
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10 text-left">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle size={28} className="text-vacation-orange" />
                <h3 className="font-bold text-xl">Order Tracking</h3>
              </div>
              <p className="text-primary-100">View all your orders and their status in one place</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle size={28} className="text-vacation-coral" />
                <h3 className="font-bold text-xl">Direct Messaging</h3>
              </div>
              <p className="text-white/80">Message our team directly about your orders</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle size={28} className="text-vacation-tropical" />
                <h3 className="font-bold text-xl">Easy Cancellation</h3>
              </div>
              <p className="text-white/80">Cancel or modify orders from your dashboard</p>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/customer/register" className="btn bg-white text-vacation-ocean hover:bg-vacation-sandLight text-lg px-10 shadow-lg font-bold">
              ✨ Create Free Account
            </Link>
            <Link href="/customer/login" className="btn border-2 border-white text-white hover:bg-white/10 text-lg px-10 font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

