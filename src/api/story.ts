import { apiRequest } from './client';

export interface TimelineRecordResponse {
  recordId: string;
  title: string;
  status: string;
  createdAt: string;
}

export interface TimelineActivityResponse {
  activityId: string;
  title: string;
  activityTypeName: string;
  startedAt: string;
  endedAt: string | null;
  isOngoing: boolean;
  recordCount: number;
  records: TimelineRecordResponse[];
}

export const getStoryTimeline = (signal?: AbortSignal) => (
  apiRequest<TimelineActivityResponse[]>('/api/story/timeline', { signal })
);
