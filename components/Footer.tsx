'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Footer() {
  const [contactInfo, setContactInfo] = useState({ email: 'info@traveltots.es', phone: null as string | null })

  useEffect(() => {
    fetch('/api/contact')
      .then(res => res.json())
      .then(data => setContactInfo(data))
      .catch(() => {
        // Keep default on error
      })
  }, [])

  return (
    <footer className="bg-gradient-to-br from-vacation-oceanDark to-vacation-ocean text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-vacation-orange to-vacation-coral bg-clip-text text-transparent">
              🌴 Travel Tots
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Making your Spanish adventure easier with quality child essentials
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products" className="hover:text-vacation-orange transition-colors">Products</Link></li>
              <li><Link href="/bundles" className="hover:text-vacation-orange transition-colors">Bundles</Link></li>
              <li><Link href="/about" className="hover:text-vacation-orange transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-vacation-orange transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-5">Information</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/terms" className="hover:text-vacation-orange transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-vacation-orange transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-5">📍 Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Los Alcázares, Spain</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📧</span>
                <a href={`mailto:${contactInfo.email}`} className="hover:text-vacation-orange transition-colors">
                  {contactInfo.email}
                </a>
              </li>
              {contactInfo.phone && (
                <li className="flex items-start gap-2">
                  <span>📞</span>
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-vacation-orange transition-colors">
                    {contactInfo.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} Travel Tots. All rights reserved. 🌴</p>
        </div>
      </div>
    </footer>
  )
}

