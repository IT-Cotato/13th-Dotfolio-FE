import CheckIcon from '@/assets/check.svg';
import ErrorIcon from '@/assets/error.svg';

interface ToastProps {
  message: string;
  onUndo?: () => void;
  variant?: 'success' | 'error';
}

export const Toast = ({ message, onUndo, variant = 'success' }: ToastProps) => (
  <div className="flex w-max max-w-[calc(100vw-2rem)] items-start gap-2.5 rounded-2xl border border-grey-0 bg-white px-4 py-3 shadow-[0_4px_20px_rgba(22,53,164,0.10)] sm:items-center sm:rounded-full">
    {variant === 'error' ? (
      <ErrorIcon className="h-5.5 w-5.5 shrink-0" />
    ) : (
      <div className="bg-primary-gradient flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full px-1 py-1.5">
        <CheckIcon className="h-2.5 w-3.5 text-grey-0" />
      </div>
    )}
    <span className="min-w-0 flex-1 break-words text-[clamp(12px,3.5vw,14px)] leading-5 text-grey-900 sm:whitespace-nowrap sm:text-body2-md">
      {message}
    </span>
    {onUndo && (
      <button
        type="button"
        onClick={onUndo}
        className="shrink-0 cursor-pointer whitespace-nowrap text-[12px] leading-5 text-grey-500 underline sm:text-body3-md"
      >
        실행취소
      </button>
    )}
  </div>
);
