import { Button } from "@/components/common/button";
import { AuthFormIntro } from "@/components/login/AuthFormIntro";

interface PasswordResetPasswordCompleteProps {
  onLogin: () => void;
}

export function PasswordResetPasswordComplete({
  onLogin,
}: PasswordResetPasswordCompleteProps) {
  return (
    <div className="flex w-full max-w-[463px] flex-col gap-8 p-6">
      <AuthFormIntro title="비밀번호 재설정 완료">
        <p>비밀번호가 재설정되었습니다.</p>
        <p>로그인하고 경험 기록 여정을 이어가보세요!</p>
      </AuthFormIntro>
      <Button label="로그인" onClick={onLogin} />
    </div>
  );
}
