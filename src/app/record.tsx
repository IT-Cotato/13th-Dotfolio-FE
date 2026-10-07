import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/card';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { Template } from '@/components/common/Template';
import { PrimaryButton } from '@/components/common/createButton';
import { ActivityModal } from '@/components/home/ActivityModal';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Toast } from '@/components/common/Toast';
import { RecordList } from '@/components/record/RecordList';
import { CustomTemplateModal, type CustomTemplateData } from '@/components/common/CustomTemplateModal';
import { useToast } from '@/hooks/useToast';
import { useRecordDeletion } from '@/hooks/useRecordDeletion';
import { useActivities, type ActivityFormData } from '@/contexts/ActivitiesContext';
import { useTemplates } from '@/contexts/TemplatesContext';
import { getRecords, toRecordEntry } from '@/api/records';
import { ApiError } from '@/api/client';
import type { RecordEntry } from '@/types/record';

export default function Record() {
  const navigate = useNavigate();
  const { activities, isLoading: isActivitiesLoading, selectedActivity, addActivity } = useActivities();
  const { templates, addCustomTemplate } = useTemplates();
  const [records, setRecords] = useState<RecordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const toastState = useToast();
  const { toast, fireToast } = toastState;

  const handleCreateCustomTemplate = async (data: CustomTemplateData) => {
    await addCustomTemplate(data);
    setIsCustomModalOpen(false);
    fireToast('템플릿이 성공적으로 생성되었습니다.');
  };

  const handleCreateActivity = async (data: ActivityFormData) => {
    try {
      await addActivity(data);
      setIsActivityModalOpen(false);
      fireToast('활동이 성공적으로 생성되었습니다.');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '활동 생성에 실패했습니다.';
      fireToast(message, undefined, 'error');
    }
  };

  const fetchRecent = useCallback(async () => {
    if (!selectedActivity) {
      setRecords([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await getRecords({ activityId: selectedActivity.id, page: 0, size: 4 });
      setRecords(response.data.content.map(toRecordEntry));
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '기록을 불러오지 못했습니다.';
      fireToast(message, undefined, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedActivity, fireToast]);

  useEffect(() => {
    const run = async () => {
      await fetchRecent();
    };
    run();
  }, [fetchRecent]);

  const { deleteTarget, setDeleteTarget, handleConfirmDelete } = useRecordDeletion(fetchRecent, toastState);

  if (!isActivitiesLoading && activities.length === 0) {
    return (
      <Card>
        <CategoryHeader title="기록하기" />
        <div className="w-full flex-1 flex flex-col items-center justify-center gap-6">
          <p className="text-body2-md text-grey-700 text-center">
            활동을 먼저 생성하고<br />
            기록을 시작해보세요.
          </p>
          <PrimaryButton label="활동 생성하기" onClick={() => setIsActivityModalOpen(true)} />
        </div>

        {isActivityModalOpen && (
          <ActivityModal
            isOpen
            onClose={() => setIsActivityModalOpen(false)}
            onSubmit={handleCreateActivity}
          />
        )}

        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
            <Toast message={toast.message} onUndo={toast.onUndo} variant={toast.variant} />
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <Breadcrumb
        items={[
          { label: '기록하기' },
          { label: selectedActivity?.title ?? '' },
        ]}
      />
      <div className="w-full flex flex-col gap-6">
        <CategoryHeader
            title="기록 템플릿"
            moreLabel="더 많은 템플릿 보기"
            onMoreClick={() => navigate('/template-all')}
            />
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(220px,266px))]">
          {templates.filter(template => !template.isCustom).map(template => (
            <Template
              key={template.id}
              title={template.title}
              description={template.description}
              bgClassName={template.bgClassName}
              borderClassName={template.borderClassName}
              onClick={() => navigate(`/record/write/${template.id}`)}
            />
          ))}
        </div>
      </div>

      {!isLoading && records.length === 0 ? (
        <div className="w-full flex-1 flex flex-col items-center justify-center gap-8">
          <div className="max-w-[260px] flex flex-col items-center gap-2 text-center">
            <p className="text-sub1-sb text-grey-950">원하는 기록 양식이 없나요?</p>
            <p className="text-body2-r text-grey-700">
              주제와 질문을 직접 설정해 나만의 템플릿을 만들어보세요.
            </p>
          </div>
          <PrimaryButton label="템플릿 만들기" onClick={() => setIsCustomModalOpen(true)} size="sm" />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-6">
          <CategoryHeader
            title="최근 작성한 기록"
            moreLabel="전체 기록 보기"
            onMoreClick={() => navigate('/record-all')}
          />
          <RecordList
            records={records}
            onDeleteClick={setDeleteTarget}
            onRecordClick={record => navigate(`/record/write/${record.templateId}`, { state: { recordId: record.id } })}
          />
        </div>
      )}

      <CustomTemplateModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={handleCreateCustomTemplate}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title={`'${deleteTarget?.title}' 기록을 삭제할까요?`}
        description="삭제한 기록은 다시 복구할 수 없습니다."
        confirmLabel="기록 삭제"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
          <Toast message={toast.message} onUndo={toast.onUndo} variant={toast.variant} />
        </div>
      )}
    </Card>
  );
}
