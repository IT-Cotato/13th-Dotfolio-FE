interface SolutionStepProps {
  index: number;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export function SolutionStep({
  index,
  title,
  description,
  selected,
  onSelect,
}: SolutionStepProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls="solution-preview"
      className={`flex w-full flex-col items-start gap-2.5 rounded-3xl text-left sm:rounded-4xl ${
        selected
          ? "border-2 border-white bg-[rgba(255,255,255,0.70)] p-4 shadow-[0_0_15px_0_rgba(22,53,164,0.05)] sm:p-7"
          : "border-2 border-transparent px-4 py-4 sm:px-5.5 min-[1366px]:w-[440px]"
      }`}
      onClick={onSelect}
    >
      <span className="flex w-full items-start gap-4 sm:gap-6">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full p-0.75 text-lg leading-7 font-semibold tracking-[-0.2px] sm:text-xl min-[1440px]:text-[20px]! min-[1440px]:leading-[28px]! ${
            selected ? "bg-primary-500 text-grey-0" : "bg-grey-200 text-grey-0"
          }`}
        >
          {index}
        </span>

        <span className="flex flex-col items-start justify-center gap-2">
          <strong
            className={`flex min-h-10 items-center text-xl leading-[140%] tracking-[-0.22px] sm:text-[22px] ${
              selected
                ? "font-semibold text-grey-900"
                : "font-medium text-grey-700"
            }`}
          >
            {title}
          </strong>
          {selected && description && (
            <span className="whitespace-pre-line text-sm leading-6 text-grey-600 sm:text-body-reading1-r min-[1440px]:whitespace-pre! min-[1440px]:text-[18px]! min-[1440px]:leading-[28.8px]!">
              {description}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
