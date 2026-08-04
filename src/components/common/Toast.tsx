import CheckIcon from '@/assets/check.svg';
import ErrorIcon from '@/assets/error.svg';

interface ToastProps {
  message: string;
  onUndo?: () => void;
  variant?: 'success' | 'error';
}

export const Toast = ({ message, onUndo, variant = 'success' }: ToastProps) => (
  <div className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-white border border-grey-0">
    {variant === 'error' ? (
      <ErrorIcon className="w-5.5 h-5.5 shrink-0" />
    ) : (
      <div className="w-5.5 h-5.5 py-1.5 px-1 rounded-full bg-primary-gradient flex items-center justify-center shrink-0">
        <CheckIcon className="w-3.5 h-2.5 text-grey-0" />
      </div>
    )}
    <span className="text-body2-md text-grey-900 whitespace-nowrap">{message}</span>
    {onUndo && (
      <button
        type="button"
        onClick={onUndo}
        className="text-body3-md text-grey-500 underline whitespace-nowrap cursor-pointer"
      >
        실행취소
      </button>
    )}
  </div>
);
