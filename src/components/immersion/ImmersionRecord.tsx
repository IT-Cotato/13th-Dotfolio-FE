import { useEffect, useMemo, useRef, useState } from "react";
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
  updateRecord,
  type RecordDetail,
  type RecordMemo,
} from "@/api/records";
import { ApiError } from "@/api/client";
import { getMemos } from "@/api/memos";
import type { TemplateQuestion } from "@/constants/templates";
import type { Memo } from "@/types/memo";

interface ImmersionRecordProps {
  focusMinutes: number;
  onComplete: (completedCount: number) => void;
  onRequestExit: () => void;
  recordCount: number;
  recordIds: string[];
}

type ImmersionRecordMemo = RecordMemo & { activityTitle?: string };
type ImmersionRecordDetail = Omit<RecordDetail, "memos"> & {
  memos: ImmersionRecordMemo[];
};

const withMemoActivityTitles = (
  record: RecordDetail,
  activityTitles: Map<string, string>,
): ImmersionRecordDetail => ({
  ...record,
  memos: record.memos.map((memo) => ({
    ...memo,
    activityTitle: activityTitles.get(memo.memoId) ?? "",
  })),
});

export function ImmersionRecord({
  focusMinutes,
  onComplete,
  onRequestExit,
  recordCount,
  recordIds,
}: ImmersionRecordProps) {
  const [records, setRecords] = useState<ImmersionRecordDetail[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [memos, setMemos] = useState<ImmersionRecordMemo[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(recordIds.length > 0);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const memoActivityTitlesRef = useRef(new Map<string, string>());
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
      tag: memo.activityTitle ?? "",
      content: memo.content,
    })),
    [memos],
  );

  const handleSelectMemos = (selectedMemos: Memo[]) => {
    const existingMemos = new Map(memos.map(memo => [memo.memoId, memo]));
    memoActivityTitlesRef.current = new Map([
      ...memoActivityTitlesRef.current,
      ...selectedMemos.map((memo) => [memo.id, memo.tag] as const),
    ]);

    setMemos(selectedMemos.map((selectedMemo, index) => {
      const existingMemo = existingMemos.get(selectedMemo.id);
      if (existingMemo) {
        return { ...existingMemo, activityTitle: selectedMemo.tag };
      }

      return {
        memoId: selectedMemo.id,
        activityId: "",
        activityTitle: selectedMemo.tag,
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

  const applyRecord = (record: ImmersionRecordDetail) => {
    setAnswers(
      Object.fromEntries(
        record.answers.map((answer) => [
          answer.templateQuestionId,
          answer.answerText,
        ]),
      ),
    );
    setMemos(record.memos);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!currentRecord || isSaving) return;

    const isCompleted = currentRecord.answers
      .filter((answer) => answer.required)
      .every((answer) => (answers[answer.templateQuestionId] ?? "").trim());

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await updateRecord(currentRecord.id, {
        title: currentRecord.title,
        answers: currentRecord.answers.map((answer) => ({
          templateQuestionId: answer.templateQuestionId,
          answerText: answers[answer.templateQuestionId] ?? "",
        })),
        memos: memos.map((memo) => ({
          memoId: memo.memoId,
          collapsed: memo.collapsed,
        })),
        status: isCompleted ? "COMPLETED" : "DRAFT",
      });

      const nextCompletedCount = completedCount + (isCompleted ? 1 : 0);
      const savedRecord = withMemoActivityTitles(
        response.data,
        memoActivityTitlesRef.current,
      );
      setCompletedCount(nextCompletedCount);
      setRecords((previous) =>
        previous.map((record, index) =>
          index === currentIndex ? savedRecord : record,
        ),
      );

      const nextRecord = records[currentIndex + 1];
      if (!nextRecord) {
        onComplete(nextCompletedCount);
        return;
      }

      setCurrentIndex((index) => index + 1);
      applyRecord(nextRecord);
    } catch (error) {
      setSaveError(
        error instanceof ApiError
          ? error.message
          : "기록을 저장하지 못했어요. 다시 시도해 주세요.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const loadRecords = async () => {
      setIsLoading(true);
      setLoadError(null);

      if (recordIds.length === 0) {
        setLoadError("선택된 기록이 없어요.");
        setIsLoading(false);
        return;
      }

      try {
        const [responses, memosResponse] = await Promise.all([
          Promise.all(recordIds.map((recordId) => getRecordDetail(recordId))),
          getMemos().catch(() => null),
        ]);
        if (!isCancelled) {
          const activityTitles = new Map<string, string>(
            (memosResponse?.data ?? []).map((memo): [string, string] => [
              memo.id,
              memo.activityTitle ?? "",
            ]),
          );
          memoActivityTitlesRef.current = activityTitles;
          const loadedRecords = responses.map((response) =>
            withMemoActivityTitles(response.data, activityTitles),
          );
          const firstRecord = loadedRecords[0];

          setRecords(loadedRecords);
          setCurrentIndex(0);
          setCompletedCount(0);
          if (firstRecord) applyRecord(firstRecord);
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
              <div className="flex flex-col items-end gap-2">
                <Button
                  label={
                    isSaving
                      ? "저장 중..."
                      : currentIndex === records.length - 1
                        ? "저장"
                        : "저장하고 다음 기록"
                  }
                  size="compact"
                  disabled={isLoading || loadError !== null || !currentRecord || isSaving}
                  onClick={handleSave}
                />
                {saveError && (
                  <p role="alert" className="text-body3-r text-error-text">
                    {saveError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex min-h-[678px] w-full items-start gap-6">
            <ImmersionMemoPanel
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
                  key={currentRecord?.id}
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
          totalCount={records.length || recordCount}
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
