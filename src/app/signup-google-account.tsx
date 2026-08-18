import { useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/login/AuthLayout";
import { GoogleAccountNotice } from "@/components/signup/GoogleAccountNotice";

export default function SignupGoogleAccount() {
  const [searchParams] = useSearchParams();

  return (
    <AuthLayout>
      <GoogleAccountNotice email={searchParams.get("email") ?? ""} />
    </AuthLayout>
  );
}
