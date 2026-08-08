export type ActivityType = 'none' | 'memo' | 'both';

export interface Activity {
  id: string;
  activityTypeId: string;
  activityTypeName: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  endDateUnknown: boolean;
  recordCount: number;
  completedCount: number;
}

export type DayType =
  | 'future'
  | 'today-none'
  | 'today-memo'
  | 'today-both'
  | ActivityType;
