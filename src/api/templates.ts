import { requestApi } from "@/api/client";

export interface ActivityTemplateQuestion {
  id: string;
  questionText: string;
  description: string | null;
  required: boolean;
  sortOrder: number;
}

export interface ActivityTemplate {
  id: string;
  title: string;
  description: string;
  isBuiltin: boolean;
  isSelectedForActivity: boolean;
  sortOrder: number;
  questionCount: number;
  questions: ActivityTemplateQuestion[];
}

export function getActivityTemplates(activityId: string) {
  return requestApi<ActivityTemplate[]>(`/api/activities/${activityId}/templates`);
}

export function saveActivityTemplates(activityId: string, templateIds: string[]) {
  return requestApi<ActivityTemplate[]>(`/api/activities/${activityId}/templates`, {
    method: "PUT",
    body: { templateIds },
  });
}

// ---- 전역 템플릿 API (/api/templates) — 활동에 종속되지 않는 템플릿 CRUD ----

export interface TemplateQuestionDetail {
  id: string;
  questionText: string;
  description: string | null;
  required: boolean;
  sortOrder: number;
}

export interface TemplateDetail {
  id: string;
  title: string;
  description: string;
  isBuiltin: boolean;
  questionCount: number;
  questions: TemplateQuestionDetail[];
}

export interface TemplateQuestionInput {
  questionText: string;
  description: string;
  required: boolean;
}

export interface TemplatePayload {
  title: string;
  description: string;
  questions: TemplateQuestionInput[];
}

export function getTemplates() {
  return requestApi<TemplateDetail[]>("/api/templates");
}

export function createTemplate(payload: TemplatePayload) {
  return requestApi<TemplateDetail>("/api/templates", {
    method: "POST",
    body: payload,
  });
}

export function getTemplateDetail(templateId: string) {
  return requestApi<TemplateDetail>(`/api/templates/${templateId}`);
}

export function deleteTemplate(templateId: string) {
  return requestApi<string>(`/api/templates/${templateId}`, {
    method: "DELETE",
  });
}

export function updateTemplate(templateId: string, payload: TemplatePayload) {
  return requestApi<TemplateDetail>(`/api/templates/${templateId}`, {
    method: "PATCH",
    body: payload,
  });
}
