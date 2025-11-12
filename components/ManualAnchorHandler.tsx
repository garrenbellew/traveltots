'use client'

import { useEffect } from 'react'

export default function ManualAnchorHandler() {
  useEffect(() => {
    // Handle anchor link clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement
      
      if (link) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('#')) {
          const id = href.substring(1)
          const element = document.getElementById(id)
          
          if (element) {
            e.preventDefault()
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
            
            // Update URL without scrolling
            window.history.pushState(null, '', href)
          }
        }
      }
    }
    
    // Handle initial hash in URL
    const handleInitialHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1)
        const element = document.getElementById(id)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }, 100)
        }
      }
    }
    
    document.addEventListener('click', handleAnchorClick)
    handleInitialHash()
    
    return () => {
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])
  
  return null
}

