import ArrowDropDownIcon from "@/assets/arrow_drop_down.svg";

export function SignupEmailField() {
  return (
    <section className="flex w-full flex-col items-start gap-2 self-stretch">
      <label className="text-sub2-sb text-grey-900" htmlFor="signup-email-local">
        이메일 아이디 <span className="ml-0.5 text-error-text">*</span>
      </label>

      <div className="flex items-center gap-2 self-stretch">
        <input
          aria-label="이메일 아이디"
          autoComplete="username"
          className="h-12 min-w-0 flex-[1_0_0] rounded-[14px] border border-grey-100 bg-grey-0 p-4 text-body2-md text-grey-900 outline-none placeholder:text-grey-400 focus:border-primary-500"
          id="signup-email-local"
          placeholder="예: cotato"
          type="text"
        />
        <span aria-hidden="true" className="text-sub2-sb text-grey-400">
          @
        </span>
        <input
          aria-label="이메일 도메인"
          autoComplete="email"
          className="h-12 min-w-0 flex-[1_0_0] rounded-[14px] border border-grey-100 bg-grey-0 p-4 text-body2-md text-grey-900 outline-none placeholder:text-grey-400 focus:border-primary-500"
          type="text"
        />
        <button
          aria-expanded="false"
          aria-haspopup="listbox"
          className="flex h-12 min-w-0 flex-[1_0_0] items-center justify-between rounded-[14px] border border-grey-100 bg-grey-0 p-4 text-body2-md text-grey-400"
          type="button"
        >
          선택
          <span className="flex size-6 shrink-0 flex-col items-center justify-center px-2 py-2.5">
            <ArrowDropDownIcon className="h-[5px] w-2.5 shrink-0" />
          </span>
        </button>
      </div>
    </section>
  );
}
