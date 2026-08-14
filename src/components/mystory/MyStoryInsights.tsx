import { useCallback, useEffect, useState } from 'react';
import LottieLib from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import {
  createInsight,
  getInsightEligibility,
  getInsightGenerationStatus,
  getLatestInsight,
  type InsightEligibilityResponse,
  type InsightJobRecommendationResponse,
  type InsightStrengthResponse,
  type LatestInsightResponse,
} from '@/api/insight';
import { ApiError } from '@/api/client';
import { getRecords } from '@/api/records';
import { Button } from '@/components/common/button';
import { Card } from '@/components/common/card';
import { Toast } from '@/components/common/Toast';
import { useToast } from '@/hooks/useToast';
import AiRecordIcon from '@/assets/ai_record.svg';
import AiStarIcon from '@/assets/ai_star.svg';
import loadingBlueAnimation from '@/assets/Loading_blue.json';

const Lottie =
  (LottieLib as unknown as { default: typeof LottieLib }).default ?? LottieLib;

const DOCUMENT_ICON_URL = new URL('../../assets/document.png', import.meta.url).href;
const BRIEFCASE_ICON_URL = new URL('../../assets/briefcase.png', import.meta.url).href;

const COLORS = ['#4F72F8', '#7C5CF6', '#0EA5E9', '#EC4899', '#A855F7'];
const POSITIONS = [
  { top: 14, left: '35%' },
  { top: 40, left: '65%' },
  { top: 116, left: '83%' },
  { top: 142, left: '50%' },
  { top: 105, left: '17%' },
];

const getErrorMessage = (error: unknown, fallback: string) => (
  error instanceof Error ? error.message : fallback
);

const formatPercent = (ratio: number) => Math.round(Math.max(0, Math.min(1, ratio)) * 100);

const formatNextAvailable = (value: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function MyStoryInsights() {
  const navigate = useNavigate();
  const [eligibility, setEligibility] = useState<InsightEligibilityResponse | null>(null);
  const [insight, setInsight] = useState<LatestInsightResponse | null>(null);
  const [completedRecordCount, setCompletedRecordCount] = useState(0);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [pollingAttempt, setPollingAttempt] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [selectedStrengthId, setSelectedStrengthId] = useState<string | null>(null);
  const [selectedCompetencyId, setSelectedCompetencyId] = useState<string | null>(null);
  const { toast, fireToast } = useToast();

  const loadInsights = useCallback(async (signal?: AbortSignal) => {
    const [nextEligibility, completedRecords] = await Promise.all([
      getInsightEligibility(signal),
      getRecords({ status: 'COMPLETED', page: 0, size: 1 }),
    ]);
    setEligibility(nextEligibility);
    setCompletedRecordCount(completedRecords.data.totalElements);

    try {
      const latest = await getLatestInsight(signal);
      setInsight(latest);
      if (latest.currentGeneration) setGenerationId(latest.currentGeneration.generationId);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setInsight(null);
        return;
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve()
      .then(() => loadInsights(controller.signal))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(getErrorMessage(error, '인사이트를 불러오지 못했습니다.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [loadInsights]);

  useEffect(() => {
    if (!generationId) return;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      getInsightGenerationStatus(generationId, controller.signal)
        .then(async (generation) => {
          if (generation.status === 'COMPLETED') {
            setGenerationId(null);
            await loadInsights(controller.signal);
            fireToast('새로운 인사이트가 생성되었습니다.');
          } else if (generation.status === 'FAILED') {
            setGenerationId(null);
            fireToast(generation.failureMessage || '인사이트 생성에 실패했습니다.', undefined, 'error');
            await loadInsights(controller.signal);
          } else {
            setPollingAttempt((attempt) => attempt + 1);
          }
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            setGenerationId(null);
            fireToast(getErrorMessage(error, '인사이트 생성 상태를 확인하지 못했습니다.'), undefined, 'error');
          }
        });
    }, 2000);
    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [fireToast, generationId, loadInsights, pollingAttempt]);

  useEffect(() => {
    if (generationId || eligibility?.reason !== 'GENERATION_IN_PROGRESS') return;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      loadInsights(controller.signal).catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(getErrorMessage(error, '인사이트 생성 상태를 확인하지 못했습니다.'));
        }
      });
    }, 2000);
    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [eligibility, generationId, loadInsights]);

  const handleCreate = async () => {
    if (!eligibility?.eligible || isCreating || generationId) return;
    setIsCreating(true);
    try {
      const generation = await createInsight();
      setGenerationId(generation.generationId);
      setPollingAttempt(0);
      fireToast('인사이트 생성을 시작했습니다.');
    } catch (error) {
      fireToast(getErrorMessage(error, '인사이트 생성을 요청하지 못했습니다.'), undefined, 'error');
      try {
        setEligibility(await getInsightEligibility());
      } catch {
        // 생성 요청 오류를 우선 표시합니다.
      }
    } finally {
      setIsCreating(false);
    }
  };

  const selectedStrength = insight?.strengths.find((item) => item.strengthTagId === selectedStrengthId);
  const selectedRecommendation = insight?.recommendations.find((item) => item.jobCompetencyId === selectedCompetencyId);
  const generating = Boolean(generationId) || isCreating || eligibility?.reason === 'GENERATION_IN_PROGRESS';

  if (isLoading) {
    return <MessageCard message="인사이트를 불러오는 중..." />;
  }

  if (loadError) {
    return (
      <Card className="relative items-stretch gap-0 rounded-t-[36px] p-6">
        <h1 className="text-title1 text-grey-900">인사이트</h1>
        <div className="grid min-h-[55vh] place-items-center text-center">
          <div>
            <p role="alert" className="text-body2-md text-error-text">{loadError}</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-xl border border-primary-500 px-4 py-2 text-primary-500">다시 시도</button>
          </div>
        </div>
      </Card>
    );
  }

  if (!insight) {
    return (
      <div className="relative h-full">
        {toast && <div className="fixed left-1/2 top-5 z-[100] -translate-x-1/2"><Toast message={toast.message} variant={toast.variant} /></div>}
        <InsightsReadyState
          eligibility={eligibility}
          recordCount={completedRecordCount}
          onCreate={() => void handleCreate()}
          generating={generating}
        />
      </div>
    );
  }

  return (
    <Card className="relative items-stretch gap-0 rounded-t-[36px] p-6">
      {toast && <div className="fixed left-1/2 top-5 z-[100] -translate-x-1/2"><Toast message={toast.message} variant={toast.variant} /></div>}
      <h1 className="mb-6 text-title1 text-grey-900">인사이트</h1>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,464px)_1fr]">
        <InsightUpdateCard
          insight={insight}
          eligibility={eligibility}
          generating={generating}
          onCreate={() => void handleCreate()}
        />
        <section className="rounded-2xl border border-grey-100 p-6">
          <h2 className="text-title2 text-grey-900">기록 템플릿 분포</h2>
          <p className="mt-1 text-body3-md text-grey-500">어떤 유형의 기록을 주로 남기는지 볼 수 있어요.</p>
          <div className="mt-6 grid gap-4">
            {insight.templates.map((template, index) => {
              const percent = formatPercent(template.ratio);
              const color = COLORS[index % COLORS.length];
              return (
                <div key={template.templateId}>
                  <div className="mb-2 flex justify-between text-body3-md text-grey-800"><span>{template.templateName}</span><strong style={{ color }}>{percent}%</strong></div>
                  <div className="h-2 overflow-hidden rounded-full bg-grey-100"><span className="block h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} /></div>
                </div>
              );
            })}
          </div>
          {insight.templates[0] && <p className="mt-6 flex items-center gap-2 text-body3-md text-grey-500"><AiStarBadge />[{insight.templates[0].templateName}] 중심의 기록을 가장 많이 남기고 있어요.</p>}
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-grey-100 p-6">
        <div className="flex items-start justify-between">
          <div><h2 className="text-title2 text-grey-900">Top 5 강점</h2><p className="mt-1 text-body3-md text-grey-500">AI가 {insight.analyzedRecordCount}개의 기록을 분석하여 도출한 핵심 강점이에요.</p></div>
          {selectedStrength && <button type="button" onClick={() => setSelectedStrengthId(null)} className="cursor-pointer text-body3-md text-grey-500">전체 강점보기</button>}
        </div>
        {selectedStrength ? (
          <StrengthDetail strength={selectedStrength} />
        ) : insight.strengths.length ? (
          <div className="relative mx-auto mt-6 h-[310px] w-full max-w-[900px]">
            {insight.strengths.map((strength, index) => <StrengthBubble key={strength.strengthTagId} strength={strength} index={index} onClick={() => setSelectedStrengthId(strength.strengthTagId)} />)}
          </div>
        ) : <p className="py-20 text-center text-body2-md text-grey-500">분석된 강점이 없습니다.</p>}
        <p className="mt-3 flex items-center gap-2 text-body3-md text-grey-400"><AiStarBadge />강점을 클릭하면 연결된 경험을 탐색할 수 있습니다</p>
      </section>

      <section className="mt-4 rounded-2xl border border-grey-100 p-6">
        <h2 className="text-title2 text-grey-900">직무역량 <span className="text-primary-500">[희망 직무: {insight.job.jobName}]</span></h2>
        <p className="mt-1 text-body3-md text-grey-500">사용자의 경험 중 희망 직무 역량을 가장 잘 보여주는 경험을 추천해요.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {insight.recommendations.map((recommendation) => (
            <button type="button" key={recommendation.jobCompetencyId} onClick={() => setSelectedCompetencyId((current) => current === recommendation.jobCompetencyId ? null : recommendation.jobCompetencyId)} aria-pressed={selectedCompetencyId === recommendation.jobCompetencyId} className={`flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[14px] px-5 text-body2-md transition-colors ${selectedCompetencyId === recommendation.jobCompetencyId ? 'border border-primary-500 bg-primary-500 text-white' : 'border border-grey-100 bg-white text-grey-900'}`}>
              {selectedCompetencyId === recommendation.jobCompetencyId && <span aria-hidden className="text-[22px] leading-none">✓</span>}{recommendation.competencyName}
            </button>
          ))}
        </div>
        {generating ? (
          <JobCompetencyLoading />
        ) : selectedRecommendation?.navigationAvailable ? (
          <RecommendationCard recommendation={selectedRecommendation} onOpen={() => navigate(`/record?recordId=${selectedRecommendation.recordId}`)} />
        ) : selectedCompetencyId || insight.recommendations.length === 0 ? (
          <JobCompetencyEmpty />
        ) : (
          <div className="mt-6 grid min-h-[220px] place-items-center rounded-2xl bg-grey-50 text-center text-body3-md leading-6 text-grey-600">원하는 역량을 선택하면<br />AI가 추천하는 대표 경험을 보여줍니다.</div>
        )}
      </section>
    </Card>
  );
}

function MessageCard({ message }: { message: string }) {
  return <Card className="relative items-stretch gap-0 rounded-t-[36px] p-6"><h1 className="text-title1 text-grey-900">인사이트</h1><div className="grid min-h-[55vh] place-items-center text-body2-md text-grey-500">{message}</div></Card>;
}

function InsightsReadyState({ eligibility, recordCount, onCreate, generating }: { eligibility: InsightEligibilityResponse | null; recordCount: number; onCreate: () => void; generating: boolean }) {
  const requiredCount = eligibility?.requiredRecordCount ?? 10;
  const jobConfigured = eligibility?.reason !== 'JOB_NOT_CONFIGURED';
  return (
    <Card className="relative items-stretch gap-0 rounded-t-[36px] p-6">
      <h1 className="text-title1 text-grey-900">인사이트</h1>
      <div className="grid min-h-[55vh] place-items-center px-6 text-center">
        <div className="translate-y-20">
          <h2 className="text-sub1-sb text-grey-950">AI 인사이트를 시작하기 위한 준비</h2>
          <div className="mx-auto mt-4 w-fit rounded-xl bg-grey-50 px-5 py-4 text-body-reading2-md text-grey-800"><p>⚙️ 직무 설정하기 {jobConfigured ? '✓' : '(마이페이지에서 설정해주세요)'}</p><p>📋 기록 {requiredCount}개 쌓기 (현재 {recordCount}개 / {requiredCount}개)</p></div>
          <p className="mt-4 text-body2-md text-grey-700">희망 직무를 설정하고 기록을 채우시면,<br />맞춤형 강점과 역량을 분석해드려요.</p>
          {(eligibility?.eligible || generating) && <div className="mx-auto mt-6 w-56"><Button label={generating ? '인사이트 생성 중...' : '인사이트 생성'} disabled={generating} onClick={onCreate} /></div>}
        </div>
      </div>
    </Card>
  );
}

function InsightUpdateCard({ insight, eligibility, generating, onCreate }: { insight: LatestInsightResponse; eligibility: InsightEligibilityResponse | null; generating: boolean; onCreate: () => void }) {
  const disabled = generating || !eligibility?.eligible;
  const buttonLabel = generating ? '인사이트 생성 중...' : eligibility?.reason === 'COOLDOWN' ? formatNextAvailable(eligibility.nextAvailableAt) : '새로운 인사이트 생성';
  return (
    <section className="flex min-h-[352px] flex-col rounded-2xl border border-grey-100 p-6">
      <h2 className="text-title2 text-grey-900">새로운 인사이트</h2><p className="mt-1 text-body3-md text-grey-500">마지막 업데이트 이후 변경사항이 있어요.</p>
      <div className="mt-6 grid gap-2">
        <div className="flex items-center gap-3 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-white"><img src={DOCUMENT_ICON_URL} alt="" className="size-5" /></span><div><span className="text-label3-md text-grey-500">새 기록</span><strong className="block text-label2-sb text-grey-900">{insight.changes.newCompletedRecordCount}개 추가됨</strong></div></div>
        <div className="flex items-center gap-3 rounded-xl border border-category-pink bg-category-pink-bg px-4 py-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-white"><img src={BRIEFCASE_ICON_URL} alt="" className="size-5" /></span><div><span className="text-label3-md text-grey-500">희망 직무</span><strong className="block text-label2-sb text-grey-900">{insight.changes.desiredJobChanged ? '변경됨' : insight.job.jobName}</strong></div></div>
      </div>
      <div className="mt-auto pt-6"><Button disabled={disabled} onClick={onCreate} label={buttonLabel || '새로운 인사이트 생성'} /></div>
      {!eligibility?.eligible && eligibility?.reason === 'NO_CHANGES' && <p className="mt-2 text-center text-label3-md text-grey-500">새로운 변경사항이 없습니다.</p>}
    </section>
  );
}

function StrengthBubble({ strength, index, onClick }: { strength: InsightStrengthResponse; index: number; onClick: () => void }) {
  const color = COLORS[index % COLORS.length];
  const position = POSITIONS[index % POSITIONS.length];
  const core = Math.round(52 + Math.max(0, Math.min(1, strength.ratio)) * 48);
  return <button type="button" onClick={onClick} className="absolute -translate-x-1/2 cursor-pointer text-center" style={{ left: position.left, top: position.top }}><span className="relative mx-auto grid place-items-center rounded-full" style={{ width: core + 38, height: core + 38, backgroundColor: `${color}19` }}><span className="grid place-items-center rounded-full text-body2-md text-white" style={{ width: core, height: core, background: `radial-gradient(circle, ${color} 0%, ${color} 42%, ${color}99 72%, ${color}1A 100%)`, boxShadow: `0 0 10px 4px ${color}40` }}>{strength.rank <= 3 ? strength.rank : ''}</span></span><strong className="mt-1 block text-body3-md" style={{ color }}>{strength.strengthName}</strong><span className="text-label3-md text-grey-500">{strength.recordCount}개</span></button>;
}

function StrengthDetail({ strength }: { strength: InsightStrengthResponse }) {
  const navigate = useNavigate();
  const color = COLORS[(strength.rank - 1) % COLORS.length];
  return <div className="mt-6 grid min-h-[330px] gap-6 md:grid-cols-2"><div className="grid place-items-center rounded-2xl bg-grey-50"><div className="text-center"><span className="mx-auto grid size-32 place-items-center rounded-full text-white" style={{ background: `radial-gradient(circle, ${color}, ${color}33 68%, transparent 72%)` }}>{strength.rank}</span><strong className="mt-2 block text-title2" style={{ color }}>{strength.strengthName}</strong><span className="text-body3-md text-grey-500">{strength.recordCount}개 · 평균 {formatPercent(strength.averageScore)}점</span></div></div><div className="rounded-2xl bg-grey-50 p-6"><div className="rounded-xl bg-primary-50 p-4 text-label1-md text-grey-900"><span className="mb-2 flex items-center gap-2 text-label2-md text-primary-500"><AiStarBadge /> AI 분석</span><strong>전체 분석 기록의 {formatPercent(strength.ratio)}%에서 나타난 강점입니다.</strong></div><h3 className="mt-5 text-body2-md text-grey-600">연결된 기록 ({strength.records.length})</h3>{strength.records.map((record) => <button type="button" disabled={!record.navigationAvailable} key={record.recordId} onClick={() => navigate(`/record?recordId=${record.recordId}`)} className="flex w-full cursor-pointer items-center justify-between border-b border-grey-100 py-4 text-left text-body2-md text-grey-900 disabled:cursor-default disabled:text-grey-400"><span>{record.recordTitle}</span><AiRecordIcon className="size-4 shrink-0" /></button>)}</div></div>;
}

function RecommendationCard({ recommendation, onOpen }: { recommendation: InsightJobRecommendationResponse; onOpen: () => void }) {
  return <div className="mt-6 rounded-2xl bg-grey-50 p-6"><h3 className="text-sub1-sb text-grey-900">{recommendation.recordTitle}</h3><p className="mt-2 text-body3-md text-grey-500">{recommendation.templateName}</p><div className="mt-6 flex items-center gap-5 border-t border-grey-100 pt-6"><span className="flex shrink-0 items-center gap-2 text-body3-md text-grey-500"><AiStarBadge /> AI 추천 이유</span><p className="text-body2-md text-grey-700">{recommendation.reason}</p><button type="button" disabled={!recommendation.navigationAvailable} onClick={onOpen} aria-label="추천 기록 보기" className="ml-auto shrink-0 cursor-pointer text-primary-500 disabled:cursor-default disabled:text-grey-300"><AiRecordIcon className="size-5" /></button></div></div>;
}

function JobCompetencyLoading() {
  return (
    <div
      className="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-2xl bg-grey-50 px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <Lottie
        animationData={loadingBlueAnimation}
        autoplay
        loop
        className="size-20 shrink-0"
      />
      <p className="mt-2 text-body2-md text-grey-700">직무 역량과 딱 맞는 나의 경험을 연결하는 중이에요.</p>
      <p className="mt-1 text-body3-md text-grey-500">쌓인 기록이 많다면 잠시만 기다려 주세요!</p>
    </div>
  );
}

function JobCompetencyEmpty() {
  return (
    <div className="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-2xl bg-grey-50 px-6 text-center">
      <p className="text-body2-md text-grey-700">아직 이 역량을 보여줄 기록이 없어요.</p>
      <p className="mt-2 text-body3-md text-grey-500">새로운 경험을 쌓고 기록으로 남겨보세요!</p>
    </div>
  );
}

function AiStarBadge() {
  return <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-primary-50"><AiStarIcon className="size-4 text-primary-500" /></span>;
}
