import { AuthLayout } from "@/components/login/AuthLayout";
import { PasswordResetPasswordForm } from "@/components/login/PasswordResetPasswordForm";

export default function PasswordResetConfirm() {
  return (
    <AuthLayout>
      <PasswordResetPasswordForm />
    </AuthLayout>
  );
}
