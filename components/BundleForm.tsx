'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Bundle {
  id?: string
  name: string
  slug: string
  description?: string
  isActive: boolean
}

interface BundleFormProps {
  isOpen: boolean
  onClose: () => void
  bundle?: Bundle
  onSuccess: () => void
}

export default function BundleForm({ isOpen, onClose, bundle, onSuccess }: BundleFormProps) {
  const [formData, setFormData] = useState<Bundle>({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (bundle) {
      setFormData(bundle)
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        isActive: true,
      })
    }
  }, [bundle])

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function handleNameChange(name: string) {
    setFormData({
      ...formData,
      name,
      slug: bundle?.slug || generateSlug(name),
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = bundle?.id 
        ? `/api/bundles/${bundle.id}`
        : '/api/bundles'
      const method = bundle?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        setError(data.error || `Failed to ${bundle?.id ? 'update' : 'create'} bundle`)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {bundle?.id ? 'Edit Bundle' : 'Create Bundle'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="label">Bundle Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="input"
              required
              placeholder="e.g., Baby Essentials Bundle"
            />
          </div>

          <div>
            <label className="label">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="input"
              required
              placeholder="e.g., baby-essentials-bundle"
            />
            <p className="text-sm text-gray-500 mt-1">
              URL-friendly identifier (auto-generated from name)
            </p>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[100px]"
              placeholder="Optional description for this bundle"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
              />
              <span>Active Bundle</span>
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : bundle?.id ? 'Update Bundle' : 'Create Bundle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

