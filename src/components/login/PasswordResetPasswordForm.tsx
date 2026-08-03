import { useState } from "react";
import { AuthForm } from "@/components/login/AuthForm";
import { PasswordInput } from "@/components/login/PasswordInput";

export function PasswordResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  return (
    <AuthForm>
      <h1 className="self-stretch text-header text-grey-900">
        비밀번호 재설정
      </h1>

      <div className="flex w-full flex-col gap-12">
        <section className="flex flex-col gap-2">
          <label className="text-sub2-sb text-grey-900" htmlFor="new-password">
            새 비밀번호<span className="ml-0.5 text-error-text">*</span>
          </label>
          <PasswordInput
            ariaLabel="새 비밀번호"
            autoComplete="new-password"
            id="new-password"
            onChange={setNewPassword}
            placeholder="영문+숫자+특수문자 조합 8~16자리"
            value={newPassword}
          />
        </section>

        <section className="flex flex-col gap-2">
          <label
            className="text-sub2-sb text-grey-900"
            htmlFor="password-confirmation"
          >
            비밀번호 확인<span className="ml-0.5 text-error-text">*</span>
          </label>
          <PasswordInput
            ariaLabel="비밀번호 확인"
            autoComplete="new-password"
            id="password-confirmation"
            onChange={setPasswordConfirmation}
            placeholder="비밀번호를 한 번 더 입력해주세요"
            value={passwordConfirmation}
          />
        </section>
      </div>
    </AuthForm>
  );
}
