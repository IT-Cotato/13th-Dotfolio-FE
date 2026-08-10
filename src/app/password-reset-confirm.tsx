import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/login/AuthLayout";
import { PasswordResetPasswordComplete } from "@/components/login/PasswordResetConfirmComplete";
import { PasswordResetPasswordForm } from "@/components/login/PasswordResetConfirmForm";

export default function PasswordResetConfirm() {
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  return (
    <AuthLayout>
      {isCompleted ? (
        <PasswordResetPasswordComplete onLogin={() => navigate("/login")} />
      ) : (
        <PasswordResetPasswordForm
          email={email}
          onComplete={() => setIsCompleted(true)}
          token={token}
        />
      )}
    </AuthLayout>
  );
}
