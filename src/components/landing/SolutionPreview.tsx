import QuickMemoPreview from "@/assets/landing_brandstory/solution-quick-memo.png";
import ImmersionModePreview from "@/assets/landing_brandstory/solution-immersion-mode.png";
import StructuredRecordPreview from "@/assets/landing_brandstory/solution-structured-record.png";
import ActivityArchivePreview from "@/assets/landing_brandstory/solution-activity-archive.png";
import AiApplicationPreview from "@/assets/landing_brandstory/solution-ai-application.png";
import ImmersionModeToggle from "@/assets/landing_brandstory/immersion-mode-togle.png";

const PREVIEWS = [
  {
    src: QuickMemoPreview,
    alt: "빠르게 남긴 메모와 중요 메모를 정리한 화면",
  },
  {
    src: ImmersionModePreview,
    alt: "몰입모드에서 기록을 이어서 작성하는 화면",
  },
  {
    src: StructuredRecordPreview,
    alt: "메모를 템플릿에 맞춰 구조화하는 기록 화면",
  },
  {
    src: ActivityArchivePreview,
    alt: "완성한 기록을 활동별로 확인하는 보관 화면",
  },
  {
    src: AiApplicationPreview,
    alt: "AI가 자소서 문항에 맞는 기록을 찾아주는 화면",
  },
];

interface SolutionPreviewProps {
  selectedStep: number;
}

export function SolutionPreview({ selectedStep }: SolutionPreviewProps) {
  const preview = PREVIEWS[selectedStep];
  const isImmersionMode = selectedStep === 1;

  return (
    <div className="flex w-full flex-col gap-5">
      {isImmersionMode && (
        <div className="flex items-center gap-3">
          <img
            src={ImmersionModeToggle}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-[31px] w-[93px] shrink-0"
          />
          <p className="text-base leading-[160%] font-normal tracking-[-0.16px] text-grey-600">
            토글버튼으로 간편하게 몰입모드 진입
          </p>
        </div>
      )}

      <img
        src={preview.src}
        alt={preview.alt}
        loading="lazy"
        className="h-auto w-full"
      />
    </div>
  );
}
