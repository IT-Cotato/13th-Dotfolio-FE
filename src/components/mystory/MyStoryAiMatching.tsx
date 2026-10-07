import { useEffect, useState } from 'react';
import {
  getMatchingQuestionTags,
  matchRecords,
  type MatchingQuestionTagResponse,
  type MatchingRecordResponse,
} from '@/api/matching';
import { Card } from '@/components/common/card';
import AiStarIcon from '@/assets/ai_star.svg';
import VectorDownIcon from '@/assets/vector_down.svg';
import VectorUpIcon from '@/assets/vector_up.svg';
import { MyStoryComingSoon } from '@/components/mystory/MyStoryComingSoon';

type MatchingStatus = 'idle' | 'analyzing' | 'complete';

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.replaceAll('-', '.');
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const getErrorMessage = (error: unknown, fallback: string) => (
  error instanceof Error ? error.message : fallback
);

export default function MyStoryAiMatching() {
  // 기존 AI 기록 매칭 화면을 다시 노출할 때 아래 렌더링으로 교체합니다.
  // return <MyStoryAiMatchingContent />;
  return <MyStoryComingSoon title="AI 기록 매칭" />;
}

export function MyStoryAiMatchingContent() {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<MatchingStatus>('idle');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [examples, setExamples] = useState<MatchingQuestionTagResponse[]>([]);
  const [matchedRecords, setMatchedRecords] = useState<MatchingRecordResponse[]>([]);
  const [error, setError] = useState('');
  const hasMatchedRecords = status === 'complete' && matchedRecords.length > 0;

  useEffect(() => {
    const controller = new AbortController();
    getMatchingQuestionTags(controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) setExamples(response.tags);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(requestError, '추천 문항을 불러오지 못했습니다.'));
        }
      });
    return () => controller.abort();
  }, []);

  const chooseExample = (example: string) => {
    setPrompt(example);
    setStatus('idle');
    setExpandedId(null);
    setMatchedRecords([]);
    setError('');
  };

  const startMatching = async () => {
    const question = prompt.trim();
    if (!question || status === 'analyzing') return;
    setStatus('analyzing');
    setExpandedId(null);
    setMatchedRecords([]);
    setError('');
    try {
      const response = await matchRecords(question, 3);
      setMatchedRecords(response.matchedRecords);
      setExpandedId(response.matchedRecords[0]?.recordId ?? null);
      setStatus('complete');
    } catch (requestError) {
      setStatus('idle');
      setError(getErrorMessage(requestError, 'AI 기록 매칭을 실행하지 못했습니다.'));
    }
  };

  return (
    <Card className="items-stretch gap-0 rounded-t-[24px] p-5 sm:rounded-t-[36px] sm:p-6">
      <header>
        <div className="flex items-center gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary-500">
            <AiStarIcon className="size-4" />
          </span>
          <h1 className="text-title1 text-grey-900">AI 기록 매칭</h1>
        </div>
        <p className="mt-2 text-body2-md text-grey-500 sm:ml-10 sm:mt-1">이력서·자소서 문항을 입력하면 AI가 관련 기록을 찾아드립니다.</p>
      </header>

      <div className="relative flex flex-col gap-3 rounded-[14px] border border-grey-100 bg-white p-3.5 sm:h-[98px] sm:flex-row sm:items-end sm:gap-0 sm:p-4">
        <textarea
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value);
            if (status !== 'idle') {
              setStatus('idle');
              setExpandedId(null);
              setMatchedRecords([]);
            }
            if (error) setError('');
          }}
          placeholder="예) 해당 직무에서 열심히 공부했던 경험에 대해 서술하시오."
          aria-label="자소서 문항"
          className="h-[112px] w-full min-w-0 resize-none bg-transparent text-body2-md leading-relaxed text-grey-900 outline-none placeholder:text-grey-400 sm:h-full sm:flex-1 sm:pr-5"
        />
        <button
          type="button"
          onClick={() => void startMatching()}
          disabled={!prompt.trim() || status === 'analyzing'}
          className={`flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-[14px] px-5 py-2.5 text-label2-sb text-white transition-colors sm:min-h-0 sm:w-auto ${
            prompt.trim() && status !== 'analyzing' ? 'cursor-pointer bg-primary-500' : 'cursor-default bg-grey-300'
          }`}
        >
          <AiStarIcon className="size-4" />
          {status === 'analyzing' ? '분석 중' : status === 'complete' ? '매칭 완료' : '매칭'}
        </button>
      </div>

      {error && <p role="alert" className="mt-3 text-body3-md text-error-text">{error}</p>}

      {!hasMatchedRecords && (
        <section className="mt-2">
          <h2 className="text-body2-md text-grey-700">예시 문항</h2>
          <div className="mt-4 flex flex-col items-stretch gap-2 sm:mt-5 sm:flex-row sm:flex-wrap">
            {examples.map((example) => (
              <button
                type="button"
                key={example.id}
                onClick={() => chooseExample(example.content)}
                className="min-h-11 w-full cursor-pointer whitespace-normal break-words rounded-xl border border-primary-100 bg-primary-50 px-3 py-2.5 text-left text-label2-sb leading-relaxed text-primary-500 transition-colors hover:bg-primary-100 sm:min-h-0 sm:w-auto sm:px-4 sm:py-2 sm:text-center"
              >
                {example.content}
              </button>
            ))}
          </div>
        </section>
      )}

      {status === 'analyzing' && (
        <div className="grid min-h-[330px] place-items-center text-center" aria-live="polite">
          <div>
            <span className="mx-auto mb-4 grid size-12 animate-pulse place-items-center rounded-2xl bg-primary-500">
              <AiStarIcon className="size-6" />
            </span>
            <p className="text-sub1-sb text-grey-900">관련 기록을 분석하고 있어요</p>
            <p className="mt-2 text-body2-md text-grey-500">입력한 문항과 가장 잘 맞는 경험을 찾는 중입니다.</p>
          </div>
        </div>
      )}

      {status === 'complete' && (
        <section className="mt-2">
          <h2 className="text-title2 text-grey-900">매칭된 기록 {matchedRecords.length}</h2>
          {matchedRecords.length === 0 ? (
            <p className="mt-8 text-center text-body2-md text-grey-500">관련 기록을 찾지 못했습니다.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {matchedRecords.map((record) => (
                <MatchedRecord
                  key={record.recordId}
                  record={record}
                  expanded={record.recordId === expandedId}
                  onToggle={() => setExpandedId((current) => current === record.recordId ? null : record.recordId)}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </Card>
  );
}

function MatchedRecord({
  record,
  expanded,
  onToggle,
}: {
  record: MatchingRecordResponse;
  expanded: boolean;
  onToggle: () => void;
}) {
  const score = Math.max(0, Math.min(100, Math.round(record.matchRate <= 1 ? record.matchRate * 100 : record.matchRate)));

  return (
    <article className="rounded-2xl border border-grey-100 bg-white p-4 sm:p-5">
      <button type="button" onClick={onToggle} className="w-full cursor-pointer text-left">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <span className="inline-flex max-w-full whitespace-normal break-words rounded-2xl bg-grey-600 px-3 py-1 text-label3-md text-white"># {record.activityTitle}</span>
            <div className="mt-3 flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
              <h3 className="break-words text-body2-md text-grey-900">{record.recordTitle}</h3>
              <time className="text-body3-md text-grey-500">{formatDate(record.recordDate)}</time>
            </div>
            <span className="mt-3 inline-flex max-w-full whitespace-normal break-words rounded-lg bg-category-purple-bg px-3 py-1 text-label3-md text-category-purple-text">{record.templateTitle || record.activityType}</span>
          </div>
          {expanded ? (
            <VectorUpIcon className="mt-2 h-[7px] w-[14px] shrink-0" />
          ) : (
            <VectorDownIcon className="mt-2 h-[7px] w-[14px] shrink-0" />
          )}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-label3-md text-primary-500">
          <span className="h-1 w-[52px] overflow-hidden rounded-full bg-grey-100">
            <span className="block h-full rounded-full bg-primary-500" style={{ width: `${score}%` }} />
          </span>
          {score}%
        </div>
      </button>

      {expanded && (
        <div className="mt-5 grid gap-3">
          {record.summary && <p className="rounded-xl bg-primary-50 px-4 py-3 text-body3-md text-grey-700">{record.summary}</p>}
          {record.answers.map((answer, index) => (
            <div key={`${answer.questionText}-${index}`} className="flex gap-4 rounded-xl border border-grey-100 px-4 py-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary-500 text-label3-sb text-white">{index + 1}</span>
              <div className="min-w-0">
                <h4 className="text-body3-md text-grey-900">{answer.questionText}</h4>
                <p className="mt-1 text-body3-md text-grey-600">{answer.answerText}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
