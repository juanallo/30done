"use client";

import { Button } from '@/components/ui/button'
import { WifiOff, RefreshCw, Wifi } from 'lucide-react'
import Link from 'next/link'
import { useOffline } from '@/hooks/useOffline'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OfflinePage() {
  const { isOffline } = useOffline()
  const router = useRouter()

  const handleRefresh = () => {
    window.location.reload()
  }

  // Auto-redirect when back online
  useEffect(() => {
    if (!isOffline) {
      // Small delay to ensure connection is stable
      const timer = setTimeout(() => {
        router.push('/')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isOffline, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Main illustration area */}
      <div className="mb-8 relative">
        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-orange-500/20 border border-orange-500/30">
          {isOffline ? (
            <WifiOff className="h-12 w-12 text-orange-400" />
          ) : (
            <Wifi className="h-12 w-12 text-green-400" />
          )}
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          {isOffline ? "You're Offline" : "Connection Restored"}
        </h1>
        <p className="text-purple-200 text-lg">
          {isOffline 
            ? "Don't worry! You can still access your cached challenges and track your progress."
            : "Redirecting you back to the app..."
          }
        </p>
      </div>

      {isOffline && (
        <div className="w-full max-w-sm space-y-4">
          <div className="text-center mb-6">
            <p className="text-purple-200 text-sm mb-4">
              Try these options:
            </p>
            <ul className="text-purple-200 text-sm space-y-2">
              <li>• Check your internet connection</li>
              <li>• Use cached challenges</li>
              <li>• Track your progress offline</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleRefresh}
              className="btn btn-secondary w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </button>
            <button
              onClick={() => router.push('/challenges')}
              className="btn btn-ghost w-full"
            >
              View Cached Challenges
            </button>
          </div>
        </div>
      )}
      
      {!isOffline && (
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => router.push('/')}
            className="btn btn-secondary w-full"
          >
            <Wifi className="mr-2 h-4 w-4" />
            Go to App
          </button>
        </div>
      )}
    </div>
  )
} 