'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Send, MessageCircle, Lock } from 'lucide-react'
import AdminNav from '@/components/AdminNav'
import { formatDateShort } from '@/lib/utils'

interface Customer {
  id: string | null
  name: string
  email: string
  phone: string
  password?: string
  isActive?: boolean
  isRegistered: boolean
  createdAt: string
  orders: Array<{
    id: string
    status: string
    totalPrice: number
    rentalStartDate: string
    rentalEndDate: string
  }>
}

export default function AdminClientsPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [resettingPassword, setResettingPassword] = useState(false)
  const [resetPasswordResult, setResetPasswordResult] = useState<{email: string, tempPassword: string} | null>(null)

  useEffect(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    try {
      const response = await fetch('/api/admin/customers')
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  async function sendMarketingMessage() {
    if (!selectedCustomer || !messageText.trim()) return

    setSendingMessage(true)
    try {
      // This will generate a WhatsApp link
      const cleanPhone = selectedCustomer.phone.replace(/[\s\-\(\)]/g, '')
      const message = `Hi ${selectedCustomer.name},\n\n${messageText}\n\nTravel Tots`
      const encodedMessage = encodeURIComponent(message)
      const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
      
      window.open(url, '_blank')
      setMessageText('')
      setSelectedCustomer(null)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  async function toggleCustomerStatus(customer: Customer) {
    if (!customer.id) return // Only registered customers can be toggled

    try {
      const response = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          isActive: !customer.isActive,
        }),
      })

      if (response.ok) {
        // Refresh the customer list
        fetchCustomers()
      }
    } catch (error) {
      console.error('Error toggling customer status:', error)
    }
  }

  async function resetCustomerPassword(customer: Customer) {
    if (!customer.id) return // Only registered customers can have passwords reset

    setResettingPassword(true)
    try {
      const response = await fetch('/api/admin/customers/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResetPasswordResult({
          email: customer.email,
          tempPassword: data.tempPassword
        })
        // Refresh the customer list
        fetchCustomers()
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      alert('Failed to reset password')
    } finally {
      setResettingPassword(false)
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client List</h1>
          <p className="text-gray-600">Manage your customers and send marketing messages</p>
        </div>

        {customers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <User size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No customers yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id || customer.email} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                          {customer.id && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              customer.isActive !== false 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {customer.isActive !== false ? 'Active' : 'Disabled'}
                            </span>
                          )}
                          {!customer.isRegistered && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              Guest
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {customer.isRegistered ? 'Member since' : 'First order'}: {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                    </div>
                    {customer.id && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Lock size={14} className="text-gray-500" />
                          <p className="text-xs text-gray-500">Account Password:</p>
                        </div>
                        <p className="text-xs text-gray-600">
                          Password is encrypted. Use "Reset Password" to create a new one you can share with the customer.
                        </p>
                      </div>
                    )}
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Orders ({customer.orders.length})</p>
                      <div className="space-y-2">
                        {customer.orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                            <div>
                              <span className="font-medium">#{order.id.slice(0, 8)}</span>
                              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <span className="text-gray-600">
                              {formatDateShort(order.rentalStartDate)}
                            </span>
                          </div>
                        ))}
                        {customer.orders.length > 3 && (
                          <p className="text-xs text-gray-500">+{customer.orders.length - 3} more orders</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {customer.id && (
                      <>
                        <button
                          onClick={() => toggleCustomerStatus(customer)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm ${
                            customer.isActive !== false
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {customer.isActive !== false ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => resetCustomerPassword(customer)}
                          disabled={resettingPassword}
                          className="px-4 py-2 rounded-lg font-medium text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                        >
                          {resettingPassword ? 'Resetting...' : 'Reset Password'}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <MessageCircle size={18} />
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Marketing Message Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Send Marketing Message</h2>
              <button
                onClick={() => {
                  setSelectedCustomer(null)
                  setMessageText('')
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">To: {selectedCustomer.name}</p>
                <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="input min-h-[150px]"
                  placeholder="Type your marketing message here..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={sendMarketingMessage}
                  disabled={sendingMessage || !messageText.trim()}
                  className="btn btn-primary flex items-center gap-2 flex-1"
                >
                  <Send size={18} />
                  {sendingMessage ? 'Opening WhatsApp...' : 'Send via WhatsApp'}
                </button>
                <button
                  onClick={() => {
                    setSelectedCustomer(null)
                    setMessageText('')
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

      {/* Password Reset Result Modal */}
      {resetPasswordResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Password Reset Successful</h2>
              <button
                onClick={() => setResetPasswordResult(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                A new temporary password has been generated for <strong>{resetPasswordResult.email}</strong>.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Temporary Password:</p>
                <code className="text-2xl font-mono text-primary-600 block text-center py-2 px-4 bg-white rounded border-2 border-yellow-300">
                  {resetPasswordResult.tempPassword}
                </code>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> Share this password with the customer. They should change it immediately after logging in.
                </p>
              </div>

              <button
                onClick={() => setResetPasswordResult(null)}
                className="btn btn-primary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

