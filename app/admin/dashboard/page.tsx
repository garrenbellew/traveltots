'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, ShoppingCart, AlertTriangle, Calendar } from 'lucide-react'
import AdminNav from '@/components/AdminNav'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pendingOrders: 0,
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    todayDeliveries: 0,
  })

  useEffect(() => {
    // Check authentication
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
      return
    }

    // Fetch dashboard stats
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const [ordersRes, productsRes, stockRes] = await Promise.all([
        fetch('/api/orders?status=PENDING'),
        fetch('/api/products'),
        fetch('/api/products/stocks'),
      ])

      const orders = await ordersRes.json()
      const products = await productsRes.json()
      const stockData = await stockRes.json()

      // Calculate low stock (2 or fewer available units)
      const lowStockCount = stockData.filter((p: any) => p.available <= 2 && p.isActive).length
      const outOfStockCount = stockData.filter((p: any) => p.available === 0 && p.isActive).length

      setStats({
        pendingOrders: orders.length || 0,
        totalProducts: products.length || 0,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount,
        todayDeliveries: 0, // TODO: Calculate today's deliveries
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold">{stats.pendingOrders}</p>
              </div>
              <ShoppingCart size={40} className="opacity-50" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Out of Stock</p>
                <p className="text-3xl font-bold">{stats.outOfStock}</p>
              </div>
              <AlertTriangle size={40} className="opacity-50" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Low Stock</p>
                <p className="text-3xl font-bold">{stats.lowStock}</p>
              </div>
              <Package size={40} className="opacity-50" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/orders" className="card hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Manage Orders</h3>
            <p className="text-gray-600">View and process customer orders</p>
          </Link>

          <Link href="/admin/products" className="card hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Manage Products</h3>
            <p className="text-gray-600">Add or edit products and stock</p>
          </Link>

          <Link href="/admin/calendar" className="card hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Calendar View</h3>
            <p className="text-gray-600">View deliveries and collections</p>
          </Link>

          <Link href="/admin/stock-report" className="card bg-yellow-50 border border-yellow-200 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-yellow-900">Stock Report</h3>
            <p className="text-yellow-700">Quick low stock analysis</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

