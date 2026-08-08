export type MyStoryView = 'timeline' | 'search' | 'detail';

export interface Activity {
  id: string;
  activityTypeId: string;
  title: string;
  category: string;
  description?: string;
  startDate: string;
  endDate: string;
  endDateUnknown: boolean;
}

export interface StoryRecord {
  id: string;
  activityId?: string;
  activityTitle: string;
  activityTypeName: string;
  templateTitle: string;
  title: string;
  date: string;
  status: string;
  content: string;
  sections: DetailSection[];
  memos: Array<{
    memoId: string;
    collapsed: boolean;
  }>;
}

export interface DetailSection {
  id: string;
  label: string;
  question: string;
  text: string;
  required: boolean;
}
