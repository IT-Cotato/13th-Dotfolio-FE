import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/card';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Toast } from '@/components/common/Toast';
import { RecordList } from '@/components/record/RecordList';
import { RecordDetailModal } from '@/components/record/RecordDetailModal';
import { StatusTag } from '@/components/record/StatusTag';
import { CategoryDropdown } from '@/components/record/CategoryDropdown';
import { useToast } from '@/hooks/useToast';
import { useTemplates } from '@/contexts/TemplatesContext';
import {
  getRecords,
  deleteRecord,
  restoreRecord,
  toStatusLabel,
  toStatusValue,
  type RecordListItem,
} from '@/api/records';
import { ApiError } from '@/api/client';
import type { RecordEntry } from '@/types/record';

const STATUS_FILTERS = ['전체', '기록 중', '기록 완료'];
const PAGE_SIZE = 7;

const toRecordEntry = (item: RecordListItem): RecordEntry => ({
  id: item.id,
  activityId: item.activityId,
  title: item.title,
  date: item.createdAt.slice(0, 10).replace(/-/g, '.'),
  status: toStatusLabel(item.status),
  templateId: item.templateId,
  answers: {},
  memoIds: [],
});

export default function RecordAll() {
  const navigate = useNavigate();
  const { templates } = useTemplates();
  const [records, setRecords] = useState<RecordEntry[]>([]);
  const [statusFilter, setStatusFilter] = useState('전체');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalPages: 0, first: true, last: true });
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RecordEntry | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const { toast, fireToast, dismissToast } = useToast();

  const categoryOptions = [
    { id: 'all', label: '전체' },
    ...templates.map(template => ({ id: template.id, label: template.title })),
  ];

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(0);
  };

  const handleCategoryFilterChange = (categoryId: string) => {
    setCategoryFilter(categoryId);
    setPage(0);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchRecords = async () => {
      setIsLoading(true);
      try {
        const response = await getRecords({
          status: statusFilter === '전체' ? undefined : toStatusValue(statusFilter),
          templateId: categoryFilter === 'all' ? undefined : categoryFilter,
          page,
          size: PAGE_SIZE,
        });
        if (cancelled) return;
        setRecords(response.data.content.map(toRecordEntry));
        setPageInfo({
          totalPages: response.data.totalPages,
          first: response.data.first,
          last: response.data.last,
        });
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof ApiError ? error.message : '기록을 불러오지 못했습니다.';
        fireToast(message, undefined, 'error');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchRecords();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter, page]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const removed = deleteTarget;
    setDeleteTarget(null);
    try {
      await deleteRecord(removed.id);
      setRecords(prev => prev.filter(r => r.id !== removed.id));
      fireToast('기록이 삭제되었습니다.', () => {
        restoreRecord(removed.id)
          .then(() => {
            setRecords(prev => [...prev, removed]);
            dismissToast();
          })
          .catch((error: unknown) => {
            const message = error instanceof ApiError ? error.message : '기록 복구에 실패했습니다.';
            fireToast(message, undefined, 'error');
          });
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '기록 삭제에 실패했습니다.';
      fireToast(message, undefined, 'error');
    }
  };

  return (
    <Card>
      <div className="w-full flex flex-col gap-8">
        <CategoryHeader title="최근 작성한 기록" onBack={() => navigate('/record')} />
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            {STATUS_FILTERS.map(status => (
              <StatusTag
                key={status}
                label={status}
                selected={statusFilter === status}
                onClick={() => handleStatusFilterChange(status)}
              />
            ))}
          </div>
          <CategoryDropdown
            options={categoryOptions}
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
          />
        </div>
        <RecordList
          records={records}
          onDeleteClick={setDeleteTarget}
          onRecordClick={record => setSelectedRecordId(record.id)}
        />
        {pageInfo.totalPages > 1 && (
          <div className="w-full flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={pageInfo.first || isLoading}
              onClick={() => setPage(prev => prev - 1)}
              className="px-4 py-2 rounded-lg border border-grey-100 text-body3-md text-grey-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              이전
            </button>
            <span className="text-body3-md text-grey-700">
              {page + 1} / {pageInfo.totalPages}
            </span>
            <button
              type="button"
              disabled={pageInfo.last || isLoading}
              onClick={() => setPage(prev => prev + 1)}
              className="px-4 py-2 rounded-lg border border-grey-100 text-body3-md text-grey-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              다음
            </button>
          </div>
        )}
      </div>

      <RecordDetailModal recordId={selectedRecordId} onClose={() => setSelectedRecordId(null)} />

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
