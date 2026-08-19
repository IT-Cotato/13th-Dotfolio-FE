import { useRef, useState } from 'react';
import { Button } from '@/components/common/button';
import CloseIcon from '@/assets/close.svg';
import AddIcon from '@/assets/add.svg';
import GripIcon from '@/assets/grip.svg';
import MoreIcon from '@/assets/more.svg';
import TrashIcon from '@/assets/trash.svg';
import { ApiError } from '@/api/client';
import type { TemplateQuestion } from '@/constants/templates';

export interface CustomTemplateData {
  title: string;
  description: string;
  questions: TemplateQuestion[];
}

interface CustomTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomTemplateData) => Promise<void>;
}

const DESCRIPTION_MAX_LENGTH = 40;

const createEmptyQuestion = (): TemplateQuestion => ({
  id: crypto.randomUUID(),
  label: '',
  description: '',
  required: false,
});

export const CustomTemplateModal = ({ isOpen, onClose, onSubmit }: CustomTemplateModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<TemplateQuestion[]>([createEmptyQuestion()]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // 텍스트 드래그 중 마우스가 배경으로 나가서 click이 배경 자체에서 발생하는 경우와
  // 실제로 배경을 클릭한 경우를 구분하기 위해, mousedown이 배경 자체에서 시작됐는지 추적.
  const backdropMouseDownRef = useRef(false);

  if (!isOpen) return null;

  const updateQuestion = (id: string, patch: Partial<TemplateQuestion>) => {
    setQuestions(prev => prev.map(question => (question.id === id ? { ...question, ...patch } : question)));
  };

  const addQuestion = () => setQuestions(prev => [...prev, createEmptyQuestion()]);

  const removeQuestion = (id: string) => {
    setQuestions(prev => (prev.length > 1 ? prev.filter(question => question.id !== id) : prev));
    setOpenMenuId(null);
  };

  const isValid = title.trim().length > 0 && questions.every(question => question.label.trim().length > 0);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setQuestions([createEmptyQuestion()]);
    setOpenMenuId(null);
    setSaveError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (!isValid) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSubmit({ title, description, questions });
      resetForm();
    } catch (error) {
      setSaveError(error instanceof ApiError ? error.message : '템플릿 생성에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: '#1C1C1A9E' }}
      onMouseDown={e => { backdropMouseDownRef.current = e.target === e.currentTarget; }}
      onClick={e => {
        if (!backdropMouseDownRef.current || e.target !== e.currentTarget) return;
        handleClose();
      }}
    >
      <div
        className="relative w-165 h-206 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-white rounded-3xl p-8 overflow-y-auto scrollbar-hide"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-title1 text-grey-900">커스텀 템플릿 만들기</p>
          <button type="button" onClick={handleClose} className="cursor-pointer">
            <CloseIcon className="w-4 h-4 text-grey-400" />
          </button>
        </div>

        {/* 템플릿 제목 */}
        <div className="flex flex-col gap-2 mt-[46px]">
          <p className="text-sub2-sb text-grey-900">
            템플릿 제목 <span className="text-error-text">*</span>
          </p>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="템플릿 제목을 입력해주세요."
            className="w-full px-4 py-4 rounded-[14px] border border-grey-100 text-body-reading2-md text-grey-900 placeholder:text-grey-400 outline-none"
          />
        </div>

        {/* 템플릿 설명 */}
        <div className="flex flex-col gap-2 mt-8">
          <p className="text-sub2-sb text-grey-900">템플릿 설명</p>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value.slice(0, DESCRIPTION_MAX_LENGTH))}
            placeholder="템플릿에 대해 간단히 설명해주세요."
            rows={3}
            className="w-full h-17.5 resize-none px-4 py-4 rounded-2xl border border-grey-100 text-body-reading2-md text-grey-900 placeholder:text-grey-400 outline-none"
          />
          <span className="self-end text-caption1 text-grey-400">
            {description.length} / {DESCRIPTION_MAX_LENGTH}
          </span>
        </div>

        <div className="flex flex-col gap-6 mt-8">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="relative rounded-[14px] border border-grey-100 p-4 flex items-start gap-3"
            >
              <div className="flex items-center gap-2 shrink-0">
                <span className="cursor-pointer text-grey-300 shrink-0">
                  <GripIcon className="w-4 h-4" />
                </span>
                <span className="flex items-center justify-center w-6 h-6 rounded-[6px] bg-primary-50 text-primary-500 text-sub3-sb shrink-0">
                  {index + 1}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-2 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="flex-1 text-sub2-sb text-grey-900">
                    항목 제목 <span className="text-error-text">*</span>
                  </p>
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(prev => (prev === question.id ? null : question.id))}
                      className="w-6 h-6 flex items-center justify-center rounded-[5px] text-grey-400 hover:bg-[#EAEEF4] transition-colors cursor-pointer"
                    >
                      <MoreIcon className="w-4 h-4" />
                    </button>
                    {openMenuId === question.id && (
                      <div className="absolute right-0 top-full mt-1 z-10 bg-white border border-grey-100 rounded-xl shadow-md py-1 w-44">
                        <button
                          type="button"
                          onClick={() => removeQuestion(question.id)}
                          className="w-full flex items-center gap-2 px-1.5 py-2 text-left text-body2-md text-grey-900 cursor-pointer"
                        >
                          <TrashIcon className="w-5 h-5 text-grey-700" />
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  value={question.label}
                  onChange={e => updateQuestion(question.id, { label: e.target.value })}
                  placeholder="항목 제목을 입력해주세요. (예: 어려웠던 점)"
                  className="w-full px-4 py-4 rounded-[14px] border border-grey-100 text-body-reading2-md text-grey-900 placeholder:text-grey-400 outline-none"
                />

                <div className="flex flex-col gap-2 mt-3">
                  <p className="text-sub2-sb text-grey-900">항목 설명 (선택)</p>
                  <input
                    type="text"
                    value={question.description}
                    onChange={e => updateQuestion(question.id, { description: e.target.value })}
                    placeholder="항목 설명을 입력해주세요. (예: 업무 중 가장 어려웠던 점은 무엇이었나요?)"
                    className="w-full px-4 py-4 rounded-[14px] border border-grey-100 text-body-reading2-md text-grey-900 placeholder:text-grey-400 outline-none"
                  />
                </div>

                <label className="flex items-center justify-end gap-2 mt-2 cursor-pointer">
                  <span className="text-sub3-sb text-grey-700">필수 답변</span>
                  <button
                    type="button"
                    onClick={() => updateQuestion(question.id, { required: !question.required })}
                    className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                      question.required ? 'bg-primary-500 border-primary-500' : 'bg-white border-grey-200'
                    }`}
                  >
                    {question.required && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* 항목 추가 */}
        <button
          type="button"
          onClick={addQuestion}
          className="w-full flex items-center justify-center gap-1 px-4 py-4 mt-6 rounded-2xl border border-dashed border-grey-200 text-sub2-sb text-grey-700 cursor-pointer"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-grey-0 text-primary-500 border border-primary-500">
            <AddIcon className="w-4 h-4" />
          </span>
          항목 추가
        </button>

        {/* 저장 */}
        <div className="flex flex-col gap-2 mt-8">
          {saveError && <p className="text-caption1 text-error-text">{saveError}</p>}
          <Button label={isSaving ? '저장 중...' : '저장'} onClick={handleSave} disabled={!isValid || isSaving} />
        </div>
      </div>
    </div>
  );
};
