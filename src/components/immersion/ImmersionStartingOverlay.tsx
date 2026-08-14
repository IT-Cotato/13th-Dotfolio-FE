import { ImmersionLoadingContent } from "@/components/immersion/ImmersionLoadingContent";

export function ImmersionStartingOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(26,26,28,0.80)] px-6 py-10 backdrop-blur-[1.5px]">
      <ImmersionLoadingContent
        title="최적의 몰입 환경을 조성하고 있어요"
        description={
          <>
            설정한 목표 시간 동안 원하는 기록 개수를
            <br />
            채우며 온전히 집중해 보세요.
          </>
        }
      />
    </div>
  );
}
