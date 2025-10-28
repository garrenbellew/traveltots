'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { formatDateShort, formatCurrency } from '@/lib/utils'
import { Package, Calendar, MapPin, Phone, Mail } from 'lucide-react'

interface OrderItem {
  product: {
    id: string
    name: string
    description: string
    price: number
    image: string
  }
  quantity: number
  price: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  rentalStartDate: string
  rentalEndDate: string
  status: string
  totalPrice: number
  items: OrderItem[]
}

export default function OrderSharePage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
              <Package className="h-10 w-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed</h1>
            <p className="text-gray-600 text-lg">Thank you for choosing Travel Tots!</p>
            <div className="mt-4 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Your Rental Details</h2>
          </div>
          
          <div className="p-8 space-y-6">
            {/* Customer Info */}
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Customer</p>
                <p className="text-lg font-semibold text-gray-900">{order.customerName}</p>
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <Mail size={16} />
                  <span className="text-sm">{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-gray-600">
                  <Phone size={16} />
                  <span className="text-sm">{order.customerPhone}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Delivery Address</p>
                <div className="flex items-start gap-2 mt-2">
                  <MapPin size={16} className="text-primary-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{order.customerAddress}</p>
                </div>
              </div>
            </div>

            {/* Rental Period */}
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-primary-600" size={20} />
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Rental Start</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{formatDateShort(order.rentalStartDate)}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-primary-600" size={20} />
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Rental End</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{formatDateShort(order.rentalEndDate)}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Rental Items</h3>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.png'
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg">{item.product.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.product.description}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-sm text-gray-500">Quantity: <span className="font-semibold">{item.quantity}</span></span>
                        <span className="text-sm text-gray-500">Subtotal: <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-3xl font-bold text-primary-600">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600">
          <p className="mb-2">Questions? Contact us via WhatsApp or email</p>
          <p className="text-sm">Travel Tots - Child Essentials Rental</p>
        </div>
      </div>
    </div>
  )
}

