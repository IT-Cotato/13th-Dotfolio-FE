import { Button } from '@/components/common/button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(28, 28, 26, 0.62)' }}
      onClick={() => {
        if (!isConfirming) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        className="flex w-full max-w-109.5 flex-col gap-6 rounded-3xl bg-white p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <p id="confirm-modal-title" className="text-sub1-sb text-neutral-grey-900">{title}</p>
          <p id="confirm-modal-description" className="whitespace-pre-line text-body2-r text-grey-700">{description}</p>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Button label={confirmLabel} variant="outline" disabled={isConfirming} onClick={onConfirm} />
          </div>
          <div className="flex-1">
            <Button label={cancelLabel} disabled={isConfirming} onClick={onCancel} />
          </div>
        </div>
      </div>
    </div>
  );
};
