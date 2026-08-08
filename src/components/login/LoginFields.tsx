import { Link } from "react-router-dom";
import { Checkbox } from "@/components/common/CheckBox";
import { EmailInput } from "@/components/login/EmailInput";
import { PasswordInput } from "@/components/login/PasswordInput";

interface LoginFieldsProps {
  email: string;
  password: string;
  keepSignedIn: boolean;
  hasError: boolean;
  errorMessage?: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onKeepSignedInChange: (checked: boolean) => void;
}

export function LoginFields({
  email,
  password,
  keepSignedIn,
  hasError,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onKeepSignedInChange,
}: LoginFieldsProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-3">
        <EmailInput hasError={hasError} onChange={onEmailChange} value={email} />

        <div className="flex flex-col items-start gap-1.5 self-stretch">
          <PasswordInput
            ariaLabel="비밀번호"
            autoComplete="current-password"
            hasError={hasError}
            onChange={onPasswordChange}
            placeholder="비밀번호 입력"
            value={password}
          />
          {hasError && (
            <p role="alert" className="flex-1 text-body3-r text-error-text">
              {errorMessage ?? "아이디 또는 비밀번호가 올바르지 않습니다."}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-body3-md text-grey-600">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={keepSignedIn}
            id="keep-signed-in"
            onChange={onKeepSignedInChange}
          />
          로그인 상태 유지
        </label>
        <Link to="/password-reset">비밀번호 찾기</Link>
      </div>
    </div>
  );
}
