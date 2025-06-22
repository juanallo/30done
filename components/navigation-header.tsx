"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface NavigationHeaderProps {
  title: string;
  onBack?: () => void;
  backHref?: string;
  subtitle?: ReactNode;
  rightElement?: ReactNode;
  className?: string;
  titleClassName?: string;
}

export function NavigationHeader({
  title,
  onBack,
  backHref,
  subtitle,
  rightElement,
  className = "",
  titleClassName = "",
}: NavigationHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    }
  };

  return (
    <div className={`bg-white p-4 shadow-sm flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between">
        <button
          className="btn btn-ghost btn-square btn-link"
          onClick={handleBack}
        >
          <ArrowLeft className="h-6 w-6 text-purple-600" />
        </button>
        <h1
          className={`text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent ${titleClassName}`}
        >
          {title}
        </h1>
        <div className="w-10 flex justify-end">
          {rightElement}
        </div>
      </div>
      {subtitle && <div>{subtitle}</div>}
    </div>
  );
} 