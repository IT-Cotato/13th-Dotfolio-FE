import { Navigate, useLocation } from "react-router-dom";
import { AuthLayout } from "@/components/login/AuthLayout";
import { GoogleAccountNotice } from "@/components/signup/GoogleAccountNotice";

export default function SignupGoogleAccount() {
  const { state } = useLocation();
  const email =
    typeof state === "object" &&
    state !== null &&
    "email" in state &&
    typeof state.email === "string"
      ? state.email
      : null;

  if (!email) {
    return <Navigate replace to="/signup" />;
  }

  return (
    <AuthLayout>
      <GoogleAccountNotice email={email} />
    </AuthLayout>
  );
}
