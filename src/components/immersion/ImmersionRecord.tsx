import { useEffect, useMemo, useState } from "react";
import PolygonIcon from "@/assets/polygon.svg";
import { Button } from "@/components/common/button";
import { ImmersionToggle } from "@/components/home/ImmersionToggle";
import { ImmersionProgress } from "@/components/immersion/ImmersionProgress";
import { ImmersionPageLayout } from "@/components/immersion/ImmersionPageLayout";
import { ImmersionTimer } from "@/components/immersion/ImmersionTimer";
import { ImmersionMemoPanel } from "@/components/immersion/ImmersionMemoPanel";
import { RecordTemplateForm } from "@/components/record/RecordTemplateForm";
import { MemoSelectModal } from "@/components/record/MemoSelectModal";
import {
  getRecordDetail,
  type RecordDetail,
  type RecordMemo,
} from "@/api/records";
import type { TemplateQuestion } from "@/constants/templates";
import type { Memo } from "@/types/memo";

interface ImmersionRecordProps {
  focusMinutes: number;
  onRequestExit: () => void;
  recordCount: number;
  recordIds: string[];
}

export function ImmersionRecord({
  focusMinutes,
  onRequestExit,
  recordCount,
  recordIds,
}: ImmersionRecordProps) {
  const [records, setRecords] = useState<RecordDetail[]>([]);
  const [currentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [memos, setMemos] = useState<RecordMemo[]>([]);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(recordIds.length > 0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const currentRecord = records[currentIndex];
  const questions = useMemo<TemplateQuestion[]>(
    () =>
      [...(currentRecord?.answers ?? [])]
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map((answer) => ({
          id: answer.templateQuestionId,
          label: answer.questionText,
          description: answer.questionDescription ?? undefined,
          required: answer.required,
        })),
    [currentRecord],
  );
  const selectedMemos = useMemo<Memo[]>(
    () => memos.map(memo => ({
      id: memo.memoId,
      date: memo.createdAt.slice(0, 10).replace(/-/g, "."),
      dDay: "",
      title: memo.title,
      tag: currentRecord?.activityTitle ?? "",
      content: memo.content,
    })),
    [currentRecord?.activityTitle, memos],
  );

  const handleSelectMemos = (selectedMemos: Memo[]) => {
    const existingMemos = new Map(memos.map(memo => [memo.memoId, memo]));

    setMemos(selectedMemos.map((selectedMemo, index) => {
      const existingMemo = existingMemos.get(selectedMemo.id);
      if (existingMemo) return existingMemo;

      return {
        memoId: selectedMemo.id,
        activityId: "",
        title: selectedMemo.title,
        content: selectedMemo.content,
        color: "",
        important: false,
        sortOrder: index,
        collapsed: true,
        createdAt: selectedMemo.date.replace(/\./g, "-") + "T00:00:00",
        expiresAt: null,
      };
    }));
    setIsMemoModalOpen(false);
  };

  useEffect(() => {
    let isCancelled = false;

    const loadRecords = async () => {
      if (recordIds.length === 0) {
        setLoadError("선택된 기록이 없어요.");
        return;
      }

      try {
        const responses = await Promise.all(
          recordIds.map((recordId) => getRecordDetail(recordId)),
        );
        if (!isCancelled) {
          const loadedRecords = responses.map((response) => response.data);
          const firstRecord = loadedRecords[0];

          setRecords(loadedRecords);
          setMemos(firstRecord?.memos ?? []);
          setAnswers(
            Object.fromEntries(
              (firstRecord?.answers ?? []).map((answer) => [
                answer.templateQuestionId,
                answer.answerText,
              ]),
            ),
          );
        }
      } catch {
        if (!isCancelled) setLoadError("기록을 불러오지 못했어요.");
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    void loadRecords();
    return () => {
      isCancelled = true;
    };
  }, [recordIds]);

  return (
    <ImmersionPageLayout className="px-6 py-6">
      <header className="relative flex w-full items-center justify-between">
        <ImmersionToggle
          isOn
          onToggle={(nextIsOn) => {
            if (!nextIsOn) onRequestExit();
          }}
        />
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
                {currentRecord?.activityTitle ?? "활동"}
              </span>
              <span className="flex size-6 items-center justify-center px-1 py-2">
                <PolygonIcon className="h-2.5 w-3 text-grey-100" />
              </span>
              <span className="text-body2-md text-grey-100">
                {currentRecord?.templateTitle ?? "템플릿"}
              </span>
            </nav>

            <div className="flex w-full items-center justify-between px-1">
              <h1 className="w-full max-w-[452px] text-title1 text-grey-0">
                {currentRecord?.title ?? "기록을 불러오는 중이에요."}
              </h1>
              <Button label="저장하고 다음 기록" size="compact" />
            </div>
          </div>

          <div className="flex min-h-[678px] w-full items-start gap-6">
            <ImmersionMemoPanel
              activityTitle={currentRecord?.activityTitle ?? ""}
              memos={memos}
              onRemove={(memoId) => {
                setMemos((previous) =>
                  previous.filter((memo) => memo.memoId !== memoId),
                );
              }}
              onRequestSelect={() => setIsMemoModalOpen(true)}
            />
            <section
              aria-label="기록 입력"
              className="flex min-h-[678px] min-w-0 flex-1 flex-col items-start gap-10 rounded-[32px] bg-[rgba(0,17,78,0.35)] p-6"
            >
              {isLoading ? (
                <p className="text-body2-md text-grey-200">
                  기록을 불러오는 중...
                </p>
              ) : loadError ? (
                <p role="alert" className="text-body2-md text-error-text">
                  {loadError}
                </p>
              ) : (
                <RecordTemplateForm
                  answers={answers}
                  onAnswerChange={(questionId, value) => {
                    setAnswers((previous) => ({
                      ...previous,
                      [questionId]: value,
                    }));
                  }}
                  questions={questions}
                  variant="immersion"
                />
              )}
            </section>
          </div>
        </div>

        <ImmersionProgress
          currentIndex={currentIndex}
          totalCount={recordCount}
        />
      </div>

      <MemoSelectModal
        isOpen={isMemoModalOpen}
        selectedMemos={selectedMemos}
        onClose={() => setIsMemoModalOpen(false)}
        onSelect={handleSelectMemos}
        variant="immersion"
      />
    </ImmersionPageLayout>
  );
}
