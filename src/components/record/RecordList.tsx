import { Fragment } from 'react';
import { Tag } from '@/components/record/tag';
import { useTemplates } from '@/contexts/TemplatesContext';
import type { RecordEntry } from '@/types/record';
import TrashIcon from '@/assets/trash.svg';

const STATUS_STYLES: Record<string, { bgClassName: string; borderClassName: string; textClassName: string }> = {
  '기록 중': { bgClassName: 'bg-primary-50', borderClassName: 'border-primary-100', textClassName: 'text-primary-500' },
  '기록 완료': { bgClassName: 'bg-grey-50', borderClassName: 'border-grey-100', textClassName: 'text-grey-600' },
};

interface RecordListProps {
  records: RecordEntry[];
  onDeleteClick?: (record: RecordEntry) => void;
  onRecordClick?: (record: RecordEntry) => void;
}

export const RecordList = ({ records, onDeleteClick, onRecordClick }: RecordListProps) => {
  const { templates } = useTemplates();
  return (
  <div className="w-full grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6">
    {records.map((record, i) => {
      const template = templates.find(t => t.id === record.templateId);
      const statusStyle = STATUS_STYLES[record.status] ?? STATUS_STYLES['기록 중'];
      return (
        <Fragment key={record.id}>
          {i > 0 && <div className="col-span-4 border-t border-grey-100" />}
          <div
            className={`flex flex-col gap-2 py-4 ${onRecordClick ? 'cursor-pointer' : ''}`}
            onClick={() => onRecordClick?.(record)}
          >
            <p className="text-grey-900 text-sub2-sb">{record.title}</p>
            <p className="text-grey-700 text-body3-r">{record.date}</p>
          </div>
          <div className="justify-self-center">
            <Tag
              label={record.status}
              bgClassName={statusStyle.bgClassName}
              borderClassName={statusStyle.borderClassName}
              textClassName={statusStyle.textClassName}
            />
          </div>
          {template ? (
            <div className="justify-self-center">
              <Tag
                label={template.title}
                bgClassName={template.bgClassName}
                borderClassName={template.borderClassName}
                textClassName={template.textClassName ?? 'text-grey-700'}
              />
            </div>
          ) : <div />}
          <button
            type="button"
            onClick={() => onDeleteClick?.(record)}
            className="cursor-pointer justify-self-end"
          >
            <TrashIcon className="w-5 h-5 text-grey-700" />
          </button>
        </Fragment>
      );
    })}
  </div>
  );
};
