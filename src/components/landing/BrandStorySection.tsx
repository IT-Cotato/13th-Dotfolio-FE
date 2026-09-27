import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/button";
import { BrandStoryGraphic } from "./BrandStoryGraphic";

export function BrandStorySection() {
  const navigate = useNavigate();

  return (
    <section className="flex w-full max-w-[1440px] flex-col items-start justify-between gap-12 px-4 py-20 sm:px-8 lg:flex-row lg:items-center lg:gap-8 lg:px-30 lg:pt-30 lg:pb-40">
      <div className="flex flex-col items-start gap-10 lg:gap-20">
        <div className="flex flex-col items-center gap-4 lg:gap-7.5">
          <p className="w-full text-lg leading-7 font-semibold tracking-[-0.2px] text-primary-500 lg:text-xl">
            Brand Story
          </p>
          <h2 className="text-3xl leading-[1.35] font-bold tracking-[-0.48px] text-grey-900 lg:text-5xl lg:leading-18">
            지금 남긴 작은 점이
            <br />
            내일의 포트폴리오가 될 거예요.
          </h2>
        </div>

        <div className="flex flex-col items-start gap-10 lg:gap-20">
          <p className="whitespace-pre-line text-base leading-7 font-normal tracking-[-0.2px] text-grey-700 lg:text-xl lg:leading-8">
            {"Dotfolio. 하루하루의 작은 점이 쌓여\n하나의 완성된 포트폴리오가 된다는 뜻이에요.\n\n매일 쌓이는 점들은 결국 연결돼요.\n자소서 앞에서, 면접장에서, 당신이 가장 빛나는 순간까지요."}
          </p>
          <Button
            label="무료로 시작하기"
            size="landing"
            onClick={() => navigate("/login")}
          />
        </div>
      </div>

      <BrandStoryGraphic />
    </section>
  );
}
