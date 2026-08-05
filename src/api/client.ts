const DEFAULT_API_BASE_URL = 'https://54.180.186.216.nip.io';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? '' : DEFAULT_API_BASE_URL)
).replace(/\/$/, '');

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const getAccessToken = () => {
  if (typeof window === 'undefined') return null;

  return window.localStorage.getItem('accessToken')
    ?? window.sessionStorage.getItem('accessToken')
    ?? window.localStorage.getItem('access_token')
    ?? window.sessionStorage.getItem('access_token')
    ?? window.localStorage.getItem('token')
    ?? window.sessionStorage.getItem('token');
};

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const accessToken = getAccessToken();

  headers.set('Accept', 'application/json');
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const contentType = response.headers.get('content-type');
  const body = contentType?.includes('application/json')
    ? await response.json() as ApiResponse<T>
    : null;

  if (!response.ok || (body && !body.success)) {
    throw new ApiError(body?.message || '요청을 처리하지 못했습니다.', response.status);
  }

  return body?.data as T;
}
