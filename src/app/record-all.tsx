import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/card';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { RecordList } from '@/components/record/RecordList';
import RECORDS from '@/mock/records.json';
import type { RecordEntry } from '@/types/record';

const records = RECORDS as RecordEntry[];

export default function RecordAll() {
  const navigate = useNavigate();

  return (
    <Card>
      <CategoryHeader title="최근 작성한 기록" onBack={() => navigate('/record')} />
      <RecordList records={records} />
    </Card>
  );
}
