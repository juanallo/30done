'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Trash2, Eye, X } from 'lucide-react'

export function PWADebug() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [isVisible, setIsVisible] = useState(true)

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  // If hidden, show a small button to reopen
  if (!isVisible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const getDebugInfo = () => {
    const info = {
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      userAgent: navigator.userAgent,
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      serviceWorker: 'serviceWorker' in navigator,
      sessionStorage: {
        pwaPromptShown: sessionStorage.getItem('pwa-prompt-shown'),
        pwaPromptDismissed: sessionStorage.getItem('pwa-prompt-dismissed'),
        iosPromptShown: sessionStorage.getItem('ios-prompt-shown'),
        iosPromptDismissed: sessionStorage.getItem('ios-prompt-dismissed'),
      }
    }
    setDebugInfo(info)
    console.log('PWA Debug Info:', info)
  }

  const clearSessionStorage = () => {
    sessionStorage.clear()
    console.log('Session storage cleared')
    getDebugInfo()
  }

  const clearPWASession = () => {
    sessionStorage.removeItem('pwa-prompt-shown')
    sessionStorage.removeItem('pwa-prompt-dismissed')
    sessionStorage.removeItem('ios-prompt-shown')
    sessionStorage.removeItem('ios-prompt-dismissed')
    console.log('PWA session storage cleared')
    getDebugInfo()
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Card className="shadow-lg border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-orange-900">
              PWA Debug Panel
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-orange-700">
            Development tools for testing PWA installation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={getDebugInfo}
              size="sm"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Eye className="mr-2 h-4 w-4" />
              Debug Info
            </Button>
            <Button
              onClick={clearPWASession}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset PWA
            </Button>
          </div>
          
          <Button
            onClick={clearSessionStorage}
            size="sm"
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All Session
          </Button>

          {Object.keys(debugInfo).length > 0 && (
            <div className="mt-4 p-3 bg-white rounded border text-xs">
              <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 