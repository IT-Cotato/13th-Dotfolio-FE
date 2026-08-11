import type { ReactNode } from "react";
import CloseIcon from "@/assets/close.svg";
import { Button } from "@/components/common/button";

interface ImmersionMessageCardProps {
  buttonLabel: string;
  closeLabel: string;
  message: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

export function ImmersionMessageCard({
  buttonLabel,
  closeLabel,
  message,
  onClose,
  onConfirm,
}: ImmersionMessageCardProps) {
  return (
    <section className="relative flex w-full max-w-[455px] flex-col items-end gap-1.5 rounded-[32px] bg-[rgba(0,17,78,0.35)] p-8">
      <button
        type="button"
        aria-label={closeLabel}
        className="flex size-6 items-center justify-center gap-2.5 p-2 text-grey-100"
        onClick={onClose}
      >
        <CloseIcon className="size-4 shrink-0 aspect-square" />
      </button>

      <div className="flex w-full flex-col items-start gap-8">
        <p className="flex w-full flex-1 items-center justify-center gap-1 text-center text-[24px] font-bold leading-[160%] tracking-[-0.24px] text-grey-0">
          <span>{message}</span>
        </p>
        <Button label={buttonLabel} onClick={onConfirm} />
      </div>
    </section>
  );
}
