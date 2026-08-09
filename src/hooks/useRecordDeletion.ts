import { useState } from 'react';
import { deleteRecord, restoreRecord } from '@/api/records';
import { ApiError } from '@/api/client';
import type { useToast } from '@/hooks/useToast';
import type { RecordEntry } from '@/types/record';

type ToastHandlers = Pick<ReturnType<typeof useToast>, 'fireToast' | 'dismissToast'>;

export function useRecordDeletion(onChanged: () => void, { fireToast, dismissToast }: ToastHandlers) {
  const [deleteTarget, setDeleteTarget] = useState<RecordEntry | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const removed = deleteTarget;
    setDeleteTarget(null);
    try {
      await deleteRecord(removed.id);
      onChanged();
      fireToast('기록이 삭제되었습니다.', () => {
        restoreRecord(removed.id)
          .then(() => {
            onChanged();
            dismissToast();
          })
          .catch((error: unknown) => {
            const message = error instanceof ApiError ? error.message : '기록 복구에 실패했습니다.';
            fireToast(message, undefined, 'error');
          });
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '기록 삭제에 실패했습니다.';
      fireToast(message, undefined, 'error');
    }
  };

  return { deleteTarget, setDeleteTarget, handleConfirmDelete };
}
