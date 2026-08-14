import { apiRequest } from './client';

export interface MatchingQuestionTagResponse {
  id: string;
  content: string;
}

export interface MatchingQuestionTagsResponse {
  tags: MatchingQuestionTagResponse[];
}

export interface MatchingRecordAnswerResponse {
  questionText: string;
  answerText: string;
}

export interface MatchingRecordResponse {
  recordId: string;
  recordTitle: string;
  activityId: string;
  activityType: string;
  activityTitle: string;
  templateTitle: string;
  recordDate: string;
  matchRate: number;
  matchingSource: string;
  summary: string;
  answers: MatchingRecordAnswerResponse[];
}

export interface RecordMatchingResponse {
  question: string;
  matchingSource: string;
  matchedRecords: MatchingRecordResponse[];
}

export const getMatchingQuestionTags = (signal?: AbortSignal) => (
  apiRequest<MatchingQuestionTagsResponse>('/api/matching/question-tags', { signal })
);

export const matchRecords = (question: string, limit = 3) => (
  apiRequest<RecordMatchingResponse>('/api/matching/records', {
    method: 'POST',
    body: JSON.stringify({ question, limit }),
  })
);
