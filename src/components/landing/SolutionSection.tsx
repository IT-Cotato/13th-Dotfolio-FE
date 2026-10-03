import { useState } from "react";
import { SolutionStep } from "./SolutionStep";
import { SolutionPreview } from "./SolutionPreview";

const SOLUTION_STEPS = [
  {
    title: "빠른 메모",
    description:
      "활동 직후, 빠르게 메모해요.\n남겨둔 메모는 기록하기에서 참고할 수 있어요.",
  },
  {
    title: "몰입모드",
    description:
      "작성 중인 기록은 언제든 이어 쓸 수 있어요.\n미뤄둔 기록은 몰입 모드에서 한꺼번에 완성해요.",
  },
  {
    title: "구조화된 기록",
    description:
      "적어둔 메모를 바탕으로 템플릿에 기록해요.\n활동을 질문에 맞게 정리해둘 수 있어요.",
  },
  {
    title: "활동 보관",
    description:
      "완성한 기록은 활동보관함에 차곡차곡 쌓여요.\n타임라인으로 나의 성장을 한눈에 확인해요.",
  },
  {
    title: "AI 자소서 · 면접 활용",
    description:
      "AI가 기록을 분석해 나의 역량을 도출해요.\n상황에 맞는 경험과 기록도 추천해줘요.",
  },
];

export function SolutionSection() {
  const [selectedStep, setSelectedStep] = useState(0);

  return (
    <section className="flex w-full max-w-[1440px] flex-col items-start gap-2.5 px-4 py-20 sm:px-8 lg:p-30 min-[1440px]:p-[120px]!">
      <div className="flex w-full flex-col items-start gap-10 lg:gap-20 min-[1440px]:gap-[80px]!">
        <div className="flex flex-col items-center gap-4 lg:gap-7.5">
          <p className="w-full text-lg leading-7 font-semibold tracking-[-0.2px] text-primary-500 lg:text-xl min-[1440px]:text-[20px]! min-[1440px]:leading-[28px]!">
            Solution
          </p>
          <h2 className="text-3xl leading-[1.35] font-bold tracking-[-0.48px] text-grey-900 lg:text-5xl lg:leading-18 min-[1440px]:text-[48px]! min-[1440px]:leading-[72px]!">
            메모 하나로 시작하는
            <br />
            경험 관리의 흐름
          </h2>
        </div>

        <div className="flex w-full flex-col items-stretch gap-8 min-[1366px]:flex-row min-[1366px]:items-center min-[1366px]:justify-between min-[1366px]:gap-0">
          <div
            className="flex w-full shrink-0 flex-col items-start gap-3 lg:gap-5 min-[1366px]:w-[441px]"
            role="tablist"
            aria-label="경험 관리 단계"
          >
            {SOLUTION_STEPS.map((step, index) => (
              <SolutionStep
                key={step.title}
                index={index + 1}
                title={step.title}
                description={step.description}
                selected={selectedStep === index}
                onSelect={() => setSelectedStep(index)}
              />
            ))}
          </div>

          <div
            id="solution-preview"
            role="tabpanel"
            aria-label={`${SOLUTION_STEPS[selectedStep].title} 미리보기`}
            className="w-full shrink-0 lg:w-[651.43px]"
          >
            <SolutionPreview selectedStep={selectedStep} />
          </div>
        </div>
      </div>
    </section>
  );
}
