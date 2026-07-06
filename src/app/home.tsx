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
import type { Activity } from '@/types/activity';
import MOCK_ACTIVITIES from '@/mock/activities.json';

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const openEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const handleSubmit = (data: Omit<Activity, 'id' | 'recordCount' | 'completedCount'>) => {
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
          <Toast message={toastMessage} />
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
          <section className="w-full grid grid-cols-4 gap-4">
            {activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} onClick={() => openEdit(activity)} />
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
    </>
  );
}
