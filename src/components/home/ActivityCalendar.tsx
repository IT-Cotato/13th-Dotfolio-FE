import activityData from '@/mock/activeday.json';

type ActivityType = 'none' | 'memo' | 'both';
type DayType = 'future' | 'today' | ActivityType;

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_LABEL_COLORS = [
  'text-error-text',
  'text-grey-700',
  'text-grey-700',
  'text-grey-700',
  'text-grey-700',
  'text-grey-700',
  'text-primary-400',
];

const getDotClass = (type: DayType): string => {
  switch (type) {
    case 'future':
      return 'border border-grey-100 bg-transparent';
    case 'today':
      return 'border-2 border-primary-400 bg-transparent';
    case 'none':
      return 'bg-grey-100';
    case 'memo':
      return 'bg-primary-100';
    case 'both':
      return 'bg-primary-gradient';
  }
};

const toDateStr = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export const ActivityCalendar = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayStr = toDateStr(year, month, now.getDate());

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const getCellType = (day: number): DayType => {
    const dateStr = toDateStr(year, month, day);
    if (dateStr === todayStr) return 'today';
    if (dateStr > todayStr) return 'future';
    return (activityData as Record<string, ActivityType>)[dateStr] ?? 'none';
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-7 gap-2">
        {DAY_LABELS.map((label, i) => (
          <div key={i} className={`flex justify-center text-caption1 ${DAY_LABEL_COLORS[i]}`}>
            {label}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-2">
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
