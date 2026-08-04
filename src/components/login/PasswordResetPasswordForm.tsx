import { useState } from "react";
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
  onComplete: () => void;
}

export function PasswordResetPasswordForm({
  onComplete,
}: PasswordResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const hasValidLength = newPassword.length >= 8 && newPassword.length <= 16;
  const hasValidComposition = isPasswordCompositionValid(newPassword);
  const isNewPasswordValid = hasValidLength && hasValidComposition;
  const isPasswordMatched =
    passwordConfirmation.length > 0 && newPassword === passwordConfirmation;

  return (
    <AuthForm>
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
        disabled={!isNewPasswordValid || !isPasswordMatched}
        label="비밀번호 재설정하기"
        onClick={onComplete}
      />
    </AuthForm>
  );
}
