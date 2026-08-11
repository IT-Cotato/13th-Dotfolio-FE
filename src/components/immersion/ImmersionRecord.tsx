import PolygonIcon from "@/assets/polygon.svg";
import { Button } from "@/components/common/button";
import { ImmersionToggle } from "@/components/home/ImmersionToggle";
import { ImmersionTimer } from "@/components/immersion/ImmersionTimer";

interface ImmersionRecordProps {
  focusMinutes: number;
}

export function ImmersionRecord({ focusMinutes }: ImmersionRecordProps) {
  return (
    <main className="bg-home-image relative min-h-svh w-full px-6 py-6">
      <div className="absolute inset-0 bg-[rgba(26,26,28,0.70)] backdrop-blur-[1.5px]" />
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
        </div>

        <div aria-label="기록 진행 상태" className="flex items-center gap-3" />
      </div>
    </main>
  );
}
