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
  title: string;
  date: string;
  content: string;
}

export interface DetailSection {
  label: string;
  question: string;
  text: string;
}
