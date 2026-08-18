import { useCallback, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "@/api/auth";
import { ApiError } from "@/api/client";
import { Button } from "@/components/common/button";
import { AuthForm } from "@/components/login/AuthForm";
import { AuthFormField } from "@/components/login/AuthFormField";
import { PasswordInput } from "@/components/login/PasswordInput";
import {
  PasswordMatchIndicator,
  PasswordRequirementList,
} from "@/components/login/PasswordRequirementList";
import { SignupEmailField } from "@/components/signup/SignupEmailField";
import { TermsAgreement } from "@/components/signup/TermsAgreement";

const isPasswordCompositionValid = (password: string) =>
  /^[\x21-\x7E]+$/.test(password) &&
  /[A-Za-z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

const DUPLICATE_EMAIL_ERROR_MESSAGE =
  "이미 가입된 이메일 주소입니다. 다른 이메일을 입력해주세요.";

export function SignupForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const emailRef = useRef("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [name, setName] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isRequiredAgreed, setIsRequiredAgreed] = useState(false);
  const [isOptionalAgreed, setIsOptionalAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(
    null,
  );
  const hasValidLength = password.length >= 8 && password.length <= 16;
  const hasValidComposition = isPasswordCompositionValid(password);
  const isPasswordMatched =
    passwordConfirmation.length > 0 && password === passwordConfirmation;
  const isSignupEnabled =
    isEmailValid &&
    hasValidLength &&
    hasValidComposition &&
    isPasswordMatched &&
    name.trim().length > 0 &&
    isRequiredAgreed;

  const handleEmailChange = useCallback((value: string) => {
    emailRef.current = value;
    setEmail(value);
    setSubmitError(null);
    setEmailErrorMessage(null);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSignupEnabled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setEmailErrorMessage(null);
    const requestedEmail = email;

    try {
      await signup({
        email: requestedEmail,
        password,
        nickname: name.trim(),
        isPrivacyAgreed: isRequiredAgreed,
        isMarketingAgreed: isOptionalAgreed,
      });
      navigate("/login");
    } catch (error) {
      const isDuplicateEmailError =
        error instanceof ApiError &&
        (error.status === 409 || error.message.includes("이미 가입된 이메일"));

      if (isDuplicateEmailError) {
        if (emailRef.current === requestedEmail) {
          setEmailErrorMessage(DUPLICATE_EMAIL_ERROR_MESSAGE);
        }
      } else {
        setSubmitError(
          error instanceof ApiError
            ? error.message
            : "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm bottomPadding="none" onSubmit={handleSubmit}>
      <h1 className="self-stretch text-header text-grey-900">회원가입</h1>

      <SignupEmailField
        errorMessage={emailErrorMessage ?? undefined}
        onEmailChange={handleEmailChange}
        onValidityChange={setIsEmailValid}
      />

      <AuthFormField htmlFor="signup-password" label="비밀번호">
        <PasswordInput
          ariaLabel="비밀번호"
          autoComplete="new-password"
          id="signup-password"
          onChange={(value) => {
            setPassword(value);
            setSubmitError(null);
          }}
          placeholder="영문+숫자+특수문자 조합 8~16자리"
          value={password}
        />
        <PasswordRequirementList
          hasValidComposition={hasValidComposition}
          hasValidLength={hasValidLength}
        />
      </AuthFormField>

      <AuthFormField
        htmlFor="signup-password-confirmation"
        label="비밀번호 확인"
      >
        <PasswordInput
          ariaLabel="비밀번호 확인"
          autoComplete="new-password"
          id="signup-password-confirmation"
          onChange={(value) => {
            setPasswordConfirmation(value);
            setSubmitError(null);
          }}
          placeholder="비밀번호를 한 번 더 입력해주세요"
          value={passwordConfirmation}
        />
        <PasswordMatchIndicator isMatched={isPasswordMatched} />
      </AuthFormField>

      <AuthFormField htmlFor="signup-name" label="이름">
        <input
          autoComplete="name"
          className="h-12 self-stretch rounded-[14px] border border-grey-100 bg-grey-0 p-4 text-body2-md text-grey-900 outline-none placeholder:text-body2-r placeholder:text-grey-400 focus:border-primary-500"
          id="signup-name"
          onChange={(event) => {
            setName(event.target.value);
            setSubmitError(null);
          }}
          placeholder="예: 홍길동"
          type="text"
          value={name}
        />
      </AuthFormField>

      <TermsAgreement
        isOptionalAgreed={isOptionalAgreed}
        isRequiredAgreed={isRequiredAgreed}
        onOptionalAgreedChange={(value) => {
          setIsOptionalAgreed(value);
          setSubmitError(null);
        }}
        onRequiredAgreedChange={(value) => {
          setIsRequiredAgreed(value);
          setSubmitError(null);
        }}
      />

      <Button
        disabled={!isSignupEnabled || isSubmitting}
        label="회원가입하기"
        type="submit"
      />
      {submitError && (
        <p role="alert" className="self-stretch text-body3-r text-error-text">
          {submitError}
        </p>
      )}
    </AuthForm>
  );
}
