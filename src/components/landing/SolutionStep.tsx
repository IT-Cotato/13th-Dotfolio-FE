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
      className={`flex w-full items-start gap-6 rounded-4xl p-7 text-left ${
        selected
          ? "border-2 border-white bg-[rgba(255,255,255,0.70)] shadow-[0_0_15px_0_rgba(22,53,164,0.05)]"
          : "border-2 border-transparent"
      }`}
      onClick={onSelect}
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-full p-0.75 text-xl leading-7 font-semibold tracking-[-0.2px] ${
          selected ? "bg-primary-500 text-grey-0" : "bg-grey-200 text-grey-0"
        }`}
      >
        {index}
      </span>

      <span className="flex flex-col items-start justify-center gap-2">
        <strong
          className={`text-[22px] leading-[140%] tracking-[-0.22px] ${
            selected
              ? "font-semibold text-grey-900"
              : "font-medium text-grey-700"
          }`}
        >
          {title}
        </strong>
        {selected && description && (
          <span className="whitespace-pre text-body-reading1-r text-grey-600">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}
