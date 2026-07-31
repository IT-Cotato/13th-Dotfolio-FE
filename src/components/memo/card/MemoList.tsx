import { MemoCard } from './MemoCard';
import type { MemoData } from '../types';

interface MemoListProps {
  memos: MemoData[];
  onDelete: (id: number) => void;
  onToggleImportant: (id: number) => void;
  onMove: (id: number) => void;
  selectedIds: Set<number>;
  onSelect: (id: number, selected: boolean) => void;
  onOpen: (id: number) => void;
}

export const MemoList = ({ memos, onDelete, onToggleImportant, onMove, selectedIds, onSelect, onOpen }: MemoListProps) => (
  <section className="mt-6 grid grid-cols-[repeat(auto-fill,266px)] gap-5">
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
