import { Button } from '@/components/common/button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(28, 28, 26, 0.62)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-109.5 mx-4 bg-white rounded-3xl p-6 flex flex-col gap-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sub1-sb text-neutral-grey-900">{title}</p>
          <p className="text-body2-r text-grey-700">{description}</p>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Button label={confirmLabel} variant="outline" onClick={onConfirm} />
          </div>
          <div className="flex-1">
            <Button label={cancelLabel} onClick={onCancel} />
          </div>
        </div>
      </div>
    </div>
  );
};
