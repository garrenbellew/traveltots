import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

// Test data to seed
const seedCategories = [
  { name: 'Car Seats', slug: 'car-seats', description: 'Safe and comfortable car seats for all ages' },
  { name: 'Travel Cots', slug: 'travel-cots', description: 'Portable cots perfect for travel' },
  { name: 'Strollers', slug: 'strollers', description: 'Lightweight strollers for easy travel' },
  { name: 'High Chairs', slug: 'high-chairs', description: 'Portable high chairs for mealtimes' },
  { name: 'Feeding Equipment', slug: 'feeding-equipment', description: 'Bottles, bowls, and feeding accessories' },
]

const seedProducts = [
  {
    name: 'Group 0+ Car Seat (0-13kg)',
    slug: 'group-0-car-seat',
    description: 'Ideal for newborns and infants up to 13kg. Features side impact protection and ISOFIX compatible.',
    price: 40,
    totalStock: 5,
    isActive: true,
    categorySlug: 'car-seats',
  },
  {
    name: 'Group 1/2/3 Car Seat (9-36kg)',
    slug: 'group-1-2-3-car-seat',
    description: 'Versatile car seat growing with your child from 9kg to 36kg. High-back booster seat.',
    price: 50,
    totalStock: 8,
    isActive: true,
    categorySlug: 'car-seats',
  },
  {
    name: 'Car Seat ISO Fix',
    slug: 'car-seat-iso-fix',
    description: 'ISOFIX compatible car seat for easy installation. Suitable for 0-4 years.',
    price: 45,
    totalStock: 6,
    isActive: true,
    categorySlug: 'car-seats',
  },
  {
    name: 'Portable Travel Cot',
    slug: 'portable-travel-cot',
    description: 'Lightweight and compact travel cot. Easy to set up and fold away. Includes mattress.',
    price: 35,
    totalStock: 10,
    isActive: true,
    categorySlug: 'travel-cots',
  },
  {
    name: 'Compact Umbrella Stroller',
    slug: 'compact-umbrella-stroller',
    description: 'Ultra-lightweight stroller perfect for travel. One-hand fold mechanism.',
    price: 25,
    totalStock: 12,
    isActive: true,
    categorySlug: 'strollers',
  },
  {
    name: 'Full-Size Travel Stroller',
    slug: 'full-size-travel-stroller',
    description: 'Comfortable full-size stroller with reclining seat and large storage basket.',
    price: 30,
    totalStock: 8,
    isActive: true,
    categorySlug: 'strollers',
  },
  {
    name: 'Portable High Chair',
    slug: 'portable-high-chair',
    description: 'Compact high chair that attaches to any standard dining chair. Perfect for restaurants.',
    price: 20,
    totalStock: 15,
    isActive: true,
    categorySlug: 'high-chairs',
  },
  {
    name: 'Baby Bottle Set (4 bottles)',
    slug: 'baby-bottle-set',
    description: 'Set of 4 anti-colic baby bottles with different teat sizes. BPA-free.',
    price: 15,
    totalStock: 20,
    isActive: true,
    categorySlug: 'feeding-equipment',
  },
  {
    name: 'Travel Feeding Set',
    slug: 'travel-feeding-set',
    description: 'Complete feeding set including bowls, spoons, and bibs. Easy to clean and store.',
    price: 12,
    totalStock: 18,
    isActive: true,
    categorySlug: 'feeding-equipment',
  },
  {
    name: 'Baby Monitor',
    slug: 'baby-monitor',
    description: 'Wireless video baby monitor with night vision and two-way communication.',
    price: 55,
    totalStock: 5,
    isActive: true,
    categorySlug: 'travel-cots',
  },
  {
    name: 'Baby Bouncer',
    slug: 'baby-bouncer',
    description: 'Comfortable baby bouncer with gentle rocking motion. Suitable from birth.',
    price: 28,
    totalStock: 7,
    isActive: true,
    categorySlug: 'travel-cots',
  },
  {
    name: 'Baby Swing',
    slug: 'baby-swing',
    description: 'Electric baby swing with multiple speeds and music. Perfect for soothing.',
    price: 60,
    totalStock: 4,
    isActive: true,
    categorySlug: 'travel-cots',
  },
]

export async function POST() {
  try {
    // Start transaction - delete existing data
    console.log('Starting database seed...')

    // Delete all orders and related data first (due to foreign key constraints)
    console.log('Deleting order messages...')
    await prisma.orderMessage.deleteMany({})
    
    console.log('Deleting stock blocks...')
    await prisma.stockBlock.deleteMany({})
    
    console.log('Deleting order items...')
    await prisma.orderItem.deleteMany({})
    
    console.log('Deleting orders...')
    await prisma.order.deleteMany({})

    // Delete products
    console.log('Deleting products...')
    await prisma.product.deleteMany({})

    // Delete categories (except those that might be used elsewhere)
    console.log('Deleting unused categories...')
    // Get all categories
    const allCategories = await prisma.category.findMany({})
    const categoryIdsToKeep = new Set<string>()
    
    // Check which categories are used by pages or other entities
    const pages = await prisma.page.findMany({})
    pages.forEach(page => {
      if (page.categoryId) {
        categoryIdsToKeep.add(page.categoryId)
      }
    })

    // Delete only categories not in use
    await prisma.category.deleteMany({
      where: {
        id: {
          notIn: Array.from(categoryIdsToKeep),
        },
      },
    })

    console.log('Creating seed categories...')
    // Create or get categories
    const categoryMap: { [key: string]: string } = {}
    for (const catData of seedCategories) {
      const category = await prisma.category.upsert({
        where: { slug: catData.slug },
        update: catData,
        create: catData,
      })
      categoryMap[catData.slug] = category.id
    }

    console.log('Creating seed products...')
    // Create products
    for (const productData of seedProducts) {
      const categoryId = categoryMap[productData.categorySlug]
      if (!categoryId) {
        console.warn(`Category not found for product: ${productData.name}`)
        continue
      }

      // Use placeholder image from external service
      const { categorySlug, ...productFields } = productData
      // Use placeholder.com for images - you can replace these with actual uploaded images later
      const placeholderImage = `https://placehold.co/400x400/e8f4f8/2563eb?text=${encodeURIComponent(productData.name)}`
      
      await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {
          ...productFields,
          categoryId,
          image: placeholderImage,
        },
        create: {
          ...productFields,
          categoryId,
          image: placeholderImage,
        },
      })
    }

    console.log('Database seed completed successfully!')
    
    return NextResponse.json({
      success: true,
      message: `Database seeded successfully! Created ${seedCategories.length} categories and ${seedProducts.length} products.`,
    })
  } catch (error: any) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to seed database' },
      { status: 500 }
    )
  }
}

