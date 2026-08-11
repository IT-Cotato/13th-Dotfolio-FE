import PolygonIcon from "@/assets/polygon.svg";
import { Button } from "@/components/common/button";
import { ImmersionToggle } from "@/components/home/ImmersionToggle";
import { ImmersionProgress } from "@/components/immersion/ImmersionProgress";
import { ImmersionPageLayout } from "@/components/immersion/ImmersionPageLayout";
import { ImmersionTimer } from "@/components/immersion/ImmersionTimer";

interface ImmersionRecordProps {
  focusMinutes: number;
  recordCount: number;
}

export function ImmersionRecord({
  focusMinutes,
  recordCount,
}: ImmersionRecordProps) {
  return (
    <ImmersionPageLayout className="px-6 py-6">
      <header className="relative flex w-full items-center justify-between">
        <ImmersionToggle defaultOn />
        <ImmersionTimer initialMinutes={focusMinutes} />
      </header>

      <div className="relative mx-auto mt-20 flex w-full max-w-[1340px] flex-col items-center gap-8">
        <div className="flex w-full flex-col items-start gap-8">
          <div className="flex w-full flex-col items-start gap-6">
            <nav
              aria-label="현재 기록 경로"
              className="flex w-full items-center gap-0.5 px-1"
            >
              <span className="text-body2-md text-grey-100">
                코테이토 13기 프로젝트
              </span>
              <span className="flex size-6 items-center justify-center px-1 py-2">
                <PolygonIcon className="h-2.5 w-3 text-grey-100" />
              </span>
              <span className="text-body2-md text-grey-100">기획·아이디어</span>
            </nav>

            <div className="flex w-full items-center justify-between px-1">
              <h1 className="w-full max-w-[452px] text-title1 text-grey-0">
                데이터 시각화 대시보드 개선
              </h1>
              <Button label="저장하고 다음 기록" size="compact" />
            </div>
          </div>

          <div className="flex h-[678px] w-full items-start gap-6">
            <aside
              aria-label="불러온 기록"
              className="flex h-full w-[389px] shrink-0 flex-col items-end gap-4 rounded-[32px] bg-[rgba(0,17,78,0.35)] p-6"
            />
            <section
              aria-label="기록 입력"
              className="flex h-full min-w-0 flex-1 flex-col items-start gap-10 rounded-[32px] bg-[rgba(0,17,78,0.35)] p-6"
            />
          </div>
        </div>

        <ImmersionProgress currentIndex={0} totalCount={recordCount} />
      </div>
    </ImmersionPageLayout>
  );
}
