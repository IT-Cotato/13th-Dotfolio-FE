import { Link } from "react-router-dom";
import { AuthForm } from "@/components/login/AuthForm";
import { AuthFormIntro } from "@/components/login/AuthFormIntro";

export function GeneralAccountNotice() {
  return (
    <AuthForm>
      <AuthFormIntro>
        <p>이미 일반 회원으로 가입된 이메일입니다.</p>
        <p>이메일과 비밀번호로 로그인해주세요.</p>
      </AuthFormIntro>

      <Link
        className="flex h-13 w-full items-center justify-center rounded-[14px] bg-primary-gradient px-5 py-3.5 text-title2 text-grey-0"
        to="/login"
      >
        일반 로그인하기
      </Link>
    </AuthForm>
  );
}
