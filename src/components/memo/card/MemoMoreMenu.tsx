import { useEffect, useRef, useState } from 'react';
import DeleteIcon from '@/assets/memo_delete.svg';
import MoreIcon from '@/assets/memo_more.svg';
import RecordIcon from '@/assets/memo_record.svg';
import StarIcon from '@/assets/memo_star.svg';

interface MemoMoreMenuProps {
  isImportant: boolean;
  onToggleImportant: () => void;
  onDelete: () => void;
  align?: 'left' | 'right';
}

export const MemoMoreMenu = ({ isImportant, onToggleImportant, onDelete, align = 'left' }: MemoMoreMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const run = (action?: () => void) => {
    action?.();
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative ml-auto" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        aria-label="메모 더보기"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex h-8 w-8 items-center justify-center rounded-xl ${isImportant ? 'text-primary-300' : 'text-grey-400'} ${isOpen ? 'bg-primary-100' : ''}`}
      >
        <MoreIcon />
      </button>

      {isOpen && (
        <div className={`absolute top-10 z-30 w-[184px] rounded-2xl border border-grey-100 bg-white p-4 shadow-[0_0_30px_rgba(22,53,164,0.08)] ${align === 'right' ? 'right-0' : 'left-0'}`}>
          <p className="mb-3 text-sub2-sb text-grey-400">메모 관리</p>
          <button type="button" onClick={() => run(onToggleImportant)} className="flex h-11 w-full items-center gap-4 text-body2-md text-grey-900">
            <StarIcon className="h-5 w-5" />
            {isImportant ? '중요한 메모 취소' : '중요한 메모'}
          </button>
          <button type="button" onClick={() => run()} className="flex h-11 w-full items-center gap-4 text-body2-md text-grey-900">
            <RecordIcon className="h-5 w-5" />
            기록하기로 이동
          </button>
          <button type="button" onClick={() => run(onDelete)} className="flex h-11 w-full items-center gap-4 text-body2-md text-grey-900">
            <DeleteIcon className="h-5 w-5" />
            메모 삭제
          </button>
        </div>
      )}
    </div>
  );
};
