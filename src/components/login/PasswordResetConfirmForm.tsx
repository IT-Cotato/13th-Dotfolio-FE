import { useState, type FormEvent } from "react";
import { resetPassword } from "@/api/auth";
import { ApiError } from "@/api/client";
import { Button } from "@/components/common/button";
import { AuthForm } from "@/components/login/AuthForm";
import { AuthFormField } from "@/components/login/AuthFormField";
import { PasswordInput } from "@/components/login/PasswordInput";
import {
  PasswordMatchIndicator,
  PasswordRequirementList,
} from "@/components/login/PasswordRequirementList";

const isPasswordCompositionValid = (password: string) =>
  /^[\x21-\x7E]+$/.test(password) &&
  /[A-Za-z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

interface PasswordResetPasswordFormProps {
  token: string | null;
  email: string | null;
  onComplete: () => void;
}

export function PasswordResetPasswordForm({
  token,
  email,
  onComplete,
}: PasswordResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasValidLength = newPassword.length >= 8 && newPassword.length <= 16;
  const hasValidComposition = isPasswordCompositionValid(newPassword);
  const isNewPasswordValid = hasValidLength && hasValidComposition;
  const isPasswordMatched =
    passwordConfirmation.length > 0 && newPassword === passwordConfirmation;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isNewPasswordValid || !isPasswordMatched || isSubmitting) {
      return;
    }

    if (!token || !email) {
      setRequestError("비밀번호 재설정 링크가 올바르지 않거나 만료되었습니다.");
      return;
    }

    setIsSubmitting(true);
    setRequestError(null);

    try {
      await resetPassword({
        token,
        email: email.trim().toLowerCase(),
        newPassword,
      });
      onComplete();
    } catch (error) {
      setRequestError(
        error instanceof ApiError
          ? error.message
          : "비밀번호 재설정 중 오류가 발생했습니다. 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit}>
      <h1 className="self-stretch text-header text-grey-900">
        비밀번호 재설정
      </h1>

      <AuthFormField htmlFor="new-password" label="새 비밀번호">
        <PasswordInput
          ariaLabel="새 비밀번호"
          autoComplete="new-password"
          id="new-password"
          onChange={setNewPassword}
          placeholder="영문+숫자+특수문자 조합 8~16자리"
          value={newPassword}
        />
        <PasswordRequirementList
          hasValidComposition={hasValidComposition}
          hasValidLength={hasValidLength}
        />
      </AuthFormField>

      <AuthFormField htmlFor="password-confirmation" label="비밀번호 확인">
        <PasswordInput
          ariaLabel="비밀번호 확인"
          autoComplete="new-password"
          id="password-confirmation"
          onChange={setPasswordConfirmation}
          placeholder="비밀번호를 한 번 더 입력해주세요"
          value={passwordConfirmation}
        />
        <PasswordMatchIndicator isMatched={isPasswordMatched} />
      </AuthFormField>

      <Button
        disabled={!isNewPasswordValid || !isPasswordMatched || isSubmitting}
        label="비밀번호 재설정하기"
        type="submit"
      />
      {requestError && (
        <p className="self-stretch text-body3-r text-error-text" role="alert">
          {requestError}
        </p>
      )}
    </AuthForm>
  );
}
