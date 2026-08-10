import { useState, useRef } from 'react';
import LottieLib from 'lottie-react';
const Lottie = (LottieLib as unknown as { default: typeof LottieLib }).default ?? LottieLib;
import readABook from '@/assets/read-a-book.json';
import { Card } from '@/components/common/card';
import { HomeHeader } from '@/components/home/header';
import { PrimaryButton } from '@/components/common/createButton';
import { ActivityModal } from '@/components/home/ActivityModal';
import { ActivityCard } from '@/components/home/ActivityCard';
import { Toast } from '@/components/common/Toast';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import type { Activity } from '@/types/activity';
import { useActivities, type ActivityFormData } from '@/contexts/ActivitiesContext';
import { useRecords } from '@/contexts/RecordsContext';
import { ApiError } from '@/api/client';

export default function Home() {
  const { activities, isLoading, addActivity, updateActivity, removeActivity, restoreActivity, archiveActivity } = useActivities();
  const { records, removeRecordsByActivity, restoreRecord } = useRecords();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [toast, setToast] = useState<{ message: string; variant?: 'success' | 'error'; onUndo?: () => void } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [confirmModal, setConfirmModal] = useState<'delete' | 'end' | null>(null);
  const [targetActivity, setTargetActivity] = useState<Activity | null>(null);

  const openEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const openConfirm = (type: 'delete' | 'end', activity: Activity) => {
    setTargetActivity(activity);
    setConfirmModal(type);
  };

  const closeConfirm = () => {
    setConfirmModal(null);
    setTargetActivity(null);
  };

  const fireToast = (message: string, variant: 'success' | 'error' = 'success', onUndo?: () => void) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, variant, onUndo });
    toastTimerRef.current = setTimeout(() => setToast(null), 2000);
  };

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof ApiError ? error.message : fallback;

  const handleDelete = async () => {
    if (!targetActivity) return;
    const removed = targetActivity;
    const removedRecords = records.filter(record => record.activityId === removed.id);
    closeConfirm();
    try {
      await removeActivity(removed.id);
      removeRecordsByActivity(removed.id);
      fireToast('활동이 삭제되었습니다.', 'success', () => {
        restoreActivity(removed.id)
          .then(() => {
            removedRecords.forEach(record => restoreRecord(record));
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
            setToast(null);
          })
          .catch((error: unknown) => {
            fireToast(getErrorMessage(error, '활동 복구에 실패했습니다.'), 'error');
          });
      });
    } catch (error) {
      fireToast(getErrorMessage(error, '활동 삭제에 실패했습니다.'), 'error');
    }
  };

  const handleEnd = async () => {
    if (!targetActivity) return;
    const target = targetActivity;
    closeConfirm();
    try {
      await archiveActivity(target.id);
      fireToast('활동 기록이 활동 보관함에 보관되었습니다.');
    } catch (error) {
      fireToast(getErrorMessage(error, '활동 보관에 실패했습니다.'), 'error');
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const handleSubmit = async (data: ActivityFormData) => {
    try {
      if (selectedActivity) {
        await updateActivity(selectedActivity.id, data);
        handleClose();
        fireToast('변경사항이 저장되었습니다.');
      } else {
        await addActivity(data);
        handleClose();
        fireToast('활동이 성공적으로 생성되었습니다.');
      }
    } catch (error) {
      fireToast(getErrorMessage(error, '요청 처리 중 오류가 발생했습니다.'), 'error');
    }
  };

  return (
    <>
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
          <Toast message={toast.message} variant={toast.variant} onUndo={toast.onUndo} />
        </div>
      )}
      <Card>
        <HomeHeader />
        <section className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-title1 text-grey-900">기록 중인 활동</span>
            <span className="text-title1 text-grey-900">{activities.length}</span>
          </div>
          {activities.length > 0 && (
            <PrimaryButton label="활동 추가" onClick={() => setIsModalOpen(true)} />
          )}
        </section>
        {isLoading ? (
          <section className="w-full flex-1 flex items-center justify-center">
            <p className="text-body2-r text-grey-500">불러오는 중...</p>
          </section>
        ) : activities.length === 0 ? (
          <section className="w-full flex-1 flex flex-col items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-2.5">
              <Lottie animationData={readABook} loop autoplay style={{ width: 160, height: 160 }} />
              <div className="flex flex-col gap-3">
                <p className="text-sub1-sb text-grey-950">첫 기록을 남겨볼까요?</p>
                <p className="text-body2-r text-grey-700">
                  경험을 하나씩 쌓다 보면 어느새 그럴싸한<br />
                  포트폴리오가 되어 있을 거예요
                </p>
              </div>
            </div>
            <PrimaryButton label="활동 기록하기" onClick={() => setIsModalOpen(true)} />
          </section>
        ) : (
          <section className="w-full self-start grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 max-w-[1112px]">
            {activities.map(activity => (
              <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onEdit={() => openEdit(activity)}
                  onEnd={() => openConfirm('end', activity)}
                  onDelete={() => openConfirm('delete', activity)}
                />
            ))}
          </section>
        )}
      </Card>
      <ActivityModal
        key={selectedActivity?.id ?? 'new'}
        isOpen={isModalOpen}
        activity={selectedActivity ?? undefined}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
      <ConfirmModal
        isOpen={confirmModal === 'delete'}
        title="활동을 삭제하시겠어요?"
        description="활동을 삭제하면 작성한 모든 기록이 함께 삭제됩니다.기록을 보관하려면 기록 종료 및 보관을 이용해 주세요."
        confirmLabel="활동 삭제"
        onConfirm={handleDelete}
        onCancel={closeConfirm}
      />
      <ConfirmModal
        isOpen={confirmModal === 'end'}
        title="기록을 종료하시겠어요?"
        description="활동 기록을 종료하면 해당 기록은 나의 스토리 > 나의 연대기에 보관됩니다."
        confirmLabel="기록 종료"
        onConfirm={handleEnd}
        onCancel={closeConfirm}
      />
    </>
  );
}
