import { Navigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/login/AuthLayout";
import { GoogleAccountNotice } from "@/components/signup/GoogleAccountNotice";

export default function SignupGoogleAccount() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  if (!email) {
    return <Navigate replace to="/signup" />;
  }

  return (
    <AuthLayout>
      <GoogleAccountNotice email={email} />
    </AuthLayout>
  );
}
