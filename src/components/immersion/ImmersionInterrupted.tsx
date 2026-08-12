import { ImmersionMessageCard } from "@/components/immersion/ImmersionMessageCard";
import { ImmersionPageLayout } from "@/components/immersion/ImmersionPageLayout";

interface ImmersionInterruptedProps {
  onClose: () => void;
  onReturnHome: () => void;
}

export function ImmersionInterrupted({
  onClose,
  onReturnHome,
}: ImmersionInterruptedProps) {
  return (
    <ImmersionPageLayout className="flex items-center justify-center px-6 py-10">
      <ImmersionMessageCard
        buttonLabel="홈으로 돌아가기"
        closeLabel="중단 화면 닫기"
        dialogLabel="몰입모드 중단 확인"
        isModal
        message={
          <>
            지금 몰입모드를 중단하면
            <br />
            작성 중이던 기록은 저장되지 않아요
          </>
        }
        onClose={onClose}
        onConfirm={onReturnHome}
      />
    </ImmersionPageLayout>
  );
}
