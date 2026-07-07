import { useState } from 'react';
import { Card } from '@/components/common/card';
import {
  CreateMemoModal,
  EmptyMemo,
  MemoBar,
  MemoHeader,
  MemoList,
  MemoDetailModal,
  type MemoData,
} from '@/components/memo';

export default function Memo() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [memos, setMemos] = useState<MemoData[]>([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [openMemoId, setOpenMemoId] = useState<number>();

  const tags = [...new Set(memos.flatMap((memo) => memo.tag ? [memo.tag] : []))];
  const visibleMemos = selectedTag
    ? memos.filter((memo) => memo.tag === selectedTag)
    : memos;
  const openMemo = memos.find((memo) => memo.id === openMemoId);

  const createMemo = (memo: Omit<MemoData, 'id'>) => {
    setMemos((current) => [{ ...memo, id: Date.now() }, ...current]);
    setIsCreateOpen(false);
  };

  const selectMemo = (id: number, selected: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <Card className="relative items-stretch gap-0">
      <MemoHeader
        tags={tags}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        onCreate={() => setIsCreateOpen(true)}
      />
      {selectedIds.size > 0 && (
        <MemoBar count={selectedIds.size} onCancel={() => setSelectedIds(new Set())} />
      )}
      {memos.length === 0 && <EmptyMemo />}
      {memos.length > 0 && (
        <MemoList
          memos={visibleMemos}
          onDelete={(id) => setMemos((current) => current.filter((memo) => memo.id !== id))}
          onToggleImportant={(id) => setMemos((current) => current.map((memo) => (
            memo.id === id ? { ...memo, isImportant: !memo.isImportant } : memo
          )))}
          selectedIds={selectedIds}
          onSelect={selectMemo}
          onOpen={setOpenMemoId}
        />
      )}
      {isCreateOpen && <CreateMemoModal onClose={() => setIsCreateOpen(false)} onCreate={createMemo} />}
      {openMemo && (
        <MemoDetailModal
          memo={openMemo}
          onClose={() => setOpenMemoId(undefined)}
          onUpdate={(updatedMemo) => setMemos((current) => current.map((memo) => (
            memo.id === updatedMemo.id ? updatedMemo : memo
          )))}
          onToggleImportant={() => setMemos((current) => current.map((memo) => (
            memo.id === openMemo.id ? { ...memo, isImportant: !memo.isImportant } : memo
          )))}
          onDelete={() => {
            setMemos((current) => current.filter((memo) => memo.id !== openMemo.id));
            setOpenMemoId(undefined);
          }}
        />
      )}
    </Card>
  );
}
