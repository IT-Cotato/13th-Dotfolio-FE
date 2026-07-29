import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/common/card';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { Toast } from '@/components/common/Toast';
import { RecordActionButtons } from '@/components/record/RecordActionButtons';
import { MemoSelectModal } from '@/components/record/MemoSelectModal';
import { MemoLoadedCard } from '@/components/record/MemoLoadedCard';
import { MemoDetailModal } from '@/components/record/MemoDetailModal';
import { RECORD_TEMPLATES } from '@/constants/templates';
import { useActivities } from '@/contexts/ActivitiesContext';
import { useToast } from '@/hooks/useToast';
import MEMOS from '@/mock/memos.json';
import type { Memo } from '@/types/memo';
import MemoUploadIcon from '@/assets/memoupload.svg';

export default function RecordWrite() {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const { selectedActivity } = useActivities();
  const { toast, fireToast } = useToast();

  const template = useMemo(
    () => RECORD_TEMPLATES.find(t => t.id === templateId),
    [templateId]
  );

  const [title, setTitle] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedMemos, setSelectedMemos] = useState<Memo[]>([]);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [detailMemo, setDetailMemo] = useState<Memo | null>(null);

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

  const handleTempSave = () => {
    fireToast('임시저장되었습니다.');
  };

  const handleComplete = () => {
    if (!isValid) {
      fireToast('필수 항목을 입력해주세요.', undefined, 'error');
      return;
    }
    fireToast('기록을 성공적으로 저장하였습니다.');
    setTimeout(() => navigate('/record'), 2000);
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

          <div className="flex flex-col gap-4">
            <p className="text-sub1-sb text-grey-900">템플릿 양식</p>
            <div className="flex flex-col gap-8 p-6 rounded-3xl border border-grey-100">
              {template.questions?.map((question, index) => (
                <div key={question.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 shrink-0 flex items-center justify-center rounded-md bg-primary-50 text-primary-500 text-label3-sb">
                      {index + 1}
                    </span>
                    <p className="text-sub2-sb text-grey-900">
                      {question.required && <span className="text-error-text">* </span>}
                      {question.label}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pl-8">
                    {question.description && (
                      <p className="text-body2-md text-grey-700">{question.description}</p>
                    )}
                    <textarea
                      value={answers[question.id] ?? ''}
                      onChange={e => handleAnswerChange(question.id, e.target.value)}
                      placeholder="내용을 입력해주세요."
                      rows={4}
                      className="w-full p-4 rounded-xl border border-grey-100 text-body-reading2-md text-grey-900 placeholder:text-grey-400 outline-none resize-none transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <MemoSelectModal
        isOpen={isMemoModalOpen}
        memos={MEMOS}
        onClose={() => setIsMemoModalOpen(false)}
        onSelect={memos => {
          setSelectedMemos(memos);
          setIsMemoModalOpen(false);
        }}
      />

      <MemoDetailModal memo={detailMemo} onClose={() => setDetailMemo(null)} />

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
          <Toast message={toast.message} onUndo={toast.onUndo} variant={toast.variant} />
        </div>
      )}
    </Card>
  );
}
