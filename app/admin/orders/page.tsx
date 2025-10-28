'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDateShort, formatCurrency } from '@/lib/utils'
import { CheckCircle, XCircle, Clock, Package, Edit, MessageCircle, Send } from 'lucide-react'
import AdminNav from '@/components/AdminNav'

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
  items: Array<{
    product: { name: string }
    quantity: number
    price: number
  }>
  messages?: Array<{
    id: string
    sender: string
    message: string
    createdAt: string
    isRead: boolean
  }>
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageTemplates, setMessageTemplates] = useState<{
    confirmed: string
    delivered: string
    completed: string
    cancelled: string
  }>({
    confirmed: '',
    delivered: '',
    completed: '',
    cancelled: '',
  })

  useEffect(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchOrders()
    fetchMessageTemplates()
  }, [statusFilter])

  async function fetchMessageTemplates() {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      setMessageTemplates({
        confirmed: data.whatsappMessageConfirmed || '',
        delivered: data.whatsappMessageDelivered || '',
        completed: data.whatsappMessageCompleted || '',
        cancelled: data.whatsappMessageCancelled || '',
      })
    } catch (error) {
      console.error('Error fetching message templates:', error)
    }
  }

  function generateWhatsAppUrl(customerPhone: string, message: string) {
    // Clean the phone number (remove spaces, dashes, etc.)
    const cleanPhone = customerPhone.replace(/[\s\-\(\)]/g, '')
    const encodedMessage = encodeURIComponent(message)
    // WhatsApp URL that opens app/web with pre-filled message
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  }

  function replacePlaceholders(template: string, order: Order): string {
    const name = order.customerName
    const items = order.items.map(item => `${item.product.name} x${item.quantity}`).join(', ')
    const startDate = formatDateShort(order.rentalStartDate)
    const endDate = formatDateShort(order.rentalEndDate)
    const address = order.customerAddress
    
    // Generate shareable order confirmation link
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'
    const orderLink = `${baseUrl}/order/${order.id}`

    // Use custom template or fall back to default
    return template
      .replace(/{name}/g, name)
      .replace(/{items}/g, items)
      .replace(/{startDate}/g, startDate)
      .replace(/{endDate}/g, endDate)
      .replace(/{address}/g, address)
      .replace(/{orderLink}/g, orderLink)
  }

  function getWhatsAppMessages(order: Order) {
    // Use custom templates if available, otherwise use defaults
    const confirmedTemplate = messageTemplates.confirmed || 
      `Hi {name}, your order has been confirmed! 📦\n\nItems: {items}\nDates: {startDate} to {endDate}\n\nView your order details: {orderLink}\n\nWe'll contact you soon to arrange delivery.\n\nTravel Tots`
    
    const deliveredTemplate = messageTemplates.delivered || 
      `Hi {name}, your items are on their way! 🚚\n\nItems: {items}\nRental Period: {startDate} to {endDate}\n\nPlease ensure someone is available at: {address}\n\nTravel Tots`
    
    const completedTemplate = messageTemplates.completed || 
      `Hi {name}, thank you for renting with us! ✅\n\nYour rental period has ended ({startDate} - {endDate}). We'll arrange collection soon.\n\nThank you for choosing Travel Tots!`
    
    const cancelledTemplate = messageTemplates.cancelled || 
      `Hi {name}, we're sorry but your order has been cancelled. ❌\n\nIf you need to place a new order, please visit our website.\n\nTravel Tots`

    return {
      confirmed: replacePlaceholders(confirmedTemplate, order),
      delivered: replacePlaceholders(deliveredTemplate, order),
      completed: replacePlaceholders(completedTemplate, order),
      cancelled: replacePlaceholders(cancelledTemplate, order),
    }
  }

  async function fetchOrders() {
    try {
      const url = statusFilter === 'all' ? '/api/orders' : `/api/orders?status=${statusFilter}`
      const response = await fetch(url)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  async function sendAdminMessage(orderId: string) {
    if (!replyText.trim()) {
      alert('Please enter a message')
      return
    }

    setSendingMessage(true)
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          message: replyText,
        }),
      })

      if (response.ok) {
        setReplyText('')
        setSelectedOrder(null)
        fetchOrders()
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

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: any }> = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
      DELIVERED: { bg: 'bg-purple-100', text: 'text-purple-800', icon: CheckCircle },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
    }
    const style = styles[status] || styles.PENDING
    const Icon = style.icon

    return (
      <span className={`${style.bg} ${style.text} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2`}>
        <Icon size={16} />
        {status}
      </span>
    )
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    setUpdatingOrder(orderId)
    
    try {
      // Confirm action for cancellations
      if (newStatus === 'CANCELLED') {
        if (!confirm('Are you sure you want to cancel this order? This will free up the stock.')) {
          setUpdatingOrder(null)
          return
        }
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Refresh the orders list
        fetchOrders()
      } else {
        alert('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('An error occurred')
    } finally {
      setUpdatingOrder(null)
    }
  }

  function getAvailableActions(status: string) {
    switch (status) {
      case 'PENDING':
        return [
          { label: 'Confirm Order', status: 'CONFIRMED', color: 'btn-primary' },
          { label: 'Cancel Order', status: 'CANCELLED', color: 'btn-danger' },
        ]
      case 'CONFIRMED':
        return [
          { label: 'Mark as Delivered', status: 'DELIVERED', color: 'btn-primary' },
          { label: 'Cancel Order', status: 'CANCELLED', color: 'btn-danger' },
        ]
      case 'DELIVERED':
        return [
          { label: 'Mark as Collected', status: 'COMPLETED', color: 'btn-primary' },
        ]
      case 'COMPLETED':
        return []
      case 'CANCELLED':
        return []
      default:
        return []
    }
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
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Orders
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`btn ${statusFilter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('CONFIRMED')}
            className={`btn ${statusFilter === 'CONFIRMED' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setStatusFilter('DELIVERED')}
            className={`btn ${statusFilter === 'DELIVERED' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Delivered
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`btn ${statusFilter === 'COMPLETED' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Completed
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="card text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{order.customerName}</h3>
                      {order.messages && order.messages.some(msg => msg.sender === 'CUSTOMER' && !msg.isRead) && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center gap-1">
                          <MessageCircle size={12} />
                          New Message
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Contact</p>
                    <p className="text-sm text-gray-600 mb-1">{order.customerEmail}</p>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="text-green-600" size={18} />
                      <a 
                        href={`tel:${order.customerPhone}`}
                        className="text-lg font-semibold text-green-600 hover:text-green-700"
                      >
                        {order.customerPhone}
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Rental Period</p>
                    <p className="text-sm text-gray-600">
                      {formatDateShort(order.rentalStartDate)} - {formatDateShort(order.rentalEndDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Delivery Address</p>
                    <p className="text-sm text-gray-600">{order.customerAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Total Amount</p>
                    <p className="text-lg font-semibold text-primary-600">
                      {formatCurrency(order.totalPrice)}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                  <ul className="space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-600">
                        {item.product.name} x{item.quantity} - {formatCurrency(item.price)}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* WhatsApp Quick Messages */}
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Quick WhatsApp Messages:</p>
                  <div className="flex gap-2 flex-wrap">
                    {(() => {
                      const messages = getWhatsAppMessages(order)
                      const buttonConfigs = {
                        PENDING: [
                          { label: 'Send Confirmation', message: messages.confirmed, color: 'bg-blue-500 hover:bg-blue-600' },
                        ],
                        CONFIRMED: [
                          { label: 'Notify Delivery', message: messages.delivered, color: 'bg-purple-500 hover:bg-purple-600' },
                        ],
                        DELIVERED: [
                          { label: 'Notify Collection', message: messages.completed, color: 'bg-green-500 hover:bg-green-600' },
                        ],
                        CANCELLED: [
                          { label: 'Send Cancellation', message: messages.cancelled, color: 'bg-red-500 hover:bg-red-600' },
                        ],
                        COMPLETED: [],
                      }
                      
                      const configs = buttonConfigs[order.status as keyof typeof buttonConfigs] || []
                      
                      return configs.map((config, idx) => {
                        const url = generateWhatsAppUrl(order.customerPhone, config.message)
                        return (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn text-white ${config.color} text-sm flex items-center gap-2`}
                          >
                            <Send size={16} />
                            {config.label}
                          </a>
                        )
                      })
                    })()}
                    {getWhatsAppMessages(order)[order.status as keyof ReturnType<typeof getWhatsAppMessages>] && (
                      <a
                        href={`https://wa.me/${order.customerPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary text-sm flex items-center gap-2"
                      >
                        <MessageCircle size={16} />
                        Custom Message
                      </a>
                    )}
                  </div>
                </div>

                {/* Order Messages */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-700">
                        Messages {order.messages && order.messages.length > 0 && `(${order.messages.length})`}
                      </p>
                      {order.messages && order.messages.some(msg => msg.sender === 'CUSTOMER' && !msg.isRead) && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    {order.messages && order.messages.length > 0 && (
                      <button
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                        className="btn btn-primary text-sm flex items-center gap-2"
                      >
                        <MessageCircle size={16} />
                        {selectedOrder === order.id ? 'Close Reply' : 'Reply to Customer'}
                      </button>
                    )}
                  </div>

                  {order.messages && order.messages.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                      {order.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg ${
                            message.sender === 'CUSTOMER'
                              ? 'bg-blue-50 border border-blue-200'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-xs font-medium text-gray-700">
                              {message.sender === 'CUSTOMER' ? 'Customer' : 'Admin'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm text-gray-800">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic mb-3">No messages yet</p>
                  )}

                  {/* Reply Form */}
                  {selectedOrder === order.id && (
                    <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your response to the customer..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-2"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => sendAdminMessage(order.id)}
                          disabled={sendingMessage || !replyText.trim()}
                          className="btn btn-primary text-sm flex items-center gap-2"
                        >
                          <Send size={16} />
                          {sendingMessage ? 'Sending...' : 'Send Message'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(null)
                            setReplyText('')
                          }}
                          className="btn btn-secondary text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Actions:</p>
                  <div className="flex gap-2 flex-wrap">
                    {getAvailableActions(order.status).map((action) => (
                      <button
                        key={action.status}
                        onClick={() => updateOrderStatus(order.id, action.status)}
                        disabled={updatingOrder === order.id}
                        className={`btn ${action.color} text-sm`}
                      >
                        {updatingOrder === order.id ? 'Updating...' : action.label}
                      </button>
                    ))}
                    {getAvailableActions(order.status).length === 0 && (
                      <span className="text-sm text-gray-500 italic">
                        No actions available for this status
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

