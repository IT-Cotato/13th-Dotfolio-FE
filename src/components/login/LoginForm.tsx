import { useState } from "react";
import { AuthFormIntro } from "@/components/login/AuthFormIntro";
import { GoogleLoginButton } from "@/components/login/GoogleLoginButton";
import { LoginFields } from "@/components/login/LoginFields";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [hasLoginError, setHasLoginError] = useState(false);
  const isLoginEnabled = email.trim().length > 0 && password.length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    {
      /* 임시 동작 확인 용*/
    }
    if (isLoginEnabled) {
      setHasLoginError(true);
    }
  };

  return (
    <form
      className="flex w-full max-w-[463px] flex-col items-center gap-8 p-6"
      onSubmit={handleSubmit}
    >
      <AuthFormIntro title="반가워요!">
        <p>메모와 경험을 기록하고 성장의 흐름을 확인해보세요.</p>
      </AuthFormIntro>

      <LoginFields
        email={email}
        hasError={hasLoginError}
        keepSignedIn={keepSignedIn}
        onEmailChange={(value) => {
          setEmail(value);
          setHasLoginError(false);
        }}
        onKeepSignedInChange={setKeepSignedIn}
        onPasswordChange={(value) => {
          setPassword(value);
          setHasLoginError(false);
        }}
        password={password}
      />

      <div className="flex w-full flex-col gap-3">
        <button
          className={`w-full px-5 py-3.5 rounded-[14px] text-title2 text-grey-0 ${
            isLoginEnabled
              ? "flex items-center justify-center gap-2 bg-primary-gradient cursor-pointer"
              : "bg-grey-300 "
          }`}
          disabled={!isLoginEnabled}
          type="submit"
        >
          로그인
        </button>
        <GoogleLoginButton />
      </div>

      <div className="flex items-center gap-3">
        <p className="text-body3-md text-grey-600">계정이 없으신가요?</p>
        <button className="text-sub3-sb text-primary-500" type="button">
          회원가입하기
        </button>
      </div>
    </form>
  );
}
