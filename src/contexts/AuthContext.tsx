import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { refreshAccessToken } from "@/api/auth";
import {
  AuthContext,
  type AccessTokenResponse,
} from "@/contexts/authContextValue";
import {
  AUTH_STATE_CHANGED_EVENT,
  clearAuthTokens,
  getAccessToken,
  saveAuthTokens,
} from "@/utils/authTokens";

async function restoreAuthentication() {
  if (getAccessToken()) {
    return true;
  }

  try {
    const { data } = await refreshAccessToken();
    saveAuthTokens(data);
    return true;
  } catch {
    clearAuthTokens();
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAccessToken()));
  const [isInitializing, setIsInitializing] = useState(true);
  const initializationPromiseRef = useRef<Promise<boolean> | null>(null);

  useEffect(() => {
    if (!initializationPromiseRef.current) {
      initializationPromiseRef.current = restoreAuthentication();
    }

    let isActive = true;

    initializationPromiseRef.current.then((isRestored) => {
      if (!isActive) {
        return;
      }

      setIsAuthenticated(isRestored);
      setIsInitializing(false);
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(Boolean(getAccessToken()));
    };

    window.addEventListener(AUTH_STATE_CHANGED_EVENT, syncAuthState);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, syncAuthState);
    };
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isInitializing,
      signIn: (response: AccessTokenResponse) => {
        saveAuthTokens(response);
        setIsAuthenticated(true);
      },
      signOut: () => {
        clearAuthTokens();
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, isInitializing],
  );

  if (isInitializing) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
