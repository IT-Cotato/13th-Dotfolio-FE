import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/card';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Toast } from '@/components/common/Toast';
import { RecordList } from '@/components/record/RecordList';
import { StatusTag } from '@/components/record/StatusTag';
import { CategoryDropdown } from '@/components/record/CategoryDropdown';
import { RECORD_TEMPLATES } from '@/constants/templates';
import { useToast } from '@/hooks/useToast';
import RECORDS from '@/mock/records.json';
import type { RecordEntry } from '@/types/record';

const STATUS_FILTERS = ['전체', '기록 중', '기록 완료'];

const CATEGORY_OPTIONS = [
  { id: 'all', label: '전체' },
  ...RECORD_TEMPLATES.map(template => ({ id: template.id, label: template.title })),
];

export default function RecordAll() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<RecordEntry[]>(RECORDS as RecordEntry[]);
  const [statusFilter, setStatusFilter] = useState('전체');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<RecordEntry | null>(null);
  const { toast, fireToast, dismissToast } = useToast();

  const filteredRecords = records.filter(record => {
    const statusMatch = statusFilter === '전체' || record.status === statusFilter;
    const categoryMatch = categoryFilter === 'all' || record.templateId === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const removed = deleteTarget;
    setRecords(prev => prev.filter(r => r.id !== removed.id));
    setDeleteTarget(null);
    fireToast('기록이 삭제되었습니다.', () => {
      setRecords(prev => [...prev, removed]);
      dismissToast();
    });
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
                onClick={() => setStatusFilter(status)}
              />
            ))}
          </div>
          <CategoryDropdown
            options={CATEGORY_OPTIONS}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        </div>
        <RecordList records={filteredRecords} onDeleteClick={setDeleteTarget} />
      </div>

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
          <Toast message={toast.message} onUndo={toast.onUndo} />
        </div>
      )}
    </Card>
  );
}
