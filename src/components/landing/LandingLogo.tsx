import LogoEllipse from "@/assets/logo_Ellipse.svg";
import LogoRectangle from "@/assets/logo_Rectangle 33479.svg";

export function LandingLogo() {
  return (
    <a
      href="/"
      className="flex items-center gap-4 bg-transparent text-grey-0 no-underline"
      aria-label="Dotfolio 랜딩 페이지"
    >
      <span
        className="flex h-6 w-6 items-center justify-center p-[9px]"
        aria-hidden="true"
      >
        <span className="flex w-5 shrink-0 items-start justify-between">
          <LogoEllipse className="size-[3.2px] shrink-0" />
          <span className="h-5 w-[2.4px] shrink-0 bg-grey-0 shadow-[inset_0_-0.576px_0.576px_0_rgba(255,255,255,0.15)]" />
          <LogoRectangle className="h-5 w-3 shrink-0" />
        </span>
      </span>
      <span className="font-nexon text-[20px] leading-[140%] font-normal tracking-[-0.2px] text-grey-0 [text-shadow:0_0_20px_rgba(0,0,0,0.10)]">
        Dotfolio
      </span>
    </a>
  );
}
