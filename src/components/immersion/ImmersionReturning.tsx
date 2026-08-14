import { ImmersionLoadingContent } from "@/components/immersion/ImmersionLoadingContent";
import { ImmersionPageLayout } from "@/components/immersion/ImmersionPageLayout";

export function ImmersionReturning() {
  return (
    <ImmersionPageLayout
      className="flex items-center justify-center px-6 py-10"
      overlayClassName="bg-[rgba(26,26,28,0.80)]"
    >
      <ImmersionLoadingContent
        title="홈으로 돌아가는 중이에요"
        description={
          <>
            새로운 기록을 시작하거나
            <br />
            기존 활동을 이어갈 수 있어요.
          </>
        }
      />
    </ImmersionPageLayout>
  );
}
