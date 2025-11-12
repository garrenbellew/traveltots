'use client'

import { useEffect } from 'react'

export default function ManualAnchorHandler() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement
      
      if (link) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('#')) {
          const id = href.substring(1)
          
          if (id) {
            e.preventDefault()
            e.stopPropagation()
            
            // Wait a moment for any React updates
            setTimeout(() => {
              const element = document.getElementById(id)
              
              if (element) {
                // Calculate scroll position
                const yOffset = -20
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
                
                window.scrollTo({
                  top: y,
                  behavior: 'smooth'
                })
                
                // Update URL without triggering scroll
                window.history.pushState(null, '', `#${id}`)
              } else {
                // Debug: show what we're looking for and what exists
                const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id)
                const headingIds = Array.from(document.querySelectorAll('h1[id], h2[id], h3[id]')).map(el => ({
                  id: el.id,
                  text: el.textContent?.substring(0, 50) || ''
                }))
                console.warn('Anchor element not found:', id)
                console.log('Looking for ID:', id)
                console.log('All heading IDs:', headingIds)
                console.log('Total IDs on page:', allIds.length)
              }
            }, 50)
          }
        }
      }
    }
    
    // Handle initial hash in URL on page load
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
        }, 500)
      }
    }
    
    // Add event listener with capture phase to catch before Next.js
    document.addEventListener('click', handleAnchorClick, true)
    
    // Handle initial hash after content loads
    setTimeout(handleInitialHash, 500)
    
    return () => {
      document.removeEventListener('click', handleAnchorClick, true)
    }
  }, [])
  
  return null
}

