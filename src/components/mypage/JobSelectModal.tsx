import { useState } from 'react';
import CheckIcon from '@/assets/check.svg';
import CloseIcon from '@/assets/close.svg';
import { Button } from '@/components/common/button';
import { useEscapeKey } from '@/components/memo/hooks/useEscapeKey';
import { useModalFocus } from '@/components/memo/hooks/useModalFocus';

export interface JobOption {
  id: string;
  name: string;
  categoryCode: string;
  categoryName: string;
}

interface JobSelectModalProps {
  isOpen: boolean;
  jobs: JobOption[];
  selectedJobId: string | null;
  isLoading?: boolean;
  error?: string | null;
  isSaving?: boolean;
  onClose: () => void;
  onRetry?: () => void;
  onSubmit: (jobId: string) => void;
}

export const JobSelectModal = ({
  isOpen,
  jobs,
  selectedJobId,
  isLoading = false,
  error = null,
  isSaving = false,
  onClose,
  onRetry,
  onSubmit,
}: JobSelectModalProps) => {
  const [draftJobId, setDraftJobId] = useState(selectedJobId ?? '');
  const [selectedCategoryCode, setSelectedCategoryCode] = useState('');
  const dialogRef = useModalFocus<HTMLDivElement>();
  const isUnchanged = draftJobId === (selectedJobId ?? '');
  const categories = Array.from(
    new Map(jobs.map(job => [job.categoryCode, job.categoryName])).entries(),
    ([code, name]) => ({ code, name }),
  );
  const activeCategoryCode = categories.some(category => category.code === selectedCategoryCode)
    ? selectedCategoryCode
    : jobs.find(job => job.id === selectedJobId)?.categoryCode ?? categories[0]?.code ?? '';
  const visibleJobs = jobs.filter(job => job.categoryCode === activeCategoryCode);

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
        className="relative flex h-[min(611px,calc(100dvh-40px))] w-full max-w-[567px] flex-col rounded-[40px] bg-white p-8 outline-none"
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

        <div className="shrink-0">
          <h2 id="job-select-title" className="text-title1 text-grey-900">희망 직무 선택</h2>
          <p className="mt-1 text-body2-md text-grey-700">원하는 직무를 선택해주세요</p>
        </div>

        <div className="mt-8 min-h-0 flex-1 overflow-y-auto scrollbar-hide">
          {isLoading ? (
            <p className="rounded-[14px] bg-grey-50 px-4 py-10 text-center text-body3-r text-grey-500" aria-live="polite">
              직무 목록을 불러오는 중...
            </p>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 rounded-[14px] bg-grey-50 px-4 py-8 text-center">
              <p role="alert" className="text-body3-r text-error-text">{error}</p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="rounded-xl border border-primary-500 px-4 py-2 text-body3-md text-primary-500"
                >
                  다시 시도
                </button>
              )}
            </div>
          ) : jobs.length === 0 ? (
            <p className="rounded-[14px] bg-grey-50 px-4 py-10 text-center text-body3-r text-grey-500">
              선택할 수 있는 직무가 없습니다.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.code}
                    type="button"
                    aria-pressed={activeCategoryCode === category.code}
                    onClick={() => setSelectedCategoryCode(category.code)}
                    className={`rounded-xl border px-3 py-2 text-body3-md transition-colors ${
                      activeCategoryCode === category.code
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-grey-100 bg-white text-grey-700 hover:border-primary-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {visibleJobs.map(job => (
                  <button
                    key={job.id}
                    type="button"
                    aria-pressed={draftJobId === job.id}
                    onClick={() => setDraftJobId(job.id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-body3-md transition-colors ${
                      draftJobId === job.id
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-primary-500 bg-white text-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    {draftJobId === job.id && <CheckIcon aria-hidden className="h-[7px] w-2.5 shrink-0 text-white" />}
                    {job.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 shrink-0">
          <Button
            label="저장"
            className="h-12 rounded-xl"
            disabled={!draftJobId || isUnchanged || isLoading || Boolean(error) || isSaving}
            onClick={() => onSubmit(draftJobId)}
          />
        </div>
      </div>
    </div>
  );
};
