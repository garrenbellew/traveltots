import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create or reuse Prisma client instance
// This ensures we get a fresh client with updated schema after regeneration
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Store in global to prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

