import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

async function getBundles() {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      isBundle: true,
    },
    include: {
      category: true,
      bundleProducts: {
        include: {
          includedProduct: {
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map(bundle => (
            <div key={bundle.id} className="card">
              <ProductCard product={bundle} />
              {bundle.bundleProducts && bundle.bundleProducts.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Includes:</p>
                  <ul className="space-y-1">
                    {bundle.bundleProducts.map((bp: any) => (
                      <li key={bp.id} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="font-medium">{bp.quantity}x</span>
                        <span>{bp.includedProduct.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

