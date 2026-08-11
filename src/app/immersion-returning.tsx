import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImmersionReturning } from "@/components/immersion/ImmersionReturning";

const RETURN_HOME_DELAY_MS = 2000;

export default function ImmersionReturningPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate("/", { replace: true });
    }, RETURN_HOME_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [navigate]);

  return <ImmersionReturning />;
}
