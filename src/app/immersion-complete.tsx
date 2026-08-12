import { useLocation, useNavigate } from "react-router-dom";
import { ImmersionComplete } from "@/components/immersion/ImmersionComplete";

interface ImmersionCompleteLocationState {
  completedCount?: number;
}

const DEFAULT_COMPLETED_COUNT = 5;

export default function ImmersionCompletePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const locationState = state as ImmersionCompleteLocationState | null;
  const completedCount =
    locationState?.completedCount ?? DEFAULT_COMPLETED_COUNT;

  return (
    <ImmersionComplete
      completedCount={completedCount}
      onClose={() => navigate("/")}
      onReturnHome={() => navigate("/immersion/returning")}
    />
  );
}
