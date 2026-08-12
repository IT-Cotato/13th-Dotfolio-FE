import { useState, type FormEvent } from "react";
import { requestPasswordReset } from "@/api/auth";
import { ApiError } from "@/api/client";
import { Button } from "@/components/common/button";
import { AuthForm } from "@/components/login/AuthForm";
import { AuthFormIntro } from "@/components/login/AuthFormIntro";
import { EmailInput } from "@/components/login/EmailInput";

const emailPattern = /^(?!\.)(?!.*\.\.)[A-Za-z0-9._+-]{1,64}(?<!\.)@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

interface PasswordResetFormProps {
  onComplete: (email: string) => void;
}

export function PasswordResetForm({ onComplete }: PasswordResetFormProps) {
  const [email, setEmail] = useState("");
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const normalizedEmail = email.trim().toLowerCase();
  const isEmailFormatValid = emailPattern.test(normalizedEmail);
  const hasFormatError = email.length > 0 && !isEmailFormatValid;
  const errorMessage = hasFormatError
    ? "올바른 이메일 형식으로 입력해주세요. 예: dotfolio@gmail.com"
    : requestError ?? undefined;

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setRequestError(null);
  };

  const handleResetMailRequest = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!isEmailFormatValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setRequestError(null);

    try {
      await requestPasswordReset({ email: normalizedEmail });
      onComplete(normalizedEmail);
    } catch (error) {
      setRequestError(
        error instanceof ApiError
          ? error.message
          : "재설정 메일 요청 중 오류가 발생했습니다. 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm onSubmit={handleResetMailRequest}>
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
        disabled={!isEmailFormatValid || isSubmitting}
        label="재설정 메일 보내기"
        type="submit"
      />
    </AuthForm>
  );
}
