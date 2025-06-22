"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

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

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          Set Your Goal,
          <br />
          Crush Your Limit!
        </h1>
        <p className="text-purple-200 text-lg">
          Join thousands completing 30-day fitness challenges
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          className="btn btn-secondary w-full"
          onClick={() => router.push("/challenges")}
        >
          Get started
        </button>
        {/* <button className="btn btn-ghost w-full">Login with Google</button> */}
      </div>
    </div>
  );
}
