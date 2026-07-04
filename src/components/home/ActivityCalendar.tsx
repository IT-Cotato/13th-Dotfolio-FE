import activityData from '@/mock/activeday.json';
import { DAY_LABELS, DAY_LABEL_COLORS } from '@/constants/calendar';
import { toDateStr, getCalendarWeeks } from '@/utils/date';

type ActivityType = 'none' | 'memo' | 'both';
type DayType = 'future' | 'today' | ActivityType;

const getDotClass = (type: DayType): string => {
  switch (type) {
    case 'future': return 'border border-grey-100 bg-transparent';
    case 'today':  return 'border-2 border-primary-400 bg-transparent';
    case 'none':   return 'bg-grey-100';
    case 'memo':   return 'bg-primary-100';
    case 'both':   return 'bg-primary-gradient';
  }
};

export const ActivityCalendar = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayStr = toDateStr(year, month, now.getDate());
  const weeks = getCalendarWeeks(year, month);

  const getCellType = (day: number): DayType => {
    const dateStr = toDateStr(year, month, day);
    if (dateStr === todayStr) return 'today';
    if (dateStr > todayStr) return 'future';
    return (activityData as Record<string, ActivityType>)[dateStr] ?? 'none';
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-7 gap-0.75">
        {DAY_LABELS.map((label, i) => (
          <div key={i} className={`flex justify-center text-caption1 ${DAY_LABEL_COLORS[i]}`}>
            {label}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-0.75">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-0.75">
            {week.map((day, di) => {
              if (!day) return <div key={di} />;
              const type = getCellType(day);
              return (
                <div key={di} className="flex flex-col items-center gap-0.5">
                  <div className={`w-7 h-7 rounded-full ${getDotClass(type)}`} />
                  {type === 'today' && (
                    <span className="text-caption2 text-primary-400">Today</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
