import LottieLib from 'lottie-react';
import type { InsightJobRecommendationResponse, LatestInsightResponse } from '@/api/insight';
import AiRecordIcon from '@/assets/ai_record.svg';
import CheckIcon from '@/assets/check.svg';
import loadingBlueAnimation from '@/assets/Loading_blue.json';
import { AiStarBadge } from './AiStarBadge';

const Lottie =
  (LottieLib as unknown as { default: typeof LottieLib }).default ?? LottieLib;

interface InsightJobCompetencySectionProps {
  insight: LatestInsightResponse;
  selectedCompetencyId: string | null;
  generating: boolean;
  onSelectCompetency: (competencyId: string | null) => void;
  onOpenRecord: (recordId: string) => Promise<void>;
}

export function InsightJobCompetencySection({ insight, selectedCompetencyId, generating, onSelectCompetency, onOpenRecord }: InsightJobCompetencySectionProps) {
  const selectedRecommendation = insight.recommendations.find((item) => item.jobCompetencyId === selectedCompetencyId);

  return (
    <section className="rounded-2xl border border-grey-100 p-6">
      <h2 className="text-title2 text-grey-900">직무역량 <span className="text-primary-500">[희망 직무: {insight.job.jobName}]</span></h2>
      <p className="mt-1 text-body3-md text-grey-500">사용자의 경험 중 희망 직무 역량을 가장 잘 보여주는 경험을 추천해요.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {insight.recommendations.map((recommendation) => (
          <button type="button" key={recommendation.jobCompetencyId} onClick={() => onSelectCompetency(selectedCompetencyId === recommendation.jobCompetencyId ? null : recommendation.jobCompetencyId)} aria-pressed={selectedCompetencyId === recommendation.jobCompetencyId} className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-body2-md transition-colors ${selectedCompetencyId === recommendation.jobCompetencyId ? 'gap-1.5 border-primary-500 bg-primary-500 text-white' : 'border-grey-100 bg-white text-grey-900'}`}>
            {selectedCompetencyId === recommendation.jobCompetencyId && <CheckIcon aria-hidden className="h-auto w-4 shrink-0 text-white" />}
            {recommendation.competencyName}
          </button>
        ))}
      </div>
      {generating ? (
        <JobCompetencyLoading />
      ) : selectedRecommendation?.navigationAvailable ? (
        <RecommendationCard recommendation={selectedRecommendation} onOpen={() => void onOpenRecord(selectedRecommendation.recordId)} />
      ) : selectedCompetencyId || insight.recommendations.length === 0 ? (
        <JobCompetencyEmpty />
      ) : (
        <div className="mt-6 grid min-h-[220px] place-items-center rounded-2xl bg-grey-50 text-center text-body-reading2-r leading-6 text-grey-700">5가지 중 원하는 역량을 선택하면<br />AI가 추천하는 대표 경험을 보여줍니다.</div>
      )}
    </section>
  );
}

function RecommendationCard({ recommendation, onOpen }: { recommendation: InsightJobRecommendationResponse; onOpen: () => void }) {
  return (
    <div className="mt-6 rounded-2xl bg-grey-50 p-6">
      <h3 className="text-sub1-sb text-grey-900">{recommendation.recordTitle}</h3>
      <p className="mt-2 text-body3-md text-grey-500">{recommendation.templateName}</p>
      <div className="mt-6 flex items-center gap-5 border-t border-grey-100 pt-6">
        <span className="flex shrink-0 items-center gap-2 text-body3-md text-grey-500"><AiStarBadge /> AI 추천 이유</span>
        <p className="text-body2-md text-grey-700">{recommendation.reason}</p>
        <button type="button" disabled={!recommendation.navigationAvailable} onClick={onOpen} aria-label="추천 기록 보기" className="ml-auto shrink-0 cursor-pointer text-primary-500 disabled:cursor-default disabled:text-grey-300"><AiRecordIcon className="size-5" /></button>
      </div>
    </div>
  );
}

function JobCompetencyLoading() {
  return (
    <div className="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-2xl bg-grey-50 px-6 text-center" role="status" aria-live="polite">
      <Lottie animationData={loadingBlueAnimation} autoplay loop className="size-20 shrink-0" />
      <p className="mt-2 text-sub2-sb text-grey-700">직무 역량과 딱 맞는 나의 경험을 연결하는 중이에요.</p>
      <p className="mt-1 text-body3-r text-grey-700">쌓인 기록이 많다면 잠시만 기다려 주세요!</p>
    </div>
  );
}

function JobCompetencyEmpty() {
  return (
    <div className="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-2xl bg-grey-50 px-6 text-center">
      <p className="text-sub2-sb text-grey-700">아직 이 역량을 보여줄 기록이 없어요.</p>
      <p className="mt-2 text-body3-r text-grey-700">새로운 경험을 쌓고 기록으로 남겨보세요!</p>
    </div>
  );
}
