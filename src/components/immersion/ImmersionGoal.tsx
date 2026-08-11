import { useState } from "react";
import AddIcon from "@/assets/add10.svg";
import RemoveIcon from "@/assets/remove.svg";
import { CounterButton } from "@/components/common/CounterButton";

const MIN_RECORD_COUNT = 1;
const MAX_RECORD_COUNT = 5;

export function ImmersionGoal() {
  const [recordCount, setRecordCount] = useState(MAX_RECORD_COUNT);

  return (
    <main className="bg-home-image relative flex min-h-svh w-full flex-col items-center justify-center gap-2.5 px-6 py-10">
      <div className="absolute inset-0 bg-[rgba(26,26,28,0.70)] backdrop-blur-[1.5px]" />
      <section className="relative flex w-full max-w-[500px] flex-col items-start justify-center gap-8 rounded-[32px] bg-[rgba(0,17,78,0.35)] p-6">
        <header className="flex w-full flex-col items-center justify-center gap-2 text-center">
          <h1 className="w-full text-title1 text-grey-0">
            완료할 기록의 개수와
            <br />
            몰입 시간을 설정해 보세요.
          </h1>
          <p className="text-body2-md text-grey-200">
            미완료된 기록은 무작위로 제공됩니다.
          </p>
        </header>

        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start gap-2">
            <h2 className="w-full text-sub1-sb text-grey-0">개수</h2>
            <p className="text-body2-md text-grey-200">
              최대 5개까지 설정 가능합니다.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <CounterButton
              ariaLabel="기록 개수 줄이기"
              disabled={recordCount === MIN_RECORD_COUNT}
              icon={<RemoveIcon className="h-0.5 w-2.5" />}
              onClick={() => setRecordCount((count) => count - 1)}
            />
            <span className="min-w-5 text-center text-title2 text-grey-0">
              {recordCount}
            </span>
            <CounterButton
              ariaLabel="기록 개수 늘리기"
              disabled={recordCount === MAX_RECORD_COUNT}
              icon={<AddIcon className="size-2.5" />}
              onClick={() => setRecordCount((count) => count + 1)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
