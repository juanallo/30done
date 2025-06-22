"use client";

import { WifiOff } from "lucide-react";
import { useOffline } from "@/hooks/useOffline";

export function OfflineBanner() {
  const { isOffline } = useOffline();

  if (isOffline) {
    return (
      <div className="z-50 bg-indigo-500 text-white text-center py-2 px-4">
        <div className="flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">
            You're offline - using cached data
          </span>
        </div>
      </div>
    );
  }

  return null;
}
