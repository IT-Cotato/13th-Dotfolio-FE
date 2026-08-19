import { useEffect, useState } from 'react';
import type { InsightEligibilityResponse, LatestInsightResponse } from '@/api/insight';
import { Button } from '@/components/common/button';
import { AiStarBadge } from './AiStarBadge';

const DOCUMENT_ICON_URL = new URL('../../../assets/document.png', import.meta.url).href;
const BRIEFCASE_ICON_URL = new URL('../../../assets/briefcase.png', import.meta.url).href;
const COLORS = ['#4F72F8', '#7C5CF6', '#0EA5E9', '#EC4899', '#A855F7'];

const formatPercent = (ratio: number) => Math.round(Math.max(0, Math.min(1, ratio)) * 100);

const formatRemainingTime = (value: string | null, currentTime: number) => {
  if (!value) return '00:00:00';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '00:00:00';

  const totalSeconds = Math.max(0, Math.ceil((date.getTime() - currentTime) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((unit) => String(unit).padStart(2, '0')).join(':');
};

interface InsightOverviewSectionProps {
  insight: LatestInsightResponse;
  eligibility: InsightEligibilityResponse | null;
  generating: boolean;
  onCreate: () => void;
}

export function InsightOverviewSection(props: InsightOverviewSectionProps) {
  const { insight } = props;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,464px)_1fr]">
      <InsightUpdateCard {...props} />
      <section className="rounded-2xl border border-grey-100 p-6">
        <h2 className="text-title2 text-grey-900">기록 템플릿 분포</h2>
        <p className="mt-1 text-body2-md text-grey-500">어떤 유형의 기록을 주로 남기는지 볼 수 있어요.</p>
        <div className="mt-6 grid gap-4">
          {insight.templates.map((template, index) => {
            const percent = formatPercent(template.ratio);
            const color = COLORS[index % COLORS.length];
            return (
              <div key={template.templateId}>
                <div className="mb-2 flex justify-between text-body3-md text-grey-900">
                  <span>{template.templateName}</span><strong style={{ color }}>{percent}%</strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-grey-100">
                  <span className="block h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
                </div>
              </div>
            );
          })}
        </div>
        {insight.templates[0] && (
          <p className="mt-6 flex items-center gap-2 text-body3-md text-grey-500">
            <AiStarBadge />[{insight.templates[0].templateName}] 중심의 기록을 가장 많이 남기고 있어요.
          </p>
        )}
      </section>
    </div>
  );
}

function InsightUpdateCard({ insight, eligibility, generating, onCreate }: InsightOverviewSectionProps) {
  const isCooldown = eligibility?.reason === 'COOLDOWN';
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    if (!isCooldown) return;
    const intervalId = window.setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [isCooldown, eligibility?.nextAvailableAt]);

  const disabled = generating || !eligibility?.eligible;
  const buttonLabel = generating
    ? '인사이트 생성 중...'
    : isCooldown
      ? formatRemainingTime(eligibility.nextAvailableAt, currentTime)
      : '새로운 인사이트 생성';
  const helperMessage = isCooldown
    ? '인사이트는 1일 1회 생성가능해요.'
    : eligibility?.reason === 'NO_CHANGES'
      ? '새로운 변경사항이 없습니다.'
      : '';

  return (
    <section className="flex min-h-[352px] flex-col rounded-2xl border border-grey-100 p-6">
      <h2 className="text-title2 text-grey-900">새로운 인사이트</h2>
      <p className="mt-1 text-body2-md text-grey-500">마지막 업데이트 이후 변경사항이 있어요.</p>
      <div className="mt-6 grid gap-2">
        <div className="flex items-center gap-3 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white"><img src={DOCUMENT_ICON_URL} alt="" className="size-5" /></span>
          <div><span className="text-label2-md text-grey-600">새 기록</span><strong className="block text-label2-sb text-grey-900">{insight.changes.newCompletedRecordCount}개 추가됨</strong></div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-category-pink bg-category-pink-bg px-4 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white"><img src={BRIEFCASE_ICON_URL} alt="" className="size-5" /></span>
          <div><span className="text-label2-md text-grey-600">희망 직무</span><strong className="block text-label2-sb text-grey-900">{insight.changes.desiredJobChanged ? '변경됨' : insight.job.jobName}</strong></div>
        </div>
      </div>
      <div className="mt-auto pt-6">
        <Button disabled={disabled} onClick={onCreate} label={buttonLabel} />
        {helperMessage && <p className="mt-2 text-center text-body3-md text-grey-500">{helperMessage}</p>}
      </div>
    </section>
  );
}
