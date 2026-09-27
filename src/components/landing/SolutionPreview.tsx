const imageUrl = (filename: string) =>
  new URL(`../../assets/landing_brandstory/${filename}`, import.meta.url).href;

const QuickMemoPreview1 = imageUrl("solution-quick-memo1.png");
const QuickMemoPreview2 = imageUrl("solution-quick-memo2.png");
const StructuredRecordPreview = imageUrl("solution-structured-record.png");
const ActivityArchivePreview = imageUrl("solution-activity-archive.png");
const AiApplicationPreview = imageUrl("solution-ai-application.png");

const PREVIEWS = [
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
  if (selectedStep === 0) {
    return (
      <div className="relative size-full">
        <img
          src={QuickMemoPreview1}
          alt="빠르게 남긴 메모 화면"
          className="absolute top-[28%] left-[5%] w-[44%] object-contain lg:top-[143px] lg:left-[54px] lg:size-[268px]"
        />
        <img
          src={QuickMemoPreview2}
          alt="중요한 메모를 정리한 화면"
          className="absolute top-[10%] right-[5%] h-[80%] w-[44%] object-contain lg:top-[54px] lg:right-[54px] lg:h-[412px] lg:w-[268px]"
        />
      </div>
    );
  }

  const preview = PREVIEWS[selectedStep - 1];

  return (
    <img
      src={preview.src}
      alt={preview.alt}
      className="max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] object-contain sm:max-h-[439px] sm:w-[601px]"
    />
  );
}
