import { useLocation } from "react-router-dom";
import { ImmersionRecord } from "@/components/immersion/ImmersionRecord";

interface ImmersionRecordLocationState {
  focusMinutes?: number;
  recordCount?: number;
}

const DEFAULT_FOCUS_MINUTES = 30;
const DEFAULT_RECORD_COUNT = 5;

export default function ImmersionRecordPage() {
  const { state } = useLocation();
  const locationState = state as ImmersionRecordLocationState | null;
  const focusMinutes = locationState?.focusMinutes ?? DEFAULT_FOCUS_MINUTES;
  const recordCount = locationState?.recordCount ?? DEFAULT_RECORD_COUNT;

  return (
    <ImmersionRecord
      focusMinutes={focusMinutes}
      recordCount={recordCount}
    />
  );
}
