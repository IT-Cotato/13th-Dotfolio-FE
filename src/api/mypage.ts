import { requestApi } from '@/api/client';

export interface MyPageProfileResponse {
  name: string;
  email: string;
  profileImageUrl: string | null;
  profileImageKey: string | null;
  desiredJobId: string | null;
  desiredJob: string | null;
}

export interface UpdateProfileRequest {
  name?: string;
  profileImageUrl?: string;
}

export interface ProfileImagePresignedUrlResponse {
  presignedUrl: string;
  s3Key: string;
}

export function getMyPageProfile() {
  return requestApi<MyPageProfileResponse>('/api/members/me');
}

export function updateMyPageProfile(payload: UpdateProfileRequest) {
  return requestApi<void>('/api/members/me', {
    method: 'PATCH',
    body: payload,
  });
}

export function getProfileImagePresignedUrl(fileName: string) {
  return requestApi<ProfileImagePresignedUrlResponse>('/api/members/me/profile-image/presigned-url', {
    method: 'POST',
    body: { fileName },
  });
}

export async function uploadProfileImage(presignedUrl: string, file: File) {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!response.ok) throw new Error('프로필 이미지를 업로드하지 못했습니다.');
}

export function updateDesiredJob(jobId: string) {
  return requestApi<void>('/api/members/me/job', {
    method: 'PATCH',
    body: { jobId },
  });
}
