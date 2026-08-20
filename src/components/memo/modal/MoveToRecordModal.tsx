import { useState } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useModalFocus } from '../hooks/useModalFocus';
import type { MemoActivityOption } from '../types';

interface MoveTemplateOption {
  id: string;
  title: string;
}

interface MoveToRecordModalProps {
  onClose: () => void;
  onMove: (activityId: string, templateId: string) => void;
  activities: MemoActivityOption[];
  isActivitiesLoading: boolean;
  activitiesError: string | null;
  templates: MoveTemplateOption[];
  isTemplatesLoading: boolean;
  templatesError: string | null;
}

const ArrowLeftIcon = () => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const MoveToRecordModal = ({
  onClose,
  onMove,
  activities,
  isActivitiesLoading,
  activitiesError,
  templates,
  isTemplatesLoading,
  templatesError,
}: MoveToRecordModalProps) => {
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const canMove = Boolean(selectedActivityId && selectedTemplateId);
  const dialogRef = useModalFocus<HTMLElement>();

  useEscapeKey(onClose);

  const selectActivity = (activityId: string) => {
    setSelectedActivityId(activityId);
  };

  const handleMove = () => {
    if (!canMove) return;
    onMove(selectedActivityId, selectedTemplateId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-grey-950/55 px-5" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="move-to-record-title"
        className="max-h-[calc(100vh-48px)] w-full max-w-[660px] overflow-y-auto rounded-[40px] bg-white p-8 shadow-[0_0_20px_rgba(0,0,0,0.18)] scrollbar-hide"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center">
          <button type="button" aria-label="뒤로 가기" onClick={onClose} className="flex h-8 w-8 cursor-pointer items-center justify-center text-grey-400 hover:text-grey-700">
            <ArrowLeftIcon />
          </button>
          <h2 id="move-to-record-title" className="flex-1 text-center text-title1 text-grey-900">기록하기로 이동</h2>
          <button type="button" aria-label="닫기" onClick={onClose} className="flex h-8 w-8 cursor-pointer items-center justify-center text-grey-400 hover:text-grey-700">
            <CloseIcon />
          </button>
        </header>

        <div className="mt-12 flex flex-col gap-6">
          <fieldset>
            <legend className="text-title2 text-grey-900">활동 선택</legend>
            <p className="mt-2 text-body2-r text-grey-700">선택한 메모를 어떤 활동으로 기록할까요?</p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  type="button"
                  aria-pressed={selectedActivityId === activity.id}
                  onClick={() => selectActivity(activity.id)}
                  className={`min-h-[84px] cursor-pointer rounded-2xl border-[1.5px] px-6 py-4 text-body1-md transition-colors ${
                    selectedActivityId === activity.id
                      ? 'border-primary-500 bg-primary-50 text-primary-500'
                      : 'border-grey-100 bg-white text-grey-900 hover:border-primary-200'
                  }`}
                >
                  {activity.title}
                </button>
              ))}
            </div>
            {isActivitiesLoading && <p className="mt-4 text-center text-body3-r text-grey-500">활동을 불러오는 중...</p>}
            {!isActivitiesLoading && activitiesError && <p role="alert" className="mt-4 text-center text-body3-r text-error-text">{activitiesError}</p>}
            {!isActivitiesLoading && !activitiesError && activities.length === 0 && <p className="mt-4 text-center text-body3-r text-grey-500">선택할 수 있는 활동이 없습니다.</p>}
          </fieldset>

          <fieldset>
            <legend className="text-title2 text-grey-900">템플릿 선택</legend>
            <p className="mt-2 text-body2-r text-grey-700">선택한 메모를 어떤 템플릿으로 기록할까요?</p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  aria-pressed={selectedTemplateId === template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`cursor-pointer rounded-2xl border-[1.5px] px-6 py-4 text-body1-md transition-colors ${
                    selectedTemplateId === template.id
                      ? 'border-primary-500 bg-primary-50 text-primary-500'
                      : 'border-grey-100 bg-white text-grey-900 hover:border-primary-200'
                  }`}
                >
                  {template.title}
                </button>
              ))}
            </div>
            {isTemplatesLoading && <p className="mt-4 text-center text-body3-r text-grey-500">템플릿을 불러오는 중...</p>}
            {!isTemplatesLoading && templatesError && <p role="alert" className="mt-4 text-center text-body3-r text-error-text">{templatesError}</p>}
            {!isTemplatesLoading && !templatesError && templates.length === 0 && <p className="mt-4 text-center text-body3-r text-grey-500">사용할 수 있는 템플릿이 없습니다.</p>}
          </fieldset>
        </div>

        <button
          type="button"
          disabled={!canMove}
          onClick={handleMove}
          className="bg-primary-gradient mt-8 w-full cursor-pointer rounded-[14px] px-5 py-3.5 text-sub2-sb text-white disabled:cursor-not-allowed disabled:bg-none disabled:bg-grey-300"
        >
          이동
        </button>
      </section>
    </div>
  );
};
