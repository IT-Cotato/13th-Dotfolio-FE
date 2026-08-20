import { useRef, useState } from 'react';
import type { MemoActivityOption, MemoCreateInput } from '../types';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useModalFocus } from '../hooks/useModalFocus';
import CloudUploadIcon from '@/assets/cloud_upload.svg';

interface CreateMemoModalProps {
  onClose: () => void;
  onCreate: (memo: MemoCreateInput) => Promise<void>;
  activities: MemoActivityOption[];
}

export const CreateMemoModal = ({ onClose, onCreate, activities }: CreateMemoModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const dialogRef = useModalFocus<HTMLElement>();

  useEscapeKey(onClose);

  const selectFile = (files: FileList | null) => {
    const nextFile = files?.[0];
    if (nextFile?.type === 'image/jpeg' || nextFile?.type === 'image/png') setFile(nextFile);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleCreate = async () => {
    if (!memo.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await onCreate({
        memo: memo.trim(),
        title: title.trim() || undefined,
        activityId: selectedActivityId,
        file: file ?? undefined,
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '메모를 생성하지 못했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-grey-950/55 px-5" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-memo-title"
        className="h-[min(746px,calc(100vh-48px))] w-full max-w-[660px] overflow-y-auto rounded-[40px] bg-white p-8 shadow-[0_0_20px_rgba(0,0,0,0.18)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-[46px] flex h-[34px] items-center justify-between">
          <h2 id="create-memo-title" className="text-title2 text-grey-950">메모 생성</h2>
          <button type="button" aria-label="닫기" onClick={onClose} className="cursor-pointer text-title2 text-grey-400 hover:text-grey-700">×</button>
        </div>

        <div className="flex flex-col gap-8">
          <label className="flex flex-col gap-2">
            <span className="text-sub1-sb text-grey-900">제목</span>
            <input
              maxLength={255}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="메모를 한눈에 알아볼 수 있는 제목을 작성해보세요."
              className="h-12 rounded-2xl border border-grey-100 px-4 text-body2-r text-grey-900 outline-none placeholder:text-grey-400 focus:border-primary-300"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sub1-sb text-grey-900">메모 <span className="text-error-text">*</span></span>
            <textarea
              maxLength={500}
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              placeholder="경험, 생각, 배운 점 등을 자유롭게 기록해보세요."
              className="h-[100px] resize-none rounded-2xl border border-grey-100 p-4 text-body2-r text-grey-900 outline-none placeholder:text-grey-400 focus:border-primary-300"
            />
            <span className="text-right text-caption1 text-grey-500">
              <strong className="font-normal text-primary-500">{memo.length}</strong> / 500
            </span>
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-sub1-sb text-grey-900">활동 사진</span>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                selectFile(event.dataTransfer.files);
              }}
              className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-grey-200 text-grey-400 hover:border-primary-300 hover:text-primary-400"
            >
              <CloudUploadIcon aria-hidden="true" className="h-6 w-[23px]" />
              <span className="mt-1 text-caption1">이미지를 드래그하거나 클릭해서 업로드하세요. (허용 확장자 : JPG, PNG)</span>
            </button>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(event) => selectFile(event.target.files)} />

            {file && (
              <div className="mt-1">
                <div className="flex items-center justify-between text-caption1 text-grey-600">
                  <span>{file.name} <span className="ml-1 text-grey-400">{(file.size / 1024 / 1024).toFixed(1)}MB</span></span>
                  <button type="button" onClick={() => setFile(null)} className="cursor-pointer text-grey-500">삭제 ×</button>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-grey-100"><div className="h-full w-full bg-primary-500" /></div>
                <p className="mt-2 text-caption1 text-primary-500">업로드 준비 완료</p>
              </div>
            )}
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-sub1-sb text-grey-900">활동 태그</legend>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  type="button"
                  aria-pressed={selectedActivityId === activity.id}
                  onClick={() => setSelectedActivityId((current) => current === activity.id ? undefined : activity.id)}
                  className={`cursor-pointer rounded-xl border px-3 py-2 text-label2-md ${
                    selectedActivityId === activity.id
                      ? 'border-primary-400 bg-primary-50 text-primary-500'
                      : 'border-grey-100 text-grey-700'
                  }`}
                >
                  # {activity.title}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {submitError && <p role="alert" className="mt-4 text-center text-body3-r text-error-text">{submitError}</p>}

        <button
          type="button"
          disabled={!memo.trim() || isSubmitting}
          onClick={() => void handleCreate()}
          className="bg-primary-gradient mt-8 h-[52px] w-full cursor-pointer rounded-[14px] text-sub2-sb text-white disabled:cursor-not-allowed disabled:bg-none disabled:bg-grey-300"
        >
          {isSubmitting ? '생성 중...' : '메모 생성'}
        </button>
      </section>
    </div>
  );
};
