import { AuthForm } from "@/components/login/AuthForm";

export function PasswordResetPasswordForm() {
  return (
    <AuthForm>
      <h1 className="self-stretch text-header text-grey-900">비밀번호 재설정</h1>

      <div className="flex w-full flex-col gap-12">
        <section className="flex flex-col gap-3">
          <label className="text-sub2-sb text-grey-900">
            새 비밀번호 <span className="text-error-text">*</span>
          </label>
          <div
            aria-hidden="true"
            className="h-12 w-full rounded-[14px] border border-grey-100 bg-grey-0"
          />
        </section>

        <section className="flex flex-col gap-3">
          <label className="text-sub2-sb text-grey-900">
            비밀번호 확인 <span className="text-error-text">*</span>
          </label>
          <div
            aria-hidden="true"
            className="h-12 w-full rounded-[14px] border border-grey-100 bg-grey-0"
          />
        </section>
      </div>
    </AuthForm>
  );
}
