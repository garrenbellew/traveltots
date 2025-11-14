import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  // Require admin authentication
  const authError = await requireAdminAuth(request)
  if (authError) return authError
  
  try {
    // Get registered customers
    const registeredCustomers = await prisma.customer.findMany({
      include: {
        orders: {
          select: {
            id: true,
            status: true,
            totalPrice: true,
            rentalStartDate: true,
            rentalEndDate: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Get all orders to extract unique customers by email
    const allOrders = await prisma.order.findMany({
      select: {
        customerEmail: true,
        customerName: true,
        customerPhone: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Create a map of customers by email
    const customerMap = new Map()
    
    // Add registered customers
    registeredCustomers.forEach((customer) => {
      customerMap.set(customer.email, {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        // SECURITY: Never expose password hashes, even to admins
        isActive: customer.isActive,
        createdAt: customer.createdAt,
        orders: customer.orders,
        isRegistered: true,
      })
    })

    // Add customers from orders who aren't registered
    allOrders.forEach((order) => {
      if (order.customerEmail && !customerMap.has(order.customerEmail)) {
        customerMap.set(order.customerEmail, {
          id: null,
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          createdAt: order.createdAt,
          orders: [],
          isRegistered: false,
        })
      }
    })

    // Convert map to array
    const customers = Array.from(customerMap.values())

    return NextResponse.json(customers)
  } catch (error: any) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  // Require admin authentication
  const authError = await requireAdminAuth(request)
  if (authError) return authError
  
  try {
    const body = await request.json()
    const { customerId, isActive } = body

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.update({
      where: { id: customerId },
      data: { isActive },
    })

    return NextResponse.json({ success: true, customer })
  } catch (error: any) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    )
  }
}

