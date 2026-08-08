import { useRef, useState, useEffect } from 'react';
import { ActivityTag } from '@/components/common/ActivityTag';
import { Button } from '@/components/common/button';
import { DatePicker } from '@/components/common/DatePicker';
import CalendarIcon from '@/assets/calendar_today.svg';
import CloseIcon from '@/assets/close.svg';
import { useActivities, type ActivityFormData } from '@/contexts/ActivitiesContext';
import type { Activity } from '@/types/activity';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ActivityFormData) => void;
  activity?: Activity;
}

export const ActivityModal = ({ isOpen, onClose, onSubmit, activity }: ActivityModalProps) => {
  const { activities } = useActivities();
  const [title, setTitle] = useState(activity?.title ?? '');
  const [description, setDescription] = useState(activity?.description ?? '');
  const [selectedTypeId, setSelectedTypeId] = useState(activity?.activityTypeId ?? '');
  const [selectedCustomLabel, setSelectedCustomLabel] = useState<string | null>(null);
  const [extraLabels, setExtraLabels] = useState<string[]>([]);
  const [isAddingType, setIsAddingType] = useState(false);
  const [newTypeValue, setNewTypeValue] = useState('');
  const [startDate, setStartDate] = useState(activity?.startDate ?? '');
  const [endDate, setEndDate] = useState(activity?.endDate ?? '');
  const [endDateUnknown, setEndDateUnknown] = useState(activity?.endDateUnknown ?? false);
  const [openPicker, setOpenPicker] = useState<'start' | 'end' | null>(null);
  const typeInputRef = useRef<HTMLInputElement>(null);
  const startPickerRef = useRef<HTMLDivElement>(null);
  const endPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openPicker) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const ref = openPicker === 'start' ? startPickerRef : endPickerRef;
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenPicker(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [openPicker]);

  if (!isOpen) return null;

  // 활동 종류 목록 조회 API가 없어서, 지금까지 만들어진 활동들에서 종류를 추려서 보여줌.
  // 활동이 하나도 없으면 고를 수 있는 종류도 없음 (백엔드에 목록 API가 생기면 교체 필요).
  const typeOptions = Array.from(
    new Map(activities.map(a => [a.activityTypeId, a.activityTypeName])).entries()
  ).map(([id, name]) => ({ id, name }));

  if (activity && !typeOptions.some(t => t.id === activity.activityTypeId)) {
    typeOptions.unshift({ id: activity.activityTypeId, name: activity.activityTypeName });
  }

  const selectType = (id: string, name: string) => {
    setSelectedTypeId(id);
    setSelectedCustomLabel(null);
    void name;
  };

  const selectCustomLabel = (label: string) => {
    setSelectedCustomLabel(prev => (prev === label ? null : label));
    setSelectedTypeId('');
  };

  const commitNewType = () => {
    const trimmed = newTypeValue.trim();
    if (trimmed && !extraLabels.includes(trimmed) && !typeOptions.some(t => t.name === trimmed)) {
      setExtraLabels(prev => [...prev, trimmed]);
      setSelectedCustomLabel(trimmed);
      setSelectedTypeId('');
    }
    setNewTypeValue('');
    setIsAddingType(false);
  };

  const handleTypeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); commitNewType(); }
    else if (e.key === 'Escape') { setNewTypeValue(''); setIsAddingType(false); }
  };

  const isDisabled =
    !title.trim() ||
    !selectedTypeId ||
    !startDate ||
    (!endDate && !endDateUnknown);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(28, 28, 26, 0.62)' }}
      onClick={() => { setOpenPicker(null); onClose(); }}
    >
      <div
        className="relative w-full max-w-116 mx-4 bg-white rounded-3xl px-8 pt-6 pb-8 flex flex-col gap-8"
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

        {/* 활동 설명 */}
        <div className="flex flex-col gap-2">
          <p className="text-sub2-sb text-grey-900">활동 설명</p>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="활동에 대해 간단히 설명해주세요."
            rows={2}
            className="py-3 border-b border-grey-100 text-body2-md text-grey-900 placeholder:text-grey-400 outline-none resize-none transition-colors"
          />
        </div>

        {/* 활동 종류 */}
        <div className="flex flex-col gap-2">
          <p className="text-sub2-sb text-grey-900">활동 종류</p>
          <div className="flex gap-2 py-2 overflow-x-auto scrollbar-hide">
            {typeOptions.map(option => (
              <ActivityTag
                key={option.id}
                label={option.name}
                selected={selectedTypeId === option.id}
                onClick={() => selectType(option.id, option.name)}
              />
            ))}
            {extraLabels.map(label => (
              <ActivityTag
                key={label}
                label={label}
                selected={selectedCustomLabel === label}
                onClick={() => selectCustomLabel(label)}
              />
            ))}
            {isAddingType ? (
              <input
                ref={typeInputRef}
                autoFocus
                type="text"
                value={newTypeValue}
                onChange={e => setNewTypeValue(e.target.value)}
                onKeyDown={handleTypeInputKeyDown}
                onBlur={commitNewType}
                size={Math.max(4, newTypeValue.length)}
                className="px-3 py-2 rounded-xl border border-dashed border-grey-100 text-body2-md text-grey-900 outline-none bg-transparent shrink-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingType(true)}
                className="flex shrink-0 items-center justify-center px-3 py-2 rounded-xl border border-dashed border-grey-100 text-body2-md text-grey-700 cursor-pointer"
              >
                +
              </button>
            )}
          </div>
          {selectedCustomLabel && (
            <p className="text-caption1 text-error-text">
              새로운 활동 종류는 아직 생성할 수 없어요. 기존 종류 중에서 선택해주세요.
            </p>
          )}
          {typeOptions.length === 0 && (
            <p className="text-caption1 text-grey-400">선택 가능한 활동 종류가 없어요.</p>
          )}
        </div>

        {/* 날짜 */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {/* 시작일 */}
            <div className="flex flex-col gap-2">
              <p className="text-sub2-sb text-grey-900">활동 시작일</p>
              <div className="relative" ref={startPickerRef}>
                <button
                  type="button"
                  onClick={() => setOpenPicker(prev => prev === 'start' ? null : 'start')}
                  className="w-full flex items-center gap-2 py-3 border-b border-grey-100 cursor-pointer"
                >
                  <CalendarIcon className="w-4 h-4 text-grey-400 shrink-0" />
                  <span className={`text-body2-md ${startDate ? 'text-grey-900' : 'text-grey-400'}`}>
                    {startDate || '날짜 선택'}
                  </span>
                </button>
                {openPicker === 'start' && (
                  <div className="absolute top-full left-0 mt-2 z-10">
                    <DatePicker
                      value={startDate}
                      onChange={setStartDate}
                      onClose={() => setOpenPicker(null)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 종료일 */}
            <div className="flex flex-col gap-2">
              <p className="text-sub2-sb text-grey-900">활동 종료일</p>
              <div className="relative" ref={endPickerRef}>
                <button
                  type="button"
                  onClick={() => !endDateUnknown && setOpenPicker(prev => prev === 'end' ? null : 'end')}
                  className="w-full flex items-center gap-2 py-3 border-b border-grey-100 cursor-pointer"
                >
                  <CalendarIcon className="w-4 h-4 text-grey-400 shrink-0" />
                  <span className={`text-body2-md ${endDate && !endDateUnknown ? 'text-grey-900' : 'text-grey-400'}`}>
                    {endDateUnknown ? '현재 진행 중' : endDate || '날짜 선택'}
                  </span>
                </button>
                {openPicker === 'end' && (
                  <div className="absolute top-full right-0 mt-2 z-10">
                    <DatePicker
                      value={endDate}
                      onChange={setEndDate}
                      onClose={() => setOpenPicker(null)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-2">
            <button
              type="button"
              onClick={() => { setEndDateUnknown(prev => !prev); setOpenPicker(null); }}
              className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors cursor-pointer ${
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

        <Button
          label={activity ? '수정하기' : '활동 생성'}
          disabled={isDisabled}
          onClick={() => onSubmit({ title, activityTypeId: selectedTypeId, description, startDate, endDate, endDateUnknown })}
        />
      </div>
    </div>
  );
};
