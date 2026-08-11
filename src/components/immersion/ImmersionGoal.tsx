export function ImmersionGoal() {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center gap-2.5 bg-[rgba(26,26,28,0.70)] px-6 py-10 backdrop-blur-[1.5px]">
      <section className="flex w-full max-w-[500px] flex-col items-start justify-center gap-8 rounded-[32px] bg-[rgba(0,17,78,0.35)] p-6">
        <header className="flex w-full flex-col items-center justify-center gap-2 text-center">
          <h1 className="w-full text-title1 text-grey-0">
            완료할 기록의 개수와
            <br />
            몰입 시간을 설정해 보세요.
          </h1>
          <p className="text-body2-md text-grey-200">
            미완료된 기록은 무작위로 제공됩니다.
          </p>
        </header>
      </section>
    </main>
  );
}
