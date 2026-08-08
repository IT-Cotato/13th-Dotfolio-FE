import { apiRequest } from './client';

export interface RecordSearchResponse {
  recordId: string;
  activityTypeName: string;
  activityTitle: string;
  templateTitle: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface RecordSearchPageResponse {
  content: RecordSearchResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const searchRecords = (keyword: string, page = 0, size = 50) => {
  const searchParams = new URLSearchParams({
    keyword,
    page: String(page),
    size: String(size),
  });

  return apiRequest<RecordSearchPageResponse>(`/api/search/records?${searchParams.toString()}`);
};
