const ACCESS_TOKEN_KEY = "dotfolio.accessToken";
const LEGACY_REFRESH_TOKEN_KEY = "dotfolio.refreshToken";
const LEGACY_GRANT_TYPE_KEY = "dotfolio.grantType";
export const AUTH_STATE_CHANGED_EVENT = "dotfolio:auth-state-changed";

interface AccessTokenResponse {
  accessToken: string;
}

function notifyAuthStateChanged() {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
}

export function saveAuthTokens({ accessToken }: AccessTokenResponse) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_GRANT_TYPE_KEY);
  notifyAuthStateChanged();
}

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getAuthorizationHeader() {
  const accessToken = getAccessToken();
  return accessToken ? `Bearer ${accessToken}` : null;
}

export function clearAuthTokens() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_GRANT_TYPE_KEY);
  notifyAuthStateChanged();
}
