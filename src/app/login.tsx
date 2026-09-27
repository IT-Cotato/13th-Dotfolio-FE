import { Navigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/login/AuthLayout";
import { LoginForm } from "@/components/login/LoginForm";

const GENERAL_ACCOUNT_OAUTH_ERROR =
  "이미 다른 방식으로 가입된 이메일입니다. 기존 계정으로 로그인을 이용해주세요.";

export default function Login() {
  const [searchParams] = useSearchParams();

  if (searchParams.get("error") === GENERAL_ACCOUNT_OAUTH_ERROR) {
    return <Navigate replace to="/login/general-account" />;
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
