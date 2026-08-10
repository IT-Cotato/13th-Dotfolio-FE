import { requestApi } from "@/api/client";

export interface ActivityTypeItem {
  id: string;
  name: string;
  isDefault: boolean;
}

export function getActivityTypes() {
  return requestApi<ActivityTypeItem[]>("/api/activity-types");
}

export function createActivityType(name: string) {
  return requestApi<string>("/api/activity-types", {
    method: "POST",
    body: { name },
  });
}
