import { useEffect, useState } from 'react';
import CloseIcon from '@/assets/close.svg';
import { MemoCard } from '@/components/record/MemoCard';
import { getMemos, toMemo } from '@/api/memos';
import { ApiError } from '@/api/client';
import type { Memo } from '@/types/memo';

interface MemoSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (memos: Memo[]) => void;
}

export const MemoSelectModal = ({ isOpen, onClose, onSelect }: MemoSelectModalProps) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const fetchMemos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getMemos();
        if (cancelled) return;
        setMemos(response.data.map(toMemo));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : '메모를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchMemos();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggle = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isValid = selectedIds.size > 0;

  const handleComplete = () => {
    if (!isValid) return;
    onSelect(memos.filter(memo => selectedIds.has(memo.id)));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: '#1C1C1A9E' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-155 h-173 max-h-[80vh] bg-white rounded-3xl px-8 pt-6 pb-8 flex flex-col gap-11.5"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full shrink-0 flex items-center justify-between">
          <p className="text-grey-900 text-title1">메모 불러오기</p>
          <button type="button" onClick={onClose} className="cursor-pointer">
            <CloseIcon className="w-4 h-4 text-grey-400" />
          </button>
        </div>

        <div className="w-full min-h-0 overflow-y-auto scrollbar-hide">
          {isLoading ? (
            <p className="text-body2-r text-grey-500 text-center py-10">불러오는 중...</p>
          ) : error ? (
            <p className="text-body2-r text-error-text text-center py-10">{error}</p>
          ) : (
            <div className="grid grid-cols-[266px_266px] gap-x-6 gap-y-4">
              {memos.map(memo => (
                <MemoCard
                  key={memo.id}
                  memo={memo}
                  selected={selectedIds.has(memo.id)}
                  onToggle={() => toggle(memo.id)}
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={!isValid}
          onClick={handleComplete}
          className={`w-full shrink-0 px-5 py-3.5 rounded-2xl text-sub2-sb transition-colors ${
            isValid
              ? 'bg-primary-500 text-grey-0 cursor-pointer'
              : 'bg-grey-300 text-grey-0 cursor-not-allowed'
          }`}
        >
          선택 완료
        </button>
      </div>
    </div>
  );
};
