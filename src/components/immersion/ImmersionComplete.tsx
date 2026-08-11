import CloseIcon from "@/assets/close.svg";
import { Button } from "@/components/common/button";
import { ImmersionPageLayout } from "@/components/immersion/ImmersionPageLayout";

interface ImmersionCompleteProps {
  completedCount: number;
  onClose: () => void;
  onReturnHome: () => void;
}

export function ImmersionComplete({
  completedCount,
  onClose,
  onReturnHome,
}: ImmersionCompleteProps) {
  return (
    <ImmersionPageLayout className="flex items-center justify-center px-6 py-10">
      <section className="relative flex w-full max-w-[455px] flex-col items-end gap-1.5 rounded-[32px] bg-[rgba(0,17,78,0.35)] p-8">
        <button
          type="button"
          aria-label="완료 화면 닫기"
          className="flex size-6 items-center justify-center gap-2.5 p-2 text-grey-100"
          onClick={onClose}
        >
          <CloseIcon className="size-4 shrink-0 aspect-square" />
        </button>

        <div className="flex w-full flex-col items-start gap-8">
          <p className="flex w-full flex-1 items-center justify-center gap-1 text-center text-[24px] font-bold leading-[160%] tracking-[-0.24px] text-grey-0">
            <span>
              {completedCount}개 기록을 완료했어요! 👏
              <br />
              홈으로 돌아가 기록 여정을 이어가세요.
            </span>
          </p>
          <Button label="홈으로 돌아가기" onClick={onReturnHome} />
        </div>
      </section>
    </ImmersionPageLayout>
  );
}
