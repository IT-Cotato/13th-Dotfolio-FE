import { useRef, useState } from 'react';
import type { MemoData } from '../types';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useModalFocus } from '../hooks/useModalFocus';

interface CreateMemoModalProps {
  onClose: () => void;
  onCreate: (memo: Omit<MemoData, 'id'>) => void;
}

const UploadIcon = () => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 16V8m0 0L9 11m3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 17.5H6a3 3 0 0 1-.35-5.98A6.5 6.5 0 0 1 18.3 10a3.75 3.75 0 0 1-.05 7.5H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CreateMemoModal = ({ onClose, onCreate }: CreateMemoModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>();
  const dialogRef = useModalFocus<HTMLElement>();

  const tags = ['코테이토 13기 프로젝트', '경영 데이터분석 워크샵', '마케팅 공모전'];

  useEscapeKey(onClose);

  const selectFile = (files: FileList | null) => {
    const nextFile = files?.[0];
    if (nextFile?.type === 'image/jpeg' || nextFile?.type === 'image/png') setFile(nextFile);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleCreate = () => {
    const today = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date()).replaceAll(' ', '').replaceAll('.', '.').replace(/\.$/, '');

    onCreate({
      createdAt: today,
      dDay: 'D-30',
      memo: memo.trim(),
      title: title.trim() || undefined,
      tag: selectedTag,
      attachmentCount: file ? 1 : undefined,
      attachmentUrl: file ? URL.createObjectURL(file) : undefined,
    });
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
          <button type="button" aria-label="닫기" onClick={onClose} className="text-title2 text-grey-400 hover:text-grey-700">×</button>
        </div>

        <div className="flex flex-col gap-8">
          <label className="flex flex-col gap-2">
            <span className="text-label1-md text-grey-900">제목</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="메모를 한눈에 알아볼 수 있는 제목을 작성해보세요."
              className="h-12 rounded-2xl border border-grey-100 px-4 text-body2-r text-grey-900 outline-none placeholder:text-grey-400 focus:border-primary-300"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-label1-md text-grey-900">메모 <span className="text-error-text">*</span></span>
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
            <span className="text-label1-md text-grey-900">활동 사진</span>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                selectFile(event.dataTransfer.files);
              }}
              className="flex h-20 flex-col items-center justify-center rounded-2xl border border-dashed border-grey-200 text-grey-400 hover:border-primary-300 hover:text-primary-400"
            >
              <UploadIcon />
              <span className="mt-1 text-caption1">이미지를 드래그하거나 클릭해서 업로드하세요. (허용 확장자 : JPG, PNG)</span>
            </button>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(event) => selectFile(event.target.files)} />

            {file && (
              <div className="mt-1">
                <div className="flex items-center justify-between text-caption1 text-grey-600">
                  <span>{file.name} <span className="ml-1 text-grey-400">{(file.size / 1024 / 1024).toFixed(1)}MB</span></span>
                  <button type="button" onClick={() => setFile(null)} className="text-grey-500">삭제 ×</button>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-grey-100"><div className="h-full w-full bg-primary-500" /></div>
                <p className="mt-2 text-caption1 text-primary-500">업로드 완료</p>
              </div>
            )}
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-label1-md text-grey-900">활동 태그</legend>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={selectedTag === tag}
                  onClick={() => setSelectedTag((current) => current === tag ? undefined : tag)}
                  className={`rounded-xl border px-3 py-2 text-label2-md ${
                    selectedTag === tag
                      ? 'border-primary-400 bg-primary-50 text-primary-500'
                      : 'border-grey-100 text-grey-700'
                  }`}
                >
                  # {tag}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <button
          type="button"
          disabled={!memo.trim()}
          onClick={handleCreate}
          className="bg-primary-gradient mt-8 h-[52px] w-full rounded-[14px] text-sub2-sb text-white disabled:cursor-not-allowed disabled:bg-none disabled:bg-grey-300"
        >
          메모 생성
        </button>
      </section>
    </div>
  );
};
