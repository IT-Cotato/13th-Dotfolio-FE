import { useEffect, useState } from 'react';
import { Card } from '@/components/common/card';
import AiStarIcon from '@/assets/ai_star.svg';
import VectorDownIcon from '@/assets/vector_down.svg';
import VectorUpIcon from '@/assets/vector_up.svg';

const EXAMPLES = [
  '해당 직무에서 열심히 공부했던 경험에 대해 서술하시오.',
  '팀원과 갈등이 생겼을 때 어떻게 해결했는지 서술하시오.',
  '목표를 달성하기 위해 노력했던 경험을 구체적으로 서술하시오.',
  '리더십을 발휘했던 경험에 대해 서술하시오.',
  '데이터를 활용하여 문제를 해결한 경험을 서술하시오.',
];

const MATCHED_RECORDS = [
  {
    id: 1,
    activity: '창업 동아리 활동',
    title: '첫 팀 미팅 및 아이디어 브레인스토밍',
    date: '2026.05.29',
    tag: '협업 · 갈등',
    score: 100,
  },
  {
    id: 2,
    activity: '경영 동아리 활동',
    title: '서비스 개선 방향 팀 회의',
    date: '2026.05.21',
    tag: '문제해결 · 성과',
    score: 96,
  },
  {
    id: 3,
    activity: '교내 프로젝트',
    title: '사용자 데이터 분석 및 결과 공유',
    date: '2026.05.12',
    tag: '데이터 분석',
    score: 92,
  },
];

const DETAIL_STEPS = [
  ['상황', '신규 프로젝트를 시작하며 팀원들과 첫 미팅을 진행했습니다. 각자 다른 배경과 전공을 가진 4명이 모여 아이디어를 도출해야 했습니다.'],
  ['대응', '각자의 강점을 살리는 역할 분담을 제안했습니다. 브레인스토밍 세션을 통해 모든 의견을 경청하고, 공통 목표를 설정했습니다.'],
  ['소통', '매일 30분씩 온라인 회의를 진행하고, 진행 상황을 공유했습니다.'],
  ['결과', '각자의 강점을 살린 결과, 예상보다 빠르게 프로젝트를 완료했습니다. 팀원들과 서로의 역량을 존중하게 되었습니다.'],
] as const;

type MatchingStatus = 'idle' | 'analyzing' | 'complete';

export default function MyStoryAiMatching() {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<MatchingStatus>('idle');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (status !== 'analyzing') return;
    const timer = window.setTimeout(() => {
      setStatus('complete');
      setExpandedId(1);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [status]);

  const chooseExample = (example: string) => {
    setPrompt(example);
    setStatus('idle');
    setExpandedId(null);
  };

  const startMatching = () => {
    if (!prompt.trim() || status === 'analyzing') return;
    setStatus('analyzing');
    setExpandedId(null);
  };

  return (
    <Card className="items-stretch gap-0 rounded-t-[36px] p-6">
      <header>
        <div className="flex items-center gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary-500">
            <AiStarIcon className="size-4" />
          </span>
          <h1 className="text-title1 text-grey-900">AI 기록 매칭</h1>
        </div>
        <p className="ml-10 mt-1 text-body2-md text-grey-500">경험을 묻는 자소서 문항을 입력하면 AI가 관련도 높은 기록을 찾아드립니다.</p>
      </header>

      <div className="relative mt-8 flex h-[98px] items-end rounded-[14px] border border-grey-100 bg-white p-4">
        <textarea
          value={prompt}
          onChange={event => {
            setPrompt(event.target.value);
            if (status !== 'idle') {
              setStatus('idle');
              setExpandedId(null);
            }
          }}
          placeholder="예) 해당 직무에서 열심히 공부했던 경험에 대해 서술하시오."
          aria-label="자소서 문항"
          className="h-full min-w-0 flex-1 resize-none bg-transparent pr-5 text-body2-md text-grey-900 outline-none placeholder:text-grey-400"
        />
        <button
          type="button"
          onClick={startMatching}
          disabled={!prompt.trim() || status !== 'idle'}
          className={`flex shrink-0 items-center justify-center gap-2 rounded-[14px] px-5 py-2.5 text-label2-sb text-white transition-colors ${
            prompt.trim() && status === 'idle' ? 'cursor-pointer bg-primary-500' : 'cursor-default bg-grey-300'
          }`}
        >
          <AiStarIcon className="size-4" />
          {status === 'analyzing' ? '분석 중' : status === 'complete' ? '매칭 완료' : '매칭'}
        </button>
      </div>

      <section className="mt-8">
        <h2 className="text-body2-md text-grey-700">예시 문항</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map(example => (
            <button
              type="button"
              key={example}
              onClick={() => chooseExample(example)}
              className="cursor-pointer rounded-xl border border-primary-100 bg-primary-50 px-4 py-2 text-label2-sb text-primary-500 transition-colors hover:bg-primary-100"
            >
              {example}
            </button>
          ))}
        </div>
      </section>

      {status === 'analyzing' && (
        <div className="grid min-h-[330px] place-items-center text-center">
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
        <section className="mt-8">
          <h2 className="text-title2 text-grey-900">매칭된 기록 {MATCHED_RECORDS.length}</h2>
          <div className="mt-4 flex flex-col gap-4">
            {MATCHED_RECORDS.map(record => (
              <MatchedRecord
                key={record.id}
                record={record}
                expanded={record.id === expandedId}
                onToggle={() => setExpandedId(current => current === record.id ? null : record.id)}
              />
            ))}
          </div>
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
  record: typeof MATCHED_RECORDS[number];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="rounded-2xl border border-grey-100 bg-white p-5">
      <button type="button" onClick={onToggle} className="w-full cursor-pointer text-left">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-grey-600 px-3 py-1 text-label3-md text-white"># {record.activity}</span>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-body2-md text-grey-900">{record.title}</h3>
              <time className="text-body3-md text-grey-500">{record.date}</time>
            </div>
            <span className="mt-3 inline-flex rounded-lg bg-category-purple-bg px-3 py-1 text-label3-md text-category-purple-text">{record.tag}</span>
          </div>
          {expanded ? (
            <VectorUpIcon className="mt-2 h-[7px] w-[14px] shrink-0" />
          ) : (
            <VectorDownIcon className="mt-2 h-[7px] w-[14px] shrink-0" />
          )}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-label3-md text-primary-500">
          <span className="h-1 w-[52px] overflow-hidden rounded-full bg-grey-100">
            <span className="block h-full rounded-full bg-primary-500" style={{ width: `${record.score}%` }} />
          </span>
          {record.score}%
        </div>
      </button>

      {expanded && (
        <div className="mt-5 grid gap-3">
          {DETAIL_STEPS.map(([label, text], index) => (
            <div key={label} className="flex gap-4 rounded-xl border border-grey-100 px-4 py-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary-500 text-label3-sb text-white">{index + 1}</span>
              <div className="min-w-0">
                <h4 className="text-body3-md text-grey-900">{label}</h4>
                <p className="mt-1 text-body3-md text-grey-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
