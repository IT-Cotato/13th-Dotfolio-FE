import { useState } from "react";
import { AuthForm } from "@/components/login/AuthForm";
import { AuthFormField } from "@/components/login/AuthFormField";
import { PasswordInput } from "@/components/login/PasswordInput";
import {
  PasswordMatchIndicator,
  PasswordRequirementList,
} from "@/components/login/PasswordRequirementList";
import { SignupEmailField } from "@/components/signup/SignupEmailField";

const isPasswordCompositionValid = (password: string) =>
  /^[\x21-\x7E]+$/.test(password) &&
  /[A-Za-z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

export function SignupForm() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [name, setName] = useState("");
  const hasValidLength = password.length >= 8 && password.length <= 16;
  const hasValidComposition = isPasswordCompositionValid(password);
  const isPasswordMatched =
    passwordConfirmation.length > 0 && password === passwordConfirmation;

  return (
    <AuthForm bottomPadding="none">
      <h1 className="self-stretch text-header text-grey-900">회원가입</h1>

      <SignupEmailField />

      <AuthFormField htmlFor="signup-password" label="비밀번호">
        <PasswordInput
          ariaLabel="비밀번호"
          autoComplete="new-password"
          id="signup-password"
          onChange={setPassword}
          placeholder="영문+숫자+특수문자 조합 8~16자리"
          value={password}
        />
        <PasswordRequirementList
          hasValidComposition={hasValidComposition}
          hasValidLength={hasValidLength}
        />
      </AuthFormField>

      <AuthFormField htmlFor="signup-password-confirmation" label="비밀번호 확인">
        <PasswordInput
          ariaLabel="비밀번호 확인"
          autoComplete="new-password"
          id="signup-password-confirmation"
          onChange={setPasswordConfirmation}
          placeholder="비밀번호를 한 번 더 입력해주세요"
          value={passwordConfirmation}
        />
        <PasswordMatchIndicator isMatched={isPasswordMatched} />
      </AuthFormField>

      <AuthFormField htmlFor="signup-name" label="이름">
        <input
          autoComplete="name"
          className="h-12 self-stretch rounded-[14px] border border-grey-100 bg-grey-0 p-4 text-body2-md text-grey-900 outline-none placeholder:text-grey-400 focus:border-primary-500"
          id="signup-name"
          onChange={(event) => setName(event.target.value)}
          placeholder="예: 홍길동"
          type="text"
          value={name}
        />
      </AuthFormField>
    </AuthForm>
  );
}
