import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
    signInWithCookie();
    navigate("/home", { replace: true });
  }, [navigate, signInWithCookie]);

  return null;
}
