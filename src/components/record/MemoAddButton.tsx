interface MemoAddButtonProps {
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'immersion';
}

export function MemoAddButton({
  className = '',
  onClick,
  variant = 'default',
}: MemoAddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-label3-sb flex cursor-pointer items-center justify-center gap-1 rounded-lg px-3 py-1 text-primary-500 ${
        variant === 'immersion'
          ? 'bg-grey-50'
          : 'border border-grey-100 bg-grey-0'
      } ${className}`}
    >
      메모 추가
    </button>
  );
}
