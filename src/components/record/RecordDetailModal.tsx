import { useEffect, useState } from 'react';
import CloseIcon from '@/assets/close.svg';
import { Tag } from '@/components/record/tag';
import { getRecordDetail, toStatusLabel, type RecordDetail } from '@/api/records';
import { ApiError } from '@/api/client';

interface RecordDetailModalProps {
  recordId: string | null;
  onClose: () => void;
}

export const RecordDetailModal = ({ recordId, onClose }: RecordDetailModalProps) => {
  const [detail, setDetail] = useState<RecordDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recordId) return;

    let cancelled = false;

    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getRecordDetail(recordId);
        if (cancelled) return;
        setDetail(response.data);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : '기록을 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [recordId]);

  if (!recordId) return null;

  const sortedAnswers = detail?.answers.slice().sort((a, b) => a.sortOrder - b.sortOrder) ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: '#1C1C1A9E' }}
      onClick={onClose}
    >
      <div
        className="relative w-165 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-white rounded-3xl p-8 overflow-y-auto scrollbar-hide"
        onClick={e => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute top-8 right-8 cursor-pointer">
          <CloseIcon className="w-4 h-4 text-grey-400" />
        </button>

        {isLoading && <p className="text-body2-md text-grey-700 py-10 text-center">불러오는 중...</p>}
        {!isLoading && error && <p className="text-body2-md text-error-text py-10 text-center">{error}</p>}

        {!isLoading && !error && detail && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3 pr-8">
              <div className="flex items-center gap-2">
                <Tag
                  label={toStatusLabel(detail.status)}
                  bgClassName="bg-primary-50"
                  borderClassName="border-primary-100"
                  textClassName="text-primary-500"
                />
                <Tag
                  label={detail.templateTitle}
                  bgClassName="bg-grey-50"
                  borderClassName="border-grey-100"
                  textClassName="text-grey-700"
                />
              </div>
              <p className="text-title1 text-grey-900">{detail.title}</p>
              <p className="text-body3-md text-grey-600">{detail.activityTitle}</p>
            </div>

            <div className="flex flex-col gap-6">
              {sortedAnswers.map((answer, index) => (
                <div key={answer.templateQuestionId} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-primary-50 text-primary-500 text-sub3-sb shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-sub2-sb text-grey-900">
                      {answer.required && <span className="text-error-text">* </span>}
                      {answer.questionText}
                    </p>
                  </div>
                  {answer.questionDescription && (
                    <p className="text-body3-r text-grey-700 pl-8">{answer.questionDescription}</p>
                  )}
                  <p className="text-body-reading2-md text-grey-900 pl-8 whitespace-pre-wrap">
                    {answer.answerText || '작성된 답변이 없습니다.'}
                  </p>
                </div>
              ))}
            </div>

            {detail.memos.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-sub1-sb text-grey-900">메모 {detail.memos.length}</p>
                <div className="flex flex-col gap-3">
                  {detail.memos.map(memo => (
                    <div key={memo.memoId} className="flex flex-col gap-2 p-4 rounded-2xl border border-grey-100">
                      <p className="text-sub2-sb text-grey-900">{memo.title}</p>
                      <p className="text-body3-r text-grey-700 whitespace-pre-wrap">{memo.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
