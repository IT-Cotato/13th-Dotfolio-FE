import { useState } from 'react';
import { getCalendarWeeks, formatDate } from '@/utils/date';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  onClose: () => void;
}

export const DatePicker = ({ value, onChange, onClose }: DatePickerProps) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const weeks = getCalendarWeeks(year, month);
  const todayStr = formatDate(today);

  const toDateStr = (day: number) =>
    `${year}.${String(month + 1).padStart(2, '0')}.${String(day).padStart(2, '0')}`;

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-grey-100 shadow-lg p-4 w-64"
      onClick={e => e.stopPropagation()}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-grey-50 text-grey-500 cursor-pointer"
        >
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path d="M5 1L1 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-sub3-sb text-grey-900">{year}년 {MONTH_NAMES[month]}</span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-grey-50 text-grey-500 cursor-pointer"
        >
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="flex items-center justify-center h-7 text-label3-md text-grey-400">
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((day, di) => {
            if (!day) return <div key={di} />;
            const dateStr = toDateStr(day);
            const isSelected = dateStr === value;
            const isToday = dateStr === todayStr;
            return (
              <div key={di} className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => { onChange(dateStr); onClose(); }}
                  className={`w-8 h-8 rounded-full text-body3-r transition-colors cursor-pointer
                    ${isSelected ? 'bg-primary-500 text-grey-0' : isToday ? 'border border-primary-500 text-primary-500' : 'text-grey-900 hover:bg-grey-50'}
                  `}
                >
                  {day}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
