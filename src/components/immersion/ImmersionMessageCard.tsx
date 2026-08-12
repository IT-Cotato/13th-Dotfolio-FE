import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import CloseIcon from "@/assets/close.svg";
import { Button } from "@/components/common/button";

interface ImmersionMessageCardProps {
  buttonLabel: string;
  closeLabel: string;
  message: ReactNode;
  dialogLabel?: string;
  isModal?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ImmersionMessageCard({
  buttonLabel,
  closeLabel,
  message,
  dialogLabel,
  isModal = false,
  onClose,
  onConfirm,
}: ImmersionMessageCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isModal) return;

    const trigger = document.activeElement;
    closeButtonRef.current?.focus();

    return () => {
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus();
      }
    };
  }, [isModal]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!isModal) return;

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = cardRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <section
      ref={cardRef}
      aria-label={isModal ? dialogLabel : undefined}
      aria-modal={isModal || undefined}
      role={isModal ? "dialog" : undefined}
      className="relative flex w-full max-w-[455px] flex-col items-end gap-1.5 rounded-[32px] bg-[rgba(0,17,78,0.35)] p-8"
      onKeyDown={handleKeyDown}
    >
      <button
        ref={closeButtonRef}
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
