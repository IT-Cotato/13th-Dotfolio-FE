import { MemoCard } from './MemoCard';
import type { MemoData } from '../types';

interface MemoListProps {
  memos: MemoData[];
  onDelete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onMove: (id: string) => void;
  selectedIds: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
  onOpen: (id: string) => void;
}

export const MemoList = ({ memos, onDelete, onToggleImportant, onMove, selectedIds, onSelect, onOpen }: MemoListProps) => (
  <section data-memo-list className="mx-auto mt-6 w-full max-w-[1124px] columns-[266px] gap-5">
    {memos.map((memo) => (
      <MemoCard
        key={memo.id}
        memo={memo}
        onDelete={() => onDelete(memo.id)}
        onToggleImportant={() => onToggleImportant(memo.id)}
        onMove={() => onMove(memo.id)}
        selected={selectedIds.has(memo.id)}
        selectionMode={selectedIds.size > 0}
        onSelect={(selected) => onSelect(memo.id, selected)}
        onOpen={() => onOpen(memo.id)}
      />
    ))}
  </section>
);
