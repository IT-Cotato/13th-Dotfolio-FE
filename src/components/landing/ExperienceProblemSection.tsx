const EXPERIENCE_CURVE_URL = new URL(
  "../../assets/ExperienceCurve.png",
  import.meta.url,
).href;

export function ExperienceProblemSection() {
  return (
    <section className="flex w-full max-w-[1440px] flex-col items-center justify-center gap-5 overflow-hidden px-4 py-20 sm:gap-6 sm:px-64.5 sm:pb-35 sm:pt-30 min-[1440px]:px-[258px]!">
      <h2 className="w-full text-center text-3xl leading-[150%] font-bold tracking-[-0.48px] text-grey-900 sm:text-5xl sm:leading-[160%] min-[1440px]:text-[48px]! min-[1440px]:leading-[76.8px]!">
        자소서가 어려운 이유는
        <br />
        경험이 없어서가 아니에요.
      </h2>

      <p className="w-full text-center text-base leading-7 font-normal tracking-[-0.2px] text-grey-700 [text-shadow:0_0_20px_rgba(0,0,0,0.10)] sm:text-xl sm:leading-8 min-[1440px]:text-[20px]! min-[1440px]:leading-[32px]!">
        경험은 이미 충분해요.
        <br />
        흩어진 경험을 찾고 연결하는 일이 어려울 뿐이에요.
      </p>

      <div className="aspect-[957/358] w-[calc(100vw-32px)] max-w-[957px] overflow-hidden">
        <img
          src={EXPERIENCE_CURVE_URL}
          alt="사진, 인스타그램, 메모, 노션, 카카오톡, 구글 드라이브에 흩어진 경험"
          className="h-auto w-full -translate-y-[15.57%]"
        />
      </div>
    </section>
  );
}
