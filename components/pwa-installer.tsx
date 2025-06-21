'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, X } from 'lucide-react'

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [hasShownPrompt, setHasShownPrompt] = useState(false)

  useEffect(() => {
    console.log('PWA Installer: Component mounted')
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    console.log('PWA Installer: Is standalone?', isStandalone)
    
    if (isStandalone) {
      setIsInstalled(true)
      console.log('PWA Installer: App is already installed, hiding prompt')
      return
    }

    // Check if we've already shown the prompt in this session
    const hasShown = sessionStorage.getItem('pwa-prompt-shown')
    const hasDismissed = sessionStorage.getItem('pwa-prompt-dismissed')
    console.log('PWA Installer: Has shown before?', hasShown, 'Has dismissed?', hasDismissed)
    
    if (hasShown && hasDismissed) {
      setHasShownPrompt(true)
      console.log('PWA Installer: Prompt already shown and dismissed, not showing again')
      return
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Installer: beforeinstallprompt event received')
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Only show if we haven't shown it before and not on iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      console.log('PWA Installer: Is iOS?', isIOS)
      
      if (!hasShownPrompt && !isIOS) {
        console.log('PWA Installer: Showing install prompt')
        setShowInstallPrompt(true)
        sessionStorage.setItem('pwa-prompt-shown', 'true')
      }
    }

    // For testing purposes, show prompt after a delay if no beforeinstallprompt event
    const testTimer = setTimeout(() => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      if (!isInstalled && !hasShownPrompt && !isIOS && !deferredPrompt) {
        console.log('PWA Installer: No beforeinstallprompt event, showing test prompt')
        setShowInstallPrompt(true)
        sessionStorage.setItem('pwa-prompt-shown', 'true')
      }
    }, 3000)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      clearTimeout(testTimer)
    }
  }, [hasShownPrompt, isInstalled, deferredPrompt])

  const handleInstallClick = async () => {
    console.log('PWA Installer: Install button clicked')
    if (!deferredPrompt) {
      console.log('PWA Installer: No deferred prompt available')
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      setIsInstalled(true)
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    console.log('PWA Installer: Prompt dismissed')
    setShowInstallPrompt(false)
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  console.log('PWA Installer: Render state', { isInstalled, showInstallPrompt, hasShownPrompt })

  if (isInstalled || !showInstallPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="shadow-lg border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-blue-900">
              Install 30done
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-blue-700">
            Get quick access to your fitness challenges and track your progress offline
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              onClick={handleInstallClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Install App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// iOS Safari install prompt
export function IOSInstallPrompt() {
  const [showIOSPrompt, setShowIOSPrompt] = useState(false)

  useEffect(() => {
    console.log('iOS Install Prompt: Component mounted')
    
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const hasShownIOSPrompt = sessionStorage.getItem('ios-prompt-shown')
    const hasDismissedIOS = sessionStorage.getItem('ios-prompt-dismissed')
    
    console.log('iOS Install Prompt:', { isIOSDevice, isStandalone, hasShownIOSPrompt, hasDismissedIOS })
    
    if (isIOSDevice && !isStandalone && !hasShownIOSPrompt && !hasDismissedIOS) {
      // Delay showing iOS prompt to avoid conflict with other prompts
      const timer = setTimeout(() => {
        console.log('iOS Install Prompt: Showing prompt')
        setShowIOSPrompt(true)
        sessionStorage.setItem('ios-prompt-shown', 'true')
      }, 2000) // Show after 2 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    console.log('iOS Install Prompt: Dismissed')
    setShowIOSPrompt(false)
    sessionStorage.setItem('ios-prompt-dismissed', 'true')
  }

  console.log('iOS Install Prompt: Render state', { showIOSPrompt })

  if (!showIOSPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="shadow-lg border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-green-900">
              Add to Home Screen
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-green-700">
            Tap the share button <span className="font-semibold">📤</span> and select "Add to Home Screen" to install 30done
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              onClick={handleDismiss}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Got it
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 