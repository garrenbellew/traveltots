import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import ProductBookingForm from '@/components/ProductBookingForm'

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  })

  if (!product) {
    return null
  }

  return product
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-4">
            <span className="text-sm text-primary-600 font-medium">
              {product.category.name}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="mb-6">
            <span className="text-4xl font-bold text-primary-600">
              {formatCurrency(product.price)}
            </span>
            <span className="text-gray-600 ml-2">/ rental period</span>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-lg text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Booking Form */}
          <ProductBookingForm product={product} />
        </div>
      </div>
    </div>
  )
}

