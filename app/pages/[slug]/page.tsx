import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { generateBreadcrumbStructuredData } from '@/lib/seo'
import { sanitizeHtml } from '@/lib/sanitize'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await prisma.page.findUnique({
    where: {
      slug: params.slug,
      isActive: true,
    },
  })

  if (!page) {
    return {}
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'
  const description = page.content
    ? page.content.replace(/<[^>]*>/g, '').substring(0, 155) + '...'
    : `${page.title} - Travel Tots baby equipment rental in Los Alcázares, Spain`

  return {
    title: page.title,
    description,
    openGraph: {
      title: `${page.title} | Travel Tots`,
      description,
      type: 'website',
      url: `${siteUrl}/pages/${page.slug}`,
      ...(page.image && {
        images: [
          {
            url: page.image,
            width: 1200,
            height: 630,
            alt: page.title,
          },
        ],
      }),
    },
    alternates: {
      canonical: `${siteUrl}/pages/${page.slug}`,
    },
  }
}

export default async function PagePage({ params }: PageProps) {
  const page = await prisma.page.findUnique({
    where: {
      slug: params.slug,
      isActive: true,
    },
  })

  if (!page) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://traveltots.es'
  
  // Generate breadcrumb structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: siteUrl },
    { name: page.title, url: `${siteUrl}/pages/${page.slug}` },
  ])

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      
      <article className="min-h-screen bg-white" itemScope itemType="https://schema.org/WebPage">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Image */}
          {page.image && (
            <div className="mb-8">
              <img
                src={page.image}
                alt={`${page.title} - Travel Tots baby equipment rental`}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          )}

          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4" itemProp="headline">{page.title}</h1>
          </header>

          {/* Page Content */}
          <div className="prose prose-lg max-w-none" itemProp="text">
            <div 
              className="text-gray-700 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }}
            />
          </div>
        </div>
      </article>
    </>
  )
}

