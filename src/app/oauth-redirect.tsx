import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { hasAccessToken, refreshAccessToken } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";

export default function OAuthRedirect() {
  const navigate = useNavigate();
  const { signInWithCookie } = useAuth();
  const hasHandledRedirectRef = useRef(false);

  useEffect(() => {
    if (hasHandledRedirectRef.current) {
      return;
    }

    hasHandledRedirectRef.current = true;

    const validateSession = async () => {
      try {
        const { data } = await refreshAccessToken();

        if (!hasAccessToken(data)) {
          navigate("/login?error=google", { replace: true });
          return;
        }

        signInWithCookie();
        navigate("/home", { replace: true });
      } catch {
        navigate("/login?error=google", { replace: true });
      }
    };

    void validateSession();
  }, [navigate, signInWithCookie]);

  return null;
}
