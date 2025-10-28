import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'

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
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const categories = await getCategories()
  const products = await getProducts(searchParams.category)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>
      
      <CategoryFilter categories={categories} currentCategory={searchParams.category} />
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

