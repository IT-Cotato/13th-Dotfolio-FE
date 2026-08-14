import { apiRequest } from './client';

export interface RecordAnswerResponse {
  templateQuestionId: string;
  questionText: string;
  questionDescription: string | null;
  required: boolean;
  sortOrder: number;
  answerText: string;
}

export interface RecordMemoResponse {
  memoId: string;
  activityId: string;
  title: string | null;
  content: string;
  color: string | null;
  important: boolean;
  sortOrder: number;
  collapsed: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface RecordResponse {
  id: string;
  activityId: string;
  activityTitle: string;
  templateId: string;
  templateTitle: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  answers: RecordAnswerResponse[];
  memos: RecordMemoResponse[];
}

export interface RecordUpdateRequest {
  title: string;
  answers: Array<{
    templateQuestionId: string;
    answerText: string;
  }>;
  memos: Array<{
    memoId: string;
    collapsed: boolean;
  }>;
  status: 'DRAFT' | 'COMPLETED';
}

export const getRecord = (recordId: string) => (
  apiRequest<RecordResponse>(`/api/records/${recordId}`)
);

export const updateRecord = (recordId: string, request: RecordUpdateRequest) => (
  apiRequest<RecordResponse>(`/api/records/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  })
);
