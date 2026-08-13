import HourglassIcon from '@/assets/hourglass.svg';
import { Checkbox } from '@/components/common/CheckBox';
import type { Memo } from '@/types/memo';

interface MemoCardProps {
  memo: Memo;
  selected: boolean;
  onToggle: () => void;
  variant?: 'default' | 'immersion';
}

export const MemoCard = ({ memo, selected, onToggle, variant = 'default' }: MemoCardProps) => (
  <label
    className={`flex w-[266px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[20px] text-left ${
      variant === 'immersion'
        ? 'min-h-[266px] max-h-[454px] bg-[#414F6F]'
        : 'h-[266px] border border-grey-100'
    }`}
  >
    <div className={`flex h-[54px] w-full shrink-0 items-center gap-2 p-4 ${
      variant === 'immersion' ? 'border-b-[1.5px] border-[#4E5C7C]' : 'border-b border-grey-100'
    }`}>
      <Checkbox checked={selected} id={`memo-select-${memo.id}`} onChange={() => onToggle()} />
      <span className={variant === 'immersion' ? 'text-body3-md text-grey-100' : 'text-body3-md text-grey-600'}>
        {memo.date}
      </span>
      {variant === 'default' && (
        <span className="text-label3-md flex items-center gap-1 rounded-full border border-grey-100 bg-grey-50 px-2 py-1 text-grey-600">
          <HourglassIcon className="size-3" />
          {memo.dDay}
        </span>
      )}
    </div>
    <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden p-4">
      <p className={variant === 'immersion' ? 'text-sub1-sb min-h-[25px] text-grey-0' : 'text-sub1-sb truncate text-grey-950'}>
        {memo.title}
      </p>
      {memo.tag && (
        <span className={`text-label3-sb inline-flex w-fit items-center gap-1 rounded-[500px] px-3 py-1 ${
          variant === 'immersion'
            ? 'border border-grey-200 text-grey-100'
            : 'bg-grey-600 text-grey-0'
        }`}>
          # {memo.tag}
        </span>
      )}
      <p className={`text-body-reading2-md overflow-hidden ${
        variant === 'immersion' ? 'memo-card-text text-grey-0' : 'line-clamp-3 text-grey-900'
      }`}>
        {memo.content}
      </p>
    </div>
  </label>
);
