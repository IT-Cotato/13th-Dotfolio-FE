import { useEffect, useRef, useState } from 'react';
import DdayIcon from '@/assets/memo_dday.svg';
import type { MemoData } from '../types';
import { MemoMoreMenu } from '../card/MemoMoreMenu';

interface MemoDetailModalProps {
  memo: MemoData;
  onClose: () => void;
  onUpdate: (memo: MemoData) => void;
  onDelete: () => void;
  onToggleImportant: () => void;
}

export const MemoDetailModal = ({ memo, onClose, onUpdate, onDelete, onToggleImportant }: MemoDetailModalProps) => {
  const [title, setTitle] = useState(memo.title ?? '');
  const [content, setContent] = useState(memo.memo);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const closeAndSave = () => {
    onUpdate({
      ...memo,
      title: title.trim() || undefined,
      memo: content.trim() || memo.memo,
    });
    onClose();
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAndSave();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  });

  useEffect(() => {
    const textarea = contentRef.current;
    if (!textarea) return;
    textarea.style.height = '0px';
    textarea.style.height = `${Math.max(208, textarea.scrollHeight)}px`;
  }, [content]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-grey-950/55 px-5" onMouseDown={closeAndSave}>
      <section
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
          <div className="ml-auto -translate-y-2">
            <MemoMoreMenu
              isImportant={!!memo.isImportant}
              onToggleImportant={onToggleImportant}
              onDelete={onDelete}
              align="right"
            />
          </div>
        </header>

        <div className="relative z-0 min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4 scrollbar-hide">
          <div className="flex flex-col gap-4">
            {(memo.isImportant || memo.title) && (
              <div className="flex items-center gap-1">
                {memo.isImportant && (
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                    <path d="m10 1.8 2.45 4.97 5.49.8-3.97 3.87.94 5.47L10 14.33l-4.91 2.58.94-5.47-3.97-3.87 5.49-.8L10 1.8Z" fill="#FFB516" />
                  </svg>
                )}
                {memo.title && (
                  <input
                    aria-label="메모 제목"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-sub1-sb text-grey-950 outline-none"
                  />
                )}
              </div>
            )}

            {memo.tag && (
              <span className="w-fit max-w-full truncate rounded-full bg-grey-500 px-3 py-1 text-label3-sb text-white">
                # {memo.tag}
              </span>
            )}

            <textarea
              ref={contentRef}
              aria-label="메모 내용"
              maxLength={500}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-[208px] w-full resize-none overflow-hidden bg-transparent text-body-reading2-md text-grey-900 outline-none"
            />

            {memo.attachmentUrl && (
              <img
                src={memo.attachmentUrl}
                alt="메모 활동 첨부 이미지"
                className="w-full rounded-sm object-cover"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
