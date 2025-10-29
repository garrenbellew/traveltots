'use client'

import { useState, useEffect } from 'react'

interface Bundle {
  id: string
  name: string
  isActive: boolean
}

interface ProductBundle {
  bundleId: string
  bundleName: string
  quantity: number
}

interface BundleSelectorProps {
  productId: string
}

export default function BundleSelector({ productId }: BundleSelectorProps) {
  const [allBundles, setAllBundles] = useState<Bundle[]>([])
  const [productBundles, setProductBundles] = useState<ProductBundle[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (productId) {
      fetchData()
    }
  }, [productId])

  async function fetchData() {
    try {
      const [bundlesRes, productBundlesRes] = await Promise.all([
        fetch('/api/bundles'),
        fetch(`/api/products/${productId}/bundles`),
      ])

      const bundles = await bundlesRes.json()
      const pBundles = await productBundlesRes.json()

      setAllBundles(bundles.filter((b: Bundle) => b.isActive))
      setProductBundles(pBundles)
    } catch (error) {
      console.error('Error fetching bundles:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleBundle(bundleId: string, checked: boolean) {
    if (saving) return

    setSaving(true)
    try {
      let updatedBundles: ProductBundle[]

      if (checked) {
        // Add bundle
        updatedBundles = [
          ...productBundles,
          { bundleId, bundleName: allBundles.find(b => b.id === bundleId)?.name || '', quantity: 1 },
        ]
      } else {
        // Remove bundle
        updatedBundles = productBundles.filter(pb => pb.bundleId !== bundleId)
      }

      const response = await fetch(`/api/products/${productId}/bundles`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bundleIds: updatedBundles.map(pb => ({
            bundleId: pb.bundleId,
            quantity: pb.quantity,
          })),
        }),
      })

      if (response.ok) {
        setProductBundles(updatedBundles)
      } else {
        alert('Failed to update bundle assignment')
      }
    } catch (error) {
      console.error('Error updating bundle:', error)
      alert('Failed to update bundle assignment')
    } finally {
      setSaving(false)
    }
  }

  function handleQuantityChange(bundleId: string, quantity: number) {
    const updated = productBundles.map(pb =>
      pb.bundleId === bundleId ? { ...pb, quantity: Math.max(1, quantity) } : pb
    )
    
    // Save immediately
    setSaving(true)
    fetch(`/api/products/${productId}/bundles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bundleIds: updated.map(pb => ({
          bundleId: pb.bundleId,
          quantity: pb.quantity,
        })),
      }),
    })
      .then(res => {
        if (res.ok) {
          setProductBundles(updated)
        }
      })
      .catch(err => console.error('Error updating quantity:', err))
      .finally(() => setSaving(false))
  }

  if (loading) {
    return (
      <div className="border-t pt-4 mt-4">
        <p className="text-sm text-gray-500">Loading bundles...</p>
      </div>
    )
  }

  return (
    <div className="border-t pt-4 mt-4">
      <label className="label mb-3">Assign to Bundles</label>
      <p className="text-sm text-gray-600 mb-4">
        Select which bundles this product should be included in. A product can be in multiple bundles.
      </p>

      {allBundles.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No active bundles available. Create bundles in the Bundles admin page.</p>
      ) : (
        <div className="space-y-3">
          {allBundles.map(bundle => {
            const isInBundle = productBundles.some(pb => pb.bundleId === bundle.id)
            const bundleAssignment = productBundles.find(pb => pb.bundleId === bundle.id)

            return (
              <div key={bundle.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  checked={isInBundle}
                  onChange={(e) => handleToggleBundle(bundle.id, e.target.checked)}
                  disabled={saving}
                  className="w-5 h-5"
                />
                <label className="flex-1 cursor-pointer">
                  <span className="font-medium">{bundle.name}</span>
                </label>
                {isInBundle && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      value={bundleAssignment?.quantity || 1}
                      onChange={(e) => handleQuantityChange(bundle.id, parseInt(e.target.value) || 1)}
                      disabled={saving}
                      className="w-20 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

