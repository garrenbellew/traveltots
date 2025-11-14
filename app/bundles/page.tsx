import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import BundleBookingForm from '@/components/BundleBookingForm'
import { formatCurrency } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Product Bundles',
  description: 'Save money with our baby equipment bundles in Los Alcázares, Spain. Convenient packages combining car seats, travel cots, prams, and more at discounted prices.',
  openGraph: {
    title: 'Baby Equipment Bundles - Travel Tots',
    description: 'Save money with our baby equipment bundles. Convenient packages at discounted prices.',
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'}/bundles`,
  },
}

async function getBundles() {
  return await prisma.bundle.findMany({
    where: {
      isActive: true,
    },
    include: {
      products: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function BundlesPage() {
  const bundles = await getBundles()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'
  
  // Generate ItemList structured data for bundles
  const itemListStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: bundles.map((bundle, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: bundle.name,
        description: bundle.description || `${bundle.name} - Baby equipment bundle`,
        url: `${siteUrl}/bundles`,
      },
    })),
  }

  return (
    <>
      {/* Structured Data */}
      {bundles.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListStructuredData),
          }}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Product Bundles</h1>
      
      <p className="text-lg text-gray-600 mb-12">
        Our convenient bundles combine multiple items at a discounted price, perfect for families traveling with babies and young children.
      </p>

      {bundles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No bundles available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {bundles.map(bundle => (
            <div key={bundle.id} className="card">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{bundle.name}</h2>
                {bundle.description && (
                  <p className="text-gray-600">{bundle.description}</p>
                )}
              </div>

              {bundle.products.length > 0 ? (
                <>
                  {/* Bundle Booking Form */}
                  <BundleBookingForm bundleId={bundle.id} bundleName={bundle.name} />

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3 mt-6">
                    <p className="font-semibold mb-2">This bundle includes:</p>
                    {bundle.products.map(pb => (
                      <Link
                        key={pb.id}
                        href={`/products/${pb.product.slug}`}
                        className="block hover:text-primary-600 transition-colors border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{pb.product.name} x{pb.quantity}</span>
                          <span className="font-medium text-gray-700 text-sm">{formatCurrency(pb.product.price)} / week</span>
                        </div>
                        {pb.product.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{pb.product.description}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">No products in this bundle yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  )
}

