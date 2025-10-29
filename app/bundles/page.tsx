import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import BundleBookingForm from '@/components/BundleBookingForm'
import { formatCurrency } from '@/lib/utils'

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
                  {/* Bundle Booking Form */}
                  <BundleBookingForm bundleId={bundle.id} bundleName={bundle.name} />

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 mt-6">
                    <p className="font-semibold mb-2">This bundle includes:</p>
                    {bundle.products.map(pb => (
                      <Link
                        key={pb.id}
                        href={`/products/${pb.product.slug}`}
                        className="flex justify-between text-sm hover:text-primary-600 transition-colors"
                      >
                        <span>{pb.product.name} x{pb.quantity}</span>
                        <span className="font-medium text-gray-700">{formatCurrency(pb.product.price)} / week</span>
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

