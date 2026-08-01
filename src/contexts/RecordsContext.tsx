import { createContext, useContext, useState, type ReactNode } from 'react';
import RECORDS from '@/mock/records.json';
import type { RecordEntry } from '@/types/record';

interface RecordFormData {
  title: string;
  templateId: string;
}

interface RecordsContextValue {
  records: RecordEntry[];
  addRecord: (data: RecordFormData) => void;
  removeRecord: (id: string) => void;
  restoreRecord: (record: RecordEntry) => void;
}

const RecordsContext = createContext<RecordsContextValue | null>(null);

const formatDate = (date: Date) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

export const RecordsProvider = ({ children }: { children: ReactNode }) => {
  const [records, setRecords] = useState<RecordEntry[]>(RECORDS as RecordEntry[]);

  const addRecord = (data: RecordFormData) => {
    const newRecord: RecordEntry = {
      id: crypto.randomUUID(),
      title: data.title,
      date: formatDate(new Date()),
      status: '기록 완료',
      templateId: data.templateId,
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  const removeRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const restoreRecord = (record: RecordEntry) => {
    setRecords(prev => [...prev, record]);
  };

  return (
    <RecordsContext.Provider value={{ records, addRecord, removeRecord, restoreRecord }}>
      {children}
    </RecordsContext.Provider>
  );
};

export const useRecords = () => {
  const ctx = useContext(RecordsContext);
  if (!ctx) throw new Error('useRecords must be used within a RecordsProvider');
  return ctx;
};
