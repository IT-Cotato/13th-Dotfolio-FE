export interface MemoImageData {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export interface MemoData {
  id: string;
  createdAt: string;
  dDay: string;
  memo: string;
  title?: string;
  tag?: string;
  activityId?: string;
  color?: string;
  attachmentCount?: number;
  attachmentUrl?: string;
  isImportant?: boolean;
  images: MemoImageData[];
}

export interface MemoActivityOption {
  id: string;
  title: string;
}

export interface MemoCreateInput {
  title?: string;
  memo: string;
  activityId?: string;
  file?: File;
}
