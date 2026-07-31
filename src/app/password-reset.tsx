import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/login/AuthLayout";
import { PasswordResetComplete } from "@/components/login/PasswordResetComplete";
import { PasswordResetForm } from "@/components/login/PasswordResetForm";

export default function PasswordReset() {
  const [completedEmail, setCompletedEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <AuthLayout>
      {completedEmail ? (
        <PasswordResetComplete
          email={completedEmail}
          onReturnToLogin={() => navigate("/login")}
        />
      ) : (
        <PasswordResetForm onComplete={setCompletedEmail} />
      )}
    </AuthLayout>
  );
}
