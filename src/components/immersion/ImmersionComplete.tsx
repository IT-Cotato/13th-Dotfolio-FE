import { ImmersionMessageCard } from "@/components/immersion/ImmersionMessageCard";
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
      <ImmersionMessageCard
        buttonLabel="홈으로 돌아가기"
        closeLabel="완료 화면 닫기"
        message={
          <>
              {completedCount}개 기록을 완료했어요! 👏
              <br />
              홈으로 돌아가 기록 여정을 이어가세요.
          </>
        }
        onClose={onClose}
        onConfirm={onReturnHome}
      />
    </ImmersionPageLayout>
  );
}
