import { useState, useEffect } from 'react'

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      console.log('App: Back online')
      setIsOffline(false)
      
      // Trigger cache refresh when back online
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          // Send message to service worker to refresh cache
          registration.active?.postMessage({
            type: 'REFRESH_CACHE',
            timestamp: Date.now()
          })
          console.log('App: Cache refresh triggered')
        })
      }
    }

    const handleOffline = () => {
      console.log('App: Gone offline')
      setIsOffline(true)
    }

    // Check initial status
    setIsOffline(!navigator.onLine)

    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOffline }
} 