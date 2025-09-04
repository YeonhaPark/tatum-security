// shared/ui - 범용 컴포넌트
"use client";

import { useState } from "react";
import { Input } from "@/shared/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        autoComplete="off"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="none"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
        aria-label={showPassword ? "Hide password" : "Show password"}
        aria-pressed={showPassword}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOffIcon className="h-4 w-4 text-gray-400" />
        ) : (
          <EyeIcon className="h-4 w-4 text-gray-400" />
        )}
      </button>
    </div>
  );
}
