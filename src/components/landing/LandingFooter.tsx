import { LandingLogo } from "./LandingLogo";

export function LandingFooter() {
  return (
    <footer className="flex w-full max-w-[1440px] items-center gap-10 border-t border-grey-100 bg-[#F6F8FC] px-4 py-12 sm:px-8 lg:gap-20 lg:p-30">
      <div className="flex flex-1 flex-col items-start gap-10 lg:gap-20">
        <LandingLogo tone="muted" />

        <div className="flex w-full flex-col items-start gap-4 text-base leading-7 tracking-[-0.2px] text-grey-600 lg:text-xl">
          <p className="font-normal">
            © 2026 Dotfolio. 하루의 작은 점들이 모여 나만의 포트폴리오가 되는 곳
          </p>
          <p className="font-semibold">개인정보 처리방침</p>
        </div>
      </div>
    </footer>
  );
}
