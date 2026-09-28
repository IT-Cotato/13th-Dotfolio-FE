interface RecordActionButtonsProps {
  isValid: boolean;
  onTempSave: () => void;
  onComplete: () => void;
}

export const RecordActionButtons = ({ isValid, onTempSave, onComplete }: RecordActionButtonsProps) => (
  <div className="flex w-full items-center gap-2 sm:w-auto">
    <button
      type="button"
      onClick={onTempSave}
      className={`flex-1 cursor-pointer whitespace-nowrap rounded-xl border px-5 py-2.5 text-sub2-sb transition-colors sm:flex-none ${
        isValid
          ? 'border-grey-100 text-grey-400'
          : 'border-grey-100 bg-grey-50 text-grey-600'
      }`}
    >
      임시저장
    </button>
    <button
      type="button"
      onClick={onComplete}
      className={`flex-1 cursor-pointer whitespace-nowrap rounded-xl px-5 py-2.5 text-sub2-sb transition-colors sm:flex-none ${
        isValid
          ? 'bg-primary-500 text-grey-0'
          : 'bg-grey-300 text-grey-0'
      }`}
    >
      기록완료
    </button>
  </div>
);
