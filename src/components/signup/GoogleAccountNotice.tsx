import { AuthForm } from "@/components/login/AuthForm";
import { AuthFormIntro } from "@/components/login/AuthFormIntro";
import { GoogleLoginButton } from "@/components/login/GoogleLoginButton";
import { ReadonlyEmail } from "@/components/login/ReadonlyEmail";

interface GoogleAccountNoticeProps {
  email: string;
}

export function GoogleAccountNotice({ email }: GoogleAccountNoticeProps) {
  return (
    <AuthForm>
      <AuthFormIntro>
        <p>이미 가입된 구글 계정입니다.</p>
        <p>구글 로그인을 이용해주세요.</p>
      </AuthFormIntro>

      <ReadonlyEmail email={email} />

      <GoogleLoginButton label="Google 계정으로 로그인" />
    </AuthForm>
  );
}
