import CheckIcon from '@/assets/check.svg';
import HourglassIcon from '@/assets/hourglass.svg';
import type { Memo } from '@/types/memo';

interface MemoCardProps {
  memo: Memo;
  selected: boolean;
  onToggle: () => void;
}

export const MemoCard = ({ memo, selected, onToggle }: MemoCardProps) => (
  <button
    type="button"
    onClick={onToggle}
    className="w-[266px] h-[266px] shrink-0 flex flex-col rounded-[20px] border border-grey-100 text-left cursor-pointer overflow-hidden"
  >
    <div className="w-full h-13.5 shrink-0 flex items-center gap-2 px-4 py-4 border-b border-grey-100">
      <span
        className={`w-5 h-5 shrink-0 flex items-center justify-center rounded-[4px] border transition-colors ${
          selected ? 'bg-primary-500 border-primary-500' : 'bg-white border-grey-100'
        }`}
      >
        {selected && <CheckIcon className="w-3 h-2.5 text-grey-0" />}
      </span>
      <span className="text-grey-600 text-body3-md">{memo.date}</span>
      <span className="flex items-center gap-1 px-2 py-1 rounded-full border border-grey-100 bg-grey-50 text-grey-600 text-label3-md">
        <HourglassIcon className="w-3 h-3" />
        {memo.dDay}
      </span>
    </div>
    <div className="flex-1 flex flex-col gap-2.5 px-4 py-4 overflow-hidden">
      <p className="text-grey-950 text-sub1-sb truncate">{memo.title}</p>
      <span className="inline-flex items-center w-fit px-3 py-1 rounded-full bg-grey-600 text-grey-0 text-label3-sb">
        # {memo.tag}
      </span>
      <p className="text-grey-900 text-body-reading2-md line-clamp-3">{memo.content}</p>
    </div>
  </button>
);
