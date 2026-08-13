import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/button";
import { BrandStoryGraphic } from "./BrandStoryGraphic";

export function BrandStorySection() {
  const navigate = useNavigate();

  return (
    <section className="flex w-full max-w-[1440px] items-center justify-between px-30 pt-30 pb-40">
      <div className="flex flex-col items-start gap-20">
        <div className="flex flex-col items-center gap-7.5">
          <p className="w-full text-xl leading-7 font-semibold tracking-[-0.2px] text-primary-500">
            Brand Story
          </p>
          <h2 className="text-5xl leading-18 font-bold tracking-[-0.48px] text-grey-900">
            지금 남긴 작은 점이
            <br />
            내일의 포트폴리오가 될 거예요.
          </h2>
        </div>

        <div className="flex flex-col items-start gap-20">
          <p className="whitespace-pre-line text-xl leading-8 font-normal tracking-[-0.2px] text-grey-700">
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
