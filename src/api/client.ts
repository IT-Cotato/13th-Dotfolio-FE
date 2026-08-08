const DEFAULT_API_BASE_URL = 'https://54.180.186.216.nip.io';
const REQUEST_TIMEOUT_MS = 10_000;

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? '' : DEFAULT_API_BASE_URL)
).replace(/\/$/, '');

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

const getApiUrl = (path: string) => (
  `${API_BASE_URL}/${path.replace(/^\//, '')}`
);

const getAccessToken = () => {
  if (typeof window === 'undefined') return null;

  return window.sessionStorage.getItem('dotfolio.accessToken')
    ?? window.localStorage.getItem('dotfolio.accessToken')
    ?? window.localStorage.getItem('accessToken')
    ?? window.sessionStorage.getItem('accessToken')
    ?? window.localStorage.getItem('access_token')
    ?? window.sessionStorage.getItem('access_token')
    ?? window.localStorage.getItem('token')
    ?? window.sessionStorage.getItem('token');
};

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function getErrorMessage(payload: unknown) {
  if (
    typeof payload === 'object'
    && payload !== null
    && 'message' in payload
    && typeof payload.message === 'string'
  ) {
    return payload.message;
  }

  return '요청 처리 중 오류가 발생했습니다.';
}

function isFailedApiResponse(payload: unknown) {
  return (
    typeof payload === 'object'
    && payload !== null
    && 'success' in payload
    && payload.success === false
  );
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const accessToken = getAccessToken();

  headers.set('Accept', 'application/json');
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(getApiUrl(path), {
    ...init,
    headers,
  });
  const payload = await parseResponseBody(response);

  if (!response.ok || isFailedApiResponse(payload)) {
    throw new ApiError(getErrorMessage(payload), response.status, payload);
  }

  return (payload as ApiResponse<T> | null)?.data as T;
}

export async function requestApi<T>(
  path: string,
  { body, headers, ...options }: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');

  if (body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const abortController = new AbortController();
  const timeoutId = window.setTimeout(
    () => abortController.abort(),
    REQUEST_TIMEOUT_MS,
  );
  let response: Response;
  let payload: unknown;

  try {
    response = await fetch(getApiUrl(path), {
      ...options,
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: requestHeaders,
      signal: abortController.signal,
    });
    payload = await parseResponseBody(response);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('요청 시간이 초과되었습니다. 다시 시도해주세요.', 0);
    }

    throw new ApiError('네트워크 연결을 확인해주세요.', 0);
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok || isFailedApiResponse(payload)) {
    throw new ApiError(getErrorMessage(payload), response.status, payload);
  }

  return payload as ApiResponse<T>;
}
