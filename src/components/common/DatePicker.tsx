import { useState } from 'react';
import ArrowIcon from '@/assets/arrow.svg';
import { getCalendarWeeks, formatDate } from '@/utils/date';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  onClose: () => void;
}

const toDateStr = (y: number, m: number, d: number) =>
  `${y}.${String(m + 1).padStart(2, '0')}.${String(d).padStart(2, '0')}`;

export const DatePicker = ({ value, onChange, onClose }: DatePickerProps) => {
  const today = new Date();
  const parsed = value ? value.split('.').map(Number) : null;
  const [year, setYear] = useState(parsed ? parsed[0] : today.getFullYear());
  const [month, setMonth] = useState(parsed ? parsed[1] - 1 : today.getMonth());

  const weeks = getCalendarWeeks(year, month);
  const todayStr = formatDate(today);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const years = Array.from({ length: 21 }, (_, i) => today.getFullYear() - 10 + i);

  return (
    <div
      data-testid="date-picker"
      className="bg-white rounded-2xl p-4 w-[296px] shadow-[0_4px_24px_rgba(0,0,0,0.10)]"
      onClick={e => e.stopPropagation()}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-grey-50 cursor-pointer"
        >
          <ArrowIcon className="w-5 h-5 text-grey-900 rotate-180" />
        </button>

        <div className="flex items-center gap-2">
          {/* 년도 select */}
          <div className="relative flex items-center border border-grey-200 rounded-xl">
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="appearance-none pl-3 pr-7 py-1.5 text-body2-md text-grey-900 bg-transparent cursor-pointer outline-none"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <ArrowIcon className="absolute right-2 w-4 h-4 text-grey-600 rotate-90 pointer-events-none" />
          </div>

          {/* 월 select */}
          <div className="relative flex items-center border border-grey-200 rounded-xl">
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="appearance-none pl-3 pr-7 py-1.5 text-body2-md text-grey-900 bg-transparent cursor-pointer outline-none"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{String(i + 1).padStart(2, '0')}</option>
              ))}
            </select>
            <ArrowIcon className="absolute right-2 w-4 h-4 text-grey-600 rotate-90 pointer-events-none" />
          </div>
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-grey-50 cursor-pointer"
        >
          <ArrowIcon className="w-5 h-5 text-grey-900" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="flex items-center justify-center h-9 text-label3-md text-grey-500">
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      {weeks.map((week, wi) => {
        const isLastWeek = wi === weeks.length - 1;
        let overflowDay = 0;

        return (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              if (day === null) {
                if (isLastWeek) {
                  overflowDay++;
                  return (
                    <div key={di} className="flex items-center justify-center h-9">
                      <span className="text-body3-r text-grey-300">{overflowDay}</span>
                    </div>
                  );
                }
                return <div key={di} className="h-9" />;
              }

              const dateStr = toDateStr(year, month, day);
              const isSelected = dateStr === value;
              const isToday = dateStr === todayStr;

              return (
                <div key={di} className="flex items-center justify-center h-9">
                  <button
                    type="button"
                    aria-label={`${dateStr} 선택`}
                    onClick={() => { onChange(dateStr); onClose(); }}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-body3-r transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-grey-950 text-white'
                        : isToday
                        ? 'border border-grey-950 text-grey-900'
                        : 'text-grey-900 hover:bg-grey-50'
                    }`}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
