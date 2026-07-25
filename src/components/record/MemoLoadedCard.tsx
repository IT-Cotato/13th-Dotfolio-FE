import { useState } from 'react';
import ArrowIcon from '@/assets/arrow.svg';
import type { Memo } from '@/types/memo';

interface MemoLoadedCardProps {
  memo: Memo;
}

export const MemoLoadedCard = ({ memo }: MemoLoadedCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-4 p-4 rounded-2xl bg-white border border-grey-100">
      <div className="w-full flex items-center justify-between">
        <span className="text-grey-600 text-body3-md">{memo.date}</span>
        <div className="flex items-center gap-2">
          <button type="button" className="text-grey-400 text-body2-md leading-none cursor-pointer">
            ···
          </button>
          <button type="button" onClick={() => setIsOpen(prev => !prev)} className="cursor-pointer">
            <ArrowIcon className={`w-4 h-4 text-grey-400 transition-transform ${isOpen ? 'rotate-90' : '-rotate-90'}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="text-grey-950 text-sub1-sb">{memo.title}</p>
        {isOpen && (
          <>
            <span className="inline-flex items-center w-fit px-3 py-1 rounded-full bg-grey-600 text-grey-0 text-label3-sb">
              # {memo.tag}
            </span>
            <p className="text-grey-900 text-body-reading2-md">{memo.content}</p>
            {memo.image && (
              <img src={memo.image} alt="" className="w-full aspect-square object-cover rounded-2xl" />
            )}
          </>
        )}
      </div>
    </div>
  );
};
