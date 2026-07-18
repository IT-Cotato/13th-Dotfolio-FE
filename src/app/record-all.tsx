import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/card';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { RecordList } from '@/components/record/RecordList';
import { StatusTag } from '@/components/record/StatusTag';
import { CategoryDropdown } from '@/components/record/CategoryDropdown';
import { RECORD_TEMPLATES } from '@/constants/templates';
import RECORDS from '@/mock/records.json';
import type { RecordEntry } from '@/types/record';

const records = RECORDS as RecordEntry[];

const STATUS_FILTERS = ['전체', '기록 중', '기록 완료'];

const CATEGORY_OPTIONS = [
  { id: 'all', label: '전체' },
  ...RECORD_TEMPLATES.map(template => ({ id: template.id, label: template.title })),
];

export default function RecordAll() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('전체');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredRecords = records.filter(record => {
    const statusMatch = statusFilter === '전체' || record.status === statusFilter;
    const categoryMatch = categoryFilter === 'all' || record.templateId === categoryFilter;
    return statusMatch && categoryMatch;
  });

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
        <RecordList records={filteredRecords} />
      </div>
    </Card>
  );
}
