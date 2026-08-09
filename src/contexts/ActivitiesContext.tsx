import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Activity } from '@/types/activity';
import {
  getActivities,
  createActivity,
  updateActivity as updateActivityApi,
  deleteActivity,
  archiveActivity as archiveActivityApi,
  type ActivityFormPayload,
  type ActivityListItem,
} from '@/api/activities';
import { toDisplayDate, toIsoDate } from '@/utils/date';
import { ApiError } from '@/api/client';

export type ActivityFormData = Omit<Activity, 'id' | 'activityTypeName' | 'recordCount' | 'completedCount'>;

interface ActivitiesContextValue {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addActivity: (data: ActivityFormData) => Promise<void>;
  updateActivity: (id: string, data: ActivityFormData) => Promise<void>;
  removeActivity: (id: string) => Promise<void>;
  archiveActivity: (id: string) => Promise<void>;
  selectedActivityId: string | null;
  setSelectedActivityId: (id: string) => void;
  selectedActivity: Activity | undefined;
}

const ActivitiesContext = createContext<ActivitiesContextValue | null>(null);

const toActivity = (item: ActivityListItem): Activity => ({
  id: item.id,
  activityTypeId: item.activityTypeId,
  activityTypeName: item.activityTypeName,
  title: item.title,
  description: item.description,
  startDate: toDisplayDate(item.startedAt),
  endDate: item.endedAt ? toDisplayDate(item.endedAt) : '',
  endDateUnknown: item.isOngoing,
  // TODO: 백엔드에 활동별 기록 수 집계 API가 생기면 실제 값으로 교체
  recordCount: 0,
  completedCount: 0,
});

const toPayload = (data: ActivityFormData): ActivityFormPayload => ({
  activityTypeId: data.activityTypeId,
  title: data.title,
  description: data.description,
  startedAt: toIsoDate(data.startDate),
  endedAt: data.endDateUnknown || !data.endDate ? null : toIsoDate(data.endDate),
  isOngoing: data.endDateUnknown,
});

export const ActivitiesProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  // 목록 새로고침은 절대 예외를 던지지 않음 — 실패는 error 상태로만 반영되고,
  // 생성/수정/삭제/보관 자체의 성공 여부와는 분리됨 (재조회만 실패해도 방금 한 요청이 실패 처리되지 않도록).
  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getActivities();
      setActivities(response.data.map(toActivity));
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '활동 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchInitial = async () => {
      await refetch();
    };
    fetchInitial();
  }, [refetch]);

  useEffect(() => {
    if (selectedActivityId && activities.some(a => a.id === selectedActivityId)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedActivityId(activities[0]?.id ?? null);
  }, [activities, selectedActivityId]);

  const addActivity = async (data: ActivityFormData) => {
    await createActivity(toPayload(data));
    await refetch();
  };

  const updateActivity = async (id: string, data: ActivityFormData) => {
    await updateActivityApi(id, toPayload(data));
    await refetch();
  };

  const removeActivity = async (id: string) => {
    await deleteActivity(id);
    await refetch();
  };

  const archiveActivity = async (id: string) => {
    await archiveActivityApi(id);
    await refetch();
  };

  const selectedActivity = activities.find(a => a.id === selectedActivityId);

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        isLoading,
        error,
        refetch,
        addActivity,
        updateActivity,
        removeActivity,
        archiveActivity,
        selectedActivityId,
        setSelectedActivityId,
        selectedActivity,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) throw new Error('useActivities must be used within an ActivitiesProvider');
  return ctx;
};
