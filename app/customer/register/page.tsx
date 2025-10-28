'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Lock } from 'lucide-react'

export default function CustomerRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countryCode, setCountryCode] = useState('+44') // Default to UK
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  // Country codes list with UK and Ireland at the top
  const countryCodes = [
    { code: '+44', country: '🇬🇧 United Kingdom' },
    { code: '+353', country: '🇮🇪 Ireland' },
    { code: '+34', country: '🇪🇸 Spain' },
    { code: '+33', country: '🇫🇷 France' },
    { code: '+49', country: '🇩🇪 Germany' },
    { code: '+39', country: '🇮🇹 Italy' },
    { code: '+31', country: '🇳🇱 Netherlands' },
    { code: '+32', country: '🇧🇪 Belgium' },
    { code: '+41', country: '🇨🇭 Switzerland' },
    { code: '+43', country: '🇦🇹 Austria' },
    { code: '+351', country: '🇵🇹 Portugal' },
    { code: '+45', country: '🇩🇰 Denmark' },
    { code: '+46', country: '🇸🇪 Sweden' },
    { code: '+47', country: '🇳🇴 Norway' },
    { code: '+358', country: '🇫🇮 Finland' },
    { code: '+30', country: '🇬🇷 Greece' },
    { code: '+1', country: '🇺🇸 United States' },
    { code: '+1', country: '🇨🇦 Canada' },
    { code: '+61', country: '🇦🇺 Australia' },
    { code: '+27', country: '🇿🇦 South Africa' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: countryCode + formData.phone.trim(), // Combine country code and phone number
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store customer session
        localStorage.setItem('customer_session', JSON.stringify(data.customer))
        router.push('/customer/dashboard')
      } else {
        // Show detailed error message
        const errorMsg = data.error || data.message || 'Failed to register'
        setError(errorMsg)
        console.error('Registration failed:', data)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join Travel Tots to track your orders</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label flex items-center gap-2">
                <User size={18} />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Mail size={18} />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Phone size={18} />
                Phone Number *
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="input flex-shrink-0 w-48"
                  required
                >
                  {countryCodes.map((cc) => (
                    <option key={cc.code} value={cc.code}>
                      {cc.country}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input flex-1"
                  placeholder="7123456789"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                For example: 7123456789 (UK without leading 0)
              </p>
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Lock size={18} />
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Lock size={18} />
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg py-3"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/customer/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

