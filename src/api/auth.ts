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
}

export interface LoginResponse {
  grantType: string;
  accessToken: string;
  refreshToken: string;
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
  });
}
