import { apiRequest, requestApi } from './client';

export interface MemoImageResponse {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export interface MemoResponse {
  id: string;
  activityId: string | null;
  activityTitle: string | null;
  title: string | null;
  content: string;
  isImportant: boolean;
  remainingDaysUntilExpiration: number;
  images: MemoImageResponse[];
  imageCount: number;
  createdAt: string;
}

export interface MemoImageRequest {
  imageUrl: string;
  s3Key: string;
}

export interface MemoCreateRequest {
  activityId?: string;
  title?: string;
  content: string;
  images?: MemoImageRequest[];
}

export interface MemoUpdateRequest {
  title?: string;
  content: string;
}

export interface MemoImagePresignedUrlResponse {
  presignedUrl: string;
  s3Key: string;
}

export const getMemos = (activityId?: string, signal?: AbortSignal) => {
  const searchParams = new URLSearchParams();
  if (activityId) searchParams.set('activityId', activityId);
  const query = searchParams.size ? `?${searchParams.toString()}` : '';

  return apiRequest<MemoResponse[]>(`/api/memos${query}`, { signal });
};

export const getMemo = (memoId: string) => (
  apiRequest<MemoResponse>(`/api/memos/${memoId}`)
);

export const createMemo = (request: MemoCreateRequest) => (
  apiRequest<string>('/api/memos', {
    method: 'POST',
    body: JSON.stringify(request),
  })
);

export const deleteMemos = async (memoIds: string[]) => {
  const searchParams = new URLSearchParams();
  memoIds.forEach((memoId) => searchParams.append('memoIds', memoId));

  await requestApi<void>(`/api/memos?${searchParams.toString()}`, {
    method: 'DELETE',
  });
};

export const restoreMemos = async (memoIds: string[]) => {
  const searchParams = new URLSearchParams();
  memoIds.forEach((memoId) => searchParams.append('memoIds', memoId));

  await requestApi<void>(`/api/memos/restore?${searchParams.toString()}`, {
    method: 'PATCH',
  });
};

export const getMemoImagePresignedUrl = (fileName: string) => (
  apiRequest<MemoImagePresignedUrlResponse>('/api/memos/images/presigned-url', {
    method: 'POST',
    body: JSON.stringify({ fileName }),
  })
);

export const uploadMemoImage = async (presignedUrl: string, file: File) => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!response.ok) throw new Error('이미지를 업로드하지 못했습니다.');
};

export const updateMemo = async (memoId: string, request: MemoUpdateRequest) => {
  await requestApi<void>(`/api/memos/${memoId}`, {
    method: 'PATCH',
    body: request,
  });
};

export const markMemoImportant = async (memoId: string, important: boolean) => {
  const searchParams = new URLSearchParams({ important: String(important) });

  await requestApi<void>(`/api/memos/${memoId}/important?${searchParams.toString()}`, {
    method: 'PATCH',
  });
};

export const deleteMemoImage = async (imageId: string) => {
  await requestApi<void>(`/api/memos/images/${imageId}`, {
    method: 'DELETE',
  });
};
