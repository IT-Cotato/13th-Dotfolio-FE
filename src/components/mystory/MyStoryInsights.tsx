import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createInsight,
  getInsightEligibility,
  getInsightGenerationStatus,
  getLatestInsight,
  type InsightEligibilityResponse,
  type LatestInsightResponse,
} from '@/api/insight';
import { ApiError } from '@/api/client';
import { getRecordDetail, getRecords } from '@/api/records';
import { Card } from '@/components/common/card';
import { Toast } from '@/components/common/Toast';
import { InsightJobCompetencySection } from '@/components/mystory/insights/InsightJobCompetencySection';
import { InsightOverviewSection } from '@/components/mystory/insights/InsightOverviewSection';
import { InsightsMessageCard, InsightsReadyState } from '@/components/mystory/insights/InsightsReadyState';
import { InsightStrengthSection } from '@/components/mystory/insights/InsightStrengthSection';
import { useToast } from '@/hooks/useToast';

const getErrorMessage = (error: unknown, fallback: string) => (
  error instanceof Error ? error.message : fallback
);

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
  const hasRequestedInitialInsight = useRef(false);
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
        .catch(async (error: unknown) => {
          if (!controller.signal.aborted) {
            if (error instanceof ApiError && error.status === 404) {
              try {
                await loadInsights(controller.signal);
                setGenerationId(null);
              } catch (loadError) {
                if (!controller.signal.aborted) {
                  setGenerationId(null);
                  fireToast(getErrorMessage(loadError, '인사이트 생성 상태를 확인하지 못했습니다.'), undefined, 'error');
                }
              }
              return;
            }

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

  const handleCreate = useCallback(async () => {
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
  }, [eligibility?.eligible, fireToast, generationId, isCreating]);

  const openRecord = useCallback(async (recordId: string) => {
    try {
      const response = await getRecordDetail(recordId);
      navigate(`/record/write/${response.data.templateId}`, {
        state: { recordId: response.data.id },
      });
    } catch (error) {
      fireToast(getErrorMessage(error, '연결된 기록을 불러오지 못했습니다.'), undefined, 'error');
    }
  }, [fireToast, navigate]);

  useEffect(() => {
    if (insight || !eligibility?.eligible || isCreating || generationId || hasRequestedInitialInsight.current) {
      return;
    }

    hasRequestedInitialInsight.current = true;
    void handleCreate();
  }, [eligibility?.eligible, generationId, handleCreate, insight, isCreating]);

  const generating = Boolean(generationId) || isCreating || eligibility?.reason === 'GENERATION_IN_PROGRESS';

  if (isLoading) {
    return <InsightsMessageCard message="인사이트를 불러오는 중..." />;
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
          generating={generating}
        />
      </div>
    );
  }

  return (
    <Card className="relative items-stretch gap-0 rounded-t-[36px] p-6">
      {toast && <div className="fixed left-1/2 top-5 z-[100] -translate-x-1/2"><Toast message={toast.message} variant={toast.variant} /></div>}
      <header className="mb-0">
        <h1 className="text-title1 text-grey-900">인사이트</h1>
        <p className="mt-1 text-body2-md text-grey-500">총 {insight.analyzedRecordCount}개의 기록을 분석했어요.</p>
      </header>

      <InsightOverviewSection insight={insight} eligibility={eligibility} generating={generating} onCreate={() => void handleCreate()} />
      <InsightStrengthSection insight={insight} selectedStrengthId={selectedStrengthId} onSelectStrength={setSelectedStrengthId} onOpenRecord={openRecord} />
      <InsightJobCompetencySection insight={insight} selectedCompetencyId={selectedCompetencyId} generating={generating} onSelectCompetency={setSelectedCompetencyId} onOpenRecord={openRecord} />
    </Card>
  );
}
