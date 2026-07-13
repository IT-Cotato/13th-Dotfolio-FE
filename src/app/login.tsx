import { LoginHeader } from "@/components/login/LoginHeader";

export default function Login() {
  return (
    <main className="w-full min-h-svh bg-home">
      <section className="flex min-h-svh overflow-hidden">
        <div className="flex w-full flex-col bg-grey-0 md:w-1/2">
          <LoginHeader />

          <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
            <div className="w-full max-w-[284px]" aria-label="로그인 폼 영역" />
          </div>
        </div>

        <aside className="hidden w-1/2 md:block" aria-label="Dotfolio 브랜딩 영역" />
      </section>
    </main>
  );
}
