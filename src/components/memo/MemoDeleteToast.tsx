import { useEffect } from 'react';
import CheckIcon from '@/assets/memo_check.svg';

interface MemoDeleteToastProps {
  onClose: () => void;
  onUndo: () => void;
}

export const MemoDeleteToast = ({ onClose, onUndo }: MemoDeleteToastProps) => {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 2500);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-[calc(50%+9.5px)] top-[17px] z-[90] inline-flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-[100px] bg-white px-4 py-3 shadow-[0_0_30px_0_rgba(22,53,164,0.08)]"
    >
      <span className="flex items-center gap-2.5 text-body2-md text-grey-900">
        <span className="bg-primary-gradient flex h-[22px] w-[22px] shrink-0 flex-col items-center justify-center gap-2.5 rounded-[100px] px-1 py-1.5">
          <CheckIcon />
        </span>
        메모가 삭제되었습니다.
      </span>
      <button
        type="button"
        onClick={onUndo}
        className="text-body3-md text-grey-500 underline"
      >
        실행취소
      </button>
    </div>
  );
};
