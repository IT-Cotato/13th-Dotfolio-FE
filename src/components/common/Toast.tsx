import CheckIcon from '@/assets/check.svg';

interface ToastProps {
  message: string;
  onUndo?: () => void;
}

export const Toast = ({ message, onUndo }: ToastProps) => (
  <div className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-white border border-grey-0">
    <div className="w-5 h-5 rounded-full bg-primary-gradient flex items-center justify-center shrink-0">
      <CheckIcon className="w-2.5 h-2" />
    </div>
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
