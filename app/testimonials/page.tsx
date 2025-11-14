'use client'

import { useEffect, useState } from 'react'
import { Star, Quote } from 'lucide-react'
import type { Metadata } from 'next'

interface Testimonial {
  id: string
  name: string
  location?: string
  rating: number
  content: string
  image?: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials')
      const data = await res.json()
      setTestimonials(data)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    }
  }

  return (
    <div className="min-h-screen bg-vacation-sandLight py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-vacation-orange to-vacation-orangeLight rounded-full mb-6">
            <Quote className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">What Our Customers Say</h1>
          <p className="text-xl text-gray-600">
            Real experiences from families who trust Travel Tots
          </p>
        </div>

        {/* Testimonials Grid */}
        {testimonials.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No testimonials available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-vacation transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-vacation-orange to-vacation-orangeLight flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-800">{testimonial.name}</p>
                    {testimonial.location && (
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

