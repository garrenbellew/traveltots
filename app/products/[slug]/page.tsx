import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import ProductBookingForm from '@/components/ProductBookingForm'
import type { Metadata } from 'next'
import { generateProductStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo'

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

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const product = await getProduct(params.slug)

  if (!product) {
    return {}
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'
  const title = `${product.name} - Rent in Los Alcázares, Spain | Travel Tots`
  const description = product.description 
    ? `${product.description.substring(0, 155)}... Rent ${product.name.toLowerCase()} in Los Alcázares, Spain.`
    : `Rent ${product.name} in Los Alcázares, Spain. Quality ${product.category.name.toLowerCase()} rental service.`

  return {
    title,
    description,
    keywords: [
      `${product.name} rental spain`,
      `${product.name} rental los alcázares`,
      `${product.name} rental murcia`,
      `${product.category.name.toLowerCase()} rental spain`,
      'baby equipment rental',
    ],
    openGraph: {
      title,
      description,
      type: 'product',
      url: `${siteUrl}/products/${product.slug}`,
      images: product.image ? [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image ? [product.image] : undefined,
    },
    alternates: {
      canonical: `${siteUrl}/products/${product.slug}`,
    },
  }
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'
  
  // Generate structured data
  const productStructuredData = generateProductStructuredData({
    name: product.name,
    description: product.description || `${product.name} rental in Los Alcázares, Spain`,
    image: product.image,
    price: product.price,
    currency: 'EUR',
    availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
    category: product.category.name,
    url: `${siteUrl}/products/${product.slug}`,
  })

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: siteUrl },
    { name: 'Products', url: `${siteUrl}/products` },
    { name: product.category.name, url: `${siteUrl}/products?category=${product.category.slug}` },
    { name: product.name, url: `${siteUrl}/products/${product.slug}` },
  ])

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-primary-600">Home</a></li>
            <li>/</li>
            <li><a href="/products" className="hover:text-primary-600">Products</a></li>
            <li>/</li>
            <li><a href={`/products?category=${product.category.slug}`} className="hover:text-primary-600">{product.category.name}</a></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <article className="grid md:grid-cols-2 gap-12" itemScope itemType="https://schema.org/Product">
          {/* Product Image */}
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden" itemProp="image">
            {product.image ? (
              <Image
                src={product.image}
                alt={`${product.name} - ${product.category.name} rental in Los Alcázares, Spain. Available for rent from Travel Tots.`}
                fill
                className="object-cover"
                unoptimized
                priority
                itemProp="image"
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
            <h1 className="text-4xl font-bold mb-4" itemProp="name">{product.name}</h1>
            
            <div className="mb-6" itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <span className="text-4xl font-bold text-primary-600" itemProp="price">
                {formatCurrency(product.price)}
              </span>
              <meta itemProp="priceCurrency" content="EUR" />
              <meta itemProp="availability" content={product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
              <span className="text-gray-600 ml-2">/ rental period</span>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-lg text-gray-700 whitespace-pre-line" itemProp="description">
                {product.description}
              </p>
            </div>

            {/* Booking Form */}
            <ProductBookingForm product={product} />
          </div>
        </article>
      </div>
    </>
  )
}

