import { AuthLayout } from "@/components/login/AuthLayout";
import { SignupForm } from "@/components/signup/SignupForm";

export default function Signup() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
