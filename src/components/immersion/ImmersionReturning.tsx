import LottieLib from "lottie-react";
import loadingAnimation from "@/assets/Loading.json";
import { ImmersionPageLayout } from "@/components/immersion/ImmersionPageLayout";

const Lottie =
  (LottieLib as unknown as { default: typeof LottieLib }).default ?? LottieLib;

export function ImmersionReturning() {
  return (
    <ImmersionPageLayout
      className="flex items-center justify-center px-6 py-10"
      overlayClassName="bg-[rgba(26,26,28,0.80)]"
    >
      <div
        className="relative flex flex-col items-center justify-center gap-6"
        role="status"
        aria-live="polite"
      >
        <Lottie
          animationData={loadingAnimation}
          autoplay
          loop
          className="size-[120px] shrink-0 aspect-square"
        />

        <div className="flex w-full flex-col items-center gap-4">
          <h1 className="text-center text-title1 text-grey-0">
            홈으로 돌아가는 중이에요
          </h1>
          <p className="w-full max-w-[504px] text-center text-[18px] font-medium leading-[160%] tracking-[-0.18px] text-grey-0">
            새로운 기록을 시작하거나
            <br />
            기존 활동을 이어갈 수 있어요.
          </p>
        </div>
      </div>
    </ImmersionPageLayout>
  );
}
