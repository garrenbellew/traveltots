'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import AdminNav from '@/components/AdminNav'
import BundleForm from '@/components/BundleForm'

interface Bundle {
  id: string
  name: string
  slug: string
  description?: string
  isActive: boolean
  createdAt: string
  products: Array<{
    id: string
    quantity: number
    product: {
      id: string
      name: string
      image: string | null
    }
  }>
}

export default function AdminBundlesPage() {
  const router = useRouter()
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [loading, setLoading] = useState(true)
  const [showBundleForm, setShowBundleForm] = useState(false)
  const [selectedBundle, setSelectedBundle] = useState<Bundle | undefined>()

  useEffect(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchBundles()
  }, [])

  async function fetchBundles() {
    try {
      const response = await fetch('/api/bundles')
      const data = await response.json()
      setBundles(data)
    } catch (error) {
      console.error('Error fetching bundles:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleNewBundle() {
    setSelectedBundle(undefined)
    setShowBundleForm(true)
  }

  function handleEditBundle(bundle: Bundle) {
    setSelectedBundle(bundle)
    setShowBundleForm(true)
  }

  async function handleDeleteBundle(bundleId: string) {
    if (!confirm('Are you sure you want to delete this bundle? This will remove all product assignments.')) return

    try {
      const response = await fetch(`/api/bundles/${bundleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchBundles()
      } else {
        alert('Failed to delete bundle')
      }
    } catch (error) {
      console.error('Error deleting bundle:', error)
      alert('Failed to delete bundle')
    }
  }

  function handleBundleFormSuccess() {
    setShowBundleForm(false)
    setSelectedBundle(undefined)
    setTimeout(() => {
      fetchBundles()
    }, 100)
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bundle Management</h1>
            <p className="text-gray-600 mt-2">
              Create bundles (like categories). Assign products to bundles from the Products page.
            </p>
          </div>
          <button
            onClick={handleNewBundle}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Bundle
          </button>
        </div>

        {bundles.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 text-lg mb-4">No bundles created yet</p>
            <p className="text-gray-500 text-sm mb-4">
              Bundles are like categories - they group products together. Create a bundle, then assign products to it from the Products page.
            </p>
            <button onClick={handleNewBundle} className="btn btn-primary">
              Create Your First Bundle
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bundles.map(bundle => (
              <div key={bundle.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{bundle.name}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                        BUNDLE
                      </span>
                      {!bundle.isActive && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                          Inactive
                        </span>
                      )}
                    </div>
                    {bundle.description && (
                      <p className="text-gray-600 mb-3">{bundle.description}</p>
                    )}
                    
                    {bundle.products.length > 0 ? (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Contains {bundle.products.length} product{bundle.products.length !== 1 ? 's' : ''}:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {bundle.products.map(pb => (
                            <span
                              key={pb.id}
                              className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                            >
                              {pb.quantity}x {pb.product.name}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          To add/remove products, go to Products page and edit the product
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No products assigned yet. Edit a product to add it to this bundle.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditBundle(bundle)}
                      className="btn btn-secondary text-sm"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBundle(bundle.id)}
                      className="btn btn-danger text-sm"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bundle Form Modal */}
        {showBundleForm && (
          <BundleForm
            isOpen={showBundleForm}
            onClose={() => {
              setShowBundleForm(false)
              setSelectedBundle(undefined)
            }}
            bundle={selectedBundle}
            onSuccess={handleBundleFormSuccess}
          />
        )}
      </div>
    </div>
  )
}
