import { apiRequest } from './client';

export type InsightGenerationStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export type InsightEligibilityReason =
  | 'AVAILABLE'
  | 'JOB_NOT_CONFIGURED'
  | 'NOT_ENOUGH_COMPLETED_RECORDS'
  | 'NOT_ENOUGH_ANALYZED_RECORDS'
  | 'ANALYSIS_IN_PROGRESS'
  | 'GENERATION_IN_PROGRESS'
  | 'COOLDOWN'
  | 'NO_CHANGES';

export interface InsightEligibilityResponse {
  eligible: boolean;
  reason: InsightEligibilityReason;
  nextAvailableAt: string | null;
  currentRecordCount: number;
  requiredRecordCount: number;
  totalRecordCount?: number;
  analysisCompletedCount?: number;
  analysisFailedCount?: number;
  analysisInProgressCount?: number;
}

export interface InsightGenerationCreateResponse {
  generationId: string;
  status: InsightGenerationStatus;
}

export interface InsightGenerationStatusResponse {
  generationId: string;
  status: InsightGenerationStatus;
  requestedAt: string;
  completedAt: string | null;
  failedAt: string | null;
  failureCode: string | null;
  failureMessage: string | null;
}

export interface InsightStrengthRecordResponse {
  recordId: string;
  recordTitle: string;
  completedAt: string;
  navigationAvailable: boolean;
}

export interface InsightStrengthResponse {
  strengthTagId: string;
  strengthName: string;
  recordCount: number;
  averageScore: number;
  ratio: number;
  rank: number;
  records: InsightStrengthRecordResponse[];
}

export interface InsightTemplateStatisticResponse {
  templateId: string;
  templateName: string;
  recordCount: number;
  ratio: number;
  rank: number;
}

export interface InsightJobRecommendationResponse {
  jobCompetencyId: string;
  competencyName: string;
  recordId: string;
  recordTitle: string;
  templateName: string;
  reason: string;
  similarity: number;
  navigationAvailable: boolean;
}

export interface InsightChangeSummaryResponse {
  newCompletedRecordCount: number;
  desiredJobChanged: boolean;
  analysisPendingRecordCount: number;
  analysisFailedRecordCount: number;
}

export interface CurrentInsightGenerationResponse {
  generationId: string;
  status: InsightGenerationStatus;
  requestedAt: string;
}

export interface LatestInsightResponse {
  insightId: string;
  job: { jobId: string; jobName: string };
  recordSnapshotAt: string;
  completedAt: string;
  analyzedRecordCount: number;
  strengths: InsightStrengthResponse[];
  templates: InsightTemplateStatisticResponse[];
  recommendations: InsightJobRecommendationResponse[];
  changes: InsightChangeSummaryResponse;
  currentGeneration: CurrentInsightGenerationResponse | null;
}

export const getInsightEligibility = (signal?: AbortSignal) => (
  apiRequest<InsightEligibilityResponse>('/api/insights/eligibility', { signal })
);

export const getLatestInsight = (signal?: AbortSignal) => (
  apiRequest<LatestInsightResponse>('/api/insights/latest', { signal })
);

export const createInsight = () => (
  apiRequest<InsightGenerationCreateResponse>('/api/insights', { method: 'POST' })
);

export const getInsightGenerationStatus = (generationId: string, signal?: AbortSignal) => (
  apiRequest<InsightGenerationStatusResponse>(`/api/insights/generations/${generationId}`, { signal })
);
