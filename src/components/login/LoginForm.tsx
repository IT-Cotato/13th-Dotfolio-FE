import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/api/auth";
import { ApiError } from "@/api/client";
import { AuthForm } from "@/components/login/AuthForm";
import { AuthFormIntro } from "@/components/login/AuthFormIntro";
import { GoogleLoginButton } from "@/components/login/GoogleLoginButton";
import { LoginFields } from "@/components/login/LoginFields";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoginEnabled = email.trim().length > 0 && password.length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoginEnabled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setLoginError(null);

    try {
      const { data } = await login({
        email: email.trim(),
        password,
        rememberMe: keepSignedIn,
      });
      signIn(data);
      navigate("/home", { replace: true });
    } catch (error) {
      setLoginError(
        error instanceof ApiError
          ? error.message
          : "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit}>
      <AuthFormIntro title="반가워요!">
        <p>메모와 경험을 기록하고 성장의 흐름을 확인해보세요.</p>
      </AuthFormIntro>

      <LoginFields
        email={email}
        errorMessage={loginError ?? undefined}
        hasError={loginError !== null}
        keepSignedIn={keepSignedIn}
        onEmailChange={(value) => {
          setEmail(value);
          setLoginError(null);
        }}
        onKeepSignedInChange={setKeepSignedIn}
        onPasswordChange={(value) => {
          setPassword(value);
          setLoginError(null);
        }}
        password={password}
      />

      <div className="flex w-full flex-col gap-3">
        <button
          className={`w-full px-5 py-3.5 rounded-[14px] text-title2 text-grey-0 ${
            isLoginEnabled && !isSubmitting
              ? "flex items-center justify-center gap-2 bg-primary-gradient cursor-pointer"
              : "bg-grey-300 "
          }`}
          disabled={!isLoginEnabled || isSubmitting}
          type="submit"
        >
          로그인
        </button>
        <GoogleLoginButton />
      </div>

      <div className="flex items-center gap-3">
        <p className="text-body3-md text-grey-600">계정이 없으신가요?</p>
        <Link className="text-sub3-sb text-primary-500" to="/signup">
          회원가입하기
        </Link>
      </div>
    </AuthForm>
  );
}
