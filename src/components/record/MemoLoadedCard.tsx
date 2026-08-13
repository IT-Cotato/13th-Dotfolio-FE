import { useEffect, useRef, useState } from 'react';
import MoreIcon from '@/assets/more.svg';
import TrashIcon from '@/assets/trash.svg';
import VectorDownIcon from '@/assets/vector_down.svg';
import VectorUpIcon from '@/assets/vector_up.svg';
import type { Memo } from '@/types/memo';

interface MemoLoadedCardProps {
  defaultOpen?: boolean;
  memo: Memo;
  onDelete?: () => void;
  onOpenDetail?: () => void;
  variant?: 'default' | 'immersion';
}

export const MemoLoadedCard = ({
  defaultOpen = false,
  memo,
  onDelete,
  onOpenDetail,
  variant = 'default',
}: MemoLoadedCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isImmersion = variant === 'immersion';
  const hasTitle = memo.title.trim().length > 0;
  const summary = hasTitle ? memo.title : memo.content;

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
      className={`flex w-full flex-col justify-center rounded-[20px] ${
        isImmersion
          ? 'bg-[#414F6F]'
          : 'gap-4 border border-grey-100 bg-white p-4'
      } ${onOpenDetail ? 'cursor-pointer' : ''}`}
    >
      <div className={`flex w-full flex-col items-center gap-4 ${isImmersion ? 'p-4' : ''}`}>
        <div className="flex w-full items-center justify-between">
          <span className={isImmersion ? 'text-body3-md text-grey-100' : 'text-body3-md text-grey-600'}>
            {memo.date}
          </span>
          <div className={`flex items-center justify-end ${isImmersion ? 'w-[103px] gap-4' : 'gap-2'}`}>
            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-label="메모 메뉴 열기"
                onClick={event => {
                  event.stopPropagation();
                  setIsMenuOpen(previous => !previous);
                }}
                className={`flex shrink-0 cursor-pointer items-center justify-center ${
                  isImmersion
                    ? 'size-[22px] px-2.5 py-1 text-grey-100'
                    : 'size-6 rounded-[5px] text-grey-400 transition-colors hover:bg-[#EAEEF4]'
                }`}
              >
                <MoreIcon className="size-5 shrink-0" />
              </button>
              {isMenuOpen && (
                <div
                  className="absolute right-0 top-full z-10 mt-2 min-w-35 rounded-2xl border border-grey-100 bg-white px-1.5 py-2"
                  style={{ boxShadow: '0 0 30px 0 rgba(22, 53, 164, 0.08)' }}
                  onClick={event => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDelete?.();
                    }}
                    className="text-body2-md flex w-full cursor-pointer items-center gap-2 rounded-xl py-2 pr-4 pl-2 text-grey-900"
                  >
                    <TrashIcon className="size-5 text-grey-700" />
                    삭제
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={`메모 ${isOpen ? '접기' : '펼치기'}`}
              onClick={event => {
                event.stopPropagation();
                setIsOpen(previous => !previous);
              }}
              className="flex size-[22px] shrink-0 cursor-pointer items-center justify-center py-2 pl-1"
            >
              {isOpen ? (
                <VectorUpIcon className="h-[7px] w-3.5 text-grey-400" />
              ) : (
                <VectorDownIcon className="h-[7px] w-3.5 text-grey-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-2.5">
          <p className={`text-sub1-sb min-w-0 max-w-full ${isImmersion ? 'text-grey-0' : 'text-grey-950'} ${
            !isOpen && !hasTitle
              ? 'overflow-hidden text-ellipsis whitespace-nowrap'
              : !isOpen
                ? 'truncate'
                : ''
          }`}>
            {summary}
          </p>
          {isOpen && (
            <>
              {memo.tag && (
                <div className="flex w-full items-center gap-2">
                  <span className={`text-label3-sb inline-flex w-fit items-center justify-center gap-1 rounded-[500px] px-3 py-1 ${
                    isImmersion
                      ? 'border border-grey-200 text-grey-100'
                      : 'bg-grey-600 text-grey-0'
                  }`}>
                    # {memo.tag}
                  </span>
                </div>
              )}
              <p className={`text-body-reading2-md w-full ${isImmersion ? 'text-grey-0' : 'text-grey-900'}`}>
                {memo.content}
              </p>
              {memo.image && (
                <img src={memo.image} alt="" className="aspect-square w-full rounded-2xl object-cover" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
