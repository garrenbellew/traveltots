'use client'

import { useEffect } from 'react'

export default function ManualAnchorHandler() {
  useEffect(() => {
    // Wait for content to be rendered
    const initAnchors = () => {
      // Handle anchor link clicks - use event delegation
      const handleAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const link = target.closest('a[href^="#"]') as HTMLAnchorElement
        
        if (link && link.href) {
          const href = link.getAttribute('href') || link.href
          if (href && href.includes('#')) {
            const hashIndex = href.indexOf('#')
            const id = href.substring(hashIndex + 1)
            
            if (id) {
              e.preventDefault()
              e.stopPropagation()
              
              // Try to find the element
              const element = document.getElementById(id)
              
              if (element) {
                // Scroll to element
                const yOffset = -20 // Offset for fixed header
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
                
                window.scrollTo({
                  top: y,
                  behavior: 'smooth'
                })
                
                // Update URL
                window.history.pushState(null, '', `#${id}`)
              } else {
                // Debug: log if element not found
                console.log('Anchor element not found:', id)
                console.log('Available IDs:', Array.from(document.querySelectorAll('[id]')).map(el => el.id))
              }
            }
          }
        }
      }
      
      // Handle initial hash in URL
      const handleInitialHash = () => {
        if (window.location.hash) {
          const id = window.location.hash.substring(1)
          setTimeout(() => {
            const element = document.getElementById(id)
            if (element) {
              const yOffset = -20
              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
              window.scrollTo({
                top: y,
                behavior: 'smooth'
              })
            }
          }, 300)
        }
      }
      
      // Use capture phase to intercept before Next.js router
      document.addEventListener('click', handleAnchorClick, true)
      handleInitialHash()
      
      return () => {
        document.removeEventListener('click', handleAnchorClick, true)
      }
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAnchors)
    } else {
      // DOM already loaded, wait a bit for content to render
      setTimeout(initAnchors, 100)
    }
  }, [])
  
  return null
}

