export interface PricingConfig {
  weeklyPricePercentIncrease: number
  minOrderValue: number
  airportMinOrder: number
  bundleDiscountPercent: number
}

export interface CartItem {
  price: number // This is now the WEEKLY price
  quantity: number
  productId?: string // Optional product ID for bundle discount calculation
}

export interface DateRange {
  rentalStartDate: Date | string
  rentalEndDate: Date | string
}

export interface PricingResult {
  subtotal: number
  weeklyPrice: number
  extraDaysCharge: number
  discount: number // For 15+ days, this represents the full discount
  bundleDiscount: number // Discount applied to bundles
  deliveryFee: number
  total: number
  requiresContact: boolean
  message?: string
}

/**
 * Calculate the number of days between two dates
 */
export function calculateDays(startDate: Date | string, endDate: Date | string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Calculate total price for weekly pricing model
 * - Products have a weekly base price
 * - For 1-7 days: charge full weekly price
 * - For 8-14 days: charge weekly price + (extra days * percentage * weekly price)
 * - For 15+ days: return requiresContact flag and show special message
 */
export function calculateDiscountedPrice(
  items: CartItem[],
  dateRange: DateRange,
  pricingConfig: PricingConfig,
  deliveryType?: string
): PricingResult {
  // Validate inputs
  if (!items || items.length === 0) {
      return { 
      subtotal: 0, 
      weeklyPrice: 0,
      extraDaysCharge: 0,
      discount: 0,
      bundleDiscount: 0,
      deliveryFee: 0, 
      total: 0,
      requiresContact: false
    }
  }
  
  if (!pricingConfig) {
    const weeklyPrice = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
      return { 
      subtotal: weeklyPrice,
      weeklyPrice,
      extraDaysCharge: 0,
      discount: 0,
      bundleDiscount: 0,
      deliveryFee: 0, 
      total: weeklyPrice,
      requiresContact: false
    }
  }
  
  // Calculate days
  const days = calculateDays(dateRange.rentalStartDate, dateRange.rentalEndDate)
  
  if (days <= 0) {
    const weeklyPrice = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
      return { 
      subtotal: weeklyPrice,
      weeklyPrice,
      extraDaysCharge: 0,
      discount: 0,
      bundleDiscount: 0,
      deliveryFee: 0, 
      total: weeklyPrice,
      requiresContact: false
    }
  }
  
  // Calculate base weekly price (sum of all product weekly prices)
  const baseWeeklyPrice = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  
  // Calculate bundle discount
  // Note: Bundle discount is calculated based on whether products belong to bundles
  // For now, this is simplified - bundle discount will be 0
  // TODO: Enhance to check product bundle membership via API or passed data
  const bundleDiscountPercent = pricingConfig.bundleDiscountPercent || 0
  const bundleDiscount = 0 // Will be calculated when we have bundle membership data
  
  let extraDaysCharge = 0
  let requiresContact = false
  let message = ''
  
  if (days >= 15) {
    // 15+ days: Full discount applies, require contact
    requiresContact = true
    const discount = baseWeeklyPrice // 100% discount
    message = 'A representative from Travel Tots will contact you to arrange a better package for your extended rental.'
    
    return {
      subtotal: baseWeeklyPrice,
      weeklyPrice: baseWeeklyPrice,
      extraDaysCharge: 0,
      discount,
      bundleDiscount: 0,
      deliveryFee: 0,
      total: 0, // Free
      requiresContact: true,
      message
    }
  } else if (days > 7) {
    // 8-14 days: Charge weekly price + percentage for extra days
    const extraDays = Math.min(days - 7, 7) // Cap at 7 extra days (days 8-14)
    const percentIncrease = pricingConfig.weeklyPricePercentIncrease || 10
    extraDaysCharge = baseWeeklyPrice * (extraDays * percentIncrease / 100)
  }
  // else: 1-7 days: just charge the weekly price
  
  // Calculate subtotal after bundle discount
  const subtotal = baseWeeklyPrice + extraDaysCharge - bundleDiscount
  
  // Apply minimum order value based on delivery type
  const minOrder = deliveryType === 'AIRPORT' ? (pricingConfig.airportMinOrder || 0) : (pricingConfig.minOrderValue || 0)
  
  // Calculate delivery fee - equal to the difference needed to reach minimum order
  // Use subtotal after bundle discount for minimum order calculation
  let deliveryFee = 0
  if (subtotal < minOrder) {
    deliveryFee = minOrder - subtotal
  }
  
  // Final total
  const finalTotal = subtotal + deliveryFee
  
  return {
    subtotal: baseWeeklyPrice + extraDaysCharge, // Subtotal before bundle discount (for display)
    weeklyPrice: baseWeeklyPrice,
    extraDaysCharge,
    discount: 0,
    bundleDiscount,
    deliveryFee,
    total: finalTotal,
    requiresContact: false
  }
}

/**
 * Calculate price per day for display (legacy function, kept for compatibility)
 */
export function calculatePricePerDay(subtotal: number, days: number): number {
  return days > 0 ? subtotal / days : 0
}
