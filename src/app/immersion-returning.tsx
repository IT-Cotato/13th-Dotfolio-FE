import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImmersionReturning } from "@/components/immersion/ImmersionReturning";

const RETURN_HOME_DELAY_MS = 2000;

export default function ImmersionReturningPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      // 이 페이지가 열리기 전에 레코드 및 가드 항목이 제거되었습니다.
      // '뒤로' 동작으로 몰입형 모드가 복원되지 않도록 로딩 항목을 교체합니다.
      navigate("/home", { replace: true });
    }, RETURN_HOME_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [navigate]);

  return <ImmersionReturning />;
}
