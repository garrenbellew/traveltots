/**
 * SEO utilities and structured data generators
 */

export interface LocalBusinessData {
  name: string
  description: string
  url: string
  telephone?: string
  email?: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo?: {
    latitude: string
    longitude: string
  }
  priceRange?: string
  image?: string
  openingHours?: string[]
  sameAs?: string[]
}

export interface ProductData {
  name: string
  description: string
  image?: string
  url: string
  price?: number
  currency?: string
  availability?: string
  category?: string
}

export interface OrganizationData {
  name: string
  url: string
  logo?: string
  description?: string
  contactPoint?: {
    telephone?: string
    contactType: string
    email?: string
  }
  sameAs?: string[]
}

export interface ServiceData {
  name: string
  description: string
  provider: {
    name: string
    url: string
  }
  areaServed?: string
  serviceType?: string
}

/**
 * Generate LocalBusiness structured data (JSON-LD)
 */
export function generateLocalBusinessSchema(data: LocalBusinessData & { areaServed?: any }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    description: data.description,
    url: data.url,
    ...(data.telephone && { telephone: data.telephone }),
    ...(data.email && { email: data.email }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry,
    },
    ...(data.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: data.geo.latitude,
        longitude: data.geo.longitude,
      },
    }),
    ...(data.priceRange && { priceRange: data.priceRange }),
    ...(data.image && { image: data.image }),
    ...(data.openingHours && { openingHours: data.openingHours }),
    ...(data.sameAs && { sameAs: data.sameAs }),
    ...(data.areaServed && { areaServed: data.areaServed }),
  }
}

/**
 * Generate Product structured data (JSON-LD)
 */
export function generateProductSchema(data: ProductData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    ...(data.image && { image: data.image }),
    url: data.url,
    ...(data.price && {
      offers: {
        '@type': 'Offer',
        priceCurrency: data.currency || 'EUR',
        price: data.price.toString(),
        ...(data.availability && { availability: `https://schema.org/${data.availability}` }),
      },
    }),
    ...(data.category && { category: data.category }),
  }
}

/**
 * Generate Product structured data (alias for compatibility)
 */
export function generateProductStructuredData(data: ProductData) {
  return generateProductSchema(data)
}

/**
 * Generate Organization structured data (JSON-LD)
 */
export function generateOrganizationSchema(data: OrganizationData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    ...(data.logo && { logo: data.logo }),
    ...(data.description && { description: data.description }),
    ...(data.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...(data.contactPoint.telephone && { telephone: data.contactPoint.telephone }),
        contactType: data.contactPoint.contactType,
        ...(data.contactPoint.email && { email: data.contactPoint.email }),
      },
    }),
    ...(data.sameAs && { sameAs: data.sameAs }),
  }
}

/**
 * Generate Organization structured data (alias for compatibility)
 */
export function generateOrganizationStructuredData(data: OrganizationData) {
  return generateOrganizationSchema(data)
}

/**
 * Generate BreadcrumbList structured data (JSON-LD)
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate BreadcrumbList structured data (alias for compatibility)
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return generateBreadcrumbSchema(items)
}

/**
 * Generate WebSite structured data with SearchAction (JSON-LD)
 */
export function generateWebSiteSchema(siteUrl: string, siteName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate FAQPage structured data (JSON-LD)
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate Service structured data (JSON-LD)
 */
export function generateServiceSchema(data: ServiceData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.name,
    description: data.description,
    provider: {
      '@type': 'Organization',
      name: data.provider.name,
      url: data.provider.url,
    },
    ...(data.areaServed && { areaServed: data.areaServed }),
    ...(data.serviceType && { serviceType: data.serviceType }),
  }
}

/**
 * Generate Service structured data (alias for compatibility)
 */
export function generateServiceStructuredData(data: ServiceData) {
  return generateServiceSchema(data)
}
