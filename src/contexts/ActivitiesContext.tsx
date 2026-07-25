import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Activity } from '@/types/activity';
import MOCK_ACTIVITIES from '@/mock/activities.json';

type ActivityFormData = Omit<Activity, 'id' | 'recordCount' | 'completedCount'>;

interface ActivitiesContextValue {
  activities: Activity[];
  addActivity: (data: ActivityFormData) => void;
  updateActivity: (id: string, data: ActivityFormData) => void;
  removeActivity: (id: string) => void;
  restoreActivity: (activity: Activity) => void;
}

const ActivitiesContext = createContext<ActivitiesContextValue | null>(null);

export const ActivitiesProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);

  const addActivity = (data: ActivityFormData) => {
    setActivities(prev => [...prev, { id: Date.now().toString(), ...data, recordCount: 0, completedCount: 0 }]);
  };

  const updateActivity = (id: string, data: ActivityFormData) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const removeActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const restoreActivity = (activity: Activity) => {
    setActivities(prev => [...prev, activity]);
  };

  return (
    <ActivitiesContext.Provider value={{ activities, addActivity, updateActivity, removeActivity, restoreActivity }}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) throw new Error('useActivities must be used within an ActivitiesProvider');
  return ctx;
};
