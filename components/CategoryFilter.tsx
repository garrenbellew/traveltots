'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface CategoryFilterProps {
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
  currentCategory?: string
}

export default function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  const searchParams = useSearchParams()

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        href="/products"
        className={`px-4 py-2 rounded-full font-medium transition ${
          !currentCategory || currentCategory === 'all'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        All
      </Link>
      {categories.map(category => (
        <Link
          key={category.id}
          href={`/products?category=${category.slug}`}
          className={`px-4 py-2 rounded-full font-medium transition ${
            currentCategory === category.slug
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}

