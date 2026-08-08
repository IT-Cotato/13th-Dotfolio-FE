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
