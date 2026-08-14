import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImmersionGoal } from "@/components/immersion/ImmersionGoal";
import { ImmersionInterrupted } from "@/components/immersion/ImmersionInterrupted";
import { exitImmersionHistory } from "@/utils/immersionHistory";

export default function ImmersionGoalPage() {
  const navigate = useNavigate();
  const [isExitOpen, setIsExitOpen] = useState(false);
  const hasAddedHistoryGuard = useRef(false);
  const isConfirmingExit = useRef(false);

  useEffect(() => {
    if (!hasAddedHistoryGuard.current) {
      window.history.pushState(
        { ...window.history.state, immersionGuard: true },
        "",
        window.location.href,
      );
      hasAddedHistoryGuard.current = true;
    }

    const handlePopState = () => {
      if (isConfirmingExit.current) return;

      window.history.pushState(
        { ...window.history.state, immersionGuard: true },
        "",
        window.location.href,
      );
      setIsExitOpen(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleConfirmExit = () => {
    isConfirmingExit.current = true;
    exitImmersionHistory({
      history: window.history,
      target: window,
      onHistoryCleared: () => {
        navigate("/immersion/returning", { replace: true });
      },
    });
  };

  return (
    <>
      <ImmersionGoal onRequestExit={() => setIsExitOpen(true)} />
      {isExitOpen && (
        <div className="fixed inset-0 z-50">
          <ImmersionInterrupted
            onClose={() => setIsExitOpen(false)}
            onReturnHome={handleConfirmExit}
          />
        </div>
      )}
    </>
  );
}
