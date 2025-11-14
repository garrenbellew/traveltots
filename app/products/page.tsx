import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our complete range of baby equipment for rent in Los Alcázares, Spain. Car seats, travel cots, prams, strollers, high chairs, and more. Quality equipment, competitive prices.',
  openGraph: {
    title: 'Baby Equipment Rental - Products | Travel Tots',
    description: 'Browse our complete range of baby equipment for rent in Los Alcázares, Spain. Quality equipment, competitive prices.',
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'}/products`,
  },
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

async function getProducts(categorySlug?: string) {
  const where: any = { isActive: true }
  
  if (categorySlug && categorySlug !== 'all') {
    where.category = { slug: categorySlug }
  }

  return await prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  })
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const categories = await getCategories()
  const products = await getProducts(searchParams.category)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'
  
  // Generate ItemList structured data for products
  const itemListStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        url: `${siteUrl}/products/${product.slug}`,
        ...(product.image && { image: product.image }),
        category: product.category.name,
      },
    })),
  }

  return (
    <>
      {/* Structured Data */}
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListStructuredData),
          }}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Our Products</h1>
        
        <CategoryFilter categories={categories} currentCategory={searchParams.category} />
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8" itemScope itemType="https://schema.org/ItemList">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

