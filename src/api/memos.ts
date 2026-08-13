import { requestApi } from "@/api/client";
import type { Memo } from "@/types/memo";

export interface MemoImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export interface MemoListItem {
  id: string;
  activityId: string;
  activityTitle: string;
  title: string;
  content: string;
  isImportant: boolean;
  remainingDaysUntilExpiration: number;
  images: MemoImage[];
  imageCount: number;
  createdAt: string;
}

export interface GetMemosParams {
  startDate?: string;
  endDate?: string;
}

export function getMemos(params: GetMemosParams = {}) {
  const query = new URLSearchParams();
  if (params.startDate) query.set("startDate", params.startDate);
  if (params.endDate) query.set("endDate", params.endDate);

  const queryString = query.toString();
  return requestApi<MemoListItem[]>(`/api/memos${queryString ? `?${queryString}` : ""}`);
}

const formatDDay = (days: number): string => {
  if (days === 0) return "D-DAY";
  if (days > 0) return `D-${days}`;
  return `D+${Math.abs(days)}`;
};

// activityTitle을 태그로 노출 — mock 데이터에서도 tag 값이 실제로는 활동명이었음.
export const toMemo = (item: MemoListItem): Memo => {
  const firstImage = item.images.slice().sort((a, b) => a.sortOrder - b.sortOrder)[0];
  return {
    id: item.id,
    date: item.createdAt.slice(0, 10).replace(/-/g, "."),
    dDay: formatDDay(item.remainingDaysUntilExpiration),
    title: item.title,
    tag: item.activityTitle,
    content: item.content,
    image: firstImage?.imageUrl,
  };
};
