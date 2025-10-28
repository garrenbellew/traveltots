'use client'

import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="card text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-600" size={48} />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for your booking request.
        </p>
        
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Order Reference:</p>
            <p className="font-mono font-semibold text-lg">{orderId}</p>
          </div>
        )}
        
        <div className="space-y-3 text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="font-semibold">What happens next?</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>You've received a confirmation email with your order details</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>We'll review your request and contact you within 24 hours</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>We'll confirm delivery arrangements and payment details</span>
            </li>
          </ul>
        </div>
        
        <div className="space-x-4">
          <a href="/" className="btn btn-primary">
            Return Home
          </a>
          <a href="/products" className="btn btn-secondary">
            Browse More Products
          </a>
        </div>
      </div>
    </div>
  )
}

