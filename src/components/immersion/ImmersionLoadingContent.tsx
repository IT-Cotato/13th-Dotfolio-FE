import LottieLib from "lottie-react";
import type { ReactNode } from "react";
import loadingAnimation from "@/assets/Loading.json";

const Lottie =
  (LottieLib as unknown as { default: typeof LottieLib }).default ?? LottieLib;

interface ImmersionLoadingContentProps {
  title: string;
  description: ReactNode;
}

export function ImmersionLoadingContent({
  title,
  description,
}: ImmersionLoadingContentProps) {
  return (
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
        <h1 className="text-center text-title1 text-grey-0">{title}</h1>
        <p className="w-full max-w-[504px] text-center text-[18px] font-medium leading-[160%] tracking-[-0.18px] text-grey-0">
          {description}
        </p>
      </div>
    </div>
  );
}
