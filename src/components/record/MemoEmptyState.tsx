import MemoUploadIcon from '@/assets/memoupload.svg';

interface MemoEmptyStateProps {
  onSelect: () => void;
  variant?: 'default' | 'immersion';
}

export function MemoEmptyState({
  onSelect,
  variant = 'default',
}: MemoEmptyStateProps) {
  const isImmersion = variant === 'immersion';

  return (
    <div className="flex w-full flex-col items-center gap-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <MemoUploadIcon className="size-6 text-primary-400" />
        <p className={`text-sub2-sb ${isImmersion ? 'text-grey-0' : 'text-grey-900'}`}>
          메모 불러오기
        </p>
        <p className={`text-body-reading2-md ${isImmersion ? 'text-grey-200' : 'text-grey-700'}`}>
          저장된 메모를 불러와<br />기록 작성에 활용해보세요.
        </p>
      </div>
      <button
        type="button"
        onClick={onSelect}
        className={`text-sub2-sb w-full cursor-pointer rounded-xl border px-5 py-2.5 ${
          isImmersion
            ? 'border-grey-200 text-grey-0'
            : 'border-grey-100 text-primary-500'
        }`}
      >
        메모 선택
      </button>
    </div>
  );
}
