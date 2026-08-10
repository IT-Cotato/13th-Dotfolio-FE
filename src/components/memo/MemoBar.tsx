import CloseIcon from '@/assets/memo_close.svg';
import RecordIcon from '@/assets/memo_record.svg';

interface MemoBarProps {
  count: number;
  onCancel: () => void;
  onMove?: () => void;
}

export const MemoBar = ({ count, onCancel, onMove }: MemoBarProps) => (
  <div className="absolute left-1/2 top-[18px] z-20 flex h-[52px] w-[534px] max-w-[50%] -translate-x-1/2 items-center rounded-2xl border border-grey-100 bg-white pl-6 pr-8 text-grey-900 shadow-[0_0_30px_rgba(22,53,164,0.08)]">
    <button type="button" aria-label="전체 선택 취소" onClick={onCancel} className="mr-4 flex h-5 w-5 items-center justify-center">
      <CloseIcon />
    </button>
    <span className="text-body3-md">{count}개 선택됨</span>
    <button type="button" onClick={onMove} className="ml-auto flex items-center gap-2 text-body2-md text-grey-900">
      <RecordIcon className="h-2.5 w-3.5" /> 기록하기로 이동
    </button>
  </div>
);
