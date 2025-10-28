'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDateShort, formatCurrency } from '@/lib/utils'
import { Package, LogOut, MessageSquare, XCircle, User, Mail, Phone, MapPin, Calendar, Send, Edit, Plus, Minus } from 'lucide-react'

interface Order {
  id: string
  customerName: string
  createdAt: string
  rentalStartDate: string
  rentalEndDate: string
  status: string
  totalPrice: number
  items: Array<{
    productId: string
    product: { id: string; name: string; image: string }
    quantity: number
    price: number
  }>
  messages: Array<{
    id: string
    message: string
    sender: string
    createdAt: string
    isRead: boolean
  }>
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

export default function CustomerDashboardPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [amendingOrder, setAmendingOrder] = useState<Order | null>(null)
  const [amendedItems, setAmendedItems] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem('customer_session')
    if (!session) {
      router.push('/customer/login')
      return
    }

    const customerData = JSON.parse(session)
    setCustomer(customerData)
    fetchOrders(customerData.id, customerData.email)
  }, [])

  async function fetchOrders(customerId: string, email?: string) {
    try {
      // Try with customerId first, but also pass email as fallback
      const url = email 
        ? `/api/customer/orders?customerId=${customerId}&email=${encodeURIComponent(email)}`
        : `/api/customer/orders?customerId=${customerId}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage() {
    if (!selectedOrder || !messageText.trim()) return

    setSendingMessage(true)
    try {
      const session = localStorage.getItem('customer_session')
      const customerData = JSON.parse(session!)

      const response = await fetch('/api/customer/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          customerId: customerData.id,
          message: messageText,
        }),
      })

      if (response.ok) {
        setMessageText('')
        fetchOrders(customerData.id, customerData.email)
        alert('Message sent successfully!')
      } else {
        alert('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('An error occurred')
    } finally {
      setSendingMessage(false)
    }
  }

  async function cancelOrder(orderId: string) {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/customer/orders/${orderId}/cancel`, {
        method: 'POST',
      })

      if (response.ok) {
        const session = localStorage.getItem('customer_session')
        const customerData = JSON.parse(session!)
        fetchOrders(customerData.id, customerData.email)
        alert('Order cancelled successfully')
      } else {
        alert('Failed to cancel order')
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert('An error occurred')
    }
  }

  async function openAmendOrder(order: Order) {
    setAmendingOrder(order)
    setAmendedItems(order.items.map((item: any) => ({
      productId: item.productId,
      productName: item.product.name,
      productImage: item.product.image,
      quantity: item.quantity,
      price: item.price,
      originalQuantity: item.quantity,
    })))

    // Load all products
    setLoadingProducts(true)
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setAllProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  function updateItemQuantity(index: number, newQuantity: number) {
    if (newQuantity < 0) return
    
    const newItems = [...amendedItems]
    if (newQuantity === 0) {
      newItems.splice(index, 1)
    } else {
      newItems[index].quantity = newQuantity
    }
    setAmendedItems(newItems)
  }

  function addProductToOrder(product: any) {
    const existingIndex = amendedItems.findIndex(item => item.productId === product.id)
    if (existingIndex >= 0) {
      const newItems = [...amendedItems]
      newItems[existingIndex].quantity += 1
      setAmendedItems(newItems)
    } else {
      setAmendedItems([...amendedItems, {
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        quantity: 1,
        price: product.price,
      }])
    }
  }

  async function submitAmendOrder() {
    if (!amendingOrder) return

    try {
      const response = await fetch(`/api/customer/orders/${amendingOrder.id}/amend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: amendedItems.map(item => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            originalQuantity: item.originalQuantity,
          })),
        }),
      })

      if (response.ok) {
        const session = localStorage.getItem('customer_session')
        const customerData = JSON.parse(session!)
        fetchOrders(customerData.id, customerData.email)
        setAmendingOrder(null)
        setAmendedItems([])
        alert('Order amended successfully!')
      } else {
        alert('Failed to amend order')
      }
    } catch (error) {
      console.error('Error amending order:', error)
      alert('An error occurred')
    }
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, { bg: string; text: string }> = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-800' },
      DELIVERED: { bg: 'bg-purple-100', text: 'text-purple-800' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-800' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800' },
    }
    const style = styles[status] || styles.PENDING

    return (
      <span className={`${style.bg} ${style.text} px-3 py-1 rounded-full text-sm font-medium`}>
        {status}
      </span>
    )
  }

  function handleLogout() {
    localStorage.removeItem('customer_session')
    router.push('/customer/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">My Account</h1>
              <p className="text-primary-100">Welcome back, {customer?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn bg-white text-primary-600 hover:bg-primary-50"
            >
              <LogOut size={18} className="inline mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User size={24} />
            Profile Information
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="font-medium">{customer?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-medium">{customer?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="font-medium">{customer?.phone}</p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-600">
                      Placed {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Calendar size={16} />
                    Rental Period: {formatDateShort(order.rentalStartDate)} - {formatDateShort(order.rentalEndDate)}
                  </div>
                  
                  {/* Order Items */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-2">
                          {item.product.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                          )}
                          <p className="text-xs font-medium text-gray-800 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="font-semibold text-lg text-primary-600">
                    Total: {formatCurrency(order.totalPrice)}
                  </div>
                </div>

                {/* Messages History */}
                {order.messages && order.messages.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">
                        Messages ({order.messages.length})
                      </h4>
                      {order.messages.some(msg => msg.sender === 'ADMIN' && !msg.isRead) && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                          New Reply
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                      {order.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg ${
                            message.sender === 'CUSTOMER'
                              ? 'bg-blue-100 border border-blue-200'
                              : 'bg-green-100 border border-green-200'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-xs font-medium text-gray-700">
                              {message.sender === 'CUSTOMER' ? 'You' : 'Admin'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm text-gray-800">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap mt-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="btn btn-secondary text-sm flex items-center gap-2"
                  >
                    <MessageSquare size={16} />
                    Message Admin
                  </button>
                  {order.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => openAmendOrder(order)}
                        className="btn btn-primary text-sm flex items-center gap-2"
                      >
                        <Edit size={16} />
                        Amend Order
                      </button>
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="btn btn-danger text-sm flex items-center gap-2"
                      >
                        <XCircle size={16} />
                        Cancel Order
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Send Message to Admin</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Order #{selectedOrder.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-600 mb-4">{formatCurrency(selectedOrder.totalPrice)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="input min-h-[120px]"
                  placeholder="Type your message to the admin..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={sendMessage}
                  disabled={sendingMessage || !messageText.trim()}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Send size={18} />
                  {sendingMessage ? 'Sending...' : 'Send Message'}
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Amend Order Modal */}
      {amendingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Amend Order</h2>
              <button 
                onClick={() => {
                  setAmendingOrder(null)
                  setAmendedItems([])
                }} 
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Current Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Current Items</h3>
                <div className="space-y-2">
                  {amendedItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {item.productImage && (
                        <img 
                          src={item.productImage} 
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(index, item.quantity - 1)}
                          className="btn btn-secondary p-1"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(index, item.quantity + 1)}
                          className="btn btn-secondary p-1"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <p className="w-24 text-right font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add More Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Add More Items</h3>
                {loadingProducts ? (
                  <p className="text-center py-8 text-gray-600">Loading products...</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {allProducts.filter(product => product.isActive).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addProductToOrder(product)}
                        className="p-3 border border-gray-300 rounded-lg hover:bg-primary-50 hover:border-primary-500 text-left"
                      >
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-24 object-cover rounded mb-2"
                          />
                        )}
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-gray-600">{formatCurrency(product.price)}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">New Total:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(amendedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={submitAmendOrder}
                  className="btn btn-primary flex items-center gap-2 flex-1"
                >
                  <Send size={18} />
                  Submit Changes
                </button>
                <button
                  onClick={() => {
                    setAmendingOrder(null)
                    setAmendedItems([])
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

