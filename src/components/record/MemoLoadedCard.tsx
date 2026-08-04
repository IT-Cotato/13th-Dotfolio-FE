import { useEffect, useRef, useState } from 'react';
import ArrowIcon from '@/assets/arrow.svg';
import TrashIcon from '@/assets/trash.svg';
import type { Memo } from '@/types/memo';

interface MemoLoadedCardProps {
  memo: Memo;
  onDelete?: () => void;
  onOpenDetail?: () => void;
}

export const MemoLoadedCard = ({ memo, onDelete, onOpenDetail }: MemoLoadedCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  return (
    <div
      onClick={onOpenDetail}
      className={`w-full flex flex-col gap-4 p-4 rounded-2xl bg-white border border-grey-100 ${onOpenDetail ? 'cursor-pointer' : ''}`}
    >
      <div className="w-full flex items-center justify-between">
        <span className="text-grey-600 text-body3-md">{memo.date}</span>
        <div className="flex items-center gap-2">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setIsMenuOpen(prev => !prev); }}
              className="w-6 h-6 flex items-center justify-center rounded-[5px] text-grey-400 text-body2-md leading-none hover:bg-[#EAEEF4] transition-colors cursor-pointer"
            >
              ···
            </button>
            {isMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 z-10 min-w-35 bg-white rounded-2xl border border-grey-100 py-2 px-1.5"
                style={{ boxShadow: '0 0 30px 0 rgba(22, 53, 164, 0.08)' }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => { setIsMenuOpen(false); onDelete?.(); }}
                  className="w-full flex items-center gap-2 pl-2 pr-4 py-2 rounded-xl text-body2-md text-grey-900 transition-colors cursor-pointer"
                >
                  <TrashIcon className="w-5 h-5 text-grey-700" />
                  삭제
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); setIsOpen(prev => !prev); }}
            className="cursor-pointer"
          >
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
