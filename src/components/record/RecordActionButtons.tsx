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
      disabled={isValid}
      className="flex-1 cursor-pointer whitespace-nowrap rounded-xl border border-grey-100 bg-grey-50 px-5 py-2.5 text-sub2-sb text-grey-600 transition-colors disabled:cursor-not-allowed disabled:border-grey-100 disabled:text-grey-400 sm:flex-none"
    >
      임시저장
    </button>
    <button
      type="button"
      onClick={onComplete}
      disabled={!isValid}
      className={`flex-1 whitespace-nowrap rounded-xl px-5 py-2.5 text-sub2-sb transition-colors sm:flex-none ${
        isValid
          ? 'bg-primary-500 text-grey-0 cursor-pointer'
          : 'bg-grey-300 text-grey-0 cursor-not-allowed'
      }`}
    >
      기록완료
    </button>
  </div>
);
