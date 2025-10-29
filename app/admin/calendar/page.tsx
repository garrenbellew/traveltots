'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDateShort, formatCurrency } from '@/lib/utils'
import { Calendar as CalendarIcon, Clock, X, Phone, Mail, MapPin, MessageCircle, Send, AlertTriangle } from 'lucide-react'
import AdminNav from '@/components/AdminNav'

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  flightDetails?: string
  specialRequests?: string
  rentalStartDate: string
  rentalEndDate: string
  status: string
  totalPrice: number
  items: Array<{
    productId: string
    product: { id: string; name: string }
    quantity: number
    price: number
  }>
  messages?: Array<{
    id: string
    message: string
    sender: string
    createdAt: string
  }>
}

interface Product {
  id: string
  name: string
  totalStock: number
}

interface StockWarning {
  productId: string
  productName: string
  required: number
  available: number
  shortfall: number
}

interface OrderDetailProps {
  order: Order
  onClose: () => void
}

function OrderDetailModal({ order, onClose }: OrderDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Mail size={14} />
                  Email
                </p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                  <Phone size={14} />
                  WhatsApp
                </p>
                <div className="flex items-center gap-3">
                  <a 
                    href={`tel:${order.customerPhone}`}
                    className="font-medium text-lg text-green-600 hover:text-green-700"
                  >
                    {order.customerPhone}
                  </a>
                  <a
                    href={`https://wa.me/${order.customerPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-green-500 hover:bg-green-600 text-white text-sm flex items-center gap-2"
                  >
                    <Send size={16} />
                    Message
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-mono text-xs">{order.id}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin size={14} />
                Delivery Address
              </p>
              <p className="font-medium mt-1">{order.customerAddress}</p>
            </div>
          </div>

          {/* Rental Period */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Rental Period</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">{formatDateShort(order.rentalStartDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-medium">{formatDateShort(order.rentalEndDate)}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Items</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <p className="text-lg font-semibold">Total</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(order.totalPrice)}
              </p>
            </div>
          </div>

          {/* Messages */}
          {order.messages && order.messages.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <MessageCircle size={20} />
                Messages
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {order.messages.map((msg) => {
                  const isCustomer = msg.sender === 'CUSTOMER'
                  return (
                    <div
                      key={msg.id}
                      className={`rounded-lg p-3 ${
                        isCustomer
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-green-50 border border-green-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold ${
                          isCustomer ? 'text-blue-700' : 'text-green-700'
                        }`}>
                          {isCustomer ? 'Customer' : 'You'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{msg.message}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Additional Info */}
          {(order.flightDetails || order.specialRequests) && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Additional Information</h3>
              {order.flightDetails && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600">Flight Details</p>
                  <p className="font-medium">{order.flightDetails}</p>
                </div>
              )}
              {order.specialRequests && (
                <div>
                  <p className="text-sm text-gray-600">Special Requests</p>
                  <p className="font-medium">{order.specialRequests}</p>
                </div>
              )}
            </div>
          )}

          {/* Status */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Status</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
              order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end">
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminCalendarPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products?all=true')
      ])
      const ordersData = await ordersRes.json()
      const productsData = await productsRes.json()
      setOrders(ordersData)
      setProducts(productsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get deliveries for selected date (start date)
  const getDeliveriesForDate = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    return orders.filter(order => {
      // Exclude cancelled orders
      if (order.status === 'CANCELLED') return false
      
      const startDate = new Date(order.rentalStartDate)
      startDate.setHours(0, 0, 0, 0)
      return startDate.getTime() === checkDate.getTime()
    })
  }

  // Get collections for selected date (end date)
  const getCollectionsForDate = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    return orders.filter(order => {
      // Exclude cancelled orders
      if (order.status === 'CANCELLED') return false
      
      const endDate = new Date(order.rentalEndDate)
      endDate.setHours(0, 0, 0, 0)
      return endDate.getTime() === checkDate.getTime()
    })
  }

  // Get active rentals on selected date (orders that are ongoing)
  const getActiveRentalsForDate = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    return orders.filter(order => {
      const orderStart = new Date(order.rentalStartDate)
      const orderEnd = new Date(order.rentalEndDate)
      orderStart.setHours(0, 0, 0, 0)
      orderEnd.setHours(0, 0, 0, 0)
      
      return checkDate >= orderStart && checkDate <= orderEnd
    })
  }

  // Calculate stock warnings for selected date
  const getStockWarnings = (date: Date): StockWarning[] => {
    const warnings: StockWarning[] = []
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    // For each product, calculate required quantity and available stock
    products.forEach(product => {
      let required = 0
      let reserved = 0
      
      // Count how many items are needed for the selected date
      orders
        .filter(order => {
          // Only count active orders (not completed or cancelled)
          if (['COMPLETED', 'CANCELLED'].includes(order.status)) return false
          
          const orderStart = new Date(order.rentalStartDate)
          const orderEnd = new Date(order.rentalEndDate)
          orderStart.setHours(0, 0, 0, 0)
          orderEnd.setHours(0, 0, 0, 0)
          
          // Check if order is active on the selected date
          return checkDate >= orderStart && checkDate <= orderEnd
        })
        .forEach(order => {
          order.items.forEach(item => {
            if (item.productId === product.id) {
              required += item.quantity
            }
          })
        })
      
      // Calculate how many are already reserved by orders starting on or before this date
      orders
        .filter(order => {
          if (['COMPLETED', 'CANCELLED'].includes(order.status)) return false
          
          const orderStart = new Date(order.rentalStartDate)
          orderStart.setHours(0, 0, 0, 0)
          
          return orderStart < checkDate
        })
        .forEach(order => {
          order.items.forEach(item => {
            if (item.productId === product.id) {
              const orderEnd = new Date(order.rentalEndDate)
              orderEnd.setHours(0, 0, 0, 0)
              // Only count if order hasn't ended yet
              if (orderEnd >= checkDate) {
                reserved += item.quantity
              }
            }
          })
        })
      
      const available = product.totalStock - reserved
      const shortfall = required - available
      
      if (shortfall > 0) {
        warnings.push({
          productId: product.id,
          productName: product.name,
          required,
          available,
          shortfall
        })
      }
    })
    
    return warnings
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const deliveries = getDeliveriesForDate(selectedDate)
  const collections = getCollectionsForDate(selectedDate)
  const activeRentals = getActiveRentalsForDate(selectedDate)
  const stockWarnings = getStockWarnings(selectedDate)
  const today = new Date()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-green-50 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-green-600" size={24} />
              <h3 className="font-semibold text-green-900">Deliveries</h3>
            </div>
            <p className="text-3xl font-bold text-green-900">{deliveries.length}</p>
            <p className="text-sm text-green-700 mt-1">Items to deliver</p>
          </div>

          <div className="card bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="text-blue-600" size={24} />
              <h3 className="font-semibold text-blue-900">Collections</h3>
            </div>
            <p className="text-3xl font-bold text-blue-900">{collections.length}</p>
            <p className="text-sm text-blue-700 mt-1">Items to collect</p>
          </div>

          <div className="card bg-purple-50 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="text-purple-600" size={24} />
              <h3 className="font-semibold text-purple-900">Active Rentals</h3>
            </div>
            <p className="text-3xl font-bold text-purple-900">{activeRentals.length}</p>
            <p className="text-sm text-purple-700 mt-1">On this date</p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="card mb-8">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-lg">Select Date:</label>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="input"
            />
            <button
              onClick={() => setSelectedDate(new Date())}
              className="btn btn-primary text-sm"
            >
              Today
            </button>
            <button
              onClick={() => {
                const tomorrow = new Date(selectedDate)
                tomorrow.setDate(tomorrow.getDate() + 1)
                setSelectedDate(tomorrow)
              }}
              className="btn border-gray-300 text-gray-700 text-sm"
            >
              Tomorrow
            </button>
          </div>
        </div>

        {/* Stock Warnings */}
        {stockWarnings.length > 0 && (
          <div className="card mb-8 bg-red-50 border-2 border-red-300">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="text-red-600 flex-shrink-0" size={28} />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-900 mb-2">
                  ⚠️ Stock Shortage Warning
                </h2>
                <p className="text-red-700">
                  You need to purchase additional stock for the following products:
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {stockWarnings.map(warning => (
                <div 
                  key={warning.productId}
                  className="bg-white rounded-lg p-4 border border-red-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-gray-900">{warning.productName}</p>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                      Need {warning.shortfall} more
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Required:</p>
                      <p className="font-semibold">{warning.required} items</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Available:</p>
                      <p className="font-semibold text-red-600">{warning.available} items</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deliveries and Collections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Deliveries */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Deliveries ({formatDateShort(selectedDate)})
            </h2>
            
            {deliveries.length === 0 ? (
              <p className="text-gray-500">No deliveries scheduled for this date</p>
            ) : (
              <div className="space-y-3">
                {deliveries.map(order => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="w-full bg-green-50 border border-green-200 rounded-lg p-4 text-left hover:bg-green-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-green-900">{order.customerName}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      {order.items.map(i => `${i.product.name} x${i.quantity}`).join(', ')}
                    </p>
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-2">
                      <span>{order.customerPhone}</span>
                      <span className="text-primary-600">
                        Click for full details →
                      </span>
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Collections */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Collections ({formatDateShort(selectedDate)})
            </h2>
            
            {collections.length === 0 ? (
              <p className="text-gray-500">No collections due on this date</p>
            ) : (
              <div className="space-y-3">
                {collections.map(order => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 text-left hover:bg-blue-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-blue-900">{order.customerName}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      {order.items.map(i => `${i.product.name} x${i.quantity}`).join(', ')}
                    </p>
                    <p className="text-xs text-blue-600 mt-2 flex items-center gap-2">
                      <span>{order.customerPhone}</span>
                      <span className="text-primary-600">
                        Click for full details →
                      </span>
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}
