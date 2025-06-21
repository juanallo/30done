"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard since we need specific challenge ID
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Redirecting...</p>
      </div>
    </div>
  );
}
