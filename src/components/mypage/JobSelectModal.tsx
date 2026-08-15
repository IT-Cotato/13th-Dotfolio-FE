import { useState } from 'react';
import CloseIcon from '@/assets/close.svg';
import { Button } from '@/components/common/button';
import { useEscapeKey } from '@/components/memo/hooks/useEscapeKey';
import { useModalFocus } from '@/components/memo/hooks/useModalFocus';

export interface JobOption {
  id: string;
  name: string;
}

interface JobSelectModalProps {
  isOpen: boolean;
  jobs: JobOption[];
  selectedJobId: string | null;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (jobId: string) => void;
}

export const JobSelectModal = ({
  isOpen,
  jobs,
  selectedJobId,
  isSaving = false,
  onClose,
  onSubmit,
}: JobSelectModalProps) => {
  const [draftJobId, setDraftJobId] = useState(selectedJobId ?? '');
  const dialogRef = useModalFocus<HTMLDivElement>();
  const isUnchanged = draftJobId === (selectedJobId ?? '');

  useEscapeKey(onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-grey-950/55 px-5"
      onMouseDown={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-select-title"
        tabIndex={-1}
        className="relative flex w-full max-w-116 flex-col gap-8 rounded-3xl bg-white px-8 pt-8 pb-8 outline-none"
        onMouseDown={event => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute top-6 right-6 cursor-pointer text-grey-400"
        >
          <CloseIcon className="size-4" />
        </button>

        <div>
          <h2 id="job-select-title" className="text-title2 text-grey-900">희망 직무 변경</h2>
          <p className="mt-2 text-body3-r text-grey-600">나의 스토리 분석에 활용할 직무를 선택해주세요.</p>
        </div>

        <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto scrollbar-hide">
          {jobs.map(job => (
            <button
              key={job.id}
              type="button"
              aria-pressed={draftJobId === job.id}
              onClick={() => setDraftJobId(job.id)}
              className={`min-h-14 rounded-[14px] border px-4 py-3 text-body2-md transition-colors ${
                draftJobId === job.id
                  ? 'border-primary-500 bg-primary-50 text-primary-500'
                  : 'border-grey-100 bg-white text-grey-800 hover:border-primary-200'
              }`}
            >
              {job.name}
            </button>
          ))}
        </div>

        {jobs.length <= 1 && (
          <p className="rounded-[14px] bg-grey-50 px-4 py-8 text-center text-body3-r text-grey-500">
            직무 목록 API가 준비되면 다른 직무를 선택할 수 있습니다.
          </p>
        )}

        <Button
          label={isSaving ? '변경 중...' : '변경하기'}
          disabled={!draftJobId || isUnchanged || isSaving}
          onClick={() => onSubmit(draftJobId)}
        />
      </div>
    </div>
  );
};
