import CloseIcon from '@/assets/close.svg';
import HourglassIcon from '@/assets/hourglass.svg';
import type { Memo } from '@/types/memo';

interface MemoDetailModalProps {
  memo: Memo | null;
  onClose: () => void;
}

export const MemoDetailModal = ({ memo, onClose }: MemoDetailModalProps) => {
  if (!memo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: '#1C1C1A9E' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-155 max-h-[80vh] overflow-y-auto scrollbar-hide bg-white rounded-3xl p-4 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4 cursor-pointer">
          <CloseIcon className="w-4 h-4 text-grey-400" />
        </button>

        <div className="flex items-center gap-2 px-4 py-4 pr-8">
          <span className="text-grey-600 text-body3-md">{memo.date}</span>
          <span className="flex items-center gap-1 px-2 py-1 rounded-full border border-grey-100 bg-grey-50 text-grey-600 text-label3-md">
            <HourglassIcon className="w-3 h-3" />
            {memo.dDay}
          </span>
        </div>

        <div className="px-4 py-4 flex flex-col gap-4">
          <p className="text-grey-950 text-sub1-sb">{memo.title}</p>

          <span className="inline-flex items-center w-fit px-3 py-1 rounded-full bg-grey-600 text-grey-0 text-label3-sb">
            # {memo.tag}
          </span>

          <p className="text-grey-900 text-body-reading2-md">{memo.content}</p>

          {memo.image && (
            <img
              src={memo.image}
              alt=""
              className="w-full rounded-2xl object-cover"
              style={{ aspectRatio: '3 / 2' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
