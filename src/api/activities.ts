import { requestApi } from "@/api/client";

export interface ActivityListItem {
  id: string;
  activityTypeId: string;
  activityTypeName: string;
  title: string;
  description: string;
  startedAt: string;
  endedAt: string | null;
  isOngoing: boolean;
  status: string;
}

export interface ActivityFormPayload {
  activityTypeId: string;
  title: string;
  description: string;
  startedAt: string;
  endedAt: string | null;
  isOngoing: boolean;
}

export function getActivities() {
  return requestApi<ActivityListItem[]>("/api/activities");
}

export function createActivity(payload: ActivityFormPayload) {
  return requestApi<string>("/api/activities", {
    method: "POST",
    body: payload,
  });
}

export function updateActivity(activityId: string, payload: ActivityFormPayload) {
  return requestApi<string>(`/api/activities/${activityId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteActivity(activityId: string) {
  return requestApi<string>(`/api/activities/${activityId}`, {
    method: "DELETE",
  });
}

export function restoreActivity(activityId: string) {
  return requestApi<string>(`/api/activities/${activityId}/restore`, {
    method: "PATCH",
  });
}

export function archiveActivity(activityId: string) {
  return requestApi<string>(`/api/activities/${activityId}/archive`, {
    method: "PATCH",
  });
}
