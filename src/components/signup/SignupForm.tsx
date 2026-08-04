import { AuthForm } from "@/components/login/AuthForm";
import { SignupEmailField } from "@/components/signup/SignupEmailField";

export function SignupForm() {
  return (
    <AuthForm bottomPadding="none">
      <h1 className="self-stretch text-header text-grey-900">
        회원가입
      </h1>
      <SignupEmailField />
    </AuthForm>
  );
}
