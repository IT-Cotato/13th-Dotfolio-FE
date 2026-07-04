import type { ActivityType } from '@/types/activity';

const activityData: Record<string, ActivityType> = {
  "2026-07-01": "both",
  "2026-07-02": "none",
  "2026-07-03": "memo",
  "2026-07-04": "none",    // 메모, 기록 x
  // "2026-07-04": "memo", // 메모만
  // "2026-07-04": "both", // 메모 + 기록
};

export default activityData;
