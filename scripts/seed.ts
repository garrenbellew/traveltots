import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create categories
  const categories = [
    { name: 'Car Seats', slug: 'car-seats', description: 'Safe and comfortable car seats for all ages' },
    { name: 'Travel Cots', slug: 'travel-cots', description: 'Portable sleeping solutions' },
    { name: 'Prams', slug: 'prams', description: 'Strollers and prams' },
    { name: 'Baby Gates', slug: 'baby-gates', description: 'Safety gates and barriers' },
    { name: 'Accessories', slug: 'accessories', description: 'Baby equipment accessories' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('Created categories')

  // Create sample products
  const carSeatsCategory = await prisma.category.findUnique({ where: { slug: 'car-seats' } })
  const travelCotsCategory = await prisma.category.findUnique({ where: { slug: 'travel-cots' } })
  const pramsCategory = await prisma.category.findUnique({ where: { slug: 'prams' } })

  const products = [
    {
      name: 'Group 0+ Car Seat (0-13kg)',
      slug: 'group-0-plus-car-seat',
      description: 'Rear-facing car seat for infants up to 13kg. ISOFIX compatible with 5-point harness for maximum safety.',
      price: 15.00,
      totalStock: 5,
      categoryId: carSeatsCategory!.id,
      image: null,
    },
    {
      name: 'Group 1/2/3 Car Seat (9-36kg)',
      slug: 'group-1-2-3-car-seat',
      description: 'Forward-facing car seat for older children. Adjustable harness and impact protection.',
      price: 18.00,
      totalStock: 8,
      categoryId: carSeatsCategory!.id,
      image: null,
    },
    {
      name: 'Portable Travel Cot',
      slug: 'portable-travel-cot',
      description: 'Lightweight and easy to set up. Perfect for travel. Suitable for children up to 3 years.',
      price: 12.00,
      totalStock: 6,
      categoryId: travelCotsCategory!.id,
      image: null,
    },
    {
      name: 'Compact Umbrella Stroller',
      slug: 'umbrella-stroller',
      description: 'Lightweight and foldable stroller. Perfect for travel and everyday use.',
      price: 10.00,
      totalStock: 4,
      categoryId: pramsCategory!.id,
      image: null,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('Created products')

  // Create admin user
  const hashedPassword = await hashPassword('admin123')
  
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@traveltots.es',
      twoFactorEnabled: false,
    },
  })

  console.log('Created admin user (username: admin, password: admin123)')

  // Create sample pages
  const pages = [
    { title: 'About Us', slug: 'about', content: 'About Travel Tots' },
    { title: 'Terms and Conditions', slug: 'terms', content: 'Terms and conditions' },
    { title: 'Privacy Policy', slug: 'privacy', content: 'Privacy policy' },
  ]

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    })
  }

  console.log('Created pages')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

