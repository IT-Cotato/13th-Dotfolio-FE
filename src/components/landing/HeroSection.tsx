import { LandingHeader } from "./LandingHeader";

const DOTFOLIO_MOCK_URL = new URL(
  "../../assets/dotfolio_mock.png",
  import.meta.url,
).href;

export function HeroSection() {
  return (
    <section className="relative flex h-[760px] w-full flex-col items-center overflow-hidden bg-[#F6F8FC] sm:h-[1175px]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('/images/background.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,74,164,0.25)_11.52%,rgba(22,74,164,0)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,248,252,0.10)_0%,rgba(246,248,252,0.70)_60.05%,#F6F8FC_100%)]" />
      </div>

      <div className="relative z-10 w-full">
        <LandingHeader />
      </div>

      <div className="relative z-10 mt-10 flex w-[592px] max-w-full flex-col items-center gap-5 px-5 sm:mt-16 sm:gap-6">
        <h1 className="flex w-[404px] max-w-full flex-col items-center gap-0.5 text-center text-3xl leading-[140%] tracking-[-0.48px] [text-shadow:0_0_20px_rgba(0,0,0,0.10)] sm:text-5xl min-[1440px]:text-[48px]!">
          <span className="w-full bg-[linear-gradient(90deg,#FFF_23.15%,rgba(255,255,255,0.40)_84.52%)] bg-clip-text font-normal text-transparent">
            기억은 흐려져도
          </span>
          <span className="w-full font-bold text-grey-0">
            경험은 남아야 하니까.
          </span>
        </h1>

        <p className="w-full text-center text-base leading-7 font-normal tracking-[-0.2px] text-grey-0 [text-shadow:0_0_20px_rgba(0,0,0,0.10)] sm:text-xl sm:leading-8 min-[1440px]:text-[20px]! min-[1440px]:leading-[32px]!">
          Dotfolio는 대학 생활의 모든 경험을 빠르게 기록하고,
          <br />
          자소서와 면접에 활용할 수 있도록 도와드려요.
        </p>
      </div>

      <div className="relative z-10 mt-8 aspect-[887/665] w-[887px] max-w-[calc(100%-2rem)] shrink-0 overflow-hidden sm:mt-11.5 sm:max-w-full">
        <img
          src={DOTFOLIO_MOCK_URL}
          alt="Dotfolio 서비스 화면"
          className="absolute top-[-10.213%] left-[-12.558%] h-[125.116%] w-[125.116%] max-w-none"
        />
      </div>
    </section>
  );
}
