import activityData from '@/mock/activeday';
import type { ActivityType, DayType } from '@/types/activity';
import { DAY_LABELS, DAY_LABEL_COLORS } from '@/constants/calendar';
import { toDateStr, getCalendarWeeks } from '@/utils/date';

const getPastDotClass = (type: ActivityType): string => {
  switch (type) {
    case 'none': return 'bg-grey-100';
    case 'memo': return 'bg-primary-100';
    case 'both': return 'bg-primary-gradient';
  }
};

const todayInnerClass: Record<'today-none' | 'today-memo' | 'today-both', string> = {
  'today-none': 'bg-white',
  'today-memo': 'bg-primary-100',
  'today-both': 'bg-primary-gradient',
};

const todayTextColor: Record<'today-none' | 'today-memo' | 'today-both', string> = {
  'today-none': 'text-primary-500',
  'today-memo': 'text-primary-500',
  'today-both': 'text-grey-0',
};

type TodayType = 'today-none' | 'today-memo' | 'today-both';

const TodayDot = ({ type }: { type: TodayType }) => (
  <div className="w-7 h-7 rounded-full bg-primary-gradient p-0.5">
    <div className={`w-full h-full rounded-full flex items-center justify-center ${todayInnerClass[type]}`}>
      <span className={`text-[8px] leading-none font-medium ${todayTextColor[type]}`}>Today</span>
    </div>
  </div>
);

export const ActivityCalendar = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayStr = toDateStr(year, month, now.getDate());
  const weeks = getCalendarWeeks(year, month);

  const getCellType = (day: number): DayType => {
    const dateStr = toDateStr(year, month, day);
    if (dateStr === todayStr) {
      const activity = activityData[dateStr];
      if (activity === 'both') return 'today-both';
      if (activity === 'memo') return 'today-memo';
      return 'today-none';
    }
    if (dateStr > todayStr) return 'future';
    return activityData[dateStr] ?? 'none';
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

              if (type === 'today-none' || type === 'today-memo' || type === 'today-both') {
                return <TodayDot key={di} type={type} />;
              }

              return (
                <div key={di} className="flex justify-center">
                  <div
                    className={`w-7 h-7 rounded-full ${
                      type === 'future'
                        ? 'border border-grey-100 bg-transparent'
                        : getPastDotClass(type)
                    }`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
