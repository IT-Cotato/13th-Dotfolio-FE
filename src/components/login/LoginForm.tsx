import { useState } from "react";
import { GoogleLoginButton } from "@/components/login/GoogleLoginButton";
import { LoginFields } from "@/components/login/LoginFields";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const isLoginEnabled = email.trim().length > 0 && password.length > 0;

  return (
    <form
      className="flex w-full max-w-[463px] flex-col items-center gap-8 p-6"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="w-full">
        <h1 className="text-title1 text-grey-900">반가워요!</h1>
        <p className="mt-2 text-body1-md text-grey-600">
          메모와 경험을 기록하고 성장의 흐름을 확인해보세요.
        </p>
      </div>

      <LoginFields
        email={email}
        keepSignedIn={keepSignedIn}
        onEmailChange={setEmail}
        onKeepSignedInChange={setKeepSignedIn}
        onPasswordChange={setPassword}
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
        <button className="text-sub3-sb text-primary-400" type="button">
          회원가입하기
        </button>
      </div>
    </form>
  );
}
