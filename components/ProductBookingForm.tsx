'use client'

import { useState, useEffect } from 'react'
import { addToCart } from '@/lib/cart'
import { formatCurrency } from '@/lib/utils'
import { Calendar, ShoppingCart } from 'lucide-react'

interface ProductBookingFormProps {
  product: {
    id: string
    name: string
    image: string | null
    price: number
    isBundle?: boolean
  }
}

export default function ProductBookingForm({ product }: ProductBookingFormProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [availableStock, setAvailableStock] = useState(0)
  const [loading, setLoading] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (startDate && endDate) {
      checkAvailability()
    }
  }, [startDate, endDate])

  async function checkAvailability() {
    if (!startDate || !endDate) return

    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          startDate,
          endDate,
        }),
      })

      const data = await response.json()
      setAvailableStock(data.available || 0)
    } catch (error) {
      console.error('Error checking availability:', error)
    }
  }

  function handleAddToCart() {
    const days = startDate && endDate 
      ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    // Product price is now the WEEKLY price
    // The pricing calculation in OrderForm will handle extra days charges
    const weeklyPrice = product.price

    addToCart({
      productId: product.id,
      productName: product.name,
      price: weeklyPrice, // This is the weekly price
      image: product.image,
      quantity: 1,
      isBundle: product.isBundle || false,
      // Store rental dates in the cart item
      rentalStartDate: startDate,
      rentalEndDate: endDate,
      days: days,
      unitPrice: product.price, // Weekly price
    } as any)

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  const days = startDate && endDate 
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Product price is now the WEEKLY price
  // Show the weekly price for display - final pricing will be calculated at checkout
  const totalPrice = product.price

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Book This Item</h3>
      
      <div className="space-y-4">
        <div>
          <label className="label">Rental Start Date</label>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label">Rental End Date</label>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input"
            required
          />
        </div>

        {startDate && endDate && availableStock > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              ✓ Stock available: {availableStock} units
            </p>
          </div>
        )}

        {startDate && endDate && availableStock === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ No stock available for these dates. You can still add to cart.
            </p>
          </div>
        )}

        {days > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Rental period:</span>
              <span className="font-semibold">{days} days</span>
            </div>
            <div className="flex justify-between">
              <span>Base weekly price:</span>
              <span className="font-semibold text-primary-600">
                {formatCurrency(totalPrice)}/week
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {days > 7 && days <= 14 && "Additional days will be charged proportionally."}
              {days > 14 && "Special pricing available - see checkout for details."}
            </p>
          </div>
        )}

        {addedToCart ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800 font-semibold">✓ Added to cart!</p>
            <a href="/cart" className="btn btn-primary mt-2 w-full">
              Go to Cart
            </a>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!startDate || !endDate || loading || days === 0}
            className="btn btn-primary w-full flex items-center justify-center"
          >
            <ShoppingCart size={20} className="mr-2" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}

