import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@/assets/add10.svg";
import RemoveIcon from "@/assets/remove.svg";
import { Button } from "@/components/common/button";
import { CounterButton } from "@/components/common/CounterButton";
import { ImmersionToggle } from "@/components/home/ImmersionToggle";
import { ImmersionPageLayout } from "@/components/immersion/ImmersionPageLayout";
import { getRecords, type RecordListItem } from "@/api/records";

const MIN_RECORD_COUNT = 1;
const MAX_RECORD_COUNT = 5;
const MIN_FOCUS_MINUTES = 1;
const MAX_FOCUS_MINUTES = 120;

interface ImmersionGoalProps {
  onRequestExit: () => void;
}

export function ImmersionGoal({ onRequestExit }: ImmersionGoalProps) {
  const navigate = useNavigate();
  const [recordCount, setRecordCount] = useState(MAX_RECORD_COUNT);
  const [focusMinutes, setFocusMinutes] = useState("30");
  const [draftRecords, setDraftRecords] = useState<RecordListItem[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [recordsError, setRecordsError] = useState<string | null>(null);
  const availableRecordCount = Math.min(draftRecords.length, MAX_RECORD_COUNT);
  const parsedFocusMinutes = Number(focusMinutes);
  const focusMinutesError =
    focusMinutes === ""
      ? "몰입 시간을 입력해 주세요."
      : parsedFocusMinutes < MIN_FOCUS_MINUTES
        ? "시간은 1분 이상 입력해 주세요."
        : parsedFocusMinutes > MAX_FOCUS_MINUTES
          ? "시간은 120분 이하로 입력해 주세요."
          : null;

  useEffect(() => {
    let isCancelled = false;

    const loadDraftRecords = async () => {
      try {
        const firstPage = await getRecords({ status: "DRAFT", page: 0, size: 1 });
        if (isCancelled) return;

        if (firstPage.data.totalElements === 0) {
          setDraftRecords([]);
          setRecordCount(MIN_RECORD_COUNT);
          return;
        }

        const recordsPage = await getRecords({
          status: "DRAFT",
          page: 0,
          size: firstPage.data.totalElements,
        });
        if (isCancelled) return;

        setDraftRecords(recordsPage.data.content);
        setRecordCount(Math.min(recordsPage.data.totalElements, MAX_RECORD_COUNT));
      } catch {
        if (!isCancelled) setRecordsError("기록 중인 기록을 불러오지 못했어요.");
      } finally {
        if (!isCancelled) setIsLoadingRecords(false);
      }
    };

    void loadDraftRecords();
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleStart = () => {
    const recordIds = [...draftRecords]
      .sort(() => Math.random() - 0.5)
      .slice(0, recordCount)
      .map(record => record.id);

    navigate("/immersion/record", {
      state: {
        focusMinutes: parsedFocusMinutes,
        recordCount,
        recordIds,
      },
    });
  };

  const handleFocusMinutesChange = (value: string) => {
    if (/^\d{0,3}$/.test(value)) {
      setFocusMinutes(value);
    }
  };

  return (
    <ImmersionPageLayout className="flex flex-col items-center justify-center gap-2.5 px-6 py-10">
      <div className="absolute left-6 top-6 z-10">
        <ImmersionToggle
          isOn
          onToggle={(nextIsOn) => {
            if (!nextIsOn) onRequestExit();
          }}
        />
      </div>
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
              disabled={recordCount >= availableRecordCount}
              icon={<AddIcon className="size-2.5" />}
              onClick={() => setRecordCount((count) => count + 1)}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-start gap-2">
              <h2 className="w-full text-sub1-sb text-grey-0">시간</h2>
              <p className="text-body2-md text-grey-200">
                최대 120분까지 설정할 수 있어요.
              </p>
            </div>

            <label className="flex h-12 w-[131px] items-center gap-2.5 rounded-[14px] border-[1.5px] border-[#4E5C7C] p-4">
              <span className="flex min-w-0 flex-1 items-center justify-between">
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label="몰입 시간"
                  aria-invalid={focusMinutesError !== null}
                  className="w-0 min-w-0 flex-1 bg-transparent text-title2 text-grey-0 outline-none"
                  value={focusMinutes}
                  onChange={(event) =>
                    handleFocusMinutesChange(event.target.value)
                  }
                />
                <span className="shrink-0 text-body-reading2-md text-grey-400">
                  분
                </span>
              </span>
            </label>
          </div>

          {focusMinutesError && (
            <p role="alert" className="w-full text-body3-r text-error-text">
              {focusMinutesError}
            </p>
          )}
        </div>

        <Button
          label="기록 시작"
          disabled={
            focusMinutesError !== null ||
            isLoadingRecords ||
            recordsError !== null ||
            availableRecordCount === 0
          }
          onClick={handleStart}
        />
        {recordsError && (
          <p role="alert" className="w-full text-body3-r text-error-text">
            {recordsError}
          </p>
        )}
      </section>
    </ImmersionPageLayout>
  );
}
