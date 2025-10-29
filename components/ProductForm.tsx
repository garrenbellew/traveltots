'use client'

import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface Product {
  id?: string
  name?: string
  slug?: string
  description?: string
  price?: number
  image?: string | null
  categoryId?: string
  totalStock?: number
  isActive?: boolean
  isBundle?: boolean
}

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  product?: Product
  onSuccess: (product: Product) => void
  categories: Category[]
  isBundle?: boolean // Force bundle mode when creating from bundles page
}

export default function ProductForm({ isOpen, onClose, product, onSuccess, categories, isBundle: forceBundle }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    image: '',
    categoryId: '',
    totalStock: 1,
    isActive: true,
    isBundle: forceBundle || false,
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (product) {
      setFormData(product)
      setImagePreview(product.image || null)
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: 0,
        image: '',
        categoryId: categories[0]?.id || '',
        totalStock: 1,
        isActive: true,
        isBundle: forceBundle || false,
      })
      setImagePreview(null)
    }
  }, [product, categories])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const uploadData = new FormData()
      uploadData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      })

      const data = await response.json()

      if (data.success) {
        setFormData({ ...formData, image: data.url })
        setImagePreview(data.url)
      } else {
        setError(data.error || 'Failed to upload image')
      }
    } catch (err) {
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate that an image is provided (only for new products, not when editing)
    if (!product?.id && !formData.image) {
      setError('Please upload an image for the product')
      return
    }

    setLoading(true)

    try {
      const url = product?.id 
        ? `/api/products/${product.id}`
        : '/api/products'
      
      const method = product?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess(data)
        onClose()
      } else {
        setError(data.error || 'Failed to save product')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {product?.id ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Slug (URL friendly) *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="input"
                required
                placeholder="product-name"
              />
            </div>
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[100px]"
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="label">Price (€) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="input"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Total Stock *</label>
              <input
                type="number"
                value={formData.totalStock}
                onChange={(e) => setFormData({ ...formData, totalStock: parseInt(e.target.value) })}
                className="input"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="label">
              Product Image {product?.id ? '(Click to change)' : '*'}
            </label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-3">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}

            {/* File Upload - Only Method */}
            <label className="block cursor-pointer">
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition bg-gray-50 ${
                imagePreview ? 'border-green-300' : 'border-gray-300 hover:border-primary-500'
              }`}>
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <span className="text-sm font-medium text-gray-700 block mb-1">
                  {uploading ? 'Uploading...' : imagePreview ? 'Image uploaded ✓' : product?.id ? 'Click to change current image' : 'Click to upload image from your device'}
                </span>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
              />
              <span>Active Product</span>
            </label>

            {!forceBundle && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBundle}
                  onChange={(e) => setFormData({ ...formData, isBundle: e.target.checked })}
                  className="rounded"
                  disabled={forceBundle}
                />
                <span>This is a Bundle</span>
              </label>
            )}
            {forceBundle && (
              <div className="px-3 py-2 bg-blue-100 text-blue-800 rounded text-sm">
                🎁 This will be created as a bundle
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading || uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || uploading}
            >
              {loading ? 'Saving...' : product?.id ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
