'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, MessageCircle, DollarSign, Lock } from 'lucide-react'
import AdminNav from '@/components/AdminNav'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [messageConfirmed, setMessageConfirmed] = useState('')
  const [messageDelivered, setMessageDelivered] = useState('')
  const [messageCompleted, setMessageCompleted] = useState('')
  const [messageCancelled, setMessageCancelled] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  
  // Pricing configuration state
  const [weeklyPricePercentIncrease, setWeeklyPricePercentIncrease] = useState(10)
  const [minOrderValue, setMinOrderValue] = useState(0)
  const [airportMinOrder, setAirportMinOrder] = useState(0)
  const [bundleDiscountPercent, setBundleDiscountPercent] = useState(0)
  
  // Popular categories state
  const [popularCategories, setPopularCategories] = useState<string>('')
  const [allCategories, setAllCategories] = useState<Array<{id: string, name: string, slug: string}>>([])
  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>([])

  useEffect(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const [settingsRes, pricingRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/pricing'),
        fetch('/api/categories')
      ])
      
      const settingsData = await settingsRes.json()
      setWhatsappNumber(settingsData.whatsappNumber || '')
      setMessageConfirmed(settingsData.whatsappMessageConfirmed || '')
      setMessageDelivered(settingsData.whatsappMessageDelivered || '')
      setMessageCompleted(settingsData.whatsappMessageCompleted || '')
      setMessageCancelled(settingsData.whatsappMessageCancelled || '')
      
      const popularCats = settingsData.popularCategories || ''
      setPopularCategories(popularCats)
      setSelectedCategorySlugs(popularCats ? popularCats.split(',').filter((s: string) => s.trim()) : [])
      
      const pricingData = await pricingRes.json()
      setWeeklyPricePercentIncrease(pricingData.weeklyPricePercentIncrease || 10)
      setMinOrderValue(pricingData.minOrderValue || 0)
      setAirportMinOrder(pricingData.airportMinOrder || 0)
      setBundleDiscountPercent(pricingData.bundleDiscountPercent || 0)
      
      const categoriesData = await categoriesRes.json()
      setAllCategories(categoriesData || [])
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setStatusMessage('')

    try {
      const [settingsRes, pricingRes] = await Promise.all([
        fetch('/api/admin/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            whatsappNumber,
            whatsappMessageConfirmed: messageConfirmed,
            whatsappMessageDelivered: messageDelivered,
            whatsappMessageCompleted: messageCompleted,
            whatsappMessageCancelled: messageCancelled,
            popularCategories: selectedCategorySlugs.join(','),
          }),
        }),
        fetch('/api/admin/pricing', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            weeklyPricePercentIncrease,
            minOrderValue,
            airportMinOrder,
            bundleDiscountPercent,
          }),
        })
      ])

      if (!settingsRes.ok || !pricingRes.ok) {
        throw new Error('Failed to save settings')
      }

      setStatusMessage('Settings saved successfully!')
      setTimeout(() => setStatusMessage(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setStatusMessage('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword() {
    setChangingPassword(true)
    setPasswordMessage('')

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      setPasswordMessage('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordMessage(''), 3000)
    } catch (error: any) {
      setPasswordMessage(error.message || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Configure WhatsApp messages and communication settings</p>
        </div>

        {/* Password Change */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-primary-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {passwordMessage && (
              <div className={`p-4 rounded-lg ${
                passwordMessage.includes('success') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {passwordMessage}
              </div>
            )}

            <button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="btn btn-secondary flex items-center gap-2 w-full sm:w-auto"
            >
              <Lock size={18} />
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>

        {/* WhatsApp Number */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="text-primary-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">WhatsApp Number</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin WhatsApp Number
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Optional: Store your WhatsApp number for reference
              </p>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+34612345678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Message Templates */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="text-primary-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">WhatsApp Message Templates</h2>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Customize the automatic messages sent to customers. Use placeholders like {`{name}`}, {`{items}`}, {`{startDate}`}, {`{endDate}`}, {`{address}`}, {`{orderLink}`}
          </p>

          <div className="space-y-6">
            {/* Confirmed Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Confirmation Message
              </label>
              <textarea
                value={messageConfirmed}
                onChange={(e) => setMessageConfirmed(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                placeholder="Hi {name}, your order has been confirmed! 📦&#10;&#10;Items: {items}&#10;Dates: {startDate} to {endDate}&#10;&#10;View your order details: {orderLink}&#10;&#10;We'll contact you soon to arrange delivery.&#10;&#10;Travel Tots"
              />
            </div>

            {/* Delivered Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Notification Message
              </label>
              <textarea
                value={messageDelivered}
                onChange={(e) => setMessageDelivered(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                placeholder="Hi {name}, your items are on their way! 🚚&#10;&#10;Items: {items}&#10;Rental Period: {startDate} to {endDate}&#10;&#10;Please ensure someone is available at: {address}&#10;&#10;Travel Tots"
              />
            </div>

            {/* Completed Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection/Completion Message
              </label>
              <textarea
                value={messageCompleted}
                onChange={(e) => setMessageCompleted(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                placeholder="Hi {name}, thank you for renting with us! ✅&#10;&#10;Your rental period has ended ({startDate} - {endDate}). We'll arrange collection soon.&#10;&#10;Thank you for choosing Travel Tots!"
              />
            </div>

            {/* Cancelled Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Message
              </label>
              <textarea
                value={messageCancelled}
                onChange={(e) => setMessageCancelled(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                placeholder="Hi {name}, we're sorry but your order has been cancelled. ❌&#10;&#10;If you need to place a new order, please visit our website.&#10;&#10;Travel Tots"
              />
            </div>
          </div>
        </div>

        {/* Pricing Configuration */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="text-primary-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Pricing Configuration</h2>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Configure weekly pricing and minimum order values. Products are priced per week.
          </p>

          <div className="space-y-6">
            {/* Weekly Price Percent Increase */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Percentage Increase per Extra Day (for days 8-14)
              </label>
              <p className="text-sm text-gray-500 mb-2">
                For rentals over 1 week (8-14 days), charge this percentage of the weekly price per extra day. Example: 10% means 12 days = weekly price + (5 extra days × 10% × weekly price). For rentals over 14 days, a representative will contact the customer.
              </p>
              <input
                type="number"
                step="0.1"
                value={weeklyPricePercentIncrease}
                onChange={(e) => setWeeklyPricePercentIncrease(parseFloat(e.target.value) || 10)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Minimum Order Value (Standard) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order (€)
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Minimum order value for accommodation deliveries. A delivery fee will be charged equal to the difference if order is below this minimum.
              </p>
              <input
                type="number"
                step="0.01"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Minimum Order Value (Airport) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order - Airport (€)
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Minimum order value for airport deliveries. A delivery fee will be charged equal to the difference if order is below this minimum.
              </p>
              <input
                type="number"
                step="0.01"
                value={airportMinOrder}
                onChange={(e) => setAirportMinOrder(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Bundle Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bundle Discount (%)
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Percentage discount applied to all bundle products. This discount will be clearly displayed in orders.
              </p>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={bundleDiscountPercent}
                onChange={(e) => setBundleDiscountPercent(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

          </div>
        </div>

        {/* Popular Categories */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">🌟 Popular Categories</h2>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Select up to 3 categories to display on the landing page as "Popular Categories".
          </p>

          <div className="space-y-3">
            {allCategories.map(category => {
              const isSelected = selectedCategorySlugs.includes(category.slug)
              return (
                <label key={category.id} className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (selectedCategorySlugs.length < 3) {
                          setSelectedCategorySlugs([...selectedCategorySlugs, category.slug])
                        }
                      } else {
                        setSelectedCategorySlugs(selectedCategorySlugs.filter(s => s !== category.slug))
                      }
                    }}
                    disabled={!isSelected && selectedCategorySlugs.length >= 3}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="flex-1 font-medium text-gray-900">{category.name}</span>
                  {isSelected && (
                    <span className="text-xs text-primary-600 font-semibold">SELECTED</span>
                  )}
                </label>
              )
            })}
            {allCategories.length === 0 && (
              <p className="text-gray-500 text-sm">No categories available. Please add categories first.</p>
            )}
          </div>
          {selectedCategorySlugs.length > 0 && (
            <p className="mt-4 text-sm text-gray-600">
              Selected: {selectedCategorySlugs.length} / 3 categories
            </p>
          )}
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            statusMessage.includes('success') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {statusMessage}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

        {/* Info */}
        <div className="mt-8 card bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Available Placeholders</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li><code className="bg-blue-100 px-1 rounded">{`{name}`}</code> - Customer name</li>
            <li><code className="bg-blue-100 px-1 rounded">{`{items}`}</code> - List of ordered items</li>
            <li><code className="bg-blue-100 px-1 rounded">{`{startDate}`}</code> - Rental start date</li>
            <li><code className="bg-blue-100 px-1 rounded">{`{endDate}`}</code> - Rental end date</li>
            <li><code className="bg-blue-100 px-1 rounded">{`{address}`}</code> - Delivery address</li>
            <li><code className="bg-blue-100 px-1 rounded">{`{orderLink}`}</code> - Link to beautiful order confirmation with product images</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

