"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface NavigationHeaderProps {
  title: string;
  onBack?: () => void;
  backHref?: string;
  /** When false, the back control is hidden (keeps title aligned with a matching left spacer). */
  showBack?: boolean;
  subtitle?: ReactNode;
  rightElement?: ReactNode;
  className?: string;
  titleClassName?: string;
}

export function NavigationHeader({
  title,
  onBack,
  backHref,
  showBack = true,
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
      <div className="flex items-center justify-between h-[40px]">
        {showBack ? (
          <button
            type="button"
            className="btn btn-ghost btn-square btn-link"
            onClick={handleBack}
          >
            <ArrowLeft className="h-6 w-6 text-purple-600" />
          </button>
        ) : (
          <div className="w-10 shrink-0" aria-hidden />
        )}
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