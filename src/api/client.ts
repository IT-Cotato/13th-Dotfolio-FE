export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const REQUEST_TIMEOUT_MS = 10_000;

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function getApiUrl(path: string) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new ApiError("API 기본 주소가 설정되지 않았습니다.", 0);
  }

  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function getErrorMessage(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return "요청 처리 중 오류가 발생했습니다.";
}

function isFailedApiResponse(payload: unknown) {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    payload.success === false
  );
}

export async function requestApi<T>(
  path: string,
  { body, headers, ...options }: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const apiUrl = getApiUrl(path);
  const abortController = new AbortController();
  const timeoutId = window.setTimeout(
    () => abortController.abort(),
    REQUEST_TIMEOUT_MS,
  );
  let response: Response;
  let payload: unknown;

  try {
    response = await fetch(apiUrl, {
      ...options,
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: requestHeaders,
      signal: abortController.signal,
    });
    payload = await parseResponseBody(response);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("요청 시간이 초과되었습니다. 다시 시도해주세요.", 0);
    }

    throw new ApiError("네트워크 연결을 확인해주세요.", 0);
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok || isFailedApiResponse(payload)) {
    throw new ApiError(getErrorMessage(payload), response.status, payload);
  }

  return payload as ApiResponse<T>;
}
