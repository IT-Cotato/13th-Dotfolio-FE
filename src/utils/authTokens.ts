import type { LoginResponse } from "@/api/auth";

const ACCESS_TOKEN_KEY = "dotfolio.accessToken";
const REFRESH_TOKEN_KEY = "dotfolio.refreshToken";
const GRANT_TYPE_KEY = "dotfolio.grantType";

export function saveAuthTokens({
  accessToken,
  refreshToken,
  grantType,
}: LoginResponse) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  sessionStorage.setItem(GRANT_TYPE_KEY, grantType);
}
