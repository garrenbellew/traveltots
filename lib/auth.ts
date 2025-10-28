import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function authenticate(username: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { username },
  })

  if (!admin) {
    return null
  }

  const isValid = await verifyPassword(password, admin.password)

  if (!isValid) {
    return null
  }

  return {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    twoFactorEnabled: admin.twoFactorEnabled,
  }
}

