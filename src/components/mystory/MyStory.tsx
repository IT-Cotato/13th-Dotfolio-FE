import { useCallback, useEffect, useState } from 'react';
import {
  createActivityType,
  deleteActivity,
  getActivityTypes,
  updateActivity,
  type ActivityTypeResponse,
} from '@/api/activity';
import { getRecord, updateRecord, type RecordResponse } from '@/api/record';
import { searchRecords, type RecordSearchResponse } from '@/api/search';
import { getStoryTimeline, type TimelineActivityResponse } from '@/api/story';
import { ActivityModal } from '@/components/home/ActivityModal';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Card } from '@/components/common/card';
import { Toast } from '@/components/common/Toast';
import { useToast } from '@/hooks/useToast';
import { MyStoryDetail } from './MyStoryDetail';
import { MyStorySearchBar } from './MyStorySearchBar';
import { MyStorySearchResults } from './MyStorySearchResults';
import { MyStoryTimeline } from './MyStoryTimeline';
import type { Activity, MyStoryView, StoryRecord } from './myStoryTypes';

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.replaceAll('-', '.');
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const normalizeDate = (value: string) => value.replaceAll('.', '-').replace(/-$/, '');

const getErrorMessage = (error: unknown, fallback: string) => (
  error instanceof Error ? error.message : fallback
);

const mapTimeline = (
  timeline: TimelineActivityResponse[],
  activityTypes: ActivityTypeResponse[],
) => {
  const activities: Activity[] = timeline.map((activity) => ({
    id: activity.activityId,
    activityTypeId: activityTypes.find((type) => type.name === activity.activityTypeName)?.id ?? '',
    title: activity.title,
    category: activity.activityTypeName,
    startDate: activity.startedAt,
    endDate: activity.endedAt ?? activity.startedAt,
    endDateUnknown: activity.isOngoing,
  }));

  const records: StoryRecord[] = timeline.flatMap((activity) => activity.records.map((record) => ({
    id: record.recordId,
    activityId: activity.activityId,
    activityTitle: activity.title,
    activityTypeName: activity.activityTypeName,
    templateTitle: '',
    title: record.title,
    date: formatDate(record.createdAt),
    status: record.status,
    content: '',
    sections: [],
    memos: [],
  })));

  return { activities, records };
};

const mapSearchRecord = (record: RecordSearchResponse): StoryRecord => ({
  id: record.recordId,
  activityTitle: record.activityTitle,
  activityTypeName: record.activityTypeName,
  templateTitle: record.templateTitle,
  title: record.title,
  date: formatDate(record.createdAt),
  status: 'COMPLETED',
  content: record.content,
  sections: [],
  memos: [],
});

const mapRecordDetail = (record: RecordResponse, previous?: StoryRecord): StoryRecord => ({
  id: record.id,
  activityId: record.activityId,
  activityTitle: record.activityTitle,
  activityTypeName: previous?.activityTypeName ?? '',
  templateTitle: record.templateTitle,
  title: record.title,
  date: formatDate(record.createdAt),
  status: record.status,
  content: record.answers[0]?.answerText ?? '',
  sections: [...record.answers]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((answer) => ({
      id: answer.templateQuestionId,
      label: answer.questionText,
      question: answer.questionDescription ?? '',
      text: answer.answerText,
      required: answer.required,
    })),
  memos: record.memos.map((memo) => ({
    memoId: memo.memoId,
    collapsed: memo.collapsed,
  })),
});

export default function MyStory() {
  const [view, setView] = useState<MyStoryView>('timeline');
  const [detailReturnView, setDetailReturnView] = useState<'timeline' | 'search'>('timeline');
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityTypes, setActivityTypes] = useState<ActivityTypeResponse[]>([]);
  const [records, setRecords] = useState<StoryRecord[]>([]);
  const [searchResultsState, setSearchResultsState] = useState<StoryRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<StoryRecord | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);
  const [sectionValues, setSectionValues] = useState<string[]>([]);
  const [savedSectionValues, setSavedSectionValues] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [openingRecordId, setOpeningRecordId] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingActivity, setIsUpdatingActivity] = useState(false);
  const { toast, fireToast } = useToast();

  const applyTimeline = useCallback((
    timeline: TimelineActivityResponse[],
    types: ActivityTypeResponse[],
  ) => {
    const mapped = mapTimeline(timeline, types);
    setActivities(mapped.activities);
    setRecords(mapped.records);
    setActivityTypes(types);
  }, []);

  const loadTimeline = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const [timeline, types] = await Promise.all([
        getStoryTimeline(),
        getActivityTypes(),
      ]);
      applyTimeline(timeline, types);
    } catch (error) {
      setLoadError(getErrorMessage(error, '나의 스토리를 불러오지 못했습니다.'));
    } finally {
      setIsLoading(false);
    }
  }, [applyTimeline]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getStoryTimeline(controller.signal),
      getActivityTypes(controller.signal),
    ])
      .then(([timeline, types]) => {
        if (!controller.signal.aborted) applyTimeline(timeline, types);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(getErrorMessage(error, '나의 스토리를 불러오지 못했습니다.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [applyTimeline]);

  const openDetail = async (record: StoryRecord) => {
    if (openingRecordId) return;
    setOpeningRecordId(record.id);
    try {
      const detail = mapRecordDetail(await getRecord(record.id), record);
      const nextValues = detail.sections.map((section) => section.text);
      setSelectedRecord(detail);
      setSectionValues(nextValues);
      setSavedSectionValues(nextValues);
      setDetailReturnView(view === 'search' ? 'search' : 'timeline');
      setView('detail');
    } catch (error) {
      fireToast(getErrorMessage(error, '기록 상세를 불러오지 못했습니다.'), undefined, 'error');
    } finally {
      setOpeningRecordId(undefined);
    }
  };

  const submitSearch = async () => {
    const next = query.trim();
    if (!next) {
      setView('timeline');
      setSubmittedQuery('');
      setSearchResultsState([]);
      return;
    }

    setSubmittedQuery(next);
    setView('search');
    setIsSearching(true);
    try {
      const response = await searchRecords(next);
      setSearchResultsState(response.content.map(mapSearchRecord));
    } catch (error) {
      setSearchResultsState([]);
      fireToast(getErrorMessage(error, '기록을 검색하지 못했습니다.'), undefined, 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const saveSelectedRecord = async () => {
    if (!selectedRecord || isSaving) return;
    setIsSaving(true);
    try {
      const updated = await updateRecord(selectedRecord.id, {
        title: selectedRecord.title,
        answers: selectedRecord.sections.map((section, index) => ({
          templateQuestionId: section.id,
          answerText: sectionValues[index] ?? '',
        })),
        memos: selectedRecord.memos,
        status: selectedRecord.status === 'DRAFT' ? 'DRAFT' : 'COMPLETED',
      });
      const updatedRecord = mapRecordDetail(updated, selectedRecord);
      const nextValues = updatedRecord.sections.map((section) => section.text);
      setSelectedRecord(updatedRecord);
      setSectionValues(nextValues);
      setSavedSectionValues(nextValues);
      setRecords((current) => current.map((record) => record.id === updatedRecord.id
        ? { ...record, title: updatedRecord.title, content: updatedRecord.content }
        : record));
      setSearchResultsState((current) => current.map((record) => record.id === updatedRecord.id
        ? { ...record, title: updatedRecord.title, content: updatedRecord.content }
        : record));
      fireToast('변경사항이 저장되었습니다.');
    } catch (error) {
      fireToast(getErrorMessage(error, '기록을 수정하지 못했습니다.'), undefined, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const submitActivityUpdate = async (data: {
    title: string;
    tags: string[];
    startDate: string;
    endDate: string;
    endDateUnknown: boolean;
  }) => {
    if (!editingActivity || isUpdatingActivity) return;
    setIsUpdatingActivity(true);
    try {
      const activityTypeName = data.tags[0];
      let activityType = activityTypes.find((type) => type.name === activityTypeName);
      if (!activityType) {
        const activityTypeId = await createActivityType(activityTypeName);
        activityType = { id: activityTypeId, name: activityTypeName, isDefault: false };
        setActivityTypes((current) => [...current, activityType as ActivityTypeResponse]);
      }

      await updateActivity(editingActivity.id, {
        activityTypeId: activityType.id,
        title: data.title.trim(),
        description: editingActivity.description,
        startedAt: normalizeDate(data.startDate),
        endedAt: data.endDateUnknown ? undefined : normalizeDate(data.endDate),
        isOngoing: data.endDateUnknown,
      });
      setActivities((current) => current.map((activity) => activity.id === editingActivity.id ? {
        ...activity,
        activityTypeId: activityType.id,
        title: data.title.trim(),
        category: activityType.name,
        startDate: normalizeDate(data.startDate),
        endDate: data.endDateUnknown ? activity.endDate : normalizeDate(data.endDate),
        endDateUnknown: data.endDateUnknown,
      } : activity));
      setRecords((current) => current.map((record) => record.activityId === editingActivity.id ? {
        ...record,
        activityTitle: data.title.trim(),
        activityTypeName: activityType.name,
      } : record));
      setEditingActivity(null);
      fireToast('활동이 수정되었습니다.');
    } catch (error) {
      fireToast(getErrorMessage(error, '활동을 수정하지 못했습니다.'), undefined, 'error');
    } finally {
      setIsUpdatingActivity(false);
    }
  };

  const confirmActivityDelete = async () => {
    if (!deletingActivity) return;
    try {
      await deleteActivity(deletingActivity.id);
      setActivities((current) => current.filter((activity) => activity.id !== deletingActivity.id));
      setRecords((current) => current.filter((record) => record.activityId !== deletingActivity.id));
      setDeletingActivity(null);
      setExpandedId(null);
      fireToast('활동이 삭제되었습니다.');
    } catch (error) {
      fireToast(getErrorMessage(error, '활동을 삭제하지 못했습니다.'), undefined, 'error');
    }
  };

  return (
    <Card className="story-shell relative items-stretch gap-0 rounded-t-[36px] p-6">
      {toast && (
        <div className="fixed left-1/2 top-5 z-[100] -translate-x-1/2 shadow-[0_8px_32px_rgba(34,62,120,.18)]">
          <Toast message={toast.message} onUndo={toast.onUndo} variant={toast.variant} />
        </div>
      )}

      {view !== 'detail' && (
        <MyStorySearchBar
          query={query}
          onQueryChange={setQuery}
          onSubmit={() => void submitSearch()}
          disabled={isLoading || isSearching}
        />
      )}

      {view === 'timeline' && isLoading && (
        <section className="grid min-h-[55vh] place-items-center text-body2-md text-grey-500" aria-live="polite">
          나의 스토리를 불러오는 중...
        </section>
      )}
      {view === 'timeline' && !isLoading && loadError && (
        <section className="grid min-h-[55vh] place-items-center text-center">
          <div>
            <p role="alert" className="text-body2-md text-error-text">{loadError}</p>
            <button type="button" onClick={() => void loadTimeline()} className="mt-4 rounded-xl border border-primary-500 px-4 py-2 text-body2-md text-primary-500">
              다시 시도
            </button>
          </div>
        </section>
      )}
      {view === 'timeline' && !isLoading && !loadError && (
        <MyStoryTimeline
          activities={activities}
          records={records}
          expandedId={expandedId}
          openMenuId={openMenuId}
          onToggle={(id) => setExpandedId((current) => current === id ? null : id)}
          onToggleMenu={(id) => setOpenMenuId((current) => current === id ? null : id)}
          onOpenDetail={(record) => void openDetail(record)}
          onEditActivity={(activity) => {
            setOpenMenuId(null);
            setEditingActivity(activity);
          }}
          onDeleteActivity={(activity) => {
            setOpenMenuId(null);
            setDeletingActivity(activity);
          }}
        />
      )}
      {view === 'search' && isSearching && (
        <section className="grid min-h-[55vh] place-items-center text-body2-md text-grey-500" aria-live="polite">
          기록을 검색하는 중...
        </section>
      )}
      {view === 'search' && !isSearching && (
        <MyStorySearchResults
          query={submittedQuery}
          results={searchResultsState}
          onOpenDetail={(record) => void openDetail(record)}
        />
      )}
      {view === 'detail' && selectedRecord && (
        <MyStoryDetail
          record={selectedRecord}
          activityTitle={selectedRecord.activityTitle}
          values={sectionValues}
          isSaveDisabled={sectionValues.every((value, index) => value === savedSectionValues[index])}
          isSaving={isSaving}
          onBack={() => {
            setSectionValues(savedSectionValues);
            setView(detailReturnView);
          }}
          onSave={() => void saveSelectedRecord()}
          onChange={(index, value) => setSectionValues((values) => values.map((item, i) => i === index ? value : item))}
          onCopy={async (text) => {
            try {
              if (!navigator.clipboard?.writeText) throw new Error('Clipboard API is unavailable');
              await navigator.clipboard.writeText(text);
              fireToast('내용이 복사되었습니다.');
            } catch {
              fireToast('내용을 복사하지 못했습니다.', undefined, 'error');
            }
          }}
        />
      )}

      {editingActivity && (
        <ActivityModal
          isOpen
          activityTypes={activityTypes.map((type) => type.name)}
          onClose={() => setEditingActivity(null)}
          activity={{
            id: editingActivity.id,
            title: editingActivity.title,
            tags: [editingActivity.category],
            startDate: editingActivity.startDate,
            endDate: editingActivity.endDate,
            endDateUnknown: editingActivity.endDateUnknown,
            recordCount: records.filter((record) => record.activityId === editingActivity.id).length,
            completedCount: records.filter((record) => record.activityId === editingActivity.id).length,
          }}
          onSubmit={(data) => void submitActivityUpdate(data)}
        />
      )}

      {deletingActivity && (
        <div className="[&_button]:!h-[50px]">
          <ConfirmModal
            isOpen
            title={`'${deletingActivity.title}' 활동을 삭제할까요?`}
            description="해당 활동과 관련된 모든 기록이 함께 삭제됩니다."
            confirmLabel="기록 삭제"
            onConfirm={() => void confirmActivityDelete()}
            onCancel={() => setDeletingActivity(null)}
          />
        </div>
      )}
    </Card>
  );
}
