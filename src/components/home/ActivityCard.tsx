import { Tag } from '@/components/home/folder/Tag';
import { ProgressBar } from '@/components/home/ProgressBar';
import type { Activity } from '@/types/activity';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const firstTag = activity.tags[0] ?? '';
  const endLabel = activity.endDateUnknown ? '현재 진행 중' : activity.endDate;
  const inProgress = activity.recordCount - activity.completedCount;

  return (
    <div className="flex flex-col gap-4 bg-white rounded-2xl px-3 py-4 border border-grey-100">
      <Tag label={firstTag} />

      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sub1-sb text-grey-950 truncate">{activity.title}</p>
          <button type="button" className="text-grey-500 text-body2-md shrink-0 cursor-pointer leading-none">
            ···
          </button>
        </div>
        <p className="text-body3-md text-grey-900">{activity.startDate}{endLabel ? ` ~ ${endLabel}` : ''}</p>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <p className="text-body3-md text-grey-700">
          기록 중 <span className="text-sub3-sb">{inProgress}</span> · 기록 완료 <span className="text-sub3-sb">{activity.completedCount}</span>
        </p>
        <ProgressBar value={activity.completedCount} max={activity.recordCount} />
      </div>
    </div>
  );
};
