import { useEffect, useState } from 'react';

interface MoveToRecordModalProps {
  onClose: () => void;
  onMove?: (activity: string, template: string) => void;
}

const activities = [
  '코테이토 13기 프로젝트',
  '경영 데이터분석 워크샵',
  '마케팅 공모전',
];

const templates = [
  '아이디어 · 기획',
  '협업 · 갈등',
  '문제 해결 · 성과',
  '도전 · 몰입',
];

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

export const MoveToRecordModal = ({ onClose, onMove }: MoveToRecordModalProps) => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const canMove = Boolean(selectedActivity && selectedTemplate);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const handleMove = () => {
    if (!canMove) return;
    onMove?.(selectedActivity, selectedTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-grey-950/55 px-5" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="move-to-record-title"
        className="max-h-[calc(100vh-48px)] w-full max-w-[660px] overflow-y-auto rounded-[40px] bg-white p-8 shadow-[0_0_20px_rgba(0,0,0,0.18)] scrollbar-hide"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center">
          <button type="button" aria-label="뒤로 가기" onClick={onClose} className="flex h-8 w-8 items-center justify-center text-grey-400 hover:text-grey-700">
            <ArrowLeftIcon />
          </button>
          <h2 id="move-to-record-title" className="flex-1 text-center text-title1 text-grey-900">기록하기로 이동</h2>
          <button type="button" aria-label="닫기" onClick={onClose} className="flex h-8 w-8 items-center justify-center text-grey-400 hover:text-grey-700">
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
                  key={activity}
                  type="button"
                  aria-pressed={selectedActivity === activity}
                  onClick={() => setSelectedActivity(activity)}
                  className={`min-h-[84px] rounded-2xl border-[1.5px] px-6 py-4 text-body1-md transition-colors ${
                    selectedActivity === activity
                      ? 'border-primary-500 bg-primary-50 text-primary-500'
                      : 'border-grey-100 bg-white text-grey-900 hover:border-primary-200'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-title2 text-grey-900">템플릿 선택</legend>
            <p className="mt-2 text-body2-r text-grey-700">선택한 메모를 어떤 템플릿으로 기록할까요?</p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {templates.map((template) => (
                <button
                  key={template}
                  type="button"
                  aria-pressed={selectedTemplate === template}
                  onClick={() => setSelectedTemplate(template)}
                  className={`rounded-2xl border-[1.5px] px-6 py-4 text-body1-md transition-colors ${
                    selectedTemplate === template
                      ? 'border-primary-500 bg-primary-50 text-primary-500'
                      : 'border-grey-100 bg-white text-grey-900 hover:border-primary-200'
                  }`}
                >
                  {template}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <button
          type="button"
          disabled={!canMove}
          onClick={handleMove}
          className="bg-primary-gradient mt-8 w-full rounded-[14px] px-5 py-3.5 text-sub2-sb text-white disabled:cursor-not-allowed disabled:bg-none disabled:bg-grey-300"
        >
          이동
        </button>
      </section>
    </div>
  );
};
