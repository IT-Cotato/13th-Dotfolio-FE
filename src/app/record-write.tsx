import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/common/card';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { Toast } from '@/components/common/Toast';
import { RECORD_TEMPLATES } from '@/constants/templates';
import { useActivities } from '@/contexts/ActivitiesContext';
import { useToast } from '@/hooks/useToast';
import DocumentIcon from '@/assets/document.svg';

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
    fireToast('기록이 완료되었습니다.');
    navigate('/record');
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTempSave}
                className="px-5 py-2.5 rounded-xl border border-grey-100 bg-grey-50 text-grey-600 text-sub2-sb cursor-pointer"
              >
                임시저장
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className={`px-5 py-2.5 rounded-xl text-sub2-sb transition-colors ${
                  isValid
                    ? 'bg-primary-500 text-grey-0 cursor-pointer'
                    : 'bg-grey-300 text-grey-0 cursor-not-allowed'
                }`}
              >
                기록완료
              </button>
            </div>
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

        <div className="w-full grid grid-cols-[280px_1fr] gap-8 items-start">
          <div className="flex flex-col gap-3">
            <p className="text-sub1-sb text-grey-900">메모 0</p>
            <div className="w-full flex flex-col items-center gap-2 px-4 py-6 rounded-2xl border border-dashed border-grey-100 text-center">
              <DocumentIcon className="w-6 h-6 text-primary-400" />
              <p className="text-sub2-sb text-grey-900">메모 불러오기</p>
              <p className="text-body3-r text-grey-600">
                저장된 메모를 불러와<br />기록 작성에 활용해보세요.
              </p>
            </div>
            <button
              type="button"
              className="w-full py-3 rounded-xl border border-grey-100 text-grey-700 text-body2-md cursor-pointer"
            >
              메모 선택
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <p className="text-sub2-sb text-grey-900">템플릿 양식</p>
            {template.questions?.map((question, index) => (
              <div key={question.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 shrink-0 flex items-center justify-center rounded-full bg-grey-700 text-grey-0 text-label3-sb">
                    {index + 1}
                  </span>
                  <p className="text-sub2-sb text-grey-900">
                    {question.required && <span className="text-error-text">* </span>}
                    {question.label}
                  </p>
                </div>
                <div className="flex flex-col gap-2 pl-7">
                  {question.description && (
                    <p className="text-body3-r text-grey-600">{question.description}</p>
                  )}
                  <textarea
                    value={answers[question.id] ?? ''}
                    onChange={e => handleAnswerChange(question.id, e.target.value)}
                    placeholder="내용을 입력해주세요."
                    rows={4}
                    className="w-full p-4 rounded-xl border border-grey-100 text-body2-md text-grey-900 placeholder:text-grey-400 outline-none resize-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
          <Toast message={toast.message} onUndo={toast.onUndo} variant={toast.variant} />
        </div>
      )}
    </Card>
  );
}
