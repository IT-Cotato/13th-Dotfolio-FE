import { useEffect, useRef, useState } from 'react';
import DdayIcon from '@/assets/memo_dday.svg';
import StarIcon from '@/assets/memo_star.svg';
import CloseIcon from '@/assets/close.svg';
import type { MemoData } from '../types';
import { MemoMoreMenu } from '../card/MemoMoreMenu';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useModalFocus } from '../hooks/useModalFocus';

interface MemoDetailModalProps {
  memo: MemoData;
  onClose: () => void;
  onUpdate: (memo: MemoData) => Promise<void>;
  onDelete: () => void;
  onToggleImportant: () => Promise<void>;
  onDeleteImage: (imageId: string) => Promise<void>;
  onMove: () => void;
}

export const MemoDetailModal = ({ memo, onClose, onUpdate, onDelete, onToggleImportant, onDeleteImage, onMove }: MemoDetailModalProps) => {
  const [title, setTitle] = useState(memo.title ?? '');
  const [content, setContent] = useState(memo.memo);
  const [contentError, setContentError] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string>();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const savedMemoRef = useRef({ title: memo.title ?? '', content: memo.memo });
  const savingPromiseRef = useRef<Promise<void> | null>(null);
  const dialogRef = useModalFocus<HTMLElement>();

  const updatedMemo = (normalizedContent: string) => ({
    ...memo,
    title: title.trim() || undefined,
    memo: normalizedContent,
  });

  const saveChanges = async () => {
    if (savingPromiseRef.current) {
      try {
        await savingPromiseRef.current;
      } catch {
        return false;
      }
    }

    const normalizedTitle = title.trim();
    const normalizedContent = contentRef.current?.value.trim() ?? content.trim();
    if (!normalizedContent) {
      setContentError(true);
      contentRef.current?.focus();
      return false;
    }
    if (
      savedMemoRef.current.title === normalizedTitle
      && savedMemoRef.current.content === normalizedContent
    ) {
      return true;
    }

    setIsSaving(true);
    setSubmitError('');
    const nextMemo = updatedMemo(normalizedContent);
    const request = onUpdate(nextMemo);
    savingPromiseRef.current = request;
    try {
      await request;
      savedMemoRef.current = { title: normalizedTitle, content: normalizedContent };
      return true;
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '메모를 수정하지 못했습니다.');
      return false;
    } finally {
      if (savingPromiseRef.current === request) savingPromiseRef.current = null;
      setIsSaving(false);
    }
  };

  const closeAndSave = async () => {
    if (!content.trim()) {
      onClose();
      return;
    }
    if (await saveChanges()) onClose();
  };

  const deleteAndSave = () => {
    onDelete();
  };

  const toggleImportant = async () => {
    setSubmitError('');
    try {
      await onToggleImportant();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '중요 메모 설정을 변경하지 못했습니다.');
    }
  };

  const removeImage = async (imageId: string) => {
    setDeletingImageId(imageId);
    setSubmitError('');
    try {
      await onDeleteImage(imageId);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '이미지를 삭제하지 못했습니다.');
    } finally {
      setDeletingImageId(undefined);
    }
  };

  useEscapeKey(() => { void closeAndSave(); });

  useEffect(() => {
    const textarea = contentRef.current;
    if (!textarea) return;
    textarea.style.height = '0px';
    textarea.style.height = `${Math.max(memo.images.length ? 0 : 208, textarea.scrollHeight)}px`;
  }, [content, memo.images.length]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-grey-950/55 px-5" onMouseDown={() => void closeAndSave()}>
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="메모 상세보기"
        onMouseDown={(event) => event.stopPropagation()}
        className="flex h-[min(720px,calc(100vh-48px))] w-full max-w-[660px] flex-col overflow-visible rounded-[40px] bg-white px-4 pt-4"
      >
        <header className="relative z-20 flex h-[54px] shrink-0 items-center border-b border-grey-100 pl-4 pr-2 text-body3-md text-grey-600">
          <time>{memo.createdAt}</time>
          <span className="ml-2 flex h-[22px] w-[62px] shrink-0 items-center rounded-[100px] border border-grey-100 bg-white py-px pl-1 pr-2 text-label3-md text-grey-600">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              <DdayIcon className="h-2.5 w-[7px]" />
            </span>
            <span className="whitespace-nowrap">{memo.dDay}</span>
          </span>
          <div className="ml-auto">
            <MemoMoreMenu
              isImportant={!!memo.isImportant}
              onToggleImportant={() => void toggleImportant()}
              onDelete={deleteAndSave}
              onMove={onMove}
              align="right"
            />
          </div>
        </header>

        <div className="relative z-0 min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4 scrollbar-hide">
          <div className="flex flex-col gap-4">
            <div className="flex min-w-0 flex-nowrap items-center gap-1">
              {memo.isImportant && (
                <StarIcon
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 [&_path]:fill-[#FFB516] [&_path]:stroke-[#FFB516]"
                />
              )}
              <input
                aria-label="메모 제목"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onBlur={() => void saveChanges()}
                className="min-w-0 flex-1 truncate whitespace-nowrap bg-transparent text-sub1-sb text-grey-950 outline-none"
              />
            </div>

            {memo.tag && (
              <span className="w-fit max-w-full truncate rounded-full bg-grey-500 px-3 py-1 text-label3-sb text-white">
                # {memo.tag}
              </span>
            )}

            <textarea
              ref={contentRef}
              rows={1}
              aria-label="메모 내용"
              aria-invalid={contentError}
              aria-describedby={contentError ? 'memo-content-error' : undefined}
              maxLength={500}
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                if (event.target.value.trim()) setContentError(false);
              }}
              onBlur={() => void saveChanges()}
              className={`${memo.images.length ? 'min-h-0' : 'min-h-[208px]'} w-full resize-none overflow-hidden rounded-lg bg-transparent text-body-reading2-md text-grey-900 outline-none ${
                contentError ? 'ring-1 ring-error-text' : ''
              }`}
            />
            {contentError && (
              <p id="memo-content-error" className="text-caption1 text-error-text">
                메모 내용을 입력해주세요.
              </p>
            )}

            {memo.images.map((image, index) => (
              <div key={image.id} className={`relative overflow-hidden rounded-sm ${index === 0 ? '-mt-3' : ''}`}>
                <img
                  src={image.imageUrl}
                  alt={`메모 활동 첨부 이미지 ${index + 1}`}
                  className="w-full object-cover"
                />
                <button
                  type="button"
                  aria-label={`첨부 이미지 ${index + 1} 삭제`}
                  disabled={deletingImageId === image.id}
                  onClick={() => void removeImage(image.id)}
                  className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center text-grey-700 disabled:cursor-wait disabled:opacity-60"
                >
                  <CloseIcon aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {submitError && <p role="alert" className="text-body3-r text-error-text">{submitError}</p>}
            {isSaving && <p className="text-right text-caption1 text-grey-500">저장 중...</p>}
          </div>
        </div>
      </section>
    </div>
  );
};
