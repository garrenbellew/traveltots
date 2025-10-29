'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { addToCart } from '@/lib/cart'

interface BundleProduct {
  productId: string
  productName: string
  price: number
  image: string | null
  quantity: number
}

interface AddBundleToCartProps {
  bundleId: string
  bundleName: string
  startDate?: string
  endDate?: string
  onAdded?: () => void
}

export default function AddBundleToCart({ bundleId, bundleName, startDate, endDate, onAdded }: AddBundleToCartProps) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  async function handleAddBundleToCart() {
    if (!startDate || !endDate) {
      alert('Please select rental start and end dates first')
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

      setAdded(true)
      if (onAdded) onAdded()
      setTimeout(() => setAdded(false), 3000)
    } catch (error) {
      console.error('Error adding bundle to cart:', error)
      alert('Failed to add bundle to cart')
    } finally {
      setLoading(false)
    }
  }

  if (!startDate || !endDate) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-sm text-yellow-800">
          Please select rental dates above to add this bundle to cart
        </p>
      </div>
    )
  }

  return (
    <button
      onClick={handleAddBundleToCart}
      disabled={loading || added}
      className="btn btn-primary w-full flex items-center justify-center gap-2"
    >
      <ShoppingCart size={20} />
      {loading ? 'Adding...' : added ? '✅ Added to Cart!' : `Add "${bundleName}" Bundle to Cart`}
    </button>
  )
}

