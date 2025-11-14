import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    image: string | null
    category: {
      name: string
      slug: string
    }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article itemScope itemType="https://schema.org/Product" className="card hover:shadow-lg transition-all">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={`${product.name} - ${product.category.name} rental in Los Alcázares, Spain`}
              fill
              className="object-cover"
              unoptimized
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <span className="text-sm text-primary-600 font-medium" itemProp="category">
            {product.category.name}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2" itemProp="name">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2" itemProp="description">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="priceCurrency" content="EUR" />
            <span itemProp="price">{formatCurrency(product.price)}</span>
          </span>
          <button className="btn btn-primary text-sm" aria-label={`View ${product.name} details`}>
            <ShoppingCart size={18} className="mr-1" />
            View
          </button>
        </div>
      </Link>
    </article>
  )
}

