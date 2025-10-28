'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { Package, AlertTriangle, TrendingUp } from 'lucide-react'
import AdminNav from '@/components/AdminNav'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  totalStock: number
  reserved: number
  available: number
  isActive: boolean
  category: { name: string }
  oversoldOrders?: Array<{
    orderId: string
    rentalStartDate: string
    rentalEndDate: string
    customerName: string
    customerEmail: string
  }>
}

export default function StockReportPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [threshold, setThreshold] = useState(2)

  useEffect(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchStockData()
  }, [])

  async function fetchStockData() {
    try {
      const response = await fetch('/api/products/stocks')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching stock data:', error)
    } finally {
      setLoading(false)
    }
  }

  const lowStockProducts = products.filter(p => p.available <= threshold && p.isActive)
  const outOfStockProducts = products.filter(p => p.available <= 0 && p.isActive)
  const negativeStockProducts = products.filter(p => p.available < 0 && p.isActive)
  const oversoldProducts = products.filter(p => p.reserved > p.totalStock && p.isActive)
  const healthyStockProducts = products.filter(p => p.available > threshold && p.isActive)

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="card bg-pink-50 border-2 border-pink-500">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-pink-700" size={28} />
              <h3 className="font-bold text-pink-900 text-lg">⚠️ OVERSOLD</h3>
            </div>
            <p className="text-4xl font-bold text-pink-700">{oversoldProducts.length}</p>
            <p className="text-sm text-pink-900 mt-1 font-semibold">Cannot fulfill all orders!</p>
          </div>

          <div className="card bg-purple-50 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-purple-600" size={24} />
              <h3 className="font-semibold text-purple-900">Negative Stock</h3>
            </div>
            <p className="text-3xl font-bold text-purple-900">{negativeStockProducts.length}</p>
            <p className="text-sm text-purple-700 mt-1">Items below 0 units</p>
          </div>

          <div className="card bg-red-50 border border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-red-600" size={24} />
              <h3 className="font-semibold text-red-900">Out of Stock</h3>
            </div>
            <p className="text-3xl font-bold text-red-900">{outOfStockProducts.length - negativeStockProducts.length}</p>
            <p className="text-sm text-red-700 mt-1">Items with 0 units available</p>
          </div>

          <div className="card bg-orange-50 border border-orange-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-orange-600" size={24} />
              <h3 className="font-semibold text-orange-900">Low Stock</h3>
            </div>
            <p className="text-3xl font-bold text-orange-900">{lowStockProducts.length - outOfStockProducts.length}</p>
            <p className="text-sm text-orange-700 mt-1">Items with ≤{threshold} units available</p>
          </div>

          <div className="card bg-green-50 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-600" size={24} />
              <h3 className="font-semibold text-green-900">Healthy Stock</h3>
            </div>
            <p className="text-3xl font-bold text-green-900">{healthyStockProducts.length}</p>
            <p className="text-sm text-green-700 mt-1">Items with &gt;{threshold} units available</p>
          </div>
        </div>

        {/* Low Stock Threshold Setting */}
        <div className="card mb-6">
          <label className="label">Low Stock Threshold</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value) || 1)}
              className="input w-24"
            />
            <span className="text-sm text-gray-600">
              Products with {threshold} or fewer available units will be flagged as low stock.
            </span>
          </div>
        </div>

        {/* Oversold Section - CRITICAL WARNING */}
        {oversoldProducts.length > 0 && (
          <div className="mb-8 border-2 border-pink-500 rounded-lg p-6 bg-pink-50">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-pink-900">
              <AlertTriangle className="text-pink-700" size={32} />
              🚨 CRITICAL: Oversold Products ({oversoldProducts.length})
            </h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
              <div className="bg-pink-600 px-6 py-3">
                <p className="text-white font-bold">
                  ⚠️ ATTENTION: You have sold more items than you have in stock. You will NOT be able to fulfill these orders without purchasing additional inventory immediately.
                </p>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-pink-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-pink-900 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-pink-900 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-pink-900 uppercase tracking-wider">
                      Total Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-pink-900 uppercase tracking-wider">
                      Reserved
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-pink-900 uppercase tracking-wider">
                      Shortfall
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-pink-900 uppercase tracking-wider">
                      Available
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {oversoldProducts.map((product) => {
                    const orders = product.oversoldOrders || []
                    const validOrders = orders.filter(o => o.rentalStartDate && o.rentalEndDate)
                    const earliestStartDate = validOrders.length > 0 
                      ? new Date(Math.min(...validOrders.map(o => new Date(o.rentalStartDate).getTime())))
                      : null
                    const latestEndDate = validOrders.length > 0
                      ? new Date(Math.max(...validOrders.map(o => new Date(o.rentalEndDate).getTime())))
                      : null
                    
                    return (
                      <>
                        <tr key={product.id} className="hover:bg-pink-50 bg-red-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">{product.category.name}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-700">
                              {product.totalStock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-pink-700">
                              {product.reserved}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-lg font-bold text-red-700">
                              -{product.reserved - product.totalStock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-red-600">
                              {product.available}
                            </span>
                          </td>
                        </tr>
                        {orders.length > 0 && earliestStartDate && (
                          <tr className="bg-pink-50">
                            <td colSpan={6} className="px-6 py-3">
                              <div className="text-xs font-semibold text-pink-900 mb-2">
                                📅 CRITICAL DATES: Stock needed by {earliestStartDate.toLocaleDateString()} through {latestEndDate?.toLocaleDateString()}
                              </div>
                              <details className="text-xs">
                                <summary className="cursor-pointer text-pink-700 font-semibold hover:text-pink-900">
                                  View all {orders.length} order{orders.length > 1 ? 's' : ''} causing this shortfall
                                </summary>
                                <div className="mt-2 space-y-1">
                                  {orders.map((order) => (
                                    <div key={order.orderId} className="bg-white border border-pink-200 rounded p-2">
                                      <div className="text-gray-700">
                                        <span className="font-medium">{order.customerName}</span> ({order.customerEmail})
                                      </div>
                                      {order.rentalStartDate && order.rentalEndDate && (
                                        <div className="text-gray-600">
                                          📆 {new Date(order.rentalStartDate).toLocaleDateString()} - {new Date(order.rentalEndDate).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4">
              <p className="text-sm text-yellow-900 font-semibold">
                💡 <strong>Action Required:</strong> Purchase additional inventory and update your stock totals in the Products section to fulfill these orders.
              </p>
            </div>
          </div>
        )}

        {/* Negative Stock Section */}
        {negativeStockProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-purple-600" size={24} />
              Negative Stock ({negativeStockProducts.length})
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                      Reserved
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {negativeStockProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-purple-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{product.category.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-purple-600">
                          {product.available}/{product.totalStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {product.reserved} units
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Out of Stock Section */}
        {(outOfStockProducts.length - negativeStockProducts.length) > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-600" size={24} />
              Out of Stock ({outOfStockProducts.length - negativeStockProducts.length})
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                      Reserved
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {outOfStockProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-red-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{product.category.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-red-600">
                          0/{product.totalStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {product.reserved} units
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Low Stock Section */}
        {lowStockProducts.filter(p => p.available > 0).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-orange-600" size={24} />
              Low Stock ({lowStockProducts.filter(p => p.available > 0).length})
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                      Reserved
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lowStockProducts
                    .filter(p => p.available > 0)
                    .sort((a, b) => a.available - b.available)
                    .map((product) => (
                    <tr key={product.id} className="hover:bg-orange-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{product.category.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-orange-600">
                          {product.available}/{product.totalStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {product.reserved} units
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Issues Message */}
        {oversoldProducts.length === 0 && negativeStockProducts.length === 0 && outOfStockProducts.length === 0 && lowStockProducts.filter(p => p.available > 0).length === 0 && (
          <div className="card text-center py-12">
            <TrendingUp className="mx-auto text-green-600 mb-4" size={48} />
            <h2 className="text-2xl font-semibold text-green-900 mb-2">All Stock Healthy!</h2>
            <p className="text-gray-600">
              No products are currently out of stock, oversold, or running low on inventory.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

