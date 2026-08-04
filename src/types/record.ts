export interface RecordEntry {
  id: string;
  activityId: string;
  title: string;
  date: string;
  status: string;
  templateId: string;
  answers: Record<string, string>;
  memoIds: string[];
}
