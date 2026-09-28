import { useRef } from 'react';

interface RecordActionButtonsProps {
  isValid: boolean;
  onTempSave: () => void;
  onComplete: () => void;
}

// 방금 텍스트를 입력하던 위치에서 마우스를 움직여 버튼을 누르면, 브라우저가 이를
// 텍스트 드래그 선택으로 인식해 click 이벤트 자체가 발생하지 않는 경우가 있음.
// mouseup은 드래그 중이었어도 항상 발생하므로 onMouseUp으로도 실행하되,
// 정상 클릭 시 onClick과 중복 실행되지 않도록 짧게 막아줌.
const useSingleFire = (callback: () => void) => {
  const firedRef = useRef(false);
  return () => {
    if (firedRef.current) return;
    firedRef.current = true;
    callback();
    requestAnimationFrame(() => { firedRef.current = false; });
  };
};

export const RecordActionButtons = ({ isValid, onTempSave, onComplete }: RecordActionButtonsProps) => {
  const triggerTempSave = useSingleFire(onTempSave);
  const triggerComplete = useSingleFire(onComplete);

  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <button
        type="button"
        onMouseUp={triggerTempSave}
        onClick={triggerTempSave}
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
        onMouseUp={triggerComplete}
        onClick={triggerComplete}
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
};
