import { useState } from "react";
import VisibilityIcon from "@/assets/visibility.svg";
import VisibilityOffIcon from "@/assets/visibility_off.svg";
import CheckIcon from "@/assets/checkicon.svg";
import { EmailInput } from "@/components/login/EmailInput";

interface LoginFieldsProps {
  email: string;
  password: string;
  keepSignedIn: boolean;
  hasError: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onKeepSignedInChange: (checked: boolean) => void;
}

export function LoginFields({
  email,
  password,
  keepSignedIn,
  hasError,
  onEmailChange,
  onPasswordChange,
  onKeepSignedInChange,
}: LoginFieldsProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-3">
        {/* 이메일 입력 */}
        <EmailInput
          hasError={hasError}
          onChange={onEmailChange}
          value={email}
        />

        {/* 비밀번호 입력 */}
        <div className="flex flex-col items-start gap-1.5 self-stretch">
          <div className="relative flex h-12 shrink-0 self-stretch items-center justify-between">
            <input
              aria-label="비밀번호"
              autoComplete="current-password"
              className={`h-full w-full rounded-[14px] border p-4 text-body2-md text-grey-900 outline-none placeholder:text-grey-400 ${
                hasError
                  ? "border-error-border bg-error-bg"
                  : "border-grey-100 bg-grey-0 focus:border-primary-500"
              }`}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="비밀번호 입력"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={
                isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 보기"
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400"
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              type="button"
            >
              {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          </div>
          {hasError && (
            <p role="alert" className="flex-1 text-body3-r text-error-text">
              아이디 또는 비밀번호가 올바르지 않습니다.
            </p>
          )}
        </div>
      </div>

      {/* 로그인 상태 유지 및 비밀번호 찾기 */}
      <div className="flex items-center justify-between text-body3-md text-grey-600">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            checked={keepSignedIn}
            className="sr-only"
            onChange={(event) => onKeepSignedInChange(event.target.checked)}
            type="checkbox"
          />
          <span
            aria-hidden="true"
            className={`w-5 h-5 py-[5px] px-[3px] rounded-[4px] border flex items-center justify-center transition-colors ${
              keepSignedIn
                ? "bg-primary-500 border-primary-500"
                : "bg-white border-grey-200"
            }`}
          >
            {keepSignedIn && (
              <CheckIcon className="w-[11.454px] h-[8.315px] shrink-0 text-white" />
            )}
          </span>
          로그인 상태 유지
        </label>
        <button type="button">비밀번호 찾기</button>
      </div>
    </div>
  );
}
