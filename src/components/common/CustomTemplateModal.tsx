import { useState } from 'react';
import CloseIcon from '@/assets/close.svg';
import AddIcon from '@/assets/add.svg';
import GripIcon from '@/assets/grip.svg';
import MoreIcon from '@/assets/more.svg';
import type { TemplateQuestion } from '@/constants/templates';

export interface CustomTemplateData {
  title: string;
  description: string;
  questions: TemplateQuestion[];
}

interface CustomTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomTemplateData) => void;
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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!isValid) return;
    onSubmit({ title, description, questions });
    resetForm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: '#1C1C1A9E' }}
      onClick={handleClose}
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
            className="w-full px-4 py-4 rounded-2xl border border-grey-100 text-body-reading2-md text-grey-900 placeholder:text-grey-400 outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        {/* 템플릿 설명 */}
        <div className="flex flex-col gap-2 mt-8">
          <p className="text-sub2-sb text-grey-900">템플릿 설명</p>
          <div className="relative">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, DESCRIPTION_MAX_LENGTH))}
              placeholder="템플릿에 대해 간단히 설명해주세요."
              rows={3}
              className="w-full resize-none px-4 pt-4 pb-6 rounded-2xl border border-grey-100 text-body-reading2-md text-grey-900 placeholder:text-grey-400 outline-none focus:border-primary-500 transition-colors"
            />
            <span className="absolute bottom-2 right-4 text-caption1 text-grey-400">
              {description.length} / {DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
        </div>

        {/* 항목 목록 */}
        <div className="flex flex-col gap-6 mt-8">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="relative rounded-2xl border border-grey-100 pt-6 px-4 pb-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="cursor-grab text-grey-300 shrink-0">
                  <GripIcon className="w-4 h-4" />
                </span>
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-500 text-grey-0 text-caption2 shrink-0">
                  {index + 1}
                </span>
                <p className="flex-1 text-sub2-sb text-grey-900">
                  항목 제목 <span className="text-error-text">*</span>
                </p>
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setOpenMenuId(prev => (prev === question.id ? null : question.id))}
                    className="w-5 h-5 flex items-center justify-center text-grey-400 cursor-pointer"
                  >
                    <MoreIcon className="w-4 h-4" />
                  </button>
                  {openMenuId === question.id && (
                    <div className="absolute right-0 top-full mt-1 z-10 bg-white border border-grey-100 rounded-xl shadow-md py-1 w-20">
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="w-full px-3 py-2 text-left text-body3-md text-error-text cursor-pointer"
                      >
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
                className="w-full px-4 py-3.5 rounded-2xl border border-grey-100 text-body-reading2-md text-grey-900 placeholder:text-grey-400 outline-none focus:border-primary-500 transition-colors"
              />

              <div className="flex flex-col gap-2 mt-3">
                <p className="text-sub2-sb text-grey-900">항목 설명 (선택)</p>
                <input
                  type="text"
                  value={question.description}
                  onChange={e => updateQuestion(question.id, { description: e.target.value })}
                  placeholder="항목 설명을 입력해주세요. (예: 업무 중 가장 어려웠던 점은 무엇이었나요?)"
                  className="w-full px-4 py-3.5 rounded-2xl border border-grey-100 text-body-reading2-md text-grey-900 placeholder:text-grey-400 outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <label className="flex items-center justify-end gap-2 mt-2 cursor-pointer">
                <span className="text-body2-md text-grey-900">필수 답변</span>
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
          ))}
        </div>

        {/* 항목 추가 */}
        <button
          type="button"
          onClick={addQuestion}
          className="w-full flex items-center justify-center gap-1 py-4 mt-6 rounded-2xl border border-dashed border-grey-200 text-sub2-sb text-grey-700 cursor-pointer"
        >
          <AddIcon className="w-5 h-5" />
          항목 추가
        </button>

        {/* 저장 */}
        <button
          type="button"
          disabled={!isValid}
          onClick={handleSave}
          className={`w-full py-3.5 mt-8 rounded-2xl text-sub2-sb transition-colors ${
            isValid ? 'bg-primary-500 text-grey-0 cursor-pointer' : 'bg-grey-300 text-grey-0 cursor-not-allowed'
          }`}
        >
          저장
        </button>
      </div>
    </div>
  );
};
