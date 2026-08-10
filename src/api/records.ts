import { requestApi } from "@/api/client";
import type { RecordEntry } from "@/types/record";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "기록 중",
  COMPLETED: "기록 완료",
};

const STATUS_VALUES: Record<string, string> = {
  "기록 중": "DRAFT",
  "기록 완료": "COMPLETED",
};

export const toStatusLabel = (status: string) => STATUS_LABELS[status] ?? status;
export const toStatusValue = (label: string) => STATUS_VALUES[label] ?? label;

export interface RecordListItem {
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
}

export interface RecordListPage {
  content: RecordListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface GetRecordsParams {
  activityId?: string;
  templateId?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface RecordAnswer {
  templateQuestionId: string;
  questionText: string;
  questionDescription: string | null;
  required: boolean;
  sortOrder: number;
  answerText: string;
}

export interface RecordMemo {
  memoId: string;
  activityId: string;
  title: string;
  content: string;
  color: string;
  important: boolean;
  sortOrder: number;
  collapsed: boolean;
  createdAt: string;
  expiresAt: string | null;
}

export interface RecordDetail extends RecordListItem {
  answers: RecordAnswer[];
  memos: RecordMemo[];
}

export const toRecordEntry = (item: RecordListItem): RecordEntry => ({
  id: item.id,
  activityId: item.activityId,
  title: item.title,
  date: item.createdAt.slice(0, 10).replace(/-/g, "."),
  status: toStatusLabel(item.status),
  templateId: item.templateId,
  answers: {},
  memoIds: [],
});

export interface CreateRecordAnswerInput {
  templateQuestionId: string;
  answerText: string;
}

export interface CreateRecordMemoInput {
  memoId: string;
  collapsed: boolean;
}

export interface CreateRecordPayload {
  activityId: string;
  templateId: string;
  title: string;
  answers: CreateRecordAnswerInput[];
  memos: CreateRecordMemoInput[];
  status: string;
}

export function createRecord(payload: CreateRecordPayload) {
  return requestApi<RecordDetail>("/api/records", {
    method: "POST",
    body: payload,
  });
}

export function getRecordDetail(recordId: string) {
  return requestApi<RecordDetail>(`/api/records/${recordId}`);
}

export function deleteRecord(recordId: string) {
  return requestApi<string>(`/api/records/${recordId}`, { method: "DELETE" });
}

export function restoreRecord(recordId: string) {
  return requestApi<string>(`/api/records/${recordId}/restore`, { method: "PATCH" });
}

export function getRecentRecords() {
  return requestApi<RecordListItem[]>("/api/records/recent");
}

export function getRecords(params: GetRecordsParams = {}) {
  const query = new URLSearchParams();
  if (params.activityId) query.set("activityId", params.activityId);
  if (params.templateId) query.set("templateId", params.templateId);
  if (params.status) query.set("status", params.status);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.size !== undefined) query.set("size", String(params.size));

  const queryString = query.toString();
  return requestApi<RecordListPage>(`/api/records${queryString ? `?${queryString}` : ""}`);
}
