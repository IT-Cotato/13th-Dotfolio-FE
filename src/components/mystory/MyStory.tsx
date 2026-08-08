import { useMemo, useState } from 'react';
import { ActivityModal } from '@/components/home/ActivityModal';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Card } from '@/components/common/card';
import { Toast } from '@/components/common/Toast';
import { useToast } from '@/hooks/useToast';
import { ACTIVITIES, DETAIL_SECTIONS, STORY_RECORDS } from './myStoryData';
import { MyStoryDetail } from './MyStoryDetail';
import { MyStorySearchBar } from './MyStorySearchBar';
import { MyStorySearchResults } from './MyStorySearchResults';
import { MyStoryTimeline } from './MyStoryTimeline';
import type { Activity, MyStoryView, StoryRecord } from './myStoryTypes';

export default function MyStory() {
  const [view, setView] = useState<MyStoryView>('timeline');
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activities, setActivities] = useState(ACTIVITIES);
  const [records, setRecords] = useState(STORY_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState(STORY_RECORDS[0]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);
  const [sectionValues, setSectionValues] = useState(DETAIL_SECTIONS.map(section => section.text));
  const [savedSectionValues, setSavedSectionValues] = useState(DETAIL_SECTIONS.map(section => section.text));
  const { toast, fireToast } = useToast();

  const searchResults = useMemo(() => {
    const normalizedQuery = submittedQuery.toLocaleLowerCase();

    return records.filter(record => {
      const activity = activities.find(item => item.id === record.activityId);
      const searchableText = [
        activity?.title,
        activity?.category,
        record.title,
        ...record.sections,
      ].filter(Boolean).join(' ').toLocaleLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [activities, records, submittedQuery]);

  const openDetail = (record: StoryRecord) => {
    setSelectedRecord(record);
    const nextValues = [...record.sections];
    setSectionValues(nextValues);
    setSavedSectionValues(nextValues);
    setView('detail');
  };

  const submitSearch = () => {
    const next = query.trim();
    if (!next) {
      setView('timeline');
      setSubmittedQuery('');
      return;
    }
    setSubmittedQuery(next);
    setView('search');
  };

  return (
    <Card className="story-shell relative items-stretch gap-0 rounded-t-[36px] p-6">
      {toast && (
        <div className="fixed z-[100] top-5 left-1/2 -translate-x-1/2 shadow-[0_8px_32px_rgba(34,62,120,.18)]">
          <Toast message={toast.message} onUndo={toast.onUndo} variant={toast.variant} />
        </div>
      )}

      {view !== 'detail' && (
        <MyStorySearchBar
          query={query}
          onQueryChange={setQuery}
          onSubmit={submitSearch}
          disabled={view === 'timeline' && activities.length === 0}
        />
      )}

      {view === 'timeline' && (
        <MyStoryTimeline
          activities={activities}
          records={records}
          expandedId={expandedId}
          openMenuId={openMenuId}
          onToggle={id => setExpandedId(current => current === id ? null : id)}
          onToggleMenu={id => setOpenMenuId(current => current === id ? null : id)}
          onOpenDetail={openDetail}
          onEditActivity={activity => {
            setOpenMenuId(null);
            setEditingActivity(activity);
          }}
          onDeleteActivity={activity => {
            setOpenMenuId(null);
            setDeletingActivity(activity);
          }}
        />
      )}
      {view === 'search' && (
        <MyStorySearchResults
          query={submittedQuery}
          results={searchResults}
          activities={activities}
          onOpenDetail={openDetail}
        />
      )}
      {view === 'detail' && (
        <MyStoryDetail
          record={selectedRecord}
          activityTitle={activities.find(activity => activity.id === selectedRecord.activityId)?.title ?? ''}
          values={sectionValues}
          isSaveDisabled={sectionValues.every((value, index) => value === savedSectionValues[index])}
          onBack={() => {
            setSectionValues(savedSectionValues);
            setView('timeline');
          }}
          onSave={() => {
            const updatedRecord = {
              ...selectedRecord,
              content: sectionValues[0],
              sections: [...sectionValues],
            };
            setRecords(current => current.map(record => record.id === updatedRecord.id ? updatedRecord : record));
            setSelectedRecord(updatedRecord);
            setSavedSectionValues([...sectionValues]);
            fireToast('변경사항이 저장되었습니다.');
          }}
          onChange={(index, value) => setSectionValues(values => values.map((item, i) => i === index ? value : item))}
          onCopy={async text => {
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

      {editingActivity && <ActivityModal
        isOpen
        onClose={() => setEditingActivity(null)}
        activity={{
          id: String(editingActivity.id),
          title: editingActivity.title,
          activityTypeId: editingActivity.category,
          activityTypeName: editingActivity.category,
          description: '',
          startDate: editingActivity.startDate,
          endDate: editingActivity.endDate,
          endDateUnknown: editingActivity.endDateUnknown,
          recordCount: records.filter(record => record.activityId === editingActivity.id).length,
          completedCount: records.filter(record => record.activityId === editingActivity.id).length,
        }}
        onSubmit={data => {
          if (!editingActivity) return;
          setActivities(current => current.map(activity => activity.id === editingActivity.id ? {
            ...activity,
            title: data.title,
            category: data.activityTypeId,
            startDate: data.startDate,
            endDate: data.endDate,
            endDateUnknown: data.endDateUnknown,
          } : activity));
          setEditingActivity(null);
          fireToast('활동이 수정되었습니다.');
        }}
      />}

      {deletingActivity && (
        <div className="[&_button]:!h-[50px]">
          <ConfirmModal
            isOpen
            title={`'${deletingActivity.title}' 활동을 삭제할까요?`}
            description="해당 활동과 관련된 모든 기록이 함께 삭제됩니다."
            confirmLabel="기록 삭제"
            onConfirm={() => {
              const deletedRecords = records.filter(record => record.activityId === deletingActivity.id);
              setActivities(current => current.filter(activity => activity.id !== deletingActivity.id));
              setRecords(current => current.filter(record => record.activityId !== deletingActivity.id));
              const deletedActivitySnapshot = deletingActivity;
              setDeletingActivity(null);
              setExpandedId(null);
              fireToast('활동이 삭제되었습니다.', () => {
                setActivities(current => [...current, deletedActivitySnapshot].sort((a, b) => a.id - b.id));
                setRecords(current => [...current, ...deletedRecords].sort((a, b) => a.id - b.id));
              });
            }}
            onCancel={() => setDeletingActivity(null)}
          />
        </div>
      )}
    </Card>
  );
}
