import type { ReactNode } from "react";

interface CounterButtonProps {
  ariaLabel: string;
  disabled?: boolean;
  icon: ReactNode;
  onClick: () => void;
}

export function CounterButton({
  ariaLabel,
  disabled = false,
  icon,
  onClick,
}: CounterButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="flex size-8 shrink-0 items-center justify-center gap-2.5 rounded-lg border-[1.5px] border-grey-0 p-[5px] text-grey-0 disabled:cursor-not-allowed disabled:border-grey-500 disabled:text-grey-500"
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
