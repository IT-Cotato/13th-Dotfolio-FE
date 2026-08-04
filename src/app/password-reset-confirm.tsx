import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/login/AuthLayout";
import { PasswordResetPasswordComplete } from "@/components/login/PasswordResetConfirmComplete";
import { PasswordResetPasswordForm } from "@/components/login/PasswordResetConfirmForm";

export default function PasswordResetConfirm() {
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  return (
    <AuthLayout>
      {isCompleted ? (
        <PasswordResetPasswordComplete onLogin={() => navigate("/login")} />
      ) : (
        <PasswordResetPasswordForm onComplete={() => setIsCompleted(true)} />
      )}
    </AuthLayout>
  );
}
