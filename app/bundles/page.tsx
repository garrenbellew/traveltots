import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import BundleBookingForm from '@/components/BundleBookingForm'

export const dynamic = 'force-dynamic'

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

  return (
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
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      This bundle includes:
                    </p>
                    <ul className="space-y-2 mb-6">
                      {bundle.products.map(pb => (
                        <li key={pb.id} className="flex items-center gap-3 text-gray-700">
                          <span className="font-medium w-8">{pb.quantity}x</span>
                          <span>{pb.product.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bundle Booking Form */}
                  <BundleBookingForm bundleId={bundle.id} bundleName={bundle.name} />

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t">
                    {bundle.products.map(pb => (
                      <Link
                        key={pb.product.id}
                        href={`/products/${pb.product.slug}`}
                        className="hover:opacity-80 transition-opacity"
                      >
                        <ProductCard product={pb.product} />
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
  )
}

