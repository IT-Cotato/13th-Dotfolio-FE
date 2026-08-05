import { useState } from "react";
import { Button } from "@/components/common/button";
import { AuthForm } from "@/components/login/AuthForm";
import { AuthFormIntro } from "@/components/login/AuthFormIntro";
import { EmailInput } from "@/components/login/EmailInput";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mockRegisteredEmail = "dotfolio@gmail.com";

interface PasswordResetFormProps {
  onComplete: (email: string) => void;
}

export function PasswordResetForm({ onComplete }: PasswordResetFormProps) {
  const [email, setEmail] = useState("");
  const [isEmailNotFound, setIsEmailNotFound] = useState(false);
  const normalizedEmail = email.trim().toLowerCase();
  const isEmailFormatValid = emailPattern.test(normalizedEmail);
  const hasFormatError = email.length > 0 && !isEmailFormatValid;
  const errorMessage = hasFormatError
    ? "올바른 이메일 형식으로 입력해주세요. 예: dotfolio@gmail.com"
    : isEmailNotFound
      ? "해당 이메일로 가입된 계정을 찾을 수 없습니다."
      : undefined;

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsEmailNotFound(false);
  };

  const handleResetMailRequest = () => {
    if (isEmailFormatValid) {
      if (normalizedEmail === mockRegisteredEmail) {
        onComplete(normalizedEmail);
        return;
      }

      setIsEmailNotFound(true);
    }
  };

  return (
    <AuthForm
      onSubmit={(event) => {
        event.preventDefault();
        handleResetMailRequest();
      }}
    >
      <AuthFormIntro title="비밀번호 재설정">
        <p>도트폴리오에 가입한 이메일 주소를 입력해 주세요.</p>
        <p>비밀번호를 재설정할 수 있는 링크를 이메일로 보내드립니다.</p>
      </AuthFormIntro>

      <EmailInput
        errorMessage={errorMessage}
        hasError={Boolean(errorMessage)}
        onChange={handleEmailChange}
        value={email}
      />

      <Button
        disabled={!isEmailFormatValid}
        label="재설정 메일 보내기"
        onClick={handleResetMailRequest}
      />
    </AuthForm>
  );
}
