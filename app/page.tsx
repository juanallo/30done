"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Flame, Trophy, Target, Zap } from "lucide-react";
import { Motivation } from "@/components/motivation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden flex-1">
      {/* Main illustration area */}
      <div className="mb-8 relative">
        <Image
          src="/logo.png"
          alt="30done Logo"
          width={240}
          height={2400}
          className="object-contain"
        />
      </div>


      <div className="text-center mb-8 relative z-10">
       <Motivation />
        <p className="text-white/90 text-xl font-medium">
          Join thousands completing 30-day fitness challenges
        </p>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-2 gap-4 mt-6 max-w-sm mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <Flame className="h-4 w-4 text-orange-400" />
            <span>Daily Streaks</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span>Achievements</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-green-400" />
            <span>Progress Tracking</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-blue-400" />
            <span>Quick Workouts</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          className="btn btn-secondary w-full"
          onClick={() => router.push("/challenges")}
        >
          <Zap className="h-5 w-5 mr-2" />
          Get Started Now!
        </button>
        
        {/* Stats preview */}
        <div className="bg-slate-500/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-yellow-600">30+</div>
              <div className="text-white/70">Challenges</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">10k+</div>
              <div className="text-white/70">Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">95%</div>
              <div className="text-white/70">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
