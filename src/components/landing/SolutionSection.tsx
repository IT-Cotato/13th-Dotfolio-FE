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
    <section className="flex w-full max-w-[1440px] flex-col items-start gap-2.5 p-30">
      <div className="flex w-full flex-col items-start gap-20">
        <div className="flex flex-col items-center gap-7.5">
          <p className="w-full text-xl leading-7 font-semibold tracking-[-0.2px] text-primary-500">
            Solution
          </p>
          <h2 className="text-5xl leading-18 font-bold tracking-[-0.48px] text-grey-900">
            메모 하나로 시작하는
            <br />
            경험 관리의 흐름
          </h2>
        </div>

        <div className="flex w-full items-center gap-21.5">
          <div
            className="flex w-[441px] shrink-0 flex-col items-start gap-6"
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
            className="flex h-[519px] w-[673px] shrink-0 items-center justify-center overflow-hidden rounded-[60px] border-2 border-white bg-white shadow-[0_0_15px_0_rgba(22,53,164,0.05)]"
          >
            <SolutionPreview selectedStep={selectedStep} />
          </div>
        </div>
      </div>
    </section>
  );
}
