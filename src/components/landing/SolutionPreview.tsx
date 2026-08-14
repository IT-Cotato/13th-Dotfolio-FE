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
          className="absolute top-[143px] left-[54px] size-[268px]"
        />
        <img
          src={QuickMemoPreview2}
          alt="중요한 메모를 정리한 화면"
          className="absolute top-[54px] right-[54px] h-[412px] w-[268px]"
        />
      </div>
    );
  }

  const preview = PREVIEWS[selectedStep - 1];

  return (
    <img
      src={preview.src}
      alt={preview.alt}
      className="max-h-[439px] w-[601px] object-contain"
    />
  );
}
