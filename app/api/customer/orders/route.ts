import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customerId = searchParams.get('customerId')
    const email = searchParams.get('email')

    if (!customerId && !email) {
      return NextResponse.json(
        { error: 'Customer ID or email is required' },
        { status: 400 }
      )
    }

    // If customer exists in database, find orders by customerId
    let customer = null
    if (customerId) {
      customer = await prisma.customer.findUnique({
        where: { id: customerId },
      })
    }

    let orders = []
    
    if (customer) {
      // Customer exists, get their orders
      orders = await prisma.order.findMany({
        where: { customerId },
        include: {
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              price: true,
              product: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 10,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else if (email) {
      // Customer doesn't exist in database, try to find orders by email
      console.log('Customer not found, searching for orders by email:', email)
      orders = await prisma.order.findMany({
        where: { customerEmail: email },
        include: {
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              price: true,
              product: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 10,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      console.log('Found orders by email:', orders.length)
    }

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error('Error fetching customer orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

