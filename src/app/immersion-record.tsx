import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ImmersionRecord } from "@/components/immersion/ImmersionRecord";
import { ImmersionInterrupted } from "@/components/immersion/ImmersionInterrupted";
import { exitImmersionHistory } from "@/utils/immersionHistory";

interface ImmersionRecordLocationState {
  focusMinutes?: number;
  recordCount?: number;
  recordIds?: string[];
}

const DEFAULT_FOCUS_MINUTES = 30;
const DEFAULT_RECORD_COUNT = 5;

export default function ImmersionRecordPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isExitOpen, setIsExitOpen] = useState(false);
  const hasAddedHistoryGuard = useRef(false);
  const isConfirmingExit = useRef(false);
  const locationState = state as ImmersionRecordLocationState | null;
  const focusMinutes = locationState?.focusMinutes ?? DEFAULT_FOCUS_MINUTES;
  const recordCount = locationState?.recordCount ?? DEFAULT_RECORD_COUNT;
  const recordIds = useMemo(
    () => locationState?.recordIds ?? [],
    [locationState?.recordIds],
  );

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
      <ImmersionRecord
        focusMinutes={focusMinutes}
        onRequestExit={() => setIsExitOpen(true)}
        recordCount={recordCount}
        recordIds={recordIds}
      />
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
