import { useState } from "react";
import { Button } from "@/components/common/button";
import { AuthFormIntro } from "@/components/login/AuthFormIntro";
import { EmailInput } from "@/components/login/EmailInput";

export function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const isSubmitEnabled = email.trim().length > 0;

  return (
    <form
      className="flex w-full max-w-[463px] flex-col gap-8 p-6"
      onSubmit={(event) => event.preventDefault()}
    >
      <AuthFormIntro title="비밀번호 재설정">
        <p>도트폴리오에 가입한 이메일 주소를 입력해 주세요.</p>
        <p>비밀번호를 재설정할 수 있는 링크를 이메일로 보내드립니다.</p>
      </AuthFormIntro>

      <EmailInput
        onChange={setEmail}
        value={email}
      />

      <Button disabled={!isSubmitEnabled} label="재설정 메일 보내기" />
    </form>
  );
}
