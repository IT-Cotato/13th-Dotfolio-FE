import LottieLib from 'lottie-react';
import type { InsightEligibilityResponse } from '@/api/insight';
import CheckIcon from '@/assets/check.svg';
import loadingBlueAnimation from '@/assets/Loading_blue.json';
import { Card } from '@/components/common/card';

const Lottie =
  (LottieLib as unknown as { default: typeof LottieLib }).default ?? LottieLib;

export function InsightsMessageCard({ message }: { message: string }) {
  return (
    <Card className="relative items-stretch gap-0 rounded-t-[36px] p-6">
      <h1 className="text-title1 text-grey-900">인사이트</h1>
      <div className="grid min-h-[55vh] place-items-center text-body2-md text-grey-500">{message}</div>
    </Card>
  );
}

interface InsightsReadyStateProps {
  eligibility: InsightEligibilityResponse | null;
  recordCount: number;
  generating: boolean;
}

export function InsightsReadyState({
  eligibility,
  recordCount,
  generating,
}: InsightsReadyStateProps) {
  const requiredCount = eligibility?.requiredRecordCount ?? 10;
  const jobConfigured = eligibility?.reason !== 'JOB_NOT_CONFIGURED';
  const analyzedRecordCount = eligibility?.analysisCompletedCount
    ?? eligibility?.currentRecordCount
    ?? 0;
  const failedRecordCount = eligibility?.analysisFailedCount ?? 0;
  const pendingRecordCount = eligibility?.analysisInProgressCount
    ?? Math.max(
      (eligibility?.totalRecordCount ?? recordCount) - analyzedRecordCount - failedRecordCount,
      0,
    );

  return (
    <Card className="relative items-stretch gap-0 rounded-t-[36px] p-6">
      <h1 className="text-title1 text-grey-900">인사이트</h1>
      <div className="grid min-h-[55vh] place-items-center px-6 text-center">
        {generating ? (
          <div role="status" aria-live="polite">
            <Lottie animationData={loadingBlueAnimation} autoplay loop className="mx-auto size-20" />
            <h2 className="mt-3 text-sub1-sb text-grey-950">AI 인사이트를 생성하고 있어요</h2>
            <p className="mt-2 text-body2-md text-grey-700">쌓인 기록을 분석하고 있으니 잠시만 기다려 주세요.</p>
          </div>
        ) : (
          <div className="w-full max-w-[420px] translate-y-20">
            <h2 className="text-sub1-sb text-grey-950">AI 인사이트를 시작하기 위한 준비</h2>
            <div className="mx-auto mt-4 rounded-xl bg-grey-50 px-5 py-4 text-left text-body-reading2-md text-grey-800">
              <p className="flex items-center gap-1.5">
                ⚙️ 직무 설정하기
                {jobConfigured
                  ? <CheckIcon aria-hidden className="h-auto w-3 shrink-0 text-primary-500" />
                  : '(마이페이지 > 희망 직무 설정)'}
              </p>
              <div className="mt-3 grid gap-2 border-t border-grey-100 pt-3">
                <p className="flex items-center justify-between gap-4">
                  <span>✅ 분석 완료된 기록</span>
                  <strong className="text-label2-sb text-grey-900">{analyzedRecordCount}/{requiredCount}개</strong>
                </p>
                <p className="flex items-center justify-between gap-4">
                  <span>⏳ 분석 중인 기록</span>
                  <strong className="text-label2-sb text-grey-900">{pendingRecordCount}개</strong>
                </p>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-error-text">⚠️ 분석 실패한 기록</span>
                  <strong className="text-label2-sb text-error-text">{failedRecordCount}개</strong>
                </div>
              </div>
            </div>
            <p className="mt-4 text-body2-md text-grey-700">희망 직무를 설정하고 기록을 채우시면,<br />맞춤형 강점과 역량을 분석해드려요.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
