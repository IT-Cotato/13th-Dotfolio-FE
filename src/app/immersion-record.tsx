import { useLocation } from "react-router-dom";
import { ImmersionRecord } from "@/components/immersion/ImmersionRecord";

interface ImmersionRecordLocationState {
  focusMinutes?: number;
  recordCount?: number;
}

const DEFAULT_FOCUS_MINUTES = 30;

export default function ImmersionRecordPage() {
  const { state } = useLocation();
  const locationState = state as ImmersionRecordLocationState | null;
  const focusMinutes = locationState?.focusMinutes ?? DEFAULT_FOCUS_MINUTES;

  return <ImmersionRecord focusMinutes={focusMinutes} />;
}
