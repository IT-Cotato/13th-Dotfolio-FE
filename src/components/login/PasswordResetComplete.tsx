import { Button } from "@/components/common/button";

interface PasswordResetCompleteProps {
  email: string;
  onReturnToLogin: () => void;
}

export function PasswordResetComplete({
  email,
  onReturnToLogin,
}: PasswordResetCompleteProps) {
  return (
    <div className="w-full max-w-[463px] p-6">
      <section className="flex flex-col items-start justify-center gap-6">
        <h1 className="text-header text-grey-900">
          비밀번호 재설정 메일 발송 완료
        </h1>
        <p className="text-body-reading2-md text-grey-900">{email}</p>
        <p className="text-body1-md text-grey-600">
          위 이메일 주소로 비밀번호 재설정 링크가 발송되었습니다.
          <br />
          이메일이 보이지 않는 경우 스팸함 등을 확인해주세요.
        </p>
        <Button label="로그인 화면으로 돌아가기" onClick={onReturnToLogin} />
      </section>
    </div>
  );
}
