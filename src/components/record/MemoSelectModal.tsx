import { useEffect, useMemo, useState } from 'react';
import CloseIcon from '@/assets/close.svg';
import { Button } from '@/components/common/button';
import { MemoCard } from '@/components/record/MemoCard';
import { getMemos, toMemo } from '@/api/memos';
import { ApiError } from '@/api/client';
import type { Memo } from '@/types/memo';

interface MemoSelectModalProps {
  isOpen: boolean;
  selectedMemos: Memo[];
  onClose: () => void;
  onSelect: (memos: Memo[]) => void;
  variant?: 'default' | 'immersion';
}

export const MemoSelectModal = ({
  isOpen,
  selectedMemos,
  onClose,
  onSelect,
  variant = 'default',
}: MemoSelectModalProps) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const initialIds = useMemo(
    () => new Set(selectedMemos.map(memo => memo.id)),
    [selectedMemos],
  );

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const fetchMemos = async () => {
      setSelectedIds(new Set(selectedMemos.map(memo => memo.id)));
      setIsLoading(true);
      setError(null);
      try {
        const response = await getMemos();
        if (cancelled) return;
        const fetched = response.data.map(toMemo);
        setMemos(fetched);
        setSelectedIds(previous => new Set(
          [...previous].filter(id => fetched.some(memo => memo.id === id)),
        ));
      } catch (fetchError) {
        if (cancelled) return;
        setError(
          fetchError instanceof ApiError
            ? fetchError.message
            : '메모를 불러오지 못했습니다.',
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void fetchMemos();
    return () => {
      cancelled = true;
    };
  }, [isOpen, selectedMemos]);

  if (!isOpen) return null;

  const toggle = (id: string) => {
    setSelectedIds(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasChanged =
    selectedIds.size !== initialIds.size ||
    [...selectedIds].some(id => !initialIds.has(id));
  const isValid = variant === 'immersion' ? hasChanged : selectedIds.size > 0;

  const handleComplete = () => {
    if (!isValid) return;
    onSelect(memos.filter(memo => selectedIds.has(memo.id)));
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        variant === 'immersion'
          ? 'bg-[rgba(26,26,28,0.70)] backdrop-blur-[1.5px]'
          : ''
      }`}
      style={variant === 'default' ? { background: '#1C1C1A9E' } : undefined}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="메모 불러오기"
        className={`relative flex w-full flex-col ${
          variant === 'immersion'
            ? 'h-[692px] max-w-[620px] gap-8 rounded-[40px] bg-[rgba(0,17,78,0.35)] p-8 shadow-[0_0_20px_rgba(0,0,0,0.18)]'
            : 'h-173 max-h-[80vh] max-w-155 gap-11.5 rounded-3xl bg-white px-8 pt-6 pb-8'
        }`}
        onClick={event => event.stopPropagation()}
      >
        <div className="flex w-full shrink-0 items-center justify-between">
          <p className={`text-title1 ${variant === 'immersion' ? 'text-grey-0' : 'text-grey-900'}`}>
            메모 불러오기
          </p>
          <button
            type="button"
            aria-label="메모 불러오기 닫기"
            onClick={onClose}
            className="flex size-6 cursor-pointer items-center justify-center p-2"
          >
            <CloseIcon className="size-4 shrink-0 text-grey-400" />
          </button>
        </div>

        <div className="min-h-0 w-full flex-1 overflow-y-auto scrollbar-hide">
          {isLoading ? (
            <p className={`py-10 text-center text-body2-r ${variant === 'immersion' ? 'text-grey-200' : 'text-grey-500'}`}>
              불러오는 중...
            </p>
          ) : error ? (
            <p className="py-10 text-center text-body2-r text-error-text">{error}</p>
          ) : (
            <div className="grid grid-cols-[266px_266px] gap-x-6 gap-y-4">
              {memos.map(memo => (
                <MemoCard
                  key={memo.id}
                  memo={memo}
                  selected={selectedIds.has(memo.id)}
                  onToggle={() => toggle(memo.id)}
                  variant={variant}
                />
              ))}
            </div>
          )}
        </div>

        {variant === 'immersion' ? (
          <Button
            label="선택 완료"
            disabled={!isValid}
            onClick={handleComplete}
            className="h-auto shrink-0 py-3.5"
          />
        ) : (
          <button
            type="button"
            disabled={!isValid}
            onClick={handleComplete}
            className={`w-full shrink-0 rounded-2xl px-5 py-3.5 text-sub2-sb transition-colors ${
              isValid
                ? 'cursor-pointer bg-primary-500 text-grey-0'
                : 'cursor-not-allowed bg-grey-300 text-grey-0'
            }`}
          >
            선택 완료
          </button>
        )}
      </div>
    </div>
  );
};
