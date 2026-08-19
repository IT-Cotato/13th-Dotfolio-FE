interface RecordActionButtonsProps {
  isValid: boolean;
  onTempSave: () => void;
  onComplete: () => void;
}

export const RecordActionButtons = ({ isValid, onTempSave, onComplete }: RecordActionButtonsProps) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={onTempSave}
      disabled={isValid}
      className="px-5 py-2.5 rounded-xl border border-grey-100 bg-grey-50 text-grey-600 text-sub2-sb transition-colors cursor-pointer disabled:cursor-not-allowed disabled:border-grey-100 disabled:text-grey-400"
    >
      임시저장
    </button>
    <button
      type="button"
      onClick={onComplete}
      disabled={!isValid}
      className={`px-5 py-2.5 rounded-xl text-sub2-sb transition-colors ${
        isValid
          ? 'bg-primary-500 text-grey-0 cursor-pointer'
          : 'bg-grey-300 text-grey-0 cursor-not-allowed'
      }`}
    >
      기록완료
    </button>
  </div>
);
