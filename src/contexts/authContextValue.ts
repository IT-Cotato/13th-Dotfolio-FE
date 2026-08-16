import { createContext } from "react";

export interface AccessTokenResponse {
  accessToken: string;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  isInitializing: boolean;
  signIn: (response: AccessTokenResponse) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
