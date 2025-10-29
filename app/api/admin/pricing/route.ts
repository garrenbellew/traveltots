import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    let config = await prisma.pricingConfig.findFirst()
    
    // If no config exists, create default
    if (!config) {
      config = await prisma.pricingConfig.create({
        data: {
          weeklyPricePercentIncrease: 10,
          minOrderValue: 50,
          airportMinOrder: 75,
          bundleDiscountPercent: 0,
        },
      })
    }

    return NextResponse.json(config)
  } catch (error: any) {
    console.error('Error fetching pricing config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing config' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      weeklyPricePercentIncrease,
      minOrderValue,
      airportMinOrder,
      bundleDiscountPercent,
    } = body

    let config = await prisma.pricingConfig.findFirst()
    
    if (config) {
      config = await prisma.pricingConfig.update({
        where: { id: config.id },
        data: {
          weeklyPricePercentIncrease: parseFloat(weeklyPricePercentIncrease) || 10,
          minOrderValue: parseFloat(minOrderValue) || 0,
          airportMinOrder: parseFloat(airportMinOrder) || 0,
          bundleDiscountPercent: parseFloat(bundleDiscountPercent) || 0,
        },
      })
    } else {
      config = await prisma.pricingConfig.create({
        data: {
          weeklyPricePercentIncrease: parseFloat(weeklyPricePercentIncrease) || 10,
          minOrderValue: parseFloat(minOrderValue) || 0,
          airportMinOrder: parseFloat(airportMinOrder) || 0,
          bundleDiscountPercent: parseFloat(bundleDiscountPercent) || 0,
        },
      })
    }

    return NextResponse.json({ success: true, config })
  } catch (error: any) {
    console.error('Error updating pricing config:', error)
    return NextResponse.json(
      { error: 'Failed to update pricing config' },
      { status: 500 }
    )
  }
}

