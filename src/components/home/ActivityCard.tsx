import { Tag } from '@/components/home/folder/Tag';
import type { Activity } from '@/types/activity';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const firstTag = activity.tags[0] ?? '';
  const endLabel = activity.endDateUnknown ? '현재 진행 중' : activity.endDate;

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
          기록 중 <span className="text-sub3-sb">0</span> · 기록 완료 <span className="text-sub3-sb">0</span>
        </p>
        <div className="w-full h-1 bg-grey-100 rounded-full overflow-hidden">
          <div className="h-full w-0 bg-primary-500 rounded-full" />
        </div>
      </div>
    </div>
  );
};
