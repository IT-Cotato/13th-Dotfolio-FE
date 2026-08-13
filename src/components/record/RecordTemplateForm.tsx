import { useLayoutEffect, useRef, useState } from 'react';
import VectorDownIcon from '@/assets/vector_down.svg';
import VectorUpIcon from '@/assets/vector_up.svg';
import { Button } from '@/components/common/button';
import type { TemplateQuestion } from '@/constants/templates';

interface RecordTemplateFormProps {
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  questions: TemplateQuestion[];
  variant?: 'default' | 'immersion';
}

interface AutoResizeTextareaProps {
  className: string;
  onChange: (value: string) => void;
  value: string;
}

function AutoResizeTextarea({ className, onChange, value }: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={event => onChange(event.target.value)}
      placeholder="내용을 입력해주세요."
      rows={1}
      className={className}
    />
  );
}

export function RecordTemplateForm({
  answers,
  onAnswerChange,
  questions,
  variant = 'default',
}: RecordTemplateFormProps) {
  const isImmersion = variant === 'immersion';
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Set<string>>(
    () => new Set(questions.filter(question => question.required && !(answers[question.id] ?? '').trim()).map(question => question.id)),
  );

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestionIds(previous => {
      const next = new Set(previous);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  if (isImmersion) {
    return (
      <div className="flex w-full flex-col items-start gap-10">
        {questions.map((question, index) => {
          const isExpanded = expandedQuestionIds.has(question.id);

          return (
            <section key={question.id} className="flex w-full flex-col items-end gap-2">
              <div className="flex w-full items-start gap-3">
                <span className="text-sub3-sb flex size-6 shrink-0 items-center justify-center rounded-md bg-[#4E5C7C] text-center text-grey-0">
                  {index + 1}
                </span>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex min-w-0 items-center gap-0.5">
                      <h2 className="text-sub1-sb text-grey-0">{question.label}</h2>
                      {question.required && (
                        <span className="text-sub2-sb text-error-text">*</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {isExpanded && (
                        <Button label="기록 TIP 💡" size="tip" />
                      )}
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-label={`${question.label} ${isExpanded ? '접기' : '펼치기'}`}
                        onClick={() => toggleQuestion(question.id)}
                        className="flex h-6 w-7 cursor-pointer items-center justify-center"
                      >
                        {isExpanded ? (
                          <VectorUpIcon className="h-[7px] w-3.5 shrink-0 text-grey-400" />
                        ) : (
                          <VectorDownIcon className="h-[7px] w-3.5 shrink-0 text-grey-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="flex w-full flex-col gap-2">
                      {question.description && (
                        <p className="text-body2-md text-grey-200">{question.description}</p>
                      )}
                      <AutoResizeTextarea
                        value={answers[question.id] ?? ''}
                        onChange={value => onAnswerChange(question.id, value)}
                        className="text-body-reading2-md min-h-12 w-full resize-none overflow-hidden rounded-[14px] border-[1.5px] border-[#4E5C7C] bg-transparent p-4 text-grey-200 outline-none placeholder:text-grey-400"
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sub1-sb text-grey-900">템플릿 양식</p>
      <div className="flex flex-col gap-8 rounded-3xl border border-grey-100 p-6">
        {questions.map((question, index) => (
          <div key={question.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-label3-sb flex size-5 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-500">
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
              <AutoResizeTextarea
                value={answers[question.id] ?? ''}
                onChange={value => onAnswerChange(question.id, value)}
                className="text-body-reading2-md min-h-[132px] w-full resize-none overflow-hidden rounded-xl border border-grey-100 p-4 text-grey-900 outline-none transition-colors placeholder:text-grey-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
