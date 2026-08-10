import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createMemo as createMemoRequest,
  deleteMemoImage as deleteMemoImageRequest,
  deleteMemos as deleteMemosRequest,
  getMemo,
  getMemoImagePresignedUrl,
  getMemos,
  markMemoImportant,
  updateMemo as updateMemoRequest,
  uploadMemoImage,
  type MemoResponse,
} from '@/api/memo';
import { Card } from '@/components/common/card';
import { Toast } from '@/components/common/Toast';
import {
  CreateMemoModal,
  EmptyMemo,
  MemoBar,
  MemoHeader,
  MemoList,
  MemoDetailModal,
  MoveToRecordModal,
  DeleteMemoModal,
  type MemoActivityOption,
  type MemoCreateInput,
  type MemoData,
} from '@/components/memo';
import { useToast } from '@/hooks/useToast';

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date).replaceAll(' ', '').replace(/\.$/, '');
};

const toMemoData = (memo: MemoResponse): MemoData => {
  const images = memo.images ?? [];

  return {
    id: memo.id,
    createdAt: formatCreatedAt(memo.createdAt),
    dDay: memo.remainingDaysUntilExpiration <= 0
      ? 'D-Day'
      : `D-${memo.remainingDaysUntilExpiration}`,
    memo: memo.content,
    title: memo.title || undefined,
    tag: memo.activityTitle || undefined,
    activityId: memo.activityId || undefined,
    attachmentCount: (memo.imageCount ?? images.length) || undefined,
    attachmentUrl: images[0]?.imageUrl,
    isImportant: memo.isImportant,
    images,
  };
};

const getErrorMessage = (error: unknown, fallback: string) => (
  error instanceof Error ? error.message : fallback
);

export default function Memo() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [memos, setMemos] = useState<MemoData[]>([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMemoId, setOpenMemoId] = useState<string>();
  const [openingMemoId, setOpeningMemoId] = useState<string>();
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [deleteMemoId, setDeleteMemoId] = useState<string>();
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const { toast, fireToast, dismissToast } = useToast();

  const loadMemos = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const response = await getMemos();
      setMemos(response.map(toMemoData));
    } catch (error) {
      setLoadError(getErrorMessage(error, '메모 목록을 불러오지 못했습니다.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getMemos(undefined, controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) setMemos(response.map(toMemoData));
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(getErrorMessage(error, '메모 목록을 불러오지 못했습니다.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  const activities = useMemo<MemoActivityOption[]>(() => {
    const uniqueActivities = new Map<string, string>();
    memos.forEach((memo) => {
      if (memo.activityId && memo.tag) uniqueActivities.set(memo.activityId, memo.tag);
    });
    return [...uniqueActivities].map(([id, title]) => ({ id, title }));
  }, [memos]);

  const tags = activities.map((activity) => activity.title);
  const activeTag = selectedTag && tags.includes(selectedTag) ? selectedTag : '';
  const visibleMemos = activeTag
    ? memos.filter((memo) => memo.tag === activeTag)
    : memos;
  const openMemo = memos.find((memo) => memo.id === openMemoId);

  const createMemo = async (input: MemoCreateInput) => {
    let images;
    if (input.file) {
      const upload = await getMemoImagePresignedUrl(input.file.name);
      await uploadMemoImage(upload.presignedUrl, input.file);
      images = [{
        imageUrl: upload.presignedUrl.split('?')[0],
        s3Key: upload.s3Key,
      }];
    }

    const memoId = await createMemoRequest({
      activityId: input.activityId,
      title: input.title,
      content: input.memo,
      images,
    });
    const createdMemo = await getMemo(memoId);
    setMemos((current) => [toMemoData(createdMemo), ...current]);
    setIsCreateOpen(false);
    fireToast('새로운 메모가 추가되었습니다.');
  };

  const selectMemo = (id: string, selected: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const openMemoDetail = async (memoId: string) => {
    if (openingMemoId) return;
    setOpeningMemoId(memoId);
    try {
      const detail = toMemoData(await getMemo(memoId));
      setMemos((current) => current.map((memo) => memo.id === memoId ? detail : memo));
      setOpenMemoId(memoId);
    } catch (error) {
      fireToast(getErrorMessage(error, '메모 상세를 불러오지 못했습니다.'), undefined, 'error');
    } finally {
      setOpeningMemoId(undefined);
    }
  };

  const saveMemo = async (updatedMemo: MemoData) => {
    const previousMemo = memos.find((memo) => memo.id === updatedMemo.id);
    if (previousMemo && previousMemo.title === updatedMemo.title && previousMemo.memo === updatedMemo.memo) return;

    await updateMemoRequest(updatedMemo.id, {
      title: updatedMemo.title,
      content: updatedMemo.memo,
    });
    setMemos((current) => current.map((memo) => (
      memo.id === updatedMemo.id ? updatedMemo : memo
    )));
  };

  const toggleImportant = async (memoId: string) => {
    const memo = memos.find((item) => item.id === memoId);
    if (!memo) return;
    const important = !memo.isImportant;

    await markMemoImportant(memoId, important);
    setMemos((current) => current.map((item) => (
      item.id === memoId ? { ...item, isImportant: important } : item
    )));
    fireToast(
      important ? '중요한 메모로 등록되었습니다.' : '중요한 메모에서 해제되었습니다.',
    );
  };

  const deleteMemo = async () => {
    if (!deleteMemoId) return;
    const deletedMemoIndex = memos.findIndex((memo) => memo.id === deleteMemoId);
    if (deletedMemoIndex === -1) return;

    const deletedMemo = memos[deletedMemoIndex];
    const deletedMemoId = deletedMemo.id;

    setMemos((current) => current.filter((memo) => memo.id !== deleteMemoId));
    setSelectedIds((current) => {
      const next = new Set(current);
      next.delete(deleteMemoId);
      return next;
    });
    if (openMemoId === deleteMemoId) setOpenMemoId(undefined);
    setDeleteMemoId(undefined);

    const restoreDeletedMemo = () => {
      setMemos((current) => {
        if (current.some((memo) => memo.id === deletedMemo.id)) return current;
        const next = [...current];
        next.splice(Math.min(deletedMemoIndex, next.length), 0, deletedMemo);
        return next;
      });
    };

    const deleteTimer = window.setTimeout(() => {
      void deleteMemosRequest([deletedMemoId]).catch((error) => {
        restoreDeletedMemo();
        fireToast(getErrorMessage(error, '메모를 삭제하지 못했습니다.'), undefined, 'error');
      });
    }, 2000);

    fireToast('메모가 삭제되었습니다.', () => {
      window.clearTimeout(deleteTimer);
      restoreDeletedMemo();
      dismissToast();
    });
  };

  const deleteSelectedMemos = async () => {
    if (selectedIds.size === 0 || isBulkDeleting) return;

    const memoIds = [...selectedIds];
    const selectedMemoIds = new Set(memoIds);
    setIsBulkDeleting(true);
    try {
      await deleteMemosRequest(memoIds);
      setMemos((current) => current.filter((memo) => !selectedMemoIds.has(memo.id)));
      setSelectedIds(new Set());
      fireToast(`${memoIds.length}개의 메모가 삭제되었습니다.`);
    } catch (error) {
      fireToast(getErrorMessage(error, '메모를 삭제하지 못했습니다.'), undefined, 'error');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    await deleteMemoImageRequest(imageId);
    setMemos((current) => current.map((memo) => {
      const images = memo.images.filter((image) => image.id !== imageId);
      if (images.length === memo.images.length) return memo;
      return {
        ...memo,
        images,
        attachmentCount: images.length || undefined,
        attachmentUrl: images[0]?.imageUrl,
      };
    }));
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
        <MemoBar
          count={selectedIds.size}
          isDeleting={isBulkDeleting}
          onCancel={() => setSelectedIds(new Set())}
          onMove={() => setIsMoveOpen(true)}
          onDelete={() => void deleteSelectedMemos()}
        />
      )}
      {isLoading && (
        <section className="flex min-h-[calc(100vh-260px)] items-center justify-center text-body2-r text-grey-600" aria-live="polite">
          메모를 불러오는 중...
        </section>
      )}
      {!isLoading && loadError && (
        <section className="flex min-h-[calc(100vh-260px)] flex-col items-center justify-center gap-4 text-center">
          <p role="alert" className="text-body2-r text-error-text">{loadError}</p>
          <button
            type="button"
            onClick={() => void loadMemos()}
            className="rounded-xl border border-primary-500 px-4 py-2 text-body2-md text-primary-500"
          >
            다시 시도
          </button>
        </section>
      )}
      {!isLoading && !loadError && memos.length === 0 && <EmptyMemo />}
      {!isLoading && !loadError && memos.length > 0 && (
        <MemoList
          memos={visibleMemos}
          onDelete={setDeleteMemoId}
          onToggleImportant={(id) => {
            void toggleImportant(id).catch((error) => {
              fireToast(getErrorMessage(error, '중요 메모 설정을 변경하지 못했습니다.'), undefined, 'error');
            });
          }}
          onMove={() => setIsMoveOpen(true)}
          selectedIds={selectedIds}
          onSelect={selectMemo}
          onOpen={(id) => void openMemoDetail(id)}
        />
      )}
      {isCreateOpen && (
        <CreateMemoModal
          activities={activities}
          onClose={() => setIsCreateOpen(false)}
          onCreate={createMemo}
        />
      )}
      {openMemo && deleteMemoId === undefined && (
        <MemoDetailModal
          memo={openMemo}
          onClose={() => setOpenMemoId(undefined)}
          onUpdate={saveMemo}
          onToggleImportant={() => toggleImportant(openMemo.id)}
          onDeleteImage={deleteImage}
          onMove={() => setIsMoveOpen(true)}
          onDelete={() => setDeleteMemoId(openMemo.id)}
        />
      )}
      {isMoveOpen && <MoveToRecordModal onClose={() => setIsMoveOpen(false)} />}
      {deleteMemoId !== undefined && (
        <DeleteMemoModal onClose={() => setDeleteMemoId(undefined)} onConfirm={deleteMemo} />
      )}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
          <Toast message={toast.message} variant={toast.variant} onUndo={toast.onUndo} />
        </div>
      )}
    </Card>
  );
}
