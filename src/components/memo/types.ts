export interface MemoData {
  id: number;
  createdAt: string;
  dDay: string;
  memo: string;
  title?: string;
  tag?: string;
  attachmentCount?: number;
  attachmentUrl?: string;
  isImportant?: boolean;
}
