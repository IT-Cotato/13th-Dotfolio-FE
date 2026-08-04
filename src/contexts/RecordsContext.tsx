import { createContext, useContext, useState, type ReactNode } from 'react';
import RECORDS from '@/mock/records.json';
import type { RecordEntry } from '@/types/record';

interface RecordFormData {
  id: string;
  activityId: string;
  templateId: string;
  title: string;
  answers: Record<string, string>;
  memoIds: string[];
}

interface RecordsContextValue {
  records: RecordEntry[];
  saveDraft: (data: RecordFormData) => void;
  completeRecord: (data: RecordFormData) => void;
  removeRecord: (id: string) => void;
  restoreRecord: (record: RecordEntry) => void;
  removeRecordsByActivity: (activityId: string) => void;
}

const RecordsContext = createContext<RecordsContextValue | null>(null);

const formatDate = (date: Date) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

const upsertRecord = (records: RecordEntry[], data: RecordFormData, status: string): RecordEntry[] => {
  const entry: RecordEntry = {
    id: data.id,
    activityId: data.activityId,
    templateId: data.templateId,
    title: data.title,
    date: formatDate(new Date()),
    status,
    answers: data.answers,
    memoIds: data.memoIds,
  };
  const existingIndex = records.findIndex(r => r.id === data.id);
  if (existingIndex === -1) return [entry, ...records];
  const next = [...records];
  next[existingIndex] = entry;
  return next;
};

export const RecordsProvider = ({ children }: { children: ReactNode }) => {
  const [records, setRecords] = useState<RecordEntry[]>(RECORDS as RecordEntry[]);

  const saveDraft = (data: RecordFormData) => {
    setRecords(prev => upsertRecord(prev, data, '기록 중'));
  };

  const completeRecord = (data: RecordFormData) => {
    setRecords(prev => upsertRecord(prev, data, '기록 완료'));
  };

  const removeRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const restoreRecord = (record: RecordEntry) => {
    setRecords(prev => [...prev, record]);
  };

  const removeRecordsByActivity = (activityId: string) => {
    setRecords(prev => prev.filter(r => r.activityId !== activityId));
  };

  return (
    <RecordsContext.Provider
      value={{ records, saveDraft, completeRecord, removeRecord, restoreRecord, removeRecordsByActivity }}
    >
      {children}
    </RecordsContext.Provider>
  );
};

export const useRecords = () => {
  const ctx = useContext(RecordsContext);
  if (!ctx) throw new Error('useRecords must be used within a RecordsProvider');
  return ctx;
};
