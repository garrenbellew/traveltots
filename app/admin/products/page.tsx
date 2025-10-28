'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { Plus, Edit, Trash2, Package, Tag } from 'lucide-react'
import ProductForm from '@/components/ProductForm'
import CategoryForm from '@/components/CategoryForm'
import AdminNav from '@/components/AdminNav'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  totalStock: number
  image: string | null
  reserved?: number
  available?: number
  isActive: boolean
  isBundle?: boolean
  category: { name: string }
  categoryId: string
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')
  const [showProductForm, setShowProductForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()

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
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products?all=true'),
        fetch('/api/categories')
      ])
      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      
      console.log('Fetched categories:', categoriesData)
      
      // Fetch stock information
      let stocksData = []
      try {
        const stocksRes = await fetch('/api/products/stocks')
        stocksData = await stocksRes.json()
        
        // Check if API returned an error object instead of array
        if (!Array.isArray(stocksData)) {
          console.warn('Stocks API returned non-array:', stocksData)
          stocksData = []
        }
      } catch (error) {
        console.error('Error fetching stocks:', error)
        stocksData = []
      }
      
      // Merge stock data with products
      const productsWithStock = productsData.map((product: Product) => {
        const stockInfo = stocksData.find((s: any) => s.id === product.id)
        return {
          ...product,
          reserved: stockInfo?.reserved || 0,
          available: stockInfo?.available || product.totalStock
        }
      })
      
      setProducts(productsWithStock)
      setAllCategories(categoriesData)
      console.log('Set categories state:', categoriesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchData() // Refresh the list
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('An error occurred')
    }
  }

  function handleEdit(product: Product) {
    setSelectedProduct(product)
    setShowProductForm(true)
  }

  function handleAdd() {
    setSelectedProduct(undefined)
    setShowProductForm(true)
  }

  async function handleProductFormSuccess() {
    // Small delay to ensure the API has finished processing
    await new Promise(resolve => setTimeout(resolve, 100))
    // Refresh the data
    fetchData()
    setSelectedProduct(undefined)
  }

  async function handleDeleteCategory(categoryId: string) {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchData()
      } else {
        alert('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('An error occurred')
    }
  }

  function handleEditCategory(category: Category) {
    setSelectedCategory(category)
    setShowCategoryForm(true)
  }

  function handleAddCategory() {
    setSelectedCategory(undefined)
    setShowCategoryForm(true)
  }

  async function handleCategoryFormSuccess() {
    // Small delay to ensure the API has finished processing
    await new Promise(resolve => setTimeout(resolve, 100))
    // Refresh the categories list
    fetchData()
    setSelectedCategory(undefined)
  }

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-2">Manage products and categories</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => activeTab === 'products' ? handleAdd() : handleAddCategory()}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Add {activeTab === 'products' ? 'Product' : 'Category'}
            </button>
          </div>
        </div>

        {/* Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'products'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package size={18} className="inline mr-2" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'categories'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Tag size={18} className="inline mr-2" />
              Categories
            </button>
          </div>

        {/* Content */}
        {activeTab === 'products' ? (
          products.length === 0 ? (
            <div className="card text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg mb-4">No products found</p>
              <button onClick={handleAdd} className="btn btn-primary">
                Add Your First Product
              </button>
            </div>
          ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock (Available/Total)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{product.category.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${
                          (product.available || 0) === 0 ? 'text-red-600' : 
                          (product.available || 0) < (product.totalStock / 2) ? 'text-orange-600' : 
                          'text-green-600'
                        }`}>
                          {product.available}/{product.totalStock}
                        </span>
                        {product.reserved && product.reserved > 0 && (
                          <span className="text-xs text-gray-500">
                            {product.reserved} reserved
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="btn btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                          title="Edit Product"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn btn-danger text-xs px-3 py-1.5 flex items-center gap-1"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )
        ) : allCategories.length === 0 ? (
          <div className="card text-center py-12">
            <Tag size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-4">No categories found</p>
            <button 
              onClick={() => {
                setSelectedCategory(undefined)
                setShowCategoryForm(true)
              }} 
              className="btn btn-primary"
            >
              Add Your First Category
            </button>
          </div>
        ) : (
          /* Categories Tab */
          <>
            {/* Debug: {console.log('Rendering categories tab, count:', allCategories.length, 'categories:', allCategories)} */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{category.slug}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{category.description || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="btn btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                          title="Edit Category"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="btn btn-danger text-xs px-3 py-1.5 flex items-center gap-1"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>

      <ProductForm
        isOpen={showProductForm}
        onClose={() => {
          setShowProductForm(false)
          setSelectedProduct(undefined)
        }}
        product={selectedProduct}
        onSuccess={handleProductFormSuccess}
        categories={allCategories}
      />

      <CategoryForm
        isOpen={showCategoryForm}
        onClose={() => {
          setShowCategoryForm(false)
          setSelectedCategory(undefined)
        }}
        category={selectedCategory}
        onSuccess={handleCategoryFormSuccess}
      />
    </div>
  )
}

