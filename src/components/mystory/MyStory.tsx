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
  const [selectedRecord, setSelectedRecord] = useState(STORY_RECORDS[0]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);
  const [sectionValues, setSectionValues] = useState(DETAIL_SECTIONS.map(section => section.text));
  const [savedSectionValues, setSavedSectionValues] = useState(DETAIL_SECTIONS.map(section => section.text));
  const { toast, fireToast } = useToast();

  const searchResults = useMemo(
    () => STORY_RECORDS.filter(record => `${record.title} ${record.content}`.includes(submittedQuery)),
    [submittedQuery],
  );

  const openDetail = (record: StoryRecord) => {
    setSelectedRecord(record);
    const nextValues = [
      record.content,
      DETAIL_SECTIONS[1].text,
      DETAIL_SECTIONS[2].text,
    ];
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
          <Toast message={toast.message} onUndo={toast.onUndo} />
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
          records={STORY_RECORDS}
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
          onOpenDetail={openDetail}
        />
      )}
      {view === 'detail' && (
        <MyStoryDetail
          record={selectedRecord}
          values={sectionValues}
          isSaveDisabled={sectionValues.every((value, index) => value === savedSectionValues[index])}
          onBack={() => setView('timeline')}
          onSave={() => {
            setSavedSectionValues(sectionValues);
            fireToast('변경사항이 저장되었습니다.');
          }}
          onChange={(index, value) => setSectionValues(values => values.map((item, i) => i === index ? value : item))}
          onCopy={text => {
            void navigator.clipboard?.writeText(text);
            fireToast('내용이 복사되었습니다.');
          }}
        />
      )}

      {editingActivity && <ActivityModal
        isOpen
        onClose={() => setEditingActivity(null)}
        activity={{
          id: String(editingActivity.id),
          title: editingActivity.title,
          tags: [editingActivity.category],
          startDate: editingActivity.startDate,
          endDate: editingActivity.endDate,
          endDateUnknown: editingActivity.endDateUnknown,
          recordCount: STORY_RECORDS.length,
          completedCount: STORY_RECORDS.length,
        }}
        onSubmit={data => {
          if (!editingActivity) return;
          setActivities(current => current.map(activity => activity.id === editingActivity.id ? {
            ...activity,
            title: data.title,
            category: data.tags[0],
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
              setActivities(current => current.filter(activity => activity.id !== deletingActivity.id));
              const deletedActivitySnapshot = deletingActivity;
              setDeletingActivity(null);
              setExpandedId(null);
              fireToast('활동이 삭제되었습니다.', () => {
                setActivities(current => [...current, deletedActivitySnapshot].sort((a, b) => a.id - b.id));
              });
            }}
            onCancel={() => setDeletingActivity(null)}
          />
        </div>
      )}
    </Card>
  );
}
