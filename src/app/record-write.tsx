import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/common/card';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { Toast } from '@/components/common/Toast';
import { RecordActionButtons } from '@/components/record/RecordActionButtons';
import { RecordTemplateForm } from '@/components/record/RecordTemplateForm';
import { MemoSelectModal } from '@/components/record/MemoSelectModal';
import { MemoLoadedCard } from '@/components/record/MemoLoadedCard';
import { MemoDetailModal } from '@/components/record/MemoDetailModal';
import { useActivities } from '@/contexts/ActivitiesContext';
import { useTemplates } from '@/contexts/TemplatesContext';
import { createRecord, updateRecord, getRecords, getRecordDetail } from '@/api/records';
import { getMemos, toMemo } from '@/api/memos';
import { ApiError } from '@/api/client';
import { useToast } from '@/hooks/useToast';
import type { Memo } from '@/types/memo';
import MemoUploadIcon from '@/assets/memoupload.svg';

export default function RecordWrite() {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const { selectedActivity } = useActivities();
  const { templates } = useTemplates();
  const { toast, fireToast } = useToast();

  const template = useMemo(
    () => templates.find(t => t.id === templateId),
    [templates, templateId]
  );

  const [savedRecordId, setSavedRecordId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedMemos, setSelectedMemos] = useState<Memo[]>([]);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [detailMemo, setDetailMemo] = useState<Memo | null>(null);

  // 임시저장 후 다른 화면으로 이동했다가 같은 활동+템플릿으로 재진입하면,
  // 새로 만들지 않고 기존 DRAFT 기록을 이어서 수정하도록 조회해서 불러옴.
  useEffect(() => {
    if (!selectedActivity || !template) return;

    let cancelled = false;

    const loadExistingDraft = async () => {
      try {
        const listResponse = await getRecords({
          activityId: selectedActivity.id,
          templateId: template.id,
          status: 'DRAFT',
          page: 0,
          size: 1,
        });
        const existing = listResponse.data.content[0];
        if (!existing || cancelled) return;

        const detailResponse = await getRecordDetail(existing.id);
        if (cancelled) return;

        setSavedRecordId(existing.id);
        setTitle(detailResponse.data.title);
        setAnswers(prev => ({
          ...prev,
          ...Object.fromEntries(detailResponse.data.answers.map(a => [a.templateQuestionId, a.answerText])),
        }));

        const memosResponse = await getMemos();
        if (cancelled) return;
        const allMemos = memosResponse.data.map(toMemo);
        setSelectedMemos(allMemos.filter(memo => detailResponse.data.memos.some(m => m.memoId === memo.id)));
      } catch (error) {
        console.error('[record-write] 기존 임시저장 기록을 불러오지 못했습니다.', error);
      }
    };

    loadExistingDraft();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedActivity?.id, template?.id]);

  if (!template) {
    navigate('/record');
    return null;
  }

  const requiredQuestions = template.questions?.filter(q => q.required) ?? [];
  const isValid =
    title.trim().length > 0 &&
    requiredQuestions.every(q => (answers[q.id] ?? '').trim().length > 0);

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const buildCommonPayload = (status: 'DRAFT' | 'COMPLETED') => ({
    title,
    answers: (template.questions ?? []).map(q => ({
      templateQuestionId: q.id,
      answerText: answers[q.id] ?? '',
    })),
    memos: selectedMemos.map(memo => ({ memoId: memo.id, collapsed: false })),
    status,
  });

  const saveRecord = async (status: 'DRAFT' | 'COMPLETED') => {
    if (savedRecordId) {
      await updateRecord(savedRecordId, buildCommonPayload(status));
      return;
    }
    const response = await createRecord({
      activityId: selectedActivity!.id,
      templateId: template.id,
      ...buildCommonPayload(status),
    });
    setSavedRecordId(response.data.id);
  };

  const handleTempSave = async () => {
    if (!selectedActivity) {
      console.error('[record-write] 선택된 활동이 없어 임시저장을 진행할 수 없습니다.');
      return;
    }
    try {
      await saveRecord('DRAFT');
      fireToast('임시저장되었습니다.');
      setTimeout(() => navigate('/record'), 2000);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '임시저장에 실패했습니다.';
      fireToast(message, undefined, 'error');
    }
  };

  const handleComplete = async () => {
    if (!isValid) {
      fireToast('필수 항목을 입력해주세요.', undefined, 'error');
      return;
    }
    if (!selectedActivity) {
      console.error('[record-write] 선택된 활동이 없어 기록완료를 진행할 수 없습니다.');
      return;
    }
    try {
      await saveRecord('COMPLETED');
      fireToast('기록을 성공적으로 저장하였습니다.');
      setTimeout(() => navigate('/record'), 2000);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '기록 저장에 실패했습니다.';
      fireToast(message, undefined, 'error');
    }
  };

  return (
    <Card>
      <Breadcrumb
        items={[
          { label: selectedActivity?.title ?? '', onClick: () => navigate('/record') },
          { label: '템플릿 작성' },
        ]}
      />

      <div className="w-full flex flex-col gap-8">
        <CategoryHeader
          title={template.title}
          onBack={() => navigate('/record')}
          extra={
            <RecordActionButtons isValid={isValid} onTempSave={handleTempSave} onComplete={handleComplete} />
          }
        />

        <div className="w-full flex flex-col gap-2">
          <p className="text-sub1-sb text-grey-900">
            <span className="text-error-text">*</span> 기록 제목
          </p>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="기록의 제목을 입력해주세요. (예: 데이터 시각화 대시보드 개선)"
            className={`px-4 py-4 rounded-[14px] border border-grey-100 text-body-reading2-md text-grey-900 placeholder:text-grey-400 outline-none transition-colors`}
          />
        </div>

        <div className="w-full grid grid-cols-[280px_1fr] gap-6 items-start">
          <div className="flex flex-col gap-4">
            <div className="w-full flex items-center justify-between">
              <p className="text-sub1-sb text-grey-900 pl-1">메모 {selectedMemos.length}</p>
              {selectedMemos.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsMemoModalOpen(true)}
                  className="px-3 py-1 mr-1 rounded-lg border border-grey-100 bg-grey-0 text-primary-500 text-label3-sb cursor-pointer"
                >
                  메모 추가
                </button>
              )}
            </div>
            <div className="w-full flex flex-col gap-4 px-4 py-4 rounded-2xl border border-dashed border-grey-100">
              {selectedMemos.length === 0 ? (
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <MemoUploadIcon className="w-6 h-6 text-primary-400" />
                    <p className="text-sub2-sb text-grey-900">메모 불러오기</p>
                    <p className="text-body-reading2-md text-grey-700">
                      저장된 메모를 불러와<br />기록 작성에 활용해보세요.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMemoModalOpen(true)}
                    className="w-full px-5 py-2.5 rounded-xl border border-grey-100 text-primary-500 text-sub2-sb cursor-pointer"
                  >
                    메모 선택
                  </button>
                </div>
              ) : (
                selectedMemos.map(memo => (
                  <MemoLoadedCard
                    key={memo.id}
                    memo={memo}
                    onDelete={() => setSelectedMemos(prev => prev.filter(m => m.id !== memo.id))}
                    onOpenDetail={() => setDetailMemo(memo)}
                  />
                ))
              )}
            </div>
          </div>

          <RecordTemplateForm
            answers={answers}
            onAnswerChange={handleAnswerChange}
            questions={template.questions ?? []}
          />
        </div>
      </div>

      <MemoSelectModal
        isOpen={isMemoModalOpen}
        selectedMemos={selectedMemos}
        onClose={() => setIsMemoModalOpen(false)}
        onSelect={memos => {
          setSelectedMemos(memos);
          setIsMemoModalOpen(false);
        }}
      />

      <MemoDetailModal memo={detailMemo} onClose={() => setDetailMemo(null)} />

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-100">
          <Toast message={toast.message} onUndo={toast.onUndo} variant={toast.variant} />
        </div>
      )}
    </Card>
  );
}
