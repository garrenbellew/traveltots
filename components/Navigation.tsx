'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ShoppingCart, User } from 'lucide-react'
import { getCartCount } from '@/lib/cart'

interface Page {
  id: string
  title: string
  slug: string
}

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [pages, setPages] = useState<Page[]>([])
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false)
  const hasFetched = useRef(false)

  useEffect(() => {
    setCartCount(getCartCount())
    // Update cart count periodically
    const interval = setInterval(() => {
      setCartCount(getCartCount())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Check if customer is logged in
    const customerSession = localStorage.getItem('customer_session')
    setIsCustomerLoggedIn(!!customerSession)
    
    // Watch for changes in customer session
    const handleStorageChange = () => {
      const session = localStorage.getItem('customer_session')
      setIsCustomerLoggedIn(!!session)
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    // Fetch active pages only once
    if (!hasFetched.current) {
      hasFetched.current = true
      fetch('/api/pages')
        .then(res => res.json())
        .then(data => {
          // Deduplicate pages by slug
          const uniquePages = Array.from(
            new Map(data.map((page: Page) => [page.slug, page])).values()
          )
          setPages(uniquePages)
        })
        .catch(err => console.error('Error fetching pages:', err))
    }
  }, [])

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-vacation-orange to-vacation-coral bg-clip-text text-transparent hover:scale-105 transition-transform">
              🌴 Travel Tots
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-vacation-orange transition font-medium text-base">
              Products
            </Link>
            <Link href="/bundles" className="text-gray-700 hover:text-vacation-orange transition font-medium text-base">
              Bundles
            </Link>
            <Link href="/testimonials" className="text-gray-700 hover:text-vacation-orange transition font-medium text-base">
              Testimonials
            </Link>
            {Array.from(
              new Map(pages.map((page) => [page.slug, page])).values()
            ).map((page) => (
              <Link 
                key={page.id} 
                href={`/pages/${page.slug}`} 
                className="text-gray-700 hover:text-vacation-orange transition font-medium text-base"
              >
                {page.title}
              </Link>
            ))}
            {isCustomerLoggedIn ? (
              <Link href="/customer/dashboard" className="text-gray-700 hover:text-vacation-orange transition flex items-center gap-2 font-medium text-base">
                <User size={18} />
                My Account
              </Link>
            ) : (
              <Link href="/customer/login" className="text-gray-700 hover:text-vacation-orange transition font-medium text-base">
                Sign In
              </Link>
            )}
            <Link href="/cart" className="btn btn-primary relative px-6">
              <ShoppingCart size={18} className="mr-2" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-vacation-coral text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-vacation-sandLight transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-3 bg-white border-t-2 border-vacation-sandLight">
            <Link href="/products" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-vacation-sandLight hover:text-vacation-orange transition-all font-medium" onClick={() => setMobileMenuOpen(false)}>
              Products
            </Link>
            <Link href="/bundles" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-vacation-sandLight hover:text-vacation-orange transition-all font-medium" onClick={() => setMobileMenuOpen(false)}>
              Bundles
            </Link>
            <Link href="/testimonials" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-vacation-sandLight hover:text-vacation-orange transition-all font-medium" onClick={() => setMobileMenuOpen(false)}>
              Testimonials
            </Link>
            {Array.from(
              new Map(pages.map((page) => [page.slug, page])).values()
            ).map((page) => (
              <Link 
                key={page.id}
                href={`/pages/${page.slug}`}
                className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-vacation-sandLight hover:text-vacation-orange transition-all font-medium" 
                onClick={() => setMobileMenuOpen(false)}
              >
                {page.title}
              </Link>
            ))}
            {isCustomerLoggedIn ? (
              <Link href="/customer/dashboard" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-vacation-sandLight hover:text-vacation-orange transition-all font-medium flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <User size={18} />
                My Account
              </Link>
            ) : (
              <Link href="/customer/login" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-vacation-sandLight hover:text-vacation-orange transition-all font-medium" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
            )}
            <Link href="/cart" className="block btn btn-primary relative mx-4" onClick={() => setMobileMenuOpen(false)}>
              <ShoppingCart size={18} className="mr-2" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-vacation-coral text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

