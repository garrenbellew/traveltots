'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { getCart, removeFromCart, updateCartItemQuantity, CartItem } from '@/lib/cart'
import OrderForm from '@/components/OrderForm'
import { Trash2 } from 'lucide-react'

interface ExtendedCartItem extends CartItem {
  rentalStartDate?: string
  rentalEndDate?: string
  days?: number
  unitPrice?: number
}

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<ExtendedCartItem[]>([])
  const [commonStartDate, setCommonStartDate] = useState('')
  const [commonEndDate, setCommonEndDate] = useState('')

  useEffect(() => {
    loadCart()
  }, [])

  function loadCart() {
    const cartItems = getCart()
    setCart(cartItems)
    
    // Set common dates if all items have the same rental dates
    if (cartItems.length > 0) {
      const firstItem = cartItems[0] as ExtendedCartItem
      if (firstItem.rentalStartDate && firstItem.rentalEndDate) {
        setCommonStartDate(firstItem.rentalStartDate)
        setCommonEndDate(firstItem.rentalEndDate)
      }
    }
  }

  const handleRemove = (productId: string) => {
    removeFromCart(productId)
    loadCart()
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateCartItemQuantity(productId, quantity)
    loadCart()
  }

  const allItemsHaveSameDates = cart.length > 0 && cart.every((item: ExtendedCartItem) => 
    item.rentalStartDate === cart[0].rentalStartDate && 
    item.rentalEndDate === cart[0].rentalEndDate
  )

  const subtotal = cart.reduce((sum, item: ExtendedCartItem) => sum + (item.price * item.quantity), 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Booking Request</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Cart Items */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Shopping Cart ({cart.length} items)</h2>
          
          {cart.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">Your cart is empty.</p>
              <a href="/products" className="btn btn-primary">
                Browse Products
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item: ExtendedCartItem) => (
                <div key={item.productId} className="card">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.productName}</h3>
                      {item.rentalStartDate && item.rentalEndDate && (
                        <p className="text-sm text-gray-600">
                          {item.days} days: {item.rentalStartDate} to {item.rentalEndDate}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <label className="text-sm text-gray-600">Quantity:</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">
                        {formatCurrency(item.price)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-500">
                          {formatCurrency(item.price / item.quantity)}/item
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove from cart"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="card bg-gray-50">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600 text-2xl">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Booking Information</h2>
          {cart.length > 0 ? (
            <OrderForm 
              cart={cart}
              totalPrice={subtotal}
            />
          ) : (
            <p className="text-gray-600">Add items to your cart to checkout</p>
          )}
        </div>
      </div>
    </div>
  )
}

