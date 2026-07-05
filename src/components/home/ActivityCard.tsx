import type { Activity } from '@/types/activity';

const TAG_COLOR: Record<string, string> = {
  '동아리/학회': 'bg-category-mint text-grey-700',
  '프로젝트': 'bg-category-purple text-grey-700',
  '인턴': 'bg-category-coral text-grey-700',
  '공모전': 'bg-category-pink text-grey-700',
};

const DEFAULT_TAG_COLOR = 'bg-grey-100 text-grey-700';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const firstTag = activity.tags[0] ?? '';
  const tagColor = TAG_COLOR[firstTag] ?? DEFAULT_TAG_COLOR;
  const endLabel = activity.endDateUnknown ? '현재 진행 중' : activity.endDate;

  return (
    <div className="flex flex-col gap-3 bg-white rounded-2xl p-4 border border-grey-100">
      <div className="flex items-center justify-between">
        <span className={`text-label2-sb px-2 py-1 rounded-md ${tagColor}`}>{firstTag}</span>
        <button type="button" className="text-grey-400 text-body2-md cursor-pointer">···</button>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sub2-sb text-grey-900 truncate">{activity.title}</p>
        <p className="text-body2-r text-grey-500">{activity.startDate} ~ {endLabel}</p>
      </div>
      <div className="border-t border-grey-100 pt-2">
        <p className="text-body3-r text-grey-500">기록 중 0 · 기여 참고 0</p>
      </div>
    </div>
  );
};
