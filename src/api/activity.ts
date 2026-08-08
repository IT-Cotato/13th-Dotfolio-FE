import { apiRequest } from './client';

export interface ActivityResponse {
  id: string;
  activityTypeId: string;
  activityTypeName: string;
  title: string;
  description: string | null;
  startedAt: string;
  endedAt: string | null;
  isOngoing: boolean;
  status: string;
}

export interface ActivityRequest {
  activityTypeId: string;
  title: string;
  description?: string;
  startedAt: string;
  endedAt?: string;
  isOngoing: boolean;
}

export interface ActivityTypeResponse {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface ActivityTemplateQuestionResponse {
  id: string;
  questionText: string;
  description: string | null;
  required: boolean;
  sortOrder: number;
}

export interface ActivityTemplateResponse {
  id: string;
  title: string;
  description: string | null;
  isBuiltin: boolean;
  isSelectedForActivity: boolean;
  sortOrder: number;
  questionCount: number;
  questions: ActivityTemplateQuestionResponse[];
}

export const getActivities = (signal?: AbortSignal) => (
  apiRequest<ActivityResponse[]>('/api/activities', { signal })
);

export const createActivity = (request: ActivityRequest) => (
  apiRequest<string>('/api/activities', {
    method: 'POST',
    body: JSON.stringify(request),
  })
);

export const updateActivity = (activityId: string, request: ActivityRequest) => (
  apiRequest<string>(`/api/activities/${activityId}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  })
);

export const deleteActivity = (activityId: string) => (
  apiRequest<string>(`/api/activities/${activityId}`, { method: 'DELETE' })
);

export const archiveActivity = (activityId: string) => (
  apiRequest<string>(`/api/activities/${activityId}/archive`, { method: 'PATCH' })
);

export const getActivityTypes = (signal?: AbortSignal) => (
  apiRequest<ActivityTypeResponse[]>('/api/activity-types', { signal })
);

export const createActivityType = (name: string) => (
  apiRequest<string>('/api/activity-types', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
);

export const getActivityTemplates = (activityId: string) => (
  apiRequest<ActivityTemplateResponse[]>(`/api/activities/${activityId}/templates`)
);

export const updateActivityTemplates = (activityId: string, templateIds: string[]) => (
  apiRequest<ActivityTemplateResponse[]>(`/api/activities/${activityId}/templates`, {
    method: 'PUT',
    body: JSON.stringify({ templateIds }),
  })
);
