import FolderCard from '@/assets/folder-card.svg';
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
    <div
      className="relative w-full rounded-[20px]"
      style={{
        aspectRatio: '266/186',
        background: 'linear-gradient(180deg, #DEE6EF 0%, rgba(222, 230, 239, 0.50) 26.32%)',
      }}
    >
      <FolderCard className="absolute inset-0 w-full h-full" />

      {/* 탭 영역 Tag */}
      <div className="absolute top-0 left-3 flex items-center h-[30px]">
        <Tag label={firstTag} />
      </div>

      {/* 본문 — 탭 아래부터, padding: 16px 12px, gap: 10px */}
      <div className="absolute inset-x-3 bottom-4 top-[30px] flex flex-col gap-2.5 pt-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sub1-sb text-grey-950 truncate">{activity.title}</p>
            <button type="button" className="text-grey-500 text-body2-md shrink-0 cursor-pointer leading-none">
              ···
            </button>
          </div>
          <p className="text-body3-md text-grey-900">
            {activity.startDate}{endLabel ? ` ~ ${endLabel}` : ''}
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <p className="text-body3-md text-grey-700">
            기록 중 <span className="text-sub3-sb">{inProgress}</span> · 기록 완료{' '}
            <span className="text-sub3-sb">{activity.completedCount}</span>
          </p>
          <ProgressBar value={activity.completedCount} max={activity.recordCount} />
        </div>
      </div>
    </div>
  );
};
