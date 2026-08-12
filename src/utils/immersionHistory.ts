interface HistoryNavigator {
  go: (delta: number) => void;
}

interface PopStateTarget {
  addEventListener: (
    type: "popstate",
    listener: () => void,
    options?: { once?: boolean },
  ) => void;
}

interface ExitImmersionHistoryOptions {
  history: HistoryNavigator;
  onHistoryCleared: () => void;
  target: PopStateTarget;
}

const IMMERSION_HISTORY_ENTRY_COUNT = 2;

export function exitImmersionHistory({
  history,
  onHistoryCleared,
  target,
}: ExitImmersionHistoryOptions) {
  target.addEventListener("popstate", onHistoryCleared, { once: true });
  history.go(-IMMERSION_HISTORY_ENTRY_COUNT);
}
