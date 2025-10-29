import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      flightDetails,
      specialRequests,
      rentalStartDate,
      rentalEndDate,
      termsAccepted,
      items,
      totalPrice,
      // Delivery coordination fields
      deliveryType,
      outboundAirport,
      arrivalTime,
      onwardJourney,
      returnAirport,
      returnArrivalTime,
      returnFlightNumber,
      returnDepartureTime,
      accommodationArrival,
      accommodationDeparture,
    } = body

    console.log('Creating order with customerId:', customerId)

    if (!termsAccepted) {
      return NextResponse.json(
        { error: 'You must accept the terms and conditions' },
        { status: 400 }
      )
    }

    // Validate customerId if provided
    let validCustomerId = null
    if (customerId) {
      console.log('Validating customer ID:', customerId)
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      })
      
      if (customer) {
        console.log('Customer found:', customer.name)
        validCustomerId = customerId
      } else {
        console.log('Customer not found with ID:', customerId, '- proceeding as guest order')
        validCustomerId = null
      }
    } else {
      console.log('No customerId provided, creating guest order')
    }

    // Generate unique order number
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const orderNumber = `TT-${timestamp}-${random}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: validCustomerId,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        flightDetails: flightDetails || null,
        specialRequests: specialRequests || null,
        rentalStartDate: new Date(rentalStartDate),
        rentalEndDate: new Date(rentalEndDate),
        termsAccepted,
        totalPrice,
        status: 'PENDING',
        // Delivery coordination fields
        deliveryType: deliveryType || null,
        outboundAirport: outboundAirport || null,
        arrivalTime: arrivalTime || null,
        onwardJourney: onwardJourney || null,
        returnAirport: returnAirport || null,
        returnArrivalTime: returnArrivalTime || null,
        returnFlightNumber: returnFlightNumber || null,
        returnDepartureTime: returnDepartureTime || null,
        accommodationArrival: accommodationArrival || null,
        accommodationDeparture: accommodationDeparture || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Create stock blocks for each item
    for (const orderItem of order.items) {
      await prisma.stockBlock.create({
        data: {
          productId: orderItem.productId,
          orderId: order.id,
          quantity: orderItem.quantity,
          startDate: order.rentalStartDate,
          endDate: order.rentalEndDate,
        },
      })
    }

    // Order confirmation will be sent via WhatsApp by admin from the Orders page

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                image: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

