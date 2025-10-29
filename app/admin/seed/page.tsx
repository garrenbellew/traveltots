'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Database, AlertTriangle, CheckCircle } from 'lucide-react'
import AdminNav from '@/components/AdminNav'

export default function SeedDatabasePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }
  }, [])

  const handleSeed = async () => {
    if (!confirm('⚠️ WARNING: This will DELETE all products and orders and replace them with test data. Are you sure?')) {
      return
    }

    if (!confirm('This action CANNOT be undone. Continue?')) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Database seeded successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to seed database' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while seeding the database' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-primary-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Database Seeding Utility</h1>
          </div>
          <p className="text-gray-600">
            Reset and populate the database with test data. Useful for testing on Render.
          </p>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">⚠️ Warning</h3>
              <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                <li>This will DELETE all existing products and orders</li>
                <li>This will DELETE all existing categories (except ones used by seeded products)</li>
                <li>Stock blocks, order messages, and other related data will also be deleted</li>
                <li>This action CANNOT be undone</li>
                <li>Categories, customers, pages, testimonials, and admin users will NOT be deleted</li>
              </ul>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle size={24} className="text-green-600" />
            ) : (
              <AlertTriangle size={24} className="text-red-600" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">What Will Be Created</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">Categories (5)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Car Seats</li>
                <li>• Travel Cots</li>
                <li>• Strollers</li>
                <li>• High Chairs</li>
                <li>• Feeding Equipment</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">Products (12)</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Various car seats</li>
                <li>• Travel cots</li>
                <li>• Strollers</li>
                <li>• High chairs</li>
                <li>• And more...</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleSeed}
            disabled={loading}
            className="btn btn-danger w-full flex items-center justify-center gap-2"
          >
            <Database size={20} />
            {loading ? 'Seeding Database...' : 'Reset & Seed Database'}
          </button>
        </div>
      </div>
    </div>
  )
}

