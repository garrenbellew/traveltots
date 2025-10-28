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
            <ProductCard key={bundle.id} product={bundle} />
          ))}
        </div>
      )}
    </div>
  )
}

