'use client'

import { useState, useEffect } from 'react'
import { Calendar, ShoppingCart } from 'lucide-react'
import { addToCart } from '@/lib/cart'

interface BundleProduct {
  productId: string
  productName: string
  price: number
  image: string | null
  quantity: number
}

interface BundleBookingFormProps {
  bundleId: string
  bundleName: string
}

export default function BundleBookingForm({ bundleId, bundleName }: BundleBookingFormProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  async function handleAddBundleToCart() {
    if (!startDate || !endDate) {
      alert('Please select rental dates')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/bundles/${bundleId}/add-to-cart`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load bundle products')
      }

      // Calculate days
      const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))

      // Add each product in the bundle to cart
      data.items.forEach((item: BundleProduct) => {
        // Add item.quantity times to cart
        for (let i = 0; i < item.quantity; i++) {
          addToCart({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            image: item.image,
            quantity: 1,
            rentalStartDate: startDate,
            rentalEndDate: endDate,
            days: days,
            unitPrice: item.price,
          } as any)
        }
      })

      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 3000)
      // Redirect to cart
      window.location.href = '/cart'
    } catch (error) {
      console.error('Error adding bundle to cart:', error)
      alert('Failed to add bundle to cart')
    } finally {
      setLoading(false)
    }
  }

  const days = startDate && endDate 
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="card mt-6">
      <h3 className="text-xl font-semibold mb-4">Book This Bundle</h3>
      
      <div className="space-y-4">
        <div>
          <label className="label flex items-center gap-2">
            <Calendar size={18} />
            Rental Start Date
          </label>
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
          <label className="label flex items-center gap-2">
            <Calendar size={18} />
            Rental End Date
          </label>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input"
            required
          />
        </div>

        {days > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Rental period: <strong>{days} day{days !== 1 ? 's' : ''}</strong>
            </p>
          </div>
        )}

        <button
          onClick={handleAddBundleToCart}
          disabled={loading || !startDate || !endDate || addedToCart}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} />
          {loading ? 'Adding to Cart...' : addedToCart ? '✅ Added to Cart!' : `Add "${bundleName}" Bundle to Cart`}
        </button>

        {addedToCart && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 text-center">
              Bundle added! Redirecting to cart...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

