export type MyStoryView = 'timeline' | 'search' | 'detail';

export interface Activity {
  id: number;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  endDateUnknown: boolean;
}

export interface StoryRecord {
  id: number;
  activityId: number;
  title: string;
  date: string;
  content: string;
  sections: string[];
}

export interface DetailSection {
  label: string;
  question: string;
  text: string;
}
