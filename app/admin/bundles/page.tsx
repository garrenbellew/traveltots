'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Package, X } from 'lucide-react'
import AdminNav from '@/components/AdminNav'
import { formatCurrency } from '@/lib/utils'
import ProductForm from '@/components/ProductForm'

interface Bundle {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string | null
  isActive: boolean
  category: { name: string; id: string }
  bundleProducts: Array<{
    id: string
    quantity: number
    includedProduct: {
      id: string
      name: string
      slug: string
      price: number
      image: string | null
      category: { name: string }
    }
  }>
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string | null
  category: { name: string }
  isBundle: boolean
}

export default function AdminBundlesPage() {
  const router = useRouter()
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showBundleForm, setShowBundleForm] = useState(false)
  const [selectedBundle, setSelectedBundle] = useState<Bundle | undefined>()
  const [editingBundle, setEditingBundle] = useState<Bundle | undefined>()
  const [showProductSelector, setShowProductSelector] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Array<{ productId: string; quantity: number }>>([])

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
      const [bundlesRes, productsRes] = await Promise.all([
        fetch('/api/bundles'),
        fetch('/api/products?all=true'),
      ])
      
      const bundlesData = await bundlesRes.json()
      const productsData = await productsRes.json()
      
      // Filter out bundles from products list (products only)
      const nonBundleProducts = productsData.filter((p: Product) => !p.isBundle)
      
      setBundles(bundlesData)
      setAllProducts(nonBundleProducts)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteBundle(bundleId: string) {
    if (!confirm('Are you sure you want to delete this bundle?')) return

    try {
      const response = await fetch(`/api/products/${bundleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete bundle')
      }

      fetchData()
    } catch (error) {
      console.error('Error deleting bundle:', error)
      alert('Failed to delete bundle')
    }
  }

  function handleEditBundle(bundle: Bundle) {
    setSelectedBundle(bundle)
    setEditingBundle(bundle)
    setShowBundleForm(true)
    
    // Pre-populate selected products
    const products = bundle.bundleProducts.map(bp => ({
      productId: bp.includedProduct.id,
      quantity: bp.quantity,
    }))
    setSelectedProducts(products)
  }

  function handleNewBundle() {
    setSelectedBundle(undefined)
    setEditingBundle(undefined)
    setSelectedProducts([])
    setShowBundleForm(true)
  }

  async function handleBundleFormSuccess(product: Product) {
    // If this is a new bundle, open product selector
    // If editing, save the bundle products if they were selected
    if (selectedProducts.length > 0) {
      await saveBundleProducts(product.id, selectedProducts)
    }
    
    setShowBundleForm(false)
    setSelectedBundle(undefined)
    setEditingBundle(undefined)
    setSelectedProducts([])
    
    // Wait a bit for API to finish
    setTimeout(() => {
      fetchData()
    }, 100)
  }

  async function saveBundleProducts(bundleId: string, products: Array<{ productId: string; quantity: number }>) {
    try {
      const response = await fetch(`/api/bundles/${bundleId}/products`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds: products }),
      })

      if (!response.ok) {
        throw new Error('Failed to save bundle products')
      }

      return await response.json()
    } catch (error) {
      console.error('Error saving bundle products:', error)
      throw error
    }
  }

  async function handleManageProducts(bundle: Bundle) {
    setEditingBundle(bundle)
    setSelectedProducts(
      bundle.bundleProducts.map(bp => ({
        productId: bp.includedProduct.id,
        quantity: bp.quantity,
      }))
    )
    setShowProductSelector(true)
  }

  async function handleSaveBundleProducts() {
    if (!editingBundle) return

    try {
      await saveBundleProducts(editingBundle.id, selectedProducts)
      setShowProductSelector(false)
      setEditingBundle(undefined)
      setSelectedProducts([])
      fetchData()
    } catch (error) {
      alert('Failed to save bundle products')
    }
  }

  function handleAddProduct() {
    // Add first available product that's not already in the bundle
    const existingIds = selectedProducts.map(p => p.productId)
    const available = allProducts.find(p => !existingIds.includes(p.id))
    
    if (available) {
      setSelectedProducts([...selectedProducts, { productId: available.id, quantity: 1 }])
    }
  }

  function handleRemoveProduct(productId: string) {
    setSelectedProducts(selectedProducts.filter(p => p.productId !== productId))
  }

  function handleUpdateQuantity(productId: string, quantity: number) {
    setSelectedProducts(
      selectedProducts.map(p =>
        p.productId === productId ? { ...p, quantity: Math.max(1, quantity) } : p
      )
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  // Get categories for bundle form (bundles typically use a "Bundles" category or similar)
  const categories = Array.from(new Set(allProducts.map(p => p.category.name)))
    .map(name => {
      const product = allProducts.find(p => p.category.name === name)
      return product ? { id: product.category?.id || '', name } : null
    })
    .filter((c): c is { id: string; name: string } => c !== null)

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bundle Management</h1>
            <p className="text-gray-600 mt-2">Create and manage product bundles</p>
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
            <button onClick={handleNewBundle} className="btn btn-primary">
              Create Your First Bundle
            </button>
          </div>
        ) : (
          <div className="space-y-6">
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
                    <p className="text-gray-600 mb-4">{bundle.description}</p>
                    <div className="text-2xl font-bold text-primary-600 mb-4">
                      {formatCurrency(bundle.price)} / week
                    </div>

                    {bundle.bundleProducts.length > 0 ? (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Includes:</p>
                        <ul className="space-y-1">
                          {bundle.bundleProducts.map(bp => (
                            <li key={bp.id} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="font-medium">{bp.quantity}x</span>
                              <span>{bp.includedProduct.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No products assigned yet</p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleManageProducts(bundle)}
                      className="btn btn-secondary text-sm"
                    >
                      <Edit size={16} className="mr-1" />
                      Manage Products
                    </button>
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
          <ProductForm
            isOpen={showBundleForm}
            onClose={() => {
              setShowBundleForm(false)
              setSelectedBundle(undefined)
              setEditingBundle(undefined)
              setSelectedProducts([])
            }}
            product={selectedBundle ? {
              ...selectedBundle,
              isBundle: true,
            } : undefined}
            onSuccess={handleBundleFormSuccess}
            categories={categories.length > 0 ? categories : []}
            isBundle={true}
          />
        )}

        {/* Product Selector Modal */}
        {showProductSelector && editingBundle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Products in "{editingBundle.name}"</h2>
                <button
                  onClick={() => {
                    setShowProductSelector(false)
                    setEditingBundle(undefined)
                    setSelectedProducts([])
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <button
                    onClick={handleAddProduct}
                    className="btn btn-primary"
                    disabled={selectedProducts.length >= allProducts.length}
                  >
                    <Plus size={16} className="mr-2" />
                    Add Product
                  </button>
                </div>

                {selectedProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No products added yet</p>
                ) : (
                  <div className="space-y-3">
                    {selectedProducts.map((sp, index) => {
                      const product = allProducts.find(p => p.id === sp.productId)
                      if (!product) return null

                      return (
                        <div key={sp.productId} className="border rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none'
                                }}
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.category.name}</p>
                              <p className="text-sm text-primary-600">{formatCurrency(product.price)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-sm">Quantity:</label>
                              <input
                                type="number"
                                min="1"
                                value={sp.quantity}
                                onChange={(e) =>
                                  handleUpdateQuantity(sp.productId, parseInt(e.target.value) || 1)
                                }
                                className="w-20 px-2 py-1 border rounded"
                              />
                            </div>
                            <button
                              onClick={() => handleRemoveProduct(sp.productId)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {selectedProducts.length < allProducts.length && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold mb-2">Available Products:</p>
                    <div className="border rounded-lg max-h-60 overflow-y-auto">
                      {allProducts
                        .filter(p => !selectedProducts.find(sp => sp.productId === p.id))
                        .map(product => (
                          <button
                            key={product.id}
                            onClick={() =>
                              setSelectedProducts([...selectedProducts, { productId: product.id, quantity: 1 }])
                            }
                            className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-3"
                          >
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none'
                                }}
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-gray-600">{product.category.name}</p>
                            </div>
                            <span className="text-sm text-primary-600">{formatCurrency(product.price)}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowProductSelector(false)
                    setEditingBundle(undefined)
                    setSelectedProducts([])
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={handleSaveBundleProducts} className="btn btn-primary">
                  Save Products
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

