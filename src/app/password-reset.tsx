import { AuthLayout } from "@/components/login/AuthLayout";
import { PasswordResetForm } from "@/components/login/PasswordResetForm";

export default function PasswordReset() {
  return (
    <AuthLayout>
      <PasswordResetForm />
    </AuthLayout>
  );
}
