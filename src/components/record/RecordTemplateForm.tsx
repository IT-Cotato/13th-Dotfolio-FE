import type { TemplateQuestion } from '@/constants/templates';

interface RecordTemplateFormProps {
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  questions: TemplateQuestion[];
}

export function RecordTemplateForm({
  answers,
  onAnswerChange,
  questions,
}: RecordTemplateFormProps) {
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
              <textarea
                value={answers[question.id] ?? ''}
                onChange={event => onAnswerChange(question.id, event.target.value)}
                placeholder="내용을 입력해주세요."
                rows={4}
                className="text-body-reading2-md w-full resize-none rounded-xl border border-grey-100 p-4 text-grey-900 outline-none transition-colors placeholder:text-grey-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
