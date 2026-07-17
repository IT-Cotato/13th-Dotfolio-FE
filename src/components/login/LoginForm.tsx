export function LoginForm() {
  return (
    <form
      className="flex w-full max-w-[463px] flex-col items-center gap-8 p-6"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="w-full">
        <h1 className="text-title1 text-grey-900">반가워요!</h1>
        <p className="mt-2 text-body1-md text-grey-600">
          메모와 경험을 기록하고 성장의 흐름을 확인해보세요.
        </p>
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-3">
          <input
            className="h-12 w-full rounded-[14px] border border-grey-100 p-4 text-body2-md text-grey-900 outline-none placeholder:text-grey-400"
            placeholder="이메일 입력"
            type="email"
          />
          <input
            className="h-12 w-full rounded-[14px] border border-grey-100 p-4 text-body2-md text-grey-900 outline-none placeholder:text-grey-400"
            placeholder="비밀번호 입력"
            type="password"
          />
        </div>
        <div className="flex items-center justify-between text-body3-md text-grey-600">
          <label className="flex items-center gap-2">
            <input
              className="size-5 rounded-sm border-grey-200"
              type="checkbox"
            />
            로그인 상태 유지
          </label>
          <button type="button">비밀번호 찾기</button>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <button
          className="w-full px-5 py-[14px] rounded-[14px] bg-grey-300 text-title2 text-grey-0"
          disabled
          type="submit"
        >
          로그인
        </button>
        <button
          className="w-full px-5 py-[14px] rounded-[14px] border border-grey-100 text-body2-md text-grey-900"
          type="button"
        >
          Google로 시작하기
        </button>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-body3-md text-grey-600">계정이 없으신가요?</p>
        <button className="text-sub3-sb text-primary-400" type="button">
          회원가입하기
        </button>
      </div>
    </form>
  );
}
