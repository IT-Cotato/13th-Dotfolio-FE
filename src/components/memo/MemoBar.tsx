import CloseIcon from '@/assets/memo_close.svg';
import RecordIcon from '@/assets/memo_record.svg';
import DeleteIcon from '@/assets/memo_delete.svg';

interface MemoBarProps {
  count: number;
  onCancel: () => void;
  onMove?: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export const MemoBar = ({ count, onCancel, onMove, onDelete, isDeleting = false }: MemoBarProps) => (
  <div className="fixed bottom-4 left-4 right-4 z-50 flex min-h-14 flex-wrap items-center gap-y-3 rounded-2xl border border-grey-100 bg-white px-4 py-3 text-grey-900 shadow-[0_0_30px_rgba(22,53,164,0.08)] sm:absolute sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-[18px] sm:h-14 sm:w-[660px] sm:max-w-[60%] sm:-translate-x-1/2 sm:flex-nowrap sm:px-0 sm:py-0 sm:pl-6 sm:pr-8">
    <button type="button" aria-label="전체 선택 취소" onClick={onCancel} className="mr-4 flex h-5 w-5 cursor-pointer items-center justify-center">
      <CloseIcon />
    </button>
    <span className="text-body2-md">{count}개 선택됨</span>
    <button type="button" onClick={onMove} className="ml-auto flex cursor-pointer items-center gap-2 whitespace-nowrap text-body2-md text-grey-900">
      <RecordIcon className="h-[16px] w-3.5" /> <span className="sm:hidden">기록하기</span><span className="hidden sm:inline">기록하기로 이동</span>
    </button>
    <button
      type="button"
      disabled={isDeleting}
      onClick={onDelete}
      className="ml-4 flex cursor-pointer items-center gap-2 whitespace-nowrap text-body2-md text-grey-900 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-8"
    >
      <DeleteIcon className="h-[16px] w-4" />
      {isDeleting ? '삭제 중...' : '삭제'}
    </button>
  </div>
);
