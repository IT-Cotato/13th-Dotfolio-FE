import { useState } from "react";
import VisibilityIcon from "@/assets/visibility.svg";
import VisibilityOffIcon from "@/assets/visibility_off.svg";

interface PasswordInputProps {
  value: string;
  placeholder: string;
  ariaLabel: string;
  autoComplete: "current-password" | "new-password";
  hasError?: boolean;
  id?: string;
  onChange: (password: string) => void;
}

export function PasswordInput({
  value,
  placeholder,
  ariaLabel,
  autoComplete,
  hasError = false,
  id,
  onChange,
}: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="relative flex h-12 shrink-0 self-stretch items-center justify-between">
      <input
        aria-invalid={hasError}
        aria-label={ariaLabel}
        autoComplete={autoComplete}
        className={`h-full w-full rounded-[14px] border p-4 text-body2-md text-grey-900 outline-none placeholder:text-grey-400 ${
          hasError
            ? "border-error-border bg-error-bg"
            : "border-grey-100 bg-grey-0 focus:border-primary-500"
        }`}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={isPasswordVisible ? "text" : "password"}
        value={value}
      />
      <button
        aria-label={isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400"
        onClick={() => setIsPasswordVisible((visible) => !visible)}
        type="button"
      >
        {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </button>
    </div>
  );
}
