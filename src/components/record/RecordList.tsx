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
  <div className="flex w-full flex-col divide-y divide-grey-100">
    {records.map(record => {
      const template = templates.find(t => t.id === record.templateId);
      const statusStyle = STATUS_STYLES[record.status] ?? STATUS_STYLES['기록 중'];
      return (
        <div
          key={record.id}
          className={`grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3 py-4 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-x-6 ${onRecordClick ? 'cursor-pointer' : ''}`}
          onClick={() => onRecordClick?.(record)}
        >
          <div
            className="flex min-w-0 flex-col gap-2"
          >
            <p className="break-words text-grey-900 text-sub2-sb">{record.title}</p>
            <p className="text-grey-700 text-body3-r">{record.date}</p>
          </div>
          <button
            type="button"
            aria-label={`${record.title} 삭제`}
            onClick={event => {
              event.stopPropagation();
              onDeleteClick?.(record);
            }}
            className="flex size-11 cursor-pointer items-center justify-center justify-self-end sm:order-last sm:size-auto"
          >
            <TrashIcon className="w-5 h-5 text-grey-700" />
          </button>
          <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1 sm:contents">
          <div className="sm:justify-self-center">
            <Tag
              label={record.status}
              bgClassName={statusStyle.bgClassName}
              borderClassName={statusStyle.borderClassName}
              textClassName={statusStyle.textClassName}
            />
          </div>
          {template ? (
            <div className="sm:justify-self-center">
              <Tag
                label={template.title}
                bgClassName={template.bgClassName}
                borderClassName={template.borderClassName}
                textClassName={template.textClassName ?? 'text-grey-700'}
              />
            </div>
          ) : <div />}
          </div>
        </div>
      );
    })}
  </div>
  );
};
