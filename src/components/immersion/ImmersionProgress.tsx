interface ImmersionProgressProps {
  currentIndex: number;
  totalCount: number;
}

export function ImmersionProgress({
  currentIndex,
  totalCount,
}: ImmersionProgressProps) {
  return (
    <div
      role="progressbar"
      aria-label={`${totalCount}개 중 ${currentIndex + 1}번째 기록`}
      aria-valuenow={currentIndex + 1}
      aria-valuemin={1}
      aria-valuemax={totalCount}
      className="flex items-center gap-3"
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        {Array.from({ length: totalCount }, (_, index) => (
          <span
            key={index}
            className={
              index === currentIndex
                ? "h-1.5 w-10 rounded-[10px] bg-grey-0"
                : "size-1.5 rounded-[10px] bg-grey-300"
            }
          />
        ))}
      </div>
      <span className="text-sub2-sb text-grey-0">
        {String(currentIndex + 1).padStart(2, "0")}
      </span>
    </div>
  );
}
