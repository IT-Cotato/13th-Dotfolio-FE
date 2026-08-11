import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ImmersionRecord } from "@/components/immersion/ImmersionRecord";
import { ImmersionInterrupted } from "@/components/immersion/ImmersionInterrupted";

interface ImmersionRecordLocationState {
  focusMinutes?: number;
  recordCount?: number;
}

const DEFAULT_FOCUS_MINUTES = 30;
const DEFAULT_RECORD_COUNT = 5;

export default function ImmersionRecordPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isExitOpen, setIsExitOpen] = useState(false);
  const hasAddedHistoryGuard = useRef(false);
  const locationState = state as ImmersionRecordLocationState | null;
  const focusMinutes = locationState?.focusMinutes ?? DEFAULT_FOCUS_MINUTES;
  const recordCount = locationState?.recordCount ?? DEFAULT_RECORD_COUNT;

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

  return (
    <>
      <ImmersionRecord
        focusMinutes={focusMinutes}
        onRequestExit={() => setIsExitOpen(true)}
        recordCount={recordCount}
      />
      {isExitOpen && (
        <div className="fixed inset-0 z-50">
          <ImmersionInterrupted
            onClose={() => setIsExitOpen(false)}
            onReturnHome={() => navigate("/immersion/returning")}
          />
        </div>
      )}
    </>
  );
}
