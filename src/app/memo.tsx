import { useState } from 'react';
import { Card } from '@/components/common/card';
import {
  CreateMemoModal,
  EmptyMemo,
  MemoBar,
  MemoHeader,
  MemoList,
  MemoDetailModal,
  MoveToRecordModal,
  DeleteMemoModal,
  MemoDeleteToast,
  type MemoData,
} from '@/components/memo';

interface DeletedMemo {
  memo: MemoData;
  index: number;
}

export default function Memo() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [memos, setMemos] = useState<MemoData[]>([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [openMemoId, setOpenMemoId] = useState<number>();
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [deleteMemoId, setDeleteMemoId] = useState<number>();
  const [deletedMemo, setDeletedMemo] = useState<DeletedMemo>();

  const tags = [...new Set(memos.flatMap((memo) => memo.tag ? [memo.tag] : []))];
  const activeTag = selectedTag && tags.includes(selectedTag) ? selectedTag : '';
  const visibleMemos = activeTag
    ? memos.filter((memo) => memo.tag === activeTag)
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

  const deleteMemo = () => {
    if (deleteMemoId === undefined) return;
    const deletedMemoIndex = memos.findIndex((memo) => memo.id === deleteMemoId);
    if (deletedMemoIndex === -1) return;

    setDeletedMemo({ memo: memos[deletedMemoIndex], index: deletedMemoIndex });
    setMemos((current) => current.filter((memo) => memo.id !== deleteMemoId));
    setSelectedIds((current) => {
      const next = new Set(current);
      next.delete(deleteMemoId);
      return next;
    });
    if (openMemoId === deleteMemoId) setOpenMemoId(undefined);
    setDeleteMemoId(undefined);
  };

  const undoDeleteMemo = () => {
    if (!deletedMemo) return;
    setMemos((current) => {
      if (current.some((memo) => memo.id === deletedMemo.memo.id)) return current;
      const next = [...current];
      next.splice(Math.min(deletedMemo.index, next.length), 0, deletedMemo.memo);
      return next;
    });
    setDeletedMemo(undefined);
  };

  return (
    <Card className="relative items-stretch gap-0">
      <MemoHeader
        tags={tags}
        selectedTag={activeTag}
        onTagChange={setSelectedTag}
        onCreate={() => setIsCreateOpen(true)}
      />
      {selectedIds.size > 0 && (
        <MemoBar count={selectedIds.size} onCancel={() => setSelectedIds(new Set())} onMove={() => setIsMoveOpen(true)} />
      )}
      {memos.length === 0 && <EmptyMemo />}
      {memos.length > 0 && (
        <MemoList
          memos={visibleMemos}
          onDelete={setDeleteMemoId}
          onToggleImportant={(id) => setMemos((current) => current.map((memo) => (
            memo.id === id ? { ...memo, isImportant: !memo.isImportant } : memo
          )))}
          onMove={() => setIsMoveOpen(true)}
          selectedIds={selectedIds}
          onSelect={selectMemo}
          onOpen={setOpenMemoId}
        />
      )}
      {isCreateOpen && <CreateMemoModal onClose={() => setIsCreateOpen(false)} onCreate={createMemo} />}
      {openMemo && deleteMemoId === undefined && (
        <MemoDetailModal
          memo={openMemo}
          onClose={() => setOpenMemoId(undefined)}
          onUpdate={(updatedMemo) => setMemos((current) => current.map((memo) => (
            memo.id === updatedMemo.id ? updatedMemo : memo
          )))}
          onToggleImportant={() => setMemos((current) => current.map((memo) => (
            memo.id === openMemo.id ? { ...memo, isImportant: !memo.isImportant } : memo
          )))}
          onMove={() => setIsMoveOpen(true)}
          onDelete={() => setDeleteMemoId(openMemo.id)}
        />
      )}
      {isMoveOpen && <MoveToRecordModal onClose={() => setIsMoveOpen(false)} />}
      {deleteMemoId !== undefined && (
        <DeleteMemoModal onClose={() => setDeleteMemoId(undefined)} onConfirm={deleteMemo} />
      )}
      {deletedMemo && (
        <MemoDeleteToast onClose={() => setDeletedMemo(undefined)} onUndo={undoDeleteMemo} />
      )}
    </Card>
  );
}
