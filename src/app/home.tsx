import { useState } from 'react';
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
import MOCK_ACTIVITIES from '@/mock/activities.json';

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [deletedActivity, setDeletedActivity] = useState<Activity | null>(null);
  const [undoTimer, setUndoTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
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

  const handleDelete = () => {
    if (!targetActivity) return;
    const removed = targetActivity;
    setActivities(prev => prev.filter(a => a.id !== removed.id));
    setDeletedActivity(removed);
    setToastMessage('활동이 삭제되었습니다.');
    setShowToast(true);
    if (undoTimer) clearTimeout(undoTimer);
    const timer = setTimeout(() => {
      setShowToast(false);
      setDeletedActivity(null);
    }, 2000);
    setUndoTimer(timer);
    closeConfirm();
  };

  const handleUndo = () => {
    if (!deletedActivity) return;
    if (undoTimer) clearTimeout(undoTimer);
    setActivities(prev => [...prev, deletedActivity]);
    setDeletedActivity(null);
    setShowToast(false);
  };

  const handleEnd = () => {
    // TODO: 보관 처리 로직
    closeConfirm();
    if (undoTimer) clearTimeout(undoTimer);
    setDeletedActivity(null);
    setToastMessage('활동 기록이 활동 보관함에 보관되었습니다.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const handleSubmit = (data: Omit<Activity, 'id' | 'recordCount' | 'completedCount'>) => {
    if (undoTimer) clearTimeout(undoTimer);
    setDeletedActivity(null);
    if (selectedActivity) {
      setActivities(prev => prev.map(a => a.id === selectedActivity.id ? { ...a, ...data } : a));
      setToastMessage('변경사항이 저장되었습니다.');
    } else {
      setActivities(prev => [...prev, { id: Date.now().toString(), ...data, recordCount: 0, completedCount: 0 }]);
      setToastMessage('활동이 성공적으로 생성되었습니다.');
    }
    handleClose();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
          <Toast message={toastMessage} onUndo={deletedActivity ? handleUndo : undefined} />
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
        {activities.length === 0 ? (
          <section className="w-full flex flex-col items-center text-center gap-8">
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
          <section className="w-full self-start grid grid-cols-4 gap-4 max-w-[1112px]">
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
        description="활동을 삭제하면 작성한 모든 기록이 함께 삭제됩니다.
기록을 보관하려면 기록 종료 및 보관을 이용해 주세요."
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
