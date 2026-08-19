import { useCallback, useRef, useState, useEffect } from 'react';
import { ActivityTag } from '@/components/common/ActivityTag';
import { Button } from '@/components/common/button';
import { DatePicker } from '@/components/common/DatePicker';
import CalendarIcon from '@/assets/calendar_today.svg';
import CloseIcon from '@/assets/close.svg';
import { getActivityTypes, createActivityType, type ActivityTypeItem } from '@/api/activityTypes';
import { ApiError } from '@/api/client';
import type { ActivityFormData } from '@/contexts/ActivitiesContext';
import type { Activity } from '@/types/activity';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ActivityFormData) => void;
  activity?: Activity;
}

export const ActivityModal = ({ isOpen, onClose, onSubmit, activity }: ActivityModalProps) => {
  const [title, setTitle] = useState(activity?.title ?? '');
  const [types, setTypes] = useState<ActivityTypeItem[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState(activity?.activityTypeId ?? '');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');
  const [isCreatingType, setIsCreatingType] = useState(false);
  const [typeError, setTypeError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(activity?.startDate ?? '');
  const [endDate, setEndDate] = useState(activity?.endDate ?? '');
  const [endDateUnknown, setEndDateUnknown] = useState(activity?.endDateUnknown ?? false);
  const [openPicker, setOpenPicker] = useState<'start' | 'end' | null>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const startPickerRef = useRef<HTMLDivElement>(null);
  const endPickerRef = useRef<HTMLDivElement>(null);
  // 조회 요청끼리 순서가 뒤바뀌어 도착해도, 가장 나중에 보낸 요청의 응답만 반영되도록 추적.
  const fetchIdRef = useRef(0);
  // 텍스트 드래그 중 마우스가 배경으로 나가서 click이 배경 자체에서 발생하는 경우와
  // 실제로 배경을 클릭한 경우를 구분하기 위해, mousedown이 배경 자체에서 시작됐는지 추적.
  const backdropMouseDownRef = useRef(false);

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

  const fetchTypes = useCallback(async () => {
    const requestId = ++fetchIdRef.current;
    try {
      const response = await getActivityTypes();
      if (requestId !== fetchIdRef.current) return;
      setTypes(response.data);
    } catch {
      if (requestId === fetchIdRef.current) setTypes([]);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const run = async () => {
      await fetchTypes();
    };
    run();
  }, [isOpen, fetchTypes]);

  if (!isOpen) return null;

  const typeOptions = (
    activity && !types.some(t => t.id === activity.activityTypeId)
      ? [{ id: activity.activityTypeId, name: activity.activityTypeName, isDefault: false }, ...types]
      : types
  ).slice().sort((a, b) => Number(b.isDefault) - Number(a.isDefault));

  const selectType = (id: string) => {
    setSelectedTypeId(prev => (prev === id ? '' : id));
  };

  const commitNewTag = async () => {
    const trimmed = newTagValue.trim();
    setNewTagValue('');
    setIsAddingTag(false);
    if (!trimmed) return;

    const existing = typeOptions.find(t => t.name === trimmed);
    if (existing) {
      setSelectedTypeId(existing.id);
      return;
    }

    setIsCreatingType(true);
    setTypeError(null);
    try {
      const response = await createActivityType(trimmed);
      setSelectedTypeId(response.data);
      // 생성 직후 목록을 다시 조회해서 최신 상태로 맞춤 (진행 중이던 초기 조회가 뒤늦게 도착해도 이 요청이 우선하도록 fetchIdRef가 갱신됨).
      await fetchTypes();
    } catch (error) {
      setTypeError(error instanceof ApiError ? error.message : '활동 종류 생성에 실패했습니다.');
    } finally {
      setIsCreatingType(false);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); commitNewTag(); }
    else if (e.key === 'Escape') { setNewTagValue(''); setIsAddingTag(false); }
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
      onMouseDown={e => { backdropMouseDownRef.current = e.target === e.currentTarget; }}
      onClick={e => {
        if (!backdropMouseDownRef.current || e.target !== e.currentTarget) return;
        setOpenPicker(null);
        onClose();
      }}
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

        {/* 활동 종류 */}
        <div className="flex flex-col gap-2">
          <p className="text-sub2-sb text-grey-900">활동 종류</p>
          <div className="flex gap-2 py-2 overflow-x-auto scrollbar-hide">
            {typeOptions.map(type => (
              <ActivityTag
                key={type.id}
                label={type.name}
                selected={selectedTypeId === type.id}
                onClick={() => selectType(type.id)}
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
                disabled={isCreatingType}
                size={Math.max(4, newTagValue.length)}
                className="px-3 py-2 rounded-xl border border-dashed border-grey-100 text-body2-md text-grey-900 outline-none bg-transparent shrink-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingTag(true)}
                disabled={isCreatingType}
                className="flex shrink-0 items-center justify-center px-3 py-2 rounded-xl border border-dashed border-grey-100 text-body2-md text-grey-700 cursor-pointer"
              >
                +
              </button>
            )}
          </div>
          {typeError && <p className="text-caption1 text-error-text">{typeError}</p>}
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
          onClick={() => onSubmit({
            title,
            activityTypeId: selectedTypeId,
            description: activity?.description ?? '',
            startDate,
            endDate,
            endDateUnknown,
          })}
        />
      </div>
    </div>
  );
};
