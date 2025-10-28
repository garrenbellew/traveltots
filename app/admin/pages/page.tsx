'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, FileText, Eye, EyeOff } from 'lucide-react'
import PageForm from '@/components/PageForm'
import AdminNav from '@/components/AdminNav'
import { useRouter } from 'next/navigation'

interface Page {
  id: string
  title: string
  slug: string
  content: string
  image: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminPagesPage() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedPage, setSelectedPage] = useState<Page | undefined>()

  useEffect(() => {
    fetchPages()
  }, [])

  async function fetchPages() {
    try {
      const response = await fetch('/api/pages?all=true')
      const data = await response.json()
      setPages(data)
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleAdd() {
    setSelectedPage(undefined)
    setShowForm(true)
  }

  function handleEdit(page: Page) {
    setSelectedPage(page)
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this page?')) {
      return
    }

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete page')
      }

      fetchPages()
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Failed to delete page')
    }
  }

  function handleFormSuccess() {
    fetchPages()
  }

  function handleToggleActive(id: string, currentStatus: boolean) {
    // This will be handled by the form
    const page = pages.find(p => p.id === id)
    if (page) {
      const updatedPage = { ...page, isActive: !currentStatus }
      setSelectedPage(updatedPage)
      setShowForm(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading pages...</p>
        </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Pages</h1>
            <p className="text-gray-600 mt-2">Create and manage static content pages</p>
          </div>
          <button
            onClick={handleAdd}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Page
          </button>
        </div>

        {/* Pages Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No pages</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new page.
                    </p>
                  </td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">/pages/{page.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {page.image ? (
                        <img 
                          src={page.image} 
                          alt={page.title}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(page.id, page.isActive)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          page.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {page.isActive ? (
                          <>
                            <Eye size={14} />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff size={14} />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(page.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(page)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page Form Modal */}
      <PageForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setSelectedPage(undefined)
        }}
        page={selectedPage}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}

