import { useMemo } from 'react';
import { MemoLoadedCard } from '@/components/record/MemoLoadedCard';
import { MemoAddButton } from '@/components/record/MemoAddButton';
import { MemoEmptyState } from '@/components/record/MemoEmptyState';
import type { RecordMemo } from '@/api/records';
import type { Memo } from '@/types/memo';

interface ImmersionMemoPanelProps {
  activityTitle: string;
  memos: RecordMemo[];
  onRemove: (memoId: string) => void;
  onRequestSelect?: () => void;
}

const formatMemoDate = (createdAt: string) => (
  createdAt.slice(0, 10).replace(/-/g, '.')
);

export function ImmersionMemoPanel({
  activityTitle,
  memos,
  onRemove,
  onRequestSelect,
}: ImmersionMemoPanelProps) {
  const displayMemos = useMemo(
    () => memos.map<{ memo: Memo; collapsed: boolean }>(memo => ({
      memo: {
        id: memo.memoId,
        date: formatMemoDate(memo.createdAt),
        dDay: '',
        title: memo.title,
        tag: activityTitle,
        content: memo.content,
      },
      collapsed: memo.collapsed,
    })),
    [activityTitle, memos],
  );

  return (
    <aside
      aria-label="불러온 메모"
      className="flex h-[678px] w-[389px] shrink-0 flex-col items-end gap-4 overflow-hidden rounded-[32px] bg-[rgba(0,17,78,0.35)] p-6"
    >
      <div className="flex w-full items-center justify-between px-1">
        <h2 className="text-sub1-sb text-grey-0">메모 {displayMemos.length}</h2>
        {displayMemos.length > 0 && (
          <MemoAddButton onClick={onRequestSelect} variant="immersion" />
        )}
      </div>

      {displayMemos.length === 0 ? (
        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          <MemoEmptyState
            onSelect={() => onRequestSelect?.()}
            variant="immersion"
          />
        </div>
      ) : (
        <div className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto scrollbar-hide">
          {displayMemos.map(({ memo, collapsed }) => (
            <MemoLoadedCard
              key={memo.id}
              defaultOpen={!collapsed}
              memo={memo}
              onDelete={() => onRemove(memo.id)}
              variant="immersion"
            />
          ))}
        </div>
      )}
    </aside>
  );
}
