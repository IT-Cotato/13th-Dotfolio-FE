import { requestApi } from "@/api/client";

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  isPrivacyAgreed: boolean;
  isMarketingAgreed: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  accessToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  email: string;
  newPassword: string;
}

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((value) => value.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.slice("XSRF-TOKEN=".length)) : null;
}

export function signup(request: SignupRequest) {
  return requestApi<string>("/api/auth/signup", {
    method: "POST",
    body: request,
  });
}

export function login(request: LoginRequest) {
  return requestApi<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: request,
    credentials: "include",
  });
}

export function refreshAccessToken() {
  const xsrfToken = getXsrfToken();

  return requestApi<LoginResponse>("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    headers: xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : undefined,
    skipAuthorization: true,
  });
}

export function logout() {
  return requestApi<void>("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export function withdraw() {
  return requestApi<void>("/api/auth/withdraw", {
    method: "DELETE",
    credentials: "include",
  });
}

export function requestPasswordReset(request: PasswordResetRequest) {
  return requestApi<void>("/api/auth/reset-request", {
    method: "POST",
    body: request,
  });
}

export function resetPassword(request: PasswordResetConfirmRequest) {
  return requestApi<void>("/api/auth/reset", {
    method: "PATCH",
    body: request,
  });
}
