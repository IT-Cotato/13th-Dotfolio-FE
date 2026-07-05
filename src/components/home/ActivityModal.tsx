import { useRef, useState } from 'react';
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
  const [extraTags, setExtraTags] = useState<string[]>([]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endDateUnknown, setEndDateUnknown] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const commitNewTag = () => {
    const trimmed = newTagValue.trim();
    if (trimmed && !extraTags.includes(trimmed) && !ACTIVITY_TYPES.includes(trimmed as (typeof ACTIVITY_TYPES)[number])) {
      setExtraTags(prev => [...prev, trimmed]);
      setSelectedTags(prev => [...prev, trimmed]);
    }
    setNewTagValue('');
    setIsAddingTag(false);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitNewTag();
    } else if (e.key === 'Escape') {
      setNewTagValue('');
      setIsAddingTag(false);
    }
  };

  const handleDateClick = (setter: (v: string) => void) => {
    setter(formatDate(new Date()));
  };

  const isDisabled =
    !title.trim() ||
    selectedTags.length === 0 ||
    !startDate ||
    (!endDate && !endDateUnknown);

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
          <CloseIcon className="w-4 h-4 text-grey-400" />
        </button>

        {/* 활동 제목 */}
        <div className="flex flex-col gap-2">
          <p className="text-sub2-sb text-grey-900">활동 제목</p>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="활동 제목을 입력해주세요."
            className={`py-3 border-b text-body2-md text-grey-900 placeholder:text-grey-400 outline-none transition-colors ${title ? 'border-primary-500' : 'border-grey-100'}`}
          />
        </div>

        {/* 활동 종류 */}
        <div className="flex flex-col gap-2">
          <p className="text-sub2-sb text-grey-900">활동 종류</p>
          <div className="flex gap-2 py-2 overflow-x-auto scrollbar-hide">
            {ACTIVITY_TYPES.map(tag => (
              <ActivityTag
                key={tag}
                label={tag}
                selected={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
            {extraTags.map(tag => (
              <ActivityTag
                key={tag}
                label={tag}
                selected={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
            {isAddingTag ? (
              <input
                ref={tagInputRef}
                autoFocus
                type="text"
                value={newTagValue}
                onChange={e => setNewTagValue(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                onBlur={commitNewTag}
                size={Math.max(4, newTagValue.length)}
                className="px-3 py-2 rounded-xl border border-dashed border-grey-100 text-body2-md text-grey-900 outline-none bg-transparent shrink-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingTag(true)}
                className="flex shrink-0 items-center justify-center px-3 py-2 rounded-xl border border-dashed border-grey-100 text-body2-md text-grey-700 cursor-pointer"
              >
                +
              </button>
            )}
          </div>
        </div>

        {/* 날짜 */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <p className="text-sub2-sb text-grey-900">활동 시작일</p>
              <button
                type="button"
                onClick={() => handleDateClick(setStartDate)}
                className="flex items-center gap-2 py-3 border-b border-grey-100 cursor-pointer"
              >
                <CalendarIcon className="w-4 h-4 text-grey-400 shrink-0" />
                <span className={`text-body2-md ${startDate ? 'text-grey-900' : 'text-grey-400'}`}>{startDate || '날짜 선택'}</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sub2-sb text-grey-900">활동 종료일</p>
              <button
                type="button"
                onClick={() => !endDateUnknown && handleDateClick(setEndDate)}
                className={`flex items-center gap-2 py-3 border-b border-grey-100 cursor-pointer`}
              >
                <CalendarIcon className="w-4 h-4 text-grey-400 shrink-0" />
                <span className={`text-body2-md ${endDate && !endDateUnknown ? 'text-grey-900' : 'text-grey-400'}`}>{endDateUnknown ? '현재 진행 중' : endDate || '날짜 선택'}</span>
              </button>
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
        <Button label="활동 생성" disabled={isDisabled} />
      </div>
    </div>
  );
};
