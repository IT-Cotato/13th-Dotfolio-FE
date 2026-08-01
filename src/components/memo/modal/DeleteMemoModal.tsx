import { useRef } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useModalFocus } from '../hooks/useModalFocus';

interface DeleteMemoModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteMemoModal = ({ onClose, onConfirm }: DeleteMemoModalProps) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useModalFocus<HTMLElement>(cancelButtonRef);

  useEscapeKey(onClose);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(28,28,26,0.62)] px-5 backdrop-blur-[2px]"
      onMouseDown={onClose}
    >
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-memo-title"
        aria-describedby="delete-memo-description"
        className="w-full max-w-[438px] rounded-[24px] bg-white p-6 shadow-[0_0_20px_0_rgba(0,0,0,0.18),0_8px_36px_0_rgba(0,0,0,0.16)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-2 text-center">
          <h2 id="delete-memo-title" className="text-sub1-sb text-grey-950">메모를 삭제하시겠어요?</h2>
          <p id="delete-memo-description" className="text-body2-r text-grey-700">삭제된 메모는 복구할 수 없습니다.</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-[14px] border border-primary-500 bg-white px-5 py-3.5 text-sub2-sb text-primary-500"
          >
            메모 삭제
          </button>
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            className="bg-primary-gradient rounded-[14px] px-5 py-3.5 text-sub2-sb text-white outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
          >
            취소
          </button>
        </div>
      </section>
    </div>
  );
};
