import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/card';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { RecordList } from '@/components/record/RecordList';
import { StatusTag } from '@/components/record/StatusTag';
import RECORDS from '@/mock/records.json';
import type { RecordEntry } from '@/types/record';

const records = RECORDS as RecordEntry[];

const STATUS_FILTERS = ['전체', '기록 중', '기록 완료'];

export default function RecordAll() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('전체');

  const filteredRecords = statusFilter === '전체'
    ? records
    : records.filter(record => record.status === statusFilter);

  return (
    <Card>
      <div className="w-full flex flex-col gap-8">
        <CategoryHeader title="최근 작성한 기록" onBack={() => navigate('/record')} />
        <div className="w-full flex items-center gap-2">
          {STATUS_FILTERS.map(status => (
            <StatusTag
              key={status}
              label={status}
              selected={statusFilter === status}
              onClick={() => setStatusFilter(status)}
            />
          ))}
        </div>
        <RecordList records={filteredRecords} />
      </div>
    </Card>
  );
}
