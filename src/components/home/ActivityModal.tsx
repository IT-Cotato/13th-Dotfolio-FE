import { useState } from 'react';
import { ActivityTag } from '@/components/common/ActivityTag';
import { Button } from '@/components/common/button';
import CalendarIcon from '@/assets/calendar.svg';
import CloseIcon from '@/assets/close.svg';
import { formatDate } from '@/utils/date';
import { ACTIVITY_TYPES } from '@/constants/activity';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityModal = ({ isOpen, onClose }: ActivityModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [endDateUnknown, setEndDateUnknown] = useState(false);

  const todayStr = formatDate(new Date());

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(28, 28, 26, 0.62)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[464px] mx-4 bg-white rounded-3xl px-8 pt-6 pb-8 flex flex-col gap-8"
        onClick={e => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute top-5 right-6 cursor-pointer">
          <CloseIcon className="w-5 h-5 text-grey-400" />
        </button>

        {/* 활동 제목 */}
        <div className="flex flex-col gap-2">
          <p className="text-sub2-sb text-grey-900">활동 제목</p>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="활동 제목을 입력해주세요."
            className="py-3 border-b border-grey-100 text-body2-md text-grey-900 placeholder:text-grey-400 outline-none"
          />
        </div>

        {/* 활동 종류 */}
        <div className="flex flex-col gap-2">
          <p className="text-sub2-sb text-grey-900">활동 종류</p>
          <div className="flex flex-wrap gap-2 py-2">
            {ACTIVITY_TYPES.map(tag => (
              <ActivityTag
                key={tag}
                label={tag}
                selected={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
            <button
              type="button"
              className="flex items-center justify-center px-3 py-2 rounded-xl border border-dashed border-grey-100 text-body2-md text-grey-400 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* 날짜 */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <p className="text-sub2-sb text-grey-900">활동 시작일</p>
              <div className="flex items-center gap-2 py-3 border-b border-grey-100">
                <CalendarIcon className="w-4 h-4 text-grey-400 shrink-0" />
                <span className="text-body2-md text-grey-400">{todayStr}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sub2-sb text-grey-900">활동 종료일</p>
              <div className={`flex items-center gap-2 py-3 border-b border-grey-100 transition-opacity ${endDateUnknown ? 'opacity-30' : ''}`}>
                <CalendarIcon className="w-4 h-4 text-grey-400 shrink-0" />
                <span className="text-body2-md text-grey-400">{todayStr}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              type="button"
              onClick={() => setEndDateUnknown(prev => !prev)}
              className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors cursor-pointer ${
                endDateUnknown ? 'bg-primary-500 border-primary-500' : 'bg-white border-grey-200'
              }`}
            >
              {endDateUnknown && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span className="text-body2-md text-grey-900">종료일 미정</span>
          </div>
        </div>

        {/* 활동 생성 */}
        <Button label="활동 생성" disabled={!title.trim()} />
      </div>
    </div>
  );
};
