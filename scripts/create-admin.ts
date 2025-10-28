import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('Create Admin User')
  console.log('=================')

  const username = await question('Username: ')
  const email = await question('Email: ')
  const password = await question('Password: ')

  if (!username || !email || !password) {
    console.log('All fields are required')
    process.exit(1)
  }

  const hashedPassword = await hashPassword(password)

  try {
    await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        twoFactorEnabled: false,
      },
    })

    console.log('\n✓ Admin user created successfully!')
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('\n✗ User already exists')
    } else {
      console.log('\n✗ Error creating admin user:', error.message)
    }
    process.exit(1)
  } finally {
    rl.close()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

